sap.ui.define(
	[
		"sap/ui/base/ManagedObject",
		"sap/ui/core/library",
		"sap/ui/core/Fragment",
		"sap/base/Log",
	],
	function (ManagedObject, coreLibrary, Fragment, Log) {
		"use strict";

		var ValueState = coreLibrary.ValueState;

		return ManagedObject.extend("app.controller.CreateDialog", {
			constructor: function (oView) {
				this._oView = oView;
			},

			exit: function () {
				delete this._oView;
			},

			open: function (oType) {
				var oView = this._oView;
				// create dialog lazily
				if (!this.pDialog) {
					// load asynchronous XML fragment
					this.pDialog = Fragment.load({
						id: oView.getId(),
						name: "app.view.fragment.CreateDialog",
						controller: this, //oFragmentController,
					}).then(function (oDialog) {
						// connect dialog to the root view of this component (models, lifecycle)
						oView.addDependent(oDialog);
						return oDialog;
					});
				}
				this.pDialog.then(
					function (oDialog) {
						this._openDialog(oType, oDialog);
					}.bind(this)
				);
			},

			/**
			 * Opens appointment maintainance dialog
			 * and configures it depending on an operation type
			 */
			_openDialog: function (oType, oDialog) {
				oDialog.attachBrowserEvent("resize", function () {
					console.log("Resize done");
				});
				oDialog._oDialogType = oType;
				if (oType.type === "edit_appointment") {
					this._setEditAppointmentDialogContent(oDialog);
				} else if (oType.type === "create_appointment") {
					this._setCreateAppointmentDialogContent();
				} else {
					Log.error("Wrong dialog type.");
				}
				oDialog.setTitle(oType.title);
				oDialog.open();
				this._updateButtonEnabledState();
			},

			_setCreateAppointmentDialogContent: function () {
				var oDateTimePickerStart = this._oView.byId("startDate"),
					oDateTimePickerEnd = this._oView.byId("endDate"),
					oPatientNameInput = this._oView.byId("inputPatientName"),
					oProcedureInput = this._oView.byId("inputProcedure"),
					oDoctorSelected = this._oView.byId("selectDoctor");

				oDoctorSelected.setSelectedItem(
					this._oView.byId("selectDoctor").getItems()[0]
				);
				oDateTimePickerStart.setValue("");
				oDateTimePickerEnd.setValue("");
				oDateTimePickerStart.setValueState(ValueState.None);
				oDateTimePickerEnd.setValueState(ValueState.None);
				oPatientNameInput.setValue("");
				oProcedureInput.setValue("");
			},

			_setEditAppointmentDialogContent: function (oDialog) {
				// 	var oAppointment = oDialog.getModel().getProperty(this.sPath),
				// 		oSelectedIntervalStart = oAppointment.start,
				// 		oSelectedIntervalEnd = oAppointment.end,
				// 		sSelectedProcedure = oAppointment.info,
				// 		sSelectedPersonName = oAppointment.title,
				// 		iSelectedDoctorId = this.sPath[this.sPath.indexOf("/people/") + "/people/".length],
				// 		oDateTimePickerStart = this.byId("startDate"),
				// 		oDateTimePickerEnd = this.byId("endDate"),
				// 		oDoctorSelected = this.byId("doctorPerson"),
				// 		oStartDate = this.byId("startDate"),
				// 		oEndDate = this.byId("endDate"),
				// 		oProcedureInput = this.byId("inputProcedure"),
				// 		oPatientNameInput = this.byId("inputPatientName");
				// 		oDoctorSelected.setSelectedIndex(iSelectedPersonId);
				// 	oStartDate.setDateValue(oSelectedIntervalStart);
				// 	oEndDate.setDateValue(oSelectedIntervalEnd);
				// 	oMoreInfoInput.setValue(sSelectedInfo);
				// 	oTitleInput.setValue(sSelectedTitle);
				// 	oDateTimePickerStart.setValueState(ValueState.None);
				// 	oDateTimePickerEnd.setValueState(ValueState.None);
			},

			onCloseDialog: function () {
				this._oView.byId("createDialog").close();
			},

			onChangeInput: function (oEvent) {
				let val = oEvent.getParameter("newValue");
				let inp = this._oView.byId(oEvent.getParameter("id"));
				if (val.length < 3 || val.length > 50) {
					inp.setValueState(ValueState.Error);
					inp.setValueStateText(
						"Input value is required to be between 3 and 50 characters"
					);
				} else {
					inp.setValueState(ValueState.None);
				}

				this._updateButtonEnabledState();
			},

			onChangeDTP: function (oEvent) {
				var oDateTimePickerStart = this._oView.byId("startDate"),
					oDateTimePickerEnd = this._oView.byId("endDate");

				if (oEvent.getParameter("valid")) {
					this._validateDateTimePicker(
						oDateTimePickerStart,
						oDateTimePickerEnd
					);
				} else {
					oEvent.getSource().setValueState(ValueState.Error);
				}

				this._updateButtonEnabledState();
			},

			_validateDateTimePicker: function (
				oDateTimePickerStart,
				oDateTimePickerEnd
			) {
				var oStartDate = oDateTimePickerStart.getDateValue(),
					oEndDate = oDateTimePickerEnd.getDateValue(),
					sValueStateText = "Start date should be before End date";

				if (
					oStartDate &&
					oEndDate &&
					oEndDate.getTime() <= oStartDate.getTime()
				) {
					oDateTimePickerStart.setValueState(ValueState.Error);
					oDateTimePickerEnd.setValueState(ValueState.Error);
					oDateTimePickerStart.setValueStateText(sValueStateText);
					oDateTimePickerEnd.setValueStateText(sValueStateText);
				} else {
					oDateTimePickerStart.setValueState(ValueState.None);
					oDateTimePickerEnd.setValueState(ValueState.None);
				}
			},

			_updateButtonEnabledState: function () {
				let oStartDate = this._oView.byId("startDate"),
					oEndDate = this._oView.byId("endDate"),
					oInputPatientName = this._oView.byId("inputPatientName"),
					oInputProcedure = this._oView.byId("inputProcedure"),
					bEnabled =
						oStartDate.getValueState() !== ValueState.Error &&
						oStartDate.getValue() !== "" &&
						oEndDate.getValueState() !== ValueState.Error &&
						oEndDate.getValue() !== "" &&
						oInputPatientName.getValueState() !== ValueState.Error &&
						oInputPatientName.getValue() !== "" &&
						oInputProcedure.getValueState() !== ValueState.Error &&
						oInputProcedure.getValue() !== "";
				this._oView
					.byId("createDialog")
					.getBeginButton()
					.setEnabled(bEnabled);
				return bEnabled;
			},

			_addNewAppointment: function (oAppointment) {
				var oModel = this._oView.getModel(),
					sPath =
						"/appointments/" +
						this._oView
							.byId("selectDoctor")
							.getSelectedIndex()
							.toString();
				sPath += "/appointments";
				let oPersonAppointments = oModel.getProperty(sPath);
				console.log(sPath);
				console.log(oPersonAppointments);
				oPersonAppointments.push(oAppointment);
				oModel.setProperty(sPath, oPersonAppointments);
			},

			onSaveButton: function () {
				if (!this._updateButtonEnabledState()) {
					return;
				}
				var oStartDate = this._oView.byId("startDate"),
					oEndDate = this._oView.byId("endDate"),
					sProcedure = this._oView.byId("inputProcedure").getValue(),
					sPatientName = this._oView
						.byId("inputPatientName")
						.getValue(),
					iDoctorId = this._oView
						.byId("selectDoctor")
						.getSelectedIndex(),
					oModel = this._oView.getModel(),
					oNewAppointmentDialog = this._oView.byId("createDialog"),
					oNewAppointment;

				if (
					oStartDate.getValueState() !== ValueState.Error &&
					oEndDate.getValueState() !== ValueState.Error
				) {
					if (
						this.sPath &&
						oNewAppointmentDialog._sDialogType ===
							"edit_appointment"
					) {
						// this._editAppointment({
						//     title: sInputTitle,
						//     info: sInfoValue,
						//     type: this.byId("detailsPopover").getBindingContext().getObject().type,
						//     start: oStartDate.getDateValue(),
						//     end: oEndDate.getDateValue()}, bIsIntervalAppointment, iPersonId, oNewAppointmentDialog);
					} else {
						oNewAppointment = {
							patient_name: sPatientName,
							procedure: sProcedure,
							start: oStartDate.getDateValue(),
							end: oEndDate.getDateValue(),
						};
						this._addNewAppointment(oNewAppointment);
					}
					oModel.updateBindings();
					oNewAppointmentDialog.close();
				}
			},
		});
	}
);
