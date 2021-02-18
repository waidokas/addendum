sap.ui.define(["sap/ui/model/json/JSONModel"], function (JSONModel) {
	"use strict";

	return {
		/**
		 * Get data and set model
		 */
		getModel: function () {
			var oModel = new JSONModel();
			oModel.loadData('http://localhost:3000/appointments');
			oModel.attachRequestCompleted(function () {
				var reservations = oModel.getData();
				oModel.setData({
					startDate: new Date(),
					reservations,
				});
			});
			return oModel
		},

		addAppointment: function (oAppointment, doctorId) {
			const data = {
				patient_name: oAppointment.patient_name,
				procedure: oAppointment.procedure,
				start: oAppointment.start,
				end: oAppointment.end,
				doctor_id: doctorId
			}
			$.ajax({
				type: 'POST',
				url: 'http://localhost:3000/appointments/',
				contentType: 'application/json',
				data: JSON.stringify(data),
			}).done(function (res) {
				console.log('SUCCESS', res);
				oAppointment.id = res.id
			}).fail(function (msg) {
				alert('Failed to add the appointment');
				throw 'Failed to add the appointment';
			})
		},

		removeAppointment: function (id) {
			$.ajax({
				type: 'DELETE',
				url: 'http://localhost:3000/appointments/',
				contentType: 'application/json',
				data: JSON.stringify({
					id
				}),
			}).done(function () {
				console.log('SUCCESS');
			}).fail(function (msg) {
				alert('Failed to delete the appointment');
			})
		},

		updateAppointment: function (oAppointment) {
			const data = {
				id: oAppointment.id,
				patient_name: oAppointment.patient_name,
				procedure: oAppointment.procedure,
				start: oAppointment.start,
				end: oAppointment.end
			}
			$.ajax({
				type: 'PUT',
				url: 'http://localhost:3000/appointments/',
				contentType: 'application/json',
				data: JSON.stringify(data),
			}).done(function () {
				console.log('SUCCESS');
			}).fail(function (msg) {
				alert('Failed to update the appointment');
				throw 'Failed to update the appointment';
			})
		}
	};
});
