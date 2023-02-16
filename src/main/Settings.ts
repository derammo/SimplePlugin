import { App, Plugin, PluginSettingTab, Setting } from "obsidian";
import { PluginServices } from "./PluginServices";

export interface Settings {
    autoHide: boolean;
}

export const DEFAULT_SETTINGS: Settings = {
    autoHide: true
};

export class SettingTab extends PluginSettingTab {
    constructor(app: App, plugin: Plugin, private services: PluginServices) {
		super(app, plugin);
	}

    display() {
		const { containerEl } = this;
		containerEl.empty();
		containerEl.createEl('h2', { text: 'Settings for DERAMMO-SIMPLE Plugin' });

		new Setting(containerEl)
			.setName('Auto Hide')
			.setDesc('If true, recognized inline commands will be hidden in preview mode when they are not being edited.')
			.addToggle(value => value
				.setValue(this.services.settings.autoHide)
				.onChange(async (value) => {
                    this.services.settings.autoHide = value;
                    await this.services.saveSettings();
				}));
    }
}