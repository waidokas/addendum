sap.ui.define(
	[
		"sap/ui/core/mvc/Controller",
		"sap/ui/model/json/JSONModel",
		"./CreateDialog",
		"./DetailsDialog",
		"../util/apiCalls"
	],
	function (Controller, JSONModel, CreateDialog, DetailsDialog, apiCalls) {
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
				var oModel = new JSONModel();
				oModel.loadData('http://localhost:3000/appointments');
				oModel.attachRequestCompleted(function () {
					var reservations = oModel.getData();
					// reservations.forEach(reservation => {
					// 	reservation.appointments.forEach(appnt => {
					// 		appnt.start = new Date(appnt.start)
					// 		appnt.end = new Date(appnt.end)
					// 	});
					// });
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

				if (sDoctorId) {
					sTempPath = "/reservations/" + sDoctorId + "/appointments";
				} else {
					sTempPath = sPath.slice(0, sPath.indexOf("appointments/") + "appointments/".length);
				}
				aDoctorAppointments = oModel.getProperty(sTempPath);
				//iIndexForRemoval = aDoctorAppointments.indexOf(oAppointment);
				if (sDoctorId) {
					iIndexForRemoval = aDoctorAppointments.findIndex(i => {
						return i.id === oAppointment.id
						// return (JSON.stringify(i.end) === JSON.stringify(oAppointment.end) &&
						// 	JSON.stringify(i.start) === JSON.stringify(oAppointment.start) &&
						// 	i.patient_name === oAppointment.patient_name &&
						// 	i.procedure === oAppointment.procedure)
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
