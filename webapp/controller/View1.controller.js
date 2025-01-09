sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/library",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
],
    function (Controller, JSONModel, coreLibrary, Filter, FilterOperator) {
        "use strict";

        return Controller.extend("zcreatenotification.zcreatenotification.controller.View1", {
            onInit: function () {
                this.oModel = new JSONModel({
                    dDefaultDate: new Date(),
                    notTyp: "",
                    notHdrTxt: "",
                    fnLoc: "",
                    equip: "",
                    desc: "",
                    longTxt: "",
                    Priority: "",
                    reqEndDate: "",
                    fnlocDesc : "",
                    eqipDesc : "",
                    visible : "false",
                    valueState : "None",
                    valueStateTxt : "",
                    valueStateNT : "None",
                    valueStateTxtNT : "",
                    valueStateEq : "None",
                    valueStateTxtEq : "",
                    LTvalueState : "None",
                    valueStateLTxt : ""



                });
                this.getView().setModel(this.oModel, "view");
            },

            onChange: function (oEvent) {
                this.oModel.setProperty("/valueStateEq", "None");
                this.oModel.setProperty("/valueStateTxtEq", "");
                var val = oEvent.getSource().getValue();
                var oModel = this.getOwnerComponent().getModel();
                var entity = "/GetFunctionalLOCSet";
                var Filter1 = new Filter('Equnr', 'EQ', val);
                var ofilter = [Filter1];
                var that = this;
                oModel.read(entity, {
                    filters: ofilter,
                    "async": true,
                    "success": function (oData) {
                        that.oModel.setProperty("/fnLoc", oData.results[0].Tplnr)
                        that.oModel.setProperty("/fnlocDesc", oData.results[0].Pltxt)
                        that.oModel.setProperty("/eqipDesc", oData.results[0].Eqktx)
                        that.oModel.setProperty("/visible", "true")
                    },
                    "error": function (oError) {

                    }
                });
            },

            onTypChange: function (evt) {
                var seltyp = evt.getSource().getSelectedKey();
                this.oModel.setProperty("/notTyp", seltyp)
                this.oModel.setProperty("/valueStateNT", "None");
                this.oModel.setProperty("/valueStateTxtNT", "");
            },

            onChangeNotText : function(oEvent){
                var notText = oEvent.getSource().getValue();
                this.oModel.setProperty("/valueState", "None");
                this.oModel.setProperty("/valueStateTxt", "");
            },
            onPrtChange: function (evt) {
                var selPrt = evt.getSource().getSelectedKey();
                this.oModel.setProperty("/Priority", selPrt)
            },
            handleLiveChange: function (oEvent) {
                var oTextArea = oEvent.getSource();
               var iValueLength = oTextArea.getValue().length;
               if(iValueLength <= 132){
                this.oModel.setProperty("/LTvalueState", "None");
                this.oModel.setProperty("/valueStateLTxt", "");
               }
            },
            onCreatePress: function () {
                if(this.oModel.getData().notTyp === ""){
                    this.oModel.setProperty("/valueStateNT", "Error");
                    this.oModel.setProperty("/valueStateTxtNT", "Please Select Notification Type");
                    return;
                }
                if(this.oModel.getData().equip === ""){
                    this.oModel.setProperty("/valueStateEq", "Error");
                    this.oModel.setProperty("/valueStateTxtEq", "Please Enter Equipment Value");
                    return;
                }
                if(this.oModel.getData().desc === ""){
                    this.oModel.setProperty("/valueState", "Error");
                    this.oModel.setProperty("/valueStateTxt", "Please Enter Notification Text");
                    return;
                }
                if(this.oModel.getData().longTxt.length > "132"){
                    this.oModel.setProperty("/LTvalueState", "Error");
                    this.oModel.setProperty("/valueStateLTxt", "Long text character limit not to exceed 132 char");

                    return;
                }
                var oRouter = this.getOwnerComponent().getRouter();
                zcreatenotification.zcreatenotification.data = this.oModel.getData();
                oRouter.navTo("View2"); 
            }
        });
    });
