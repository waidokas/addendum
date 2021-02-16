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
            _aDialogTypes: [
                { title: "Create Appointment", type: "create_appointment" },
                { title: "Edit Appointment", type: "edit_appointment" },
            ],

            onInit: function () {
                /**
                 * Get data and set model
                 */
                var oModel = new JSONModel("model/appointments.json");
                oModel.attachRequestCompleted(function () {
                    var appointments = oModel.getData();
                    oModel.setData({
                        startDate: new Date(),
                        appointments,
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

        });
    }
);
