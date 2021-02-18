sap.ui.define(
	[
		"sap/ui/core/mvc/Controller",
		"sap/ui/core/EventBus",
		"./CreateDialog",
		"./DetailsDialog",
		"../util/ApiCalls"
	],
	function (Controller, EventBus, CreateDialog, DetailsDialog, apiCalls) {
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
				const bus = this.getOwnerComponent().getEventBus();
				bus.subscribe("appChannel", "refreshDataEvent", this.setModel, this);
				// Get data and set model
				this.setModel()

				// create dialogs
				this._createDialog = new CreateDialog(this.oView);
				this._detailsDialog = new DetailsDialog(this.oView);
			},

			setModel: function () {
				this.getView().setModel(apiCalls.getModel());
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

			/**
			 * Used by both dialogs, that's why placed here
			 * 
			 */
			removeAppointment: function (oAppointment, sPath, sDoctorId) {
				var oModel = this.oView.getModel(),
					sTempPath,
					aDoctorAppointments,
					iIndexForRemoval;

				if (sDoctorId) {
					sTempPath = "/reservations/" + sDoctorId + "/appointments";
				} else {
					sTempPath = sPath.slice(0, sPath.indexOf("appointments/") + "appointments/".length);
				}
				aDoctorAppointments = oModel.getProperty(sTempPath);
				if (sDoctorId) {
					iIndexForRemoval = aDoctorAppointments.findIndex(i => {
						return i.id === oAppointment.id
					});
				} else {
					iIndexForRemoval = sPath.substring(sPath.lastIndexOf('/') + 1);
				}

				if (iIndexForRemoval !== -1) {
					aDoctorAppointments.splice(iIndexForRemoval, 1);
				}
				oModel.setProperty(sTempPath, aDoctorAppointments);

				apiCalls.removeAppointment(oAppointment.id);
			},

		});
	}
);
