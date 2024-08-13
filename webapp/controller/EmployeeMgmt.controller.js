sap.ui.define([
    "./App.controller",
    "../model/models",
    "sap/m/MessageBox"
],
    function (BaseController, models, MessageBox) {
        "use strict";

        return BaseController.extend("employeemgmt.controller.EmployeeMgmt", {
            onInit: function () {
                this.getModel().setUseBatch(false);
                this.readData("/Employees", "/TableItems", null);
            },        
            
            onUpdateFinish: function (oEvent) {
                debugger;
                var aItemsLen = oEvent.getSource().getBinding("items").aIndices.length;
                var oTable = this.getView().byId("employeesTable");
                oTable.getHeaderToolbar().getContent()[0].setText("Employee(" + aItemsLen + ")");

            }, 

            onEmployeeListItemPress: function (oEvent) {
                debugger;
                var oSelectedEmployee = oEvent.getSource().getBindingContext("EmployeeModel").getObject();
                this.getModel("EmployeeModel").setProperty("/detailPageData", oSelectedEmployee);
                var iEmployeeId = oSelectedEmployee.EMP_ID;
                this.getModel("EmployeeModel").setProperty("/empId", iEmployeeId);
                sap.ui.core.BusyIndicator.show(0);
                this.getModel().callFunction("/readEmployees", {
                    urlParameters: {
                        "EMP_ID": iEmployeeId
                    },
                    success: function (oData) {
                        this.expandCV();
                        this.getModel("EmployeeModel").setProperty("/detailPageData", oData.results[0]);
                        this.getModel("EmployeeModel").setProperty("/CV", oData.results);
                        this.getRouter().navTo("DisplayEmployee",{
                            Id: iEmployeeId
                        });
                        sap.ui.core.BusyIndicator.hide();
                    }.bind(this)
                });
            },

            expandCV: function(){
                var iEmployeeId = this.getModel("EmployeeModel").getProperty("/detailPageData").EMP_ID
                var oEmployeeFilter = new sap.ui.model.Filter({
                    path: "EMP_ID",
                    operator: sap.ui.model.FilterOperator.EQ,
                    value1: iEmployeeId
                });
                this.getModel().read("/Employees", {
                    urlParameters: {
                        "$expand": "FILE"
                    },
                    filters:[oEmployeeFilter],
                    success: function (oData) {
                        this.getModel("EmployeeModel").setProperty("/CV", oData.results);
                        this.getRouter().navTo("DisplayEmployee",{
                            Id: iEmployeeId
                        });
                        sap.ui.core.BusyIndicator.hide();
                    }.bind(this)
                });
            },

            onSelectedRecord: function () {
                debugger;
                var oTable = this.getView().byId("employeesTable");
                var aSeletedItem = oTable.getSelectedItems();
                this.getModel("EmployeeModel").setProperty("/seletedItemToDelete", aSeletedItem);
            },  //Select records to delete employee

            onDeletePress: function () {
                debugger;
                var aSeletedItem = this.getModel("EmployeeModel").getProperty("/seletedItemToDelete");
                if (aSeletedItem === undefined) {
                    MessageBox.error("Please select alteast one record!");
                    return;
                } else {
                    MessageBox.warning("Do you want to delete this record?", {
                        title: "Warning",
                        actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                        onClose: async function (sAction) {
                            if (sAction === 'YES') {
                                debugger;
                                for (var i in aSeletedItem) {
                                    var oSelectedEmployee = aSeletedItem[i].getBindingContext("EmployeeModel").getObject();
                                    var iEmployeeId = oSelectedEmployee.EMP_ID;
                                    var sUrl = `/Employees(${iEmployeeId})`;
                                    await this.deleteData(sUrl);
                                }
                                sap.m.MessageBox.success("Employee deleted successfully!!");
                                this.getView().byId("employeesTable").removeSelections(true);
                                this.readData("/Employees", "/TableItems", null);

                            }
                        }.bind(this)
                    });
                }
            },

            onCreateEmployee: function (oEvent) {
                debugger;
                var oModel = this.getModel("EmployeeModel");
                var oPayload = oModel.getProperty("/createData");
                oPayload.IMG = this.fileContent;
                this.getModel().create("/Employees", oPayload, {
                    success: function (oData) {
                        this.readData("/Employees", "/TableItems", null);
                        this.onCancelEmployee();
                    }.bind(this)
                })
            },

            onBeforeUploadStart: function (oEvent) {
                debugger;
                var that = this;
                var oImage = oEvent.mParameters.item.getFileObject();
                var reader = new FileReader();
                reader.onload = (e) => {
                    that.fileContent = e.target.result.split(",")[1];
                };
                reader.readAsDataURL(oImage);
            },

            onCancelEmployee: function () {
                this.createDialog.close();
                if (this.createDialog) {
                    this.createDialog.destroy();
                    this.createDialog = null;
                }
            },

            openCreateEmployeeDialog: function () {
                debugger;
                var oEmployeeModel = this.getModel("EmployeeModel");
                oEmployeeModel.setProperty("/createData", models.onCreateEmployeeObj());
                oEmployeeModel.setProperty("/controlType", "Dialog");
                if (!this.createDialog) {
                    this.createDialog = sap.ui.xmlfragment("employeemgmt.fragment.CreateEmployee", this);
                    this.getView().addDependent(this.createDialog);
                }
                this.createDialog.open();
            }
        });
    });
