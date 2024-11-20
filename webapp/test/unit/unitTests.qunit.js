/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"zcreate_notification/zcreate_notification/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
