import { ObsidianPluginBase } from "derobst/main";
import { PluginServices } from "main/PluginServices";

import { Settings, DEFAULT_SETTINGS, SettingTab } from "main/Settings";

export default class ObsidianPlugin extends ObsidianPluginBase<Settings> implements PluginServices {
	async onload() {
		await this.loadSettings(DEFAULT_SETTINGS);

        // TODO: Start up other components of your plugin here.

		this.addSettingTab(new SettingTab(this.app, this, this));
	}

	onunload() {
		// TODO: Shut down components of your plugin here.
	}    

    // TODO: Implement the core functionality of your plugin here, to be called via PluginServices.
}