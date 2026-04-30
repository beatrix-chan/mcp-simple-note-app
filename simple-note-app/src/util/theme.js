window.appUtils = window.appUtils || {};
window.appUtils.theme = (function () {
	function getTheme() {
		return localStorage.getItem('app-theme') || 'light';
	}

	function applyTheme(theme) {
		document.documentElement.setAttribute('data-theme', theme);
		localStorage.setItem('app-theme', theme);
	}

	function toggleTheme() {
		const next = getTheme() === 'light' ? 'dark' : 'light';
		applyTheme(next);
		return next;
	}

	function init() {
		applyTheme(getTheme());
	}

	return { init, getTheme, applyTheme, toggleTheme };
})();
