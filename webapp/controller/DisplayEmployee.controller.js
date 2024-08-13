sap.ui.define([
    "./App.controller",
    "sap/ui/model/json/JSONModel",
    "employeemgmt/model/models"
],
    function (BaseController, JSONModel, Models) {
        "use strict";

        return BaseController.extend("employeemgmt.controller.DisplayEmployee", {
            onInit: function () {
                this.getRouter().getRoute("DisplayEmployee").attachPatternMatched(this._onObjectMatched, this);
            },

            _onObjectMatched: function () {
                debugger;
                this.getModel("EmployeeModel").setProperty("/bEdit", false);
                this.getModel("EmployeeModel").setProperty("/bDisplay", true);
            },

            onEditPress: function () {
                debugger;
                this.getModel("EmployeeModel").setProperty("/bEdit", true);
                this.getModel("EmployeeModel").setProperty("/bDisplay", false);
            },

            onBeforeCVUploadStarts: function (oEvent) {
                debugger;
                var oFile = oEvent.mParameters.item.getFileObject();
                var iEmpId = this.getModel("EmployeeModel").oData.detailPageData.EMP_ID
                var oFileObj = {
                    "FileName": oFile.name,
                    "EmpId": iEmpId,
                    "MediaType": oFile.type
                };
                this.getModel("EmployeeModel").setProperty("/requiredCVDetails", oFileObj);
                var reader = new FileReader();
                reader.onload = (e) => {
                    debugger;
                    var oCvObj = this.getModel("EmployeeModel").getProperty("/requiredCVDetails");
                    var sBase64Str = e.target.result.split(",")[1];
                    var oPayload = Models.onCreateFileObj();
                    oPayload.FILE_NAME = oFileObj.FileName;
                    oPayload.EMP_EMP_ID = oFileObj.EmpId;
                    oPayload.MEDIA_TYPE = oFileObj.MediaType
                    oPayload.CONTENT = sBase64Str;

                    this.getModel().create("/Files", oPayload, {
                        success: function (oData) {
                            debugger;
                        }
                    });
                };
                reader.readAsDataURL(oFile);
            },

            onAfterItemRemoved: function(oEvent){
                debugger;
                var sFileId = oEvent.mParameters.item.getBindingContext("EmployeeModel").getObject().FILE.FILE_ID;
                var sUrl = `/Files(guid'${sFileId}')`;
                this.getModel().remove(sUrl,{
                    success: function(oData){
                        debugger;
                        sap.m.MessageBox.success("CV deleted successfully.");
                    },
                    error: function(oError){
                        debugger;
                    }
                });
            }

        });
    });
