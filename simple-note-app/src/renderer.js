// Renderer entry (module)
import './util/theme.js';
import './util/editor.js';
import './util/export.js';

function createToast(type, titleText, message, timeout = 5000) {
	const container = document.getElementById('toasts');
	if (!container) return;
	const el = document.createElement('div');
	el.className = `toast toast-${type}`;
	const title = document.createElement('span');
	title.className = 'title';
	title.innerHTML = `<strong>${titleText}</strong>`;
	const msg = document.createElement('span');
	msg.className = 'message';
	msg.textContent = message;
	el.appendChild(title);
	el.appendChild(msg);
	container.appendChild(el);
	setTimeout(() => {
		el.remove();
	}, timeout);
}

document.addEventListener('DOMContentLoaded', () => {
	// init theme and editor
	if (window.appUtils && window.appUtils.theme) window.appUtils.theme.init();
	if (window.appUtils && window.appUtils.editor) window.appUtils.editor.init('editor');

	const btnSave = document.getElementById('btn-save');
	const btnTheme = document.getElementById('btn-theme');
	const btnUndo = document.getElementById('btn-undo');
	const btnRedo = document.getElementById('btn-redo');

	btnSave?.addEventListener('click', async () => {
		try {
			const content = window.appUtils.editor.getValue();
			const res = await window.appUtils.export.save(content);
			if (res && !res.canceled) {
				createToast('success', 'Success', 'File saved successfully.', 5000);
				window.appUtils.editor.clear();
			} else {
				createToast('error', 'Error', 'Save cancelled', 5000);
			}
		} catch (err) {
			console.error(err);
			createToast('error', 'Error', `Save failed (check console)`, 7000);
		}
	});

	btnTheme?.addEventListener('click', () => {
		try {
			const next = window.appUtils.theme.toggleTheme();
		} catch (err) {
			console.error(err);
		}
	});

	btnUndo?.addEventListener('click', () => window.appUtils.editor.undo());
	btnRedo?.addEventListener('click', () => window.appUtils.editor.redo());

	// Keyboard shortcut: Ctrl/Cmd + S
	window.addEventListener('keydown', (e) => {
		const isSave = (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's';
		if (isSave) {
			e.preventDefault();
			btnSave?.click();
		}
	});
});
