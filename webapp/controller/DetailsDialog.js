sap.ui.define([
	"sap/ui/base/ManagedObject",
	"sap/ui/core/Fragment"
], function (ManagedObject, Fragment) {
	"use strict";

	return ManagedObject.extend("app.controller.DetailsDialog", {

		constructor : function (oView) {
			this._oView = oView;
		},

		exit : function () {
			delete this._oView;
		},

		open : function () {
			var oView = this._oView;

			// create dialog lazily
			if (!this.pDialog) {
				var oFragmentController = {
					onCloseDialog : function () {
						oView.byId("detailsDialog").close();
					}
				};
				// load asynchronous XML fragment
				this.pDialog = Fragment.load({
					id: oView.getId(),
					name: "app.view.fragment.DetailsDialog",
					controller: oFragmentController
				}).then(function (oDialog) {
					// connect dialog to the root view of this component (models, lifecycle)
					oView.addDependent(oDialog);
					return oDialog;
				});
			}
			this.pDialog.then(function(oDialog) {
				oDialog.open();
			});
		}

	});

});