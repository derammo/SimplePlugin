import { MarkdownRenderChild, MarkdownView, Plugin } from "obsidian";

export class FooRenderer extends MarkdownRenderChild {
	constructor(el: HTMLElement, protected parent: Plugin, protected source: string) {
		super(el);
	}

	onload() {
		const button = document.createElement("button");
		button.innerText = "Foo";
		this.registerDomEvent(button, "click", () => {
			// Replace the current editor selection (if any) with some text.  Note that we don't have access to a syntax
			// tree or anything like that, so if we want to manipulate the document based on where the block command is located,
			// we would have to search for it in the content of the editor.
			const editor = this.parent.app.workspace.getActiveViewOfType(MarkdownView)?.editor;
			editor?.replaceSelection("I pity you! ");
		});
		this.containerEl.replaceWith(button);
	}

	onunload() {
		// DOM listener auto cleaned up since we used registerDomEvent
	}
}
