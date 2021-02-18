sap.ui.require(
	[
		"app/util/Validation",
		"sap/ui/model/resource/ResourceModel",
		"sap/ui/thirdparty/sinon",
		"sap/ui/thirdparty/sinon-qunit"
	],
	function (validator, ResourceModel) {
		"use strict";
		QUnit.module("Test", {
			setup: function () {
			},
			teardown: function () {
			}
		});
		QUnit.test("Should return true", function (assert) {
			assert.strictEqual(true, true, "The True is Correct!");
		});
	}
);