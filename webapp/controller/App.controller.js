sap.ui.define(
    [
        "sap/ui/core/mvc/Controller"
    ],
    function(BaseController) {
      "use strict";
  
      return BaseController.extend("employeemgmt.controller.App", {
        onInit: function () {
        },
  
        getRouter: function () {
          return this.getOwnerComponent().getRouter();
        },
  
        getModel: function (sName) {
          return sName ? this.getOwnerComponent().getModel(sName) : this.getOwnerComponent().getModel();
        },
  
        setProperty: function (property, value) {
          return this.getModel("EmployeeModel").setProperty(property, value);
        },
  
        getProperty: function (property) {
          return this.getModel("EmployeeModel").setProperty(property);
        },
  
        getControl: function (sId) {
          var sControlType = this.getModel("EmployeeModel").getProperty("/controlType");
          return sControlType === "Dialog" ? sap.ui.getCore().byId(sId) : this.byId(sId);
        },
  
        readData: function (sEntitySet, sProperty, oFilters) {
          var oModel = this.getModel();
          oModel.read(sEntitySet, {
            filters: [oFilters],
            success: function (oData) {
              this.getModel("EmployeeModel").setProperty(sProperty, oData.results)
            }.bind(this)
          });
        },
  
        deleteData: function (sUrl,) {
          return new Promise(function (resolve, reject) {
            var odataModel = this.getModel();
            odataModel.remove(sUrl, {
              success: function (data) {
                debugger;
                resolve(data);
              }.bind(this),
              error: function (error) {
                debugger;
              }
            });
          }.bind(this))
        }
      });
    }
  );
  