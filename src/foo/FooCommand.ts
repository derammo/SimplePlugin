import { Decoration, ParsedCommandWithParameters, SyntaxNodeRef } from "derobst/command";
import { ViewPluginContext } from "derobst/view";
import { PluginServices } from "main/PluginServices";
import { FooWidget } from "./FooWidget";

export class FooCommand extends ParsedCommandWithParameters<PluginServices> {
	/**
	 * This parses the command '!foo' and splits off any parameters after that into a capture group.
	 */
	static readonly COMMAND_REGEX = /^\s*!foo(?:\s(.*)|$)/;

	buildWidget(context: ViewPluginContext<PluginServices>, commandNodeRef: SyntaxNodeRef): void {
		
		// console.debug(`creating widget for doc object ${Object.id(context.state.doc)}`);
		const widget = new FooWidget(context.plugin, context.state, commandNodeRef);
		context.builder.add(commandNodeRef.from - 1, commandNodeRef.from - 1, Decoration.widget({ widget: widget }));

		// Style the command to dim or hide when not being edited, which we detect in CSS (see styles.css).
		const cssClass = context.plugin.settings.autoHide ? "auto-hide" : "auto-dim"
		context.builder.add(commandNodeRef.from, commandNodeRef.to, Decoration.mark({ class: cssClass }));
	}

	get regex(): RegExp {
		return FooCommand.COMMAND_REGEX;
	}

	/**
	 * This allows the dispatcher to pre-parse before even constructing an instance of this class.
	 */
	static match(text: string): boolean {
		return text.match(FooCommand.COMMAND_REGEX) !== null;
	}
}
