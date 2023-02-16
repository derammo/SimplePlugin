import { MarkdownPostProcessorContext } from "obsidian";

import { CommandDispatcher, CommandViewPlugin, createCommandRemovalPostProcessor } from "derobst/command";
import { ObsidianPluginBase } from "derobst/main";
import { createTextRangeUpdater, TextRangeTracking } from "derobst/view";

import { PluginServices } from "main/PluginServices";
import { DEFAULT_SETTINGS, Settings, SettingTab } from "main/Settings";

import { FooCommand } from "foo/FooCommand";
import { FooRenderer } from "./src/foo/FooRenderer";

export const debug = false;
export const showInlineCommandInRenderView = false;

export default class ObsidianPlugin extends ObsidianPluginBase<Settings> implements PluginServices {
	commands: CommandDispatcher<PluginServices>;
	tracking: TextRangeTracking = createTextRangeUpdater(debug);

	async onload() {
		await this.loadSettings(DEFAULT_SETTINGS);

		this.commands = new CommandDispatcher();
		this.commands.registerCommand(FooCommand)

		this.registerEditorExtension(this.tracking.createExtensions());
		this.registerViewPlugin(createCommandViewPlugin(this));
		if (!showInlineCommandInRenderView) {
			this.registerMarkdownPostProcessor(createCommandRemovalPostProcessor(this.commands));
		}
		this.registerMarkdownPostProcessor((_el: HTMLElement, _ctx: MarkdownPostProcessorContext) => {
			// this is async, but caused by the dispatch we have already seen in the state field
			// console.debug(`Markdown post processor called with element ${util.inspect(el, { showHidden: true })} and context ${util.inspect(ctx, { showHidden: true })}`);
			// console.debug(el);
			// console.debug(util.inspect(ctx.getSectionInfo(el), { showHidden: true }));
			// console.debug(ctx.getSectionInfo(el));
		});
		this.registerMarkdownCodeBlockProcessor("foo", (source: string, el: HTMLElement, ctx: MarkdownPostProcessorContext) => {
			// console.debug(`Markdown code block processor called with element ${util.inspect(el, { showHidden: true })}, context ${util.inspect(ctx, { showHidden: true })}, and source '${source}'`);
			ctx.addChild(new FooRenderer(el, this, source));
		});
		this.addSettingTab(new SettingTab(this.app, this, this));
	}

	onunload() {
		// no code
	}    
}

/**
 * Create a unique class to identify the view plugin, which has access to this Obsidian plugin through capture
 * @param parent the Obsidian plugin reference baked into the view plugin class
 * @returns a unique class
 */
function createCommandViewPlugin(parent: PluginServices) {
	return class extends
		CommandViewPlugin<PluginServices> {
		getPlugin(): PluginServices {
			return parent;
		}
	};
}
