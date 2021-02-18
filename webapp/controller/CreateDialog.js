sap.ui.define(
	[
		"sap/ui/base/ManagedObject",
		"sap/ui/core/library",
		"sap/ui/core/Fragment",
		"sap/base/Log",
		"../util/apiCalls"
	],
	function (ManagedObject, coreLibrary, Fragment, Log, apiCalls) {
		"use strict";

		var ValueState = coreLibrary.ValueState;

		return ManagedObject.extend("app.controller.CreateDialog", {
			constructor: function (oView) {
				this._oView = oView;
				this.sPath = null;
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
				this.sPath = this._oView.oController.sPath;

				let oAppointment = oDialog.getModel().getProperty(this.sPath),
					sSelectedIntervalStart = oAppointment.start,
					sSelectedIntervalEnd = oAppointment.end,
					sProcedure = oAppointment.procedure,
					sPatientName = oAppointment.patient_name,
					iAppId = oAppointment.id,
					iSelectedDoctorId = this.sPath[
						this.sPath.indexOf("/appointmnetns/") +
						"/appointmnetns/".length
					],
					oDoctorSelected = this._oView.byId("selectDoctor"),
					oStartDate = this._oView.byId("startDate"),
					oEndDate = this._oView.byId("endDate"),
					oProcedureInput = this._oView.byId("inputProcedure"),
					oPatientNameInput = this._oView.byId("inputPatientName"),
					oAppIdInput = this._oView.byId("inputAppId");

				oDoctorSelected.setSelectedIndex(iSelectedDoctorId);
				oStartDate.setDateValue(new Date(sSelectedIntervalStart));
				oEndDate.setDateValue(new Date(sSelectedIntervalEnd));
				oProcedureInput.setValue(sProcedure);
				oPatientNameInput.setValue(sPatientName);
				oAppIdInput.setValue(iAppId);

				oStartDate.setValueState(ValueState.None);
				oEndDate.setValueState(ValueState.None);
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
					oInputPatientName.getValueState() !==
					ValueState.Error &&
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
					"/reservations/" +
					this._oView
					.byId("selectDoctor")
					.getSelectedIndex()
					.toString();
				sPath += "/appointments";
				/**
				 * Add appointment to DB
				 */
				apiCalls.addAppointment(oAppointment, this._oView.byId("selectDoctor").getSelectedKey());
				/**
				 * Reflect it in the model
				 */
				let oDoctorAppointments = oModel.getProperty(sPath);
				if (oDoctorAppointments) {
					oDoctorAppointments.push(oAppointment);
				} else {
					oDoctorAppointments = [oAppointment];
				}
				oModel.setProperty(sPath, oDoctorAppointments);

			},

			onSaveButton: function () {
				if (!this._updateButtonEnabledState()) {
					return;
				}
				var oStartDate = this._oView.byId("startDate"),
					oEndDate = this._oView.byId("endDate"),
					sProcedure = this._oView.byId("inputProcedure").getValue(),
					sPatientName = this._oView.byId("inputPatientName").getValue(),
					iAppId = this._oView.byId("inputAppId").getValue(),
					iDoctorId = this._oView.byId("selectDoctor").getSelectedIndex(),
					oModel = this._oView.getModel(),
					oCreateDialog = this._oView.byId("createDialog"),
					oNewAppointment;

				if (this.sPath && oCreateDialog._oDialogType.type === 'edit_appointment') {
					this._editAppointment({
							id: iAppId,
							patient_name: sPatientName,
							procedure: sProcedure,
							start: oStartDate.getDateValue(),
							end: oEndDate.getDateValue(),
						},
						iDoctorId,
						oCreateDialog
					);
				} else {
					oNewAppointment = {
						id: iAppId,
						patient_name: sPatientName,
						procedure: sProcedure,
						start: new Date(oStartDate.getDateValue()),
						end: new Date(oEndDate.getDateValue()),
					};
					this._addNewAppointment(oNewAppointment);
				}
				oModel.updateBindings();
				this._oView.byId("createDialog").close();
			},

			_editAppointment: function (oAppointment, iDoctorId, oCreateDialog) {
				var sAppointmentPath = this._appointmentOwnerChange(oCreateDialog),
					oModel = this._oView.getModel();

				if (this.sPath !== sAppointmentPath) {
					this._addNewAppointment(oAppointment);
					this._oView.oController.removeAppointment(oCreateDialog.getModel().getProperty(this.sPath), this.sPath);
				}

				oModel.setProperty(sAppointmentPath + "/id", oAppointment.id);
				oModel.setProperty(sAppointmentPath + "/patient_name", oAppointment.patient_name);
				oModel.setProperty(sAppointmentPath + "/procedure", oAppointment.procedure);
				oModel.setProperty(sAppointmentPath + "/start", oAppointment.start);
				oModel.setProperty(sAppointmentPath + "/end", oAppointment.end);

				apiCalls.updateAppointment(oAppointment);
			},

			_appointmentOwnerChange: function (oCreateDialog) {
				var iSpathDoctorId = this.sPath[this.sPath.indexOf("/reservations/") + "/reservations/".length],
					iSelectedDoctor = this._oView.byId("selectDoctor").getSelectedIndex(),
					sTempPath = this.sPath,
					iLastElementIndex = oCreateDialog.getModel().getProperty(
						"/reservations/" + iSelectedDoctor.toString() + "/appointments/"
					).length.toString();

				if (iSpathDoctorId !== iSelectedDoctor.toString()) {
					sTempPath = "".concat("/reservations/", iSelectedDoctor.toString(), "/appointments/", iLastElementIndex.toString());
				}

				return sTempPath;
			},

		});
	}
);
