import { syntaxTree } from "@codemirror/language";
import { RangeSetBuilder } from "@codemirror/state";
import { EditorView, Decoration, DecorationSet, WidgetType, PluginValue, ViewPlugin, ViewUpdate } from "@codemirror/view";
import { SyntaxNodeRef } from "@lezer/common";
import { ObsidianPluginBase } from "derobst/main";
import { PluginServices } from "main/PluginServices";

import { Settings, DEFAULT_SETTINGS, SettingTab } from "main/Settings";
import { editorLivePreviewField } from "obsidian";

export default class ObsidianPlugin extends ObsidianPluginBase<Settings> implements PluginServices {
	async onload() {
		await this.loadSettings(DEFAULT_SETTINGS);

        // TODO: Start up other components of your plugin here.
		this.registerEditorExtension(ViewPlugin.fromClass(FilterView,  { decorations: (value: FilterView) => value.decorations }));
		this.addSettingTab(new SettingTab(this.app, this, this));
	}

	onunload() {
		// TODO: Shut down components of your plugin here.
	}    

    // TODO: Implement the core functionality of your plugin here, to be called via PluginServices.
}

class FilterWidget extends WidgetType {
	constructor(private text: string) {
		super();
	}

	toDOM() {
		const dom = document.createElement("div");
		dom.classList.add("HyperMD-header", "HyperMD-header-2");
		const span = document.createElement("span");
		span.classList.add("cm-header", "cm-header-2");
		span.innerText = this.text;
		dom.appendChild(span);
		return dom;
	}
}

class FilterView implements PluginValue {
	decorations: DecorationSet = Decoration.none;

	buildDecorations(view: EditorView): DecorationSet {
		const buffer = new RangeSetBuilder<Decoration>()
		const syntax = syntaxTree(view.state);
		for (const { from, to } of view.visibleRanges) {
			syntax.iterate({
				from,
				to,
				enter: (node: SyntaxNodeRef) => {
					if (node.type.name.startsWith("hashtag_hashtag-end")) {
						const tag = view.state.doc.sliceString(node.from, node.to);
						if (tag === "d") {
							const line = view.state.doc.lineAt(node.from);
							const rest = `[d] ${view.state.doc.sliceString(node.to, line.to)}`;
							buffer.add(line.from, line.to, Decoration.replace({ widget: new FilterWidget(rest) }));
						}
					}
				}
			});
		}
		return buffer.finish();
	}

	update(update: ViewUpdate) {
		if (!update.state.field(editorLivePreviewField)) {
			// live preview only, not rendered in strict source code view
			this.decorations = Decoration.none;
			return;
		}

		if (update.docChanged || update.viewportChanged || this.decorations === Decoration.none) {
			this.decorations = this.buildDecorations(update.view);
		}
	}	
}