import { Decoration, ParsedCommandWithParameters } from "derobst/command";
import { ViewPluginContext } from "derobst/view";
import { PluginServices } from "main/PluginServices";
import { FooWidget } from "./FooWidget";

export class FooCommand extends ParsedCommandWithParameters<PluginServices> {
	/**
	 * This parses the command '!foo' and splits off any parameters after that into a capture group.
	 */
	static readonly COMMAND_REGEX = /^\s*!foo(?:\s(.*)|$)/;

	buildWidget(context: ViewPluginContext<PluginServices>): void {
		if (this.commandNode === undefined) {
			return;
		}

		// Place a <button> to the left of this inline command.
		const widget = new FooWidget(context.plugin, this);
		context.builder.add(this.commandNode.from - 1, this.commandNode.from - 1, Decoration.widget({ widget: widget }));
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
