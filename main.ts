import { CommandDispatcher, CommandViewPlugin, createCommandRemovalPostProcessor } from "derobst/command";
import { ObsidianPluginBase } from "derobst/main";
import { PluginServices } from "main/PluginServices";

import { Settings, DEFAULT_SETTINGS, SettingTab } from "main/Settings";
import { FooCommand } from "foo/FooCommand";

export default class ObsidianPlugin extends ObsidianPluginBase<Settings> implements PluginServices {
	commands: CommandDispatcher<PluginServices>;

	async onload() {
		await this.loadSettings(DEFAULT_SETTINGS);

		this.commands = new CommandDispatcher();
		this.commands.registerCommand(FooCommand)

		// In preview mode, the appearance of recognized commands is controlled by the view plugin.
		this.registerViewPlugin(createCommandViewPlugin(this));

		// Always hide recognized commands in rendered markdown.
		this.registerMarkdownPostProcessor(createCommandRemovalPostProcessor(this.commands));

        // TODO: Start up other components of your plugin here.

		this.addSettingTab(new SettingTab(this.app, this, this));
	}

	onunload() {
		// TODO: Shut down components of your plugin here.
	}    

    // TODO: Implement the core functionality of your plugin here, to be called via PluginServices.
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
