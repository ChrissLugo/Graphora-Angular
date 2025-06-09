// src/assets/gojs/text-editor.ts
import * as go from "gojs";

export function initTextEditor(window) {
	const TextEditor = new go.HTMLInfo();
	const textarea = document.createElement("textarea");

	textarea.addEventListener("input", (e) => {
		const tool = TextEditor.tool;
		if (!tool?.textBlock) return;
		const tempText = tool.measureTemporaryTextBlock(textarea.value);
		const scale = textarea.textScale;
		textarea.style.width =
			20 +
			Math.max(
				tool.textBlock.measuredBounds.width,
				tempText.measuredBounds.width
			) *
				scale +
			"px";
		textarea.rows = Math.max(tool.textBlock.lineCount, tempText.lineCount);
	});

	textarea.addEventListener("keydown", (e) => {
		if (e.isComposing) return;
		const tool = TextEditor.tool;
		if (!tool?.textBlock) return;
		const key = e.key;
		if (key === "Enter") {
			if (!tool.textBlock.isMultiline) e.preventDefault();
			tool.acceptText(go.TextEditingAccept.Enter);
		} else if (key === "Tab") {
			tool.acceptText(go.TextEditingAccept.Tab);
			e.preventDefault();
		} else if (key === "Escape") {
			tool.doCancel();
			if (tool.diagram) tool.diagram.doFocus();
		}
	});

	textarea.addEventListener("focus", () => {
		const tool = TextEditor.tool;
		if (!tool || tool.state === go.TextEditingState.None) return;
		if (tool.state === go.TextEditingState.Active) {
			tool.state = go.TextEditingState.Editing;
		}
		if (
			typeof textarea.select === "function" &&
			tool.selectsTextOnActivate
		) {
			textarea.select();
			textarea.setSelectionRange(0, 9999);
		}
	});

	textarea.addEventListener("blur", () => {
		const tool = TextEditor.tool;
		if (!tool || tool.state === go.TextEditingState.None) return;
		textarea.focus();
		if (tool.selectsTextOnActivate) {
			textarea.select();
			textarea.setSelectionRange(0, 9999);
		}
	});

	TextEditor.valueFunction = () => textarea.value;
	TextEditor.mainElement = textarea;
	TextEditor.tool = null;

	TextEditor.show = (textBlock, diagram, tool) => {
		if (!(textBlock instanceof go.TextBlock)) return;
		if (
			!diagram?.div ||
			!(tool instanceof go.TextEditingTool) ||
			TextEditor.tool
		)
			return;

		TextEditor.tool = tool;

		if (tool.state === go.TextEditingState.Invalid) {
			textarea.style.border = "3px solid red";
			textarea.focus();
			return;
		}

		const loc = textBlock.getDocumentPoint(go.Spot.Center);
		const pos = diagram.position;
		const sc = diagram.scale;
		let textscale = textBlock.getDocumentScale() * sc;
		if (textscale < tool.minimumEditorScale)
			textscale = tool.minimumEditorScale;

		const textwidth = textBlock.naturalBounds.width * textscale + 6;
		const textheight = textBlock.naturalBounds.height * textscale + 2;
		const left = (loc.x - pos.x) * sc;
		const yCenter = (loc.y - pos.y) * sc;

		const valign = textBlock.verticalAlignment;
		const oneLineHeight =
			textBlock.lineHeight +
			textBlock.spacingAbove +
			textBlock.spacingBelow;
		const allLinesHeight = oneLineHeight * textBlock.lineCount * textscale;
		const center = 0.5 * textheight - 0.5 * allLinesHeight;
		const yOffset =
			valign.y * textheight -
			valign.y * allLinesHeight +
			valign.offsetY -
			center -
			allLinesHeight / 2;

		textarea.value = textBlock.text;

		diagram.div.style["font"] = textBlock.font;
		const padding = 1;
		Object.assign(textarea.style, {
			position: "absolute",
			zIndex: "100",
			font: "inherit",
			fontSize: `${textscale * 100}%`,
			lineHeight: "normal",
			width: `${textwidth}px`,
			left: `${((left - textwidth / 2) | 0) - padding}px`,
			top: `${((yCenter + yOffset) | 0) - padding}px`,
			textAlign: textBlock.textAlign,
			margin: "0",
			padding: `${padding}px`,
			border: "0",
			outline: "none",
			whiteSpace: "pre-wrap",
			overflow: "hidden",
		});

		textarea.style["backgroundColor"] = "white";

		textarea.rows = textBlock.lineCount;
		textarea.textScale = textscale;
		textarea.className = "goTXarea";

		diagram.div.appendChild(textarea);
		textarea.focus();

		if (tool.selectsTextOnActivate) {
			textarea.select();
			textarea.setSelectionRange(0, 9999);
		}
	};

	TextEditor.hide = (diagram, _tool) => {
		TextEditor.tool = null;
		if (diagram?.div) {
			diagram.div.removeChild(textarea);
		}
	};

	return TextEditor;
}
