sap.ui.define(
	[
		"sap/ui/base/ManagedObject",
		"sap/ui/core/Fragment",
		"sap/ui/core/format/DateFormat",
	],
	function (ManagedObject, Fragment, DateFormat) {
		"use strict";

		return ManagedObject.extend("app.controller.DetailsDialog", {
			constructor: function (oView) {
				this._oView = oView;
			},

			exit: function () {
				delete this._oView;
			},

			open: function (oAppointment) {
				var oView = this._oView;
				// create dialog lazily
				if (!this.pDialog) {
					// load asynchronous XML fragment
					this.pDialog = Fragment.load({
						id: oView.getId(),
						name: "app.view.fragment.DetailsDialog",
						controller: this,
					}).then(function (oDialog) {
						// connect dialog to the root view of this component (models, lifecycle)
						oView.addDependent(oDialog);
						return oDialog;
					});
				}

				this.pDialog.then(
					function (oDialog) {
						this._setDetailsDialogContent(oAppointment, oDialog);
					}.bind(this)
				);
			},

			onCloseDialog: function () {
				this._oView.byId("detailsDialog").close();
			},

			onDeleteAppointment: function () {
				var oDetailsDialog = this._oView.byId("detailsDialog"),
					oBindingContext = oDetailsDialog.getBindingContext(),
					oAppointment = oBindingContext.getObject(),
					aDoctorAppointments = oBindingContext.getPath().indexOf("/reservations/") + "/reservations/".length,
					iDoctorId = oBindingContext.getPath()[aDoctorAppointments];
				this._oView.oController.removeAppointment(oAppointment, null, iDoctorId);
				this._oView.byId("detailsDialog").close();
			},

			_setDetailsDialogContent: function (oAppointment, oDialog) {
				oDialog.setBindingContext(oAppointment.getBindingContext());
				oDialog.openBy(oAppointment);
			},

			formatDate: function (s) {
				let oDate = new Date(s);
				if (oDate) {
					var iHours = oDate.getHours(),
						iMinutes = oDate.getMinutes(),
						iSeconds = oDate.getSeconds();

					if (iHours !== 0 || iMinutes !== 0 || iSeconds !== 0) {
						return DateFormat.getDateTimeInstance({
							style: "medium",
						}).format(oDate);
					} else {
						return DateFormat.getDateInstance({
							style: "medium",
						}).format(oDate);
					}
				}
			},

			onEditAppointment: function () {
				let oDetailsDialog = this._oView.byId("detailsDialog");
				this._oView.oController.onEditAppointment(
					oDetailsDialog.getBindingContext().getPath()
				);
				this.onCloseDialog();
			},
		});
	}
);
