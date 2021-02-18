sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/EventBus",
], function (Controller, EventBus) {
	"use strict";

	let bus;

	return Controller.extend("app.controller.App", {
		onInit: function () {
			bus = this.getOwnerComponent().getEventBus();
		},

		onRefreshClick: function() {
			bus.publish("appChannel", "refreshDataEvent", { }); 
		}
	});

});
