/*global QUnit*/

sap.ui.define([
	"employeemgmt/controller/EmployeeMgmt.controller"
], function (Controller) {
	"use strict";

	QUnit.module("EmployeeMgmt Controller");

	QUnit.test("I should test the EmployeeMgmt controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
