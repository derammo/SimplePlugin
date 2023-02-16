import { ObsidianPluginBase } from "derobst/main";
import { PluginServices } from "main/PluginServices";

import { DEFAULT_SETTINGS, Settings, SettingTab } from "main/Settings";
import { MarkdownPostProcessorContext } from "obsidian";
import { FooRenderer } from "./src/foo/FooRenderer";

export default class ObsidianPlugin extends ObsidianPluginBase<Settings> implements PluginServices {
	async onload() {
		await this.loadSettings(DEFAULT_SETTINGS);

		// Register a code block handler for the "foo" language.  Note we should not use exclamation points or other punctuation of any kind in this identifier.
		this.registerMarkdownCodeBlockProcessor("foo", (source: string, el: HTMLElement, ctx: MarkdownPostProcessorContext) => {
			ctx.addChild(new FooRenderer(el, this, source));
		});

        // TODO: Start up other components of your plugin here.

		this.addSettingTab(new SettingTab(this.app, this, this));
	}

	onunload() {
		// TODO: Shut down components of your plugin here.
	}    

    // TODO: Implement the core functionality of your plugin here, to be called via PluginServices.
}

