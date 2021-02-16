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
            onInit: function () {
                /**
                 * Get data and set model
                 */
                var oModel = new JSONModel("model/people.json");
                oModel.attachRequestCompleted(function () {
                    var people = oModel.getData();
                    oModel.setData({
                        startDate: new Date(),
                        people,
                    });
                });
                this.getView().setModel(oModel);

                // set dialogs
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

            closeCreateDialog: function () {
                this._createDialog.destroy();
                delete this._createDialog;
            },

            /**
             * Create dialog manipulations part
             */
            onCreateAppointment: function () {
                this._createDialog.open();
            },

            onCancelAppointment: function(){
                this.byId("createDialog").close();
            },
        });
    }
);
