sap.ui.define(
	[
		"sap/ui/core/UIComponent",
		"sap/ui/core/ComponentSupport",
	],
	function (UIComponent) {
		"use strict";
		return UIComponent.extend("app.Component", {
			metadata: {
				manifest: "json",
			},

			init: function () {
				// call the init function of the parent
				UIComponent.prototype.init.apply(this, arguments);
			},


		});
	}
);
