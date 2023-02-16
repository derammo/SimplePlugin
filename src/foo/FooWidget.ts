import { CommandWidgetBase, EditorView } from "derobst/command";
import { PluginServices } from "main/PluginServices";


export class FooWidget extends CommandWidgetBase<PluginServices> {
	toDOM(view: EditorView): HTMLElement {
		const button = document.createElement("button");
		button.innerText = "Foo";
		this.host.registerDomEvent(button, "click", () => {
			if (this.command.commandNode === undefined) {
				return;
			}
			// Place some text to the left of this inline command.
			view.dispatch({ changes: { from: this.command.commandNode.from - 1, to: this.command.commandNode.from - 1, insert: "I pity you. " } });
		});
		return button;
	}
}
