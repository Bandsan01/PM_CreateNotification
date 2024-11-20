sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/core/format/DateFormat",
    "sap/m/MessageBox",
],
    function (Controller, JSONModel, Filter, FilterOperator, DateFormat, MessageBox) {
        "use strict";

        return Controller.extend("zcreatenotification.zcreatenotification.controller.View2", {

            onInit() {
                //var oRouter = this.getOwnerComponent().getRouter();
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.getRoute("View2").attachPatternMatched(this.onObjectMatched, this);
            },

            onObjectMatched(oEvent) {
                this.objData = zcreatenotification.zcreatenotification.data
                var entity = "/GetNotificationSet";
                var Filter1 = new Filter('Qmart', 'EQ', this.objData.notTyp);
                var Filter2 = new Filter('Equnr', 'EQ', this.objData.equip);

                var ofilter = [Filter1, Filter2];
                var that = this;
                var oModel = this.getOwnerComponent().getModel();
                oModel.read(entity, {
                    filters: ofilter,
                    "async": true,
                    "success": function (oData) {
                        const dateFormat = sap.ui.core.format.DateFormat.getDateInstance({
                            pattern: "d MMM y"
                        });
                        for (var i = 0; i < oData.results.length; i++) {
                            oData.results[i].Erdat = dateFormat.format(oData.results[i].Erdat);
                        }

                        var oModel = new JSONModel([]);
                        oModel.setData(oData.results)
                        that.getView().setModel(oModel, "notifData");
                    },
                    "error": function (oError) {

                    }
                });
            },
            onCreateNot: function () {
                var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({
                    pattern: "yyyy-MM-ddT00:00:00"
                });
                var dateFormatted = dateFormat.format(this.objData.dDefaultDate);
                if (this.objData.reqEndDate === "" || this.objData.reqEndDate === "") {
                    var dateFormattedReq = dateFormat.format(this.objData.dDefaultDate);
                } else {
                    var dateFormattedReq = dateFormat.format(this.objData.reqEndDate);
                }
                // var dateFormattedReq = dateFormat.format(this.objData.reqEndDate);
                var data = {
                    "NotifType": this.objData.notTyp,
                    "Type": "",
                    "Message": "",
                    "LongText": this.objData.longTxt,
                    "Notifheader": {
                        "Refobjecttype": "",
                        "Refobjectkey": "",
                        "Refreltype": "",
                        "Equipment": this.objData.equip,
                        "FunctLoc": this.objData.fnLoc,
                        "Assembly": "",
                        "Serialno": "",
                        "Material": "",
                        "Division": "",
                        "SalesOrg": "",
                        "DistrChan": "",
                        "SalesOffice": "",
                        "SalesGrp": "",
                        "ShortText": this.objData.desc,
                        "Priority": this.objData.Priority,
                        "Desstdate": dateFormattedReq,
                        "Dessttime": "PT17H15M",
                        "Breakdown" : true,
                        // "Desenddate" : "0000-00-00T00:00:00",
                        "Strmlfndate": dateFormatted,
                        // "Strmlfntime" : "",
                        
                        "NotifDate": dateFormatted,
                        
                        // "Notiftime" : ""
                    }
                };
                var that = this;
                var croModel = this.getOwnerComponent().getModel();
                croModel.create("/CreateNotificationSet", data, {
                    method: "POST",
                    success: function (success) {
                        if (success.NotifNo === "") {
                            MessageBox.error("Error while creating notification");
                        } else {
                            MessageBox.success("Notification No " + success.NotifNo + " Created successfully", {
                                actions: [MessageBox.Action.OK],
                                emphasizedAction: MessageBox.Action.OK,
                                onClose: function (sAction) {
                                    var CrossApplicationNavigation = sap.ushell.Container.getService("CrossApplicationNavigation");
                                    CrossApplicationNavigation.toExternal({
                                        target: {
                                            shellHash: "#"
                                        }
                                    });
                                },
                                dependentOn: that.getView()
                            });
                        }
                    },
                    error: function (error) {
                        MessageBox.error("Error while creating notification");
                    }
                });

            },
            onClose: function () {
                var oRouter = this.getOwnerComponent().getRouter();
                oRouter.navTo("View1");
            }


        });
    });
