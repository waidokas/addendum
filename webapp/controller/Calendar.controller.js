sap.ui.define(
	[
		"sap/ui/core/mvc/Controller",
		"sap/ui/model/json/JSONModel",
		"./CreateDialog",
		"./DetailsDialog",
	],
	function (Controller, JSONModel, CreateDialog, DetailsDialog) {
		"use strict";

		return Controller.extend("app.controller.Calendar", {
			/**
			 * Global data used in App
			 */
			_aDialogTypes: [{
					title: "Create Appointment",
					type: "create_appointment"
				},
				{
					title: "Edit Appointment",
					type: "edit_appointment"
				},
			],

			onInit: function () {
				/**
				 * Get data and set model
				 */
				var oModel = new JSONModel("model/reservations.json");
				oModel.attachRequestCompleted(function () {
					var reservations = oModel.getData();
					oModel.setData({
						startDate: new Date(),
						reservations,
					});
				});
				this.getView().setModel(oModel);

				// create dialogs
				this._createDialog = new CreateDialog(this.oView);
				this._detailsDialog = new DetailsDialog(this.oView);
			},

			exit: function () {
				this._createDialog.destroy();
				delete this._createDialog;
				this._detailsDialog.destroy();
				delete this._detailsDialog;
			},

			dateFormatter: function (s) {
				return new Date(s);
			},

			/**
			 * Create dialog manipulations part
			 */
			onCreateAppointment: function () {
				this._createDialog.open(this._aDialogTypes[0]);
			},

			onEditAppointment: function (sPath) {
				this.sPath = sPath;
				this._createDialog.open(this._aDialogTypes[1]);
			},

			onSelectAppointment: function (oEvent) {
				var oAppointment = oEvent.getParameter("appointment");
				if (oAppointment === undefined) {
					return;
				}
				this._detailsDialog.open(oAppointment);
			},

			removeAppointment: function (oAppointment, sPath, sDoctorId) {
				var oModel = this.oView.getModel(),
					sTempPath,
					aDoctorAppointments,
					iIndexForRemoval;

				if (!sDoctorId) {
					sTempPath = sPath.slice(0, sPath.indexOf("appointments/") + "appointments/".length);
				} else {
					sTempPath = "/reservations/" + sDoctorId + "/appointments";
				}

				aDoctorAppointments = oModel.getProperty(sTempPath);
				iIndexForRemoval = aDoctorAppointments.indexOf(oAppointment);
				if (iIndexForRemoval !== -1) {
					aDoctorAppointments.splice(iIndexForRemoval, 1);
				}
				oModel.setProperty(sTempPath, aDoctorAppointments);
			},

		});
	}
);
