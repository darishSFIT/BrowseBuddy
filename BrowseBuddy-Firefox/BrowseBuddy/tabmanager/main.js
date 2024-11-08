import App from './App/App.js';

/**
 * start up and register to unload
 */
window.addEventListener('DOMContentLoaded', function() {
	browser.storage.sync.get(null).then(values => {
		App.init({settings: values});
	});
});

window.addEventListener('unload', function() {
	App.unregisterEvents();
});
