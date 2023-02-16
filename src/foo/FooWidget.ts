import { WidgetType } from "@codemirror/view";
import { EditorView, EditorState } from "derobst/command";
import { TextRange, UpdatedTextRange } from "derobst/view";
import { PluginServices } from "main/PluginServices";

import { inspect } from "util";
import { debug } from "../../main";

let serial = 1;

export class FooWidget extends WidgetType {
	protected commandRange: UpdatedTextRange | undefined;
	serial: number;

	constructor(protected host: PluginServices, state: EditorState, commandRange: TextRange) {
		super();
		this.commandRange = host.tracking.register(state, commandRange);
		this.serial = serial++;
		if (debug) console.debug(`created widget ${this.serial} (object ${Object.id(this)}) for range ${commandRange.from} to ${commandRange.to}`);
	}
	
	toDOM(view: EditorView): HTMLElement {
		if (debug) console.debug(`toDOM widget ${this.serial}`);
		const button = document.createElement("button");
		button.innerText = "Foo";
		const target = this.commandRange;
		this.host.registerDomEvent(button, "click", () => {
			// give ourselves some time to edit for testing before this happens
			setTimeout(() => {
				const updated = target?.fetchCurrentRange() ?? null;
				if (updated === null) {
					console.error("broken command range reference (edited inside?)", inspect(target));
					return;
				}
				console.debug(`inserting text at ${updated.from - 1}`);
				view.dispatch({ changes: { from: updated.from - 1, to: updated.from - 1, insert: "I pity the " } });
			}, 5000);
		});
		return button;
	}

	eq(widget: WidgetType): boolean {
		if (widget instanceof FooWidget) {
			if (debug) console.debug(`eq widget ${this.serial} == widget ${widget.serial}?`);
			// reusable if this identifies the same text range, regardless of which registration it is
			const equals = 
				this.commandRange !== undefined && 
				widget.commandRange !== undefined && 
				this.commandRange.id.range == widget.commandRange.id.range;
			if (equals) {
				// NOTE the other widget won't be used after all, we could do some cleanup on it
			}
			return equals;
		}
		console.debug(`eq widget ${this.serial} == [something that is not a FooWidget]?`);
		return false;
	}

	updateDOM(_dom: HTMLElement, _view: EditorView): boolean {
		// always up to date, as long as our range is valid
		if (debug) console.debug(`updateDOM widget ${this.serial}`);
		return this.commandRange?.fetchCurrentRange() !== null;
	}

	destroy(_dom: HTMLElement) {
		if (debug) console.debug(`destroy DOM widget ${this.serial}`);
	}	
}
