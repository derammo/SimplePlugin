import { MinimalCommandHost } from "derobst/interfaces";
import { Settings } from "./Settings";

/**
 * Functionality that this Obsidian plugin provides to its commands, views, and other components.
 */
export interface PluginServices extends MinimalCommandHost<PluginServices> {
    /**
     * Access to current settings, valid since only shared after onLoad();
     */
    settings: Settings;

    // TODO: Add other functionality to support your components.
}
