sap.ui.define(["sap/ui/core/library"], function (coreLibrary) {
	"use strict";

	var ValueState = coreLibrary.ValueState;

	return {
		validateDateTimePickers: function (oView) {
			var oDateTimePickerStart = oView.byId("startDate"),
				oDateTimePickerEnd = oView.byId("endDate");

			const oStartDate = oDateTimePickerStart.getDateValue();
			const oEndDate = oDateTimePickerEnd.getDateValue();

			// initially set all ok
			oDateTimePickerStart.setValueState(ValueState.None);
			oDateTimePickerEnd.setValueState(ValueState.None);

			if (oStartDate && oEndDate) {
				// let's first check a trivial case of start and end date validity
				if (oEndDate.getTime() <= oStartDate.getTime()) {
					let sValueStateError = "Start date should be before End date"
					oDateTimePickerStart.setValueState(ValueState.Error);
					oDateTimePickerEnd.setValueState(ValueState.Error);
					oDateTimePickerStart.setValueStateText(sValueStateError);
					oDateTimePickerEnd.setValueStateText(sValueStateError);
				} else {
					// and now let's dig deeper
					const oModel = oView.getModel();
					const sPath = "/reservations/" + oView.byId("selectDoctor").getSelectedIndex().toString() + "/appointments";
					let oDoctorAppointments = oModel.getProperty(sPath);
					oDoctorAppointments.some(appnt => {
						// ignore specified appointment id in case it is being edited
						let ignoreId = oView.byId("inputAppId").getValue();
						if (appnt.id != ignoreId) {
							/**
							 * First let's check if it not overlaps
							 */
							const s = new Date(appnt.start)
							const e = new Date(appnt.end)
							if (oStartDate <= e && oEndDate >= s) {
								let sValueStateError = "The appointment overlaps with existing one";
								oDateTimePickerStart.setValueState(ValueState.Error);
								oDateTimePickerEnd.setValueState(ValueState.Error);
								oDateTimePickerStart.setValueStateText(sValueStateError);
								oDateTimePickerEnd.setValueStateText(sValueStateError);
								return true; // break the cycle
							}
							/**
							 * if a patient is the same, then check if it is not in the same week
							 */
							let patientName = oView.byId("inputPatientName").getValue();
							if (appnt.patient_name == patientName) {
								let oWeekEnd = new Date(oStartDate)
								let oWeekStart = new Date(oStartDate)
								oWeekStart.setDate(oWeekStart.getDate() - 7);
								if (oWeekStart <= e && oWeekEnd >= s) {
									let sValueStateError = "A patient can have only one appointment within the same week";
									oDateTimePickerStart.setValueState(ValueState.Error);
									oDateTimePickerEnd.setValueState(ValueState.Error);
									oDateTimePickerStart.setValueStateText(sValueStateError);
									oDateTimePickerEnd.setValueStateText(sValueStateError);
									return true; // break the cycle
								}
							}

						}
					});
				}
			}
		},

		validateInput: function (inp) {
			let val = inp.getValue();
			if (val.length < 3 || val.length > 50) {
				inp.setValueState(ValueState.Error);
				inp.setValueStateText(
					"Input value is required to be between 3 and 50 characters"
				);
			} else {
				inp.setValueState(ValueState.None);
			}
		},

		updateButtonEnabledState: function (oView) {
			let oStartDate = oView.byId("startDate"),
				oEndDate = oView.byId("endDate"),
				oInputPatientName = oView.byId("inputPatientName"),
				oInputProcedure = oView.byId("inputProcedure"),


				bEnabled =
				oStartDate.getValueState() !== ValueState.Error &&
				oStartDate.getValue() !== "" &&
				oEndDate.getValueState() !== ValueState.Error &&
				oEndDate.getValue() !== "" &&
				oInputPatientName.getValueState() !== ValueState.Error &&
				oInputPatientName.getValue() !== "" &&
				oInputProcedure.getValueState() !== ValueState.Error &&
				oInputProcedure.getValue() !== "";

			oView
				.byId("createDialog")
				.getBeginButton()
				.setEnabled(bEnabled);

			return bEnabled;
		},
	};
});
