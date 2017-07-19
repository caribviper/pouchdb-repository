"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var category_error_1 = require("./category-error");
var Assert = (function () {
    function Assert() {
    }
    /**
     * Asserts whether the value passed is true
     * @param value Value to be evaluated
     * @param message Error message to be generated
     * @param title Title/Category of error
     */
    Assert.isTrue = function (value, message, title) {
        if (title === void 0) { title = ''; }
        if (!value)
            throw new category_error_1.CategoryError(message, title);
    };
    /**
     * Asserts whether the value passed is false
     * @param value Value to be evaluated
     * @param message Error message to be generated
     * @param title Title/Category of error
     */
    Assert.isFalse = function (value, message, title) {
        if (title === void 0) { title = ''; }
        if (value === false)
            throw new category_error_1.CategoryError(message, title);
    };
    /**
     * Asserts whether the value is not false/undefined
     * @param value Value to be evaluated
     * @param message Error message to be generated
     * @param title Title/Category of error
     */
    Assert.isTruthy = function (value, message, title) {
        if (title === void 0) { title = ''; }
        if (!value)
            throw new category_error_1.CategoryError(message, title);
    };
    /**
     * Asserts whether the value passed is falsey or undefined
     * @param value Value to be evaluated
     * @param message Error message to be generated
     * @param title Title/Category of error
     */
    Assert.isFalsey = function (value, message, title) {
        if (title === void 0) { title = ''; }
        if (!value)
            throw new category_error_1.CategoryError(message, title);
    };
    /**
     * Asserts whether the value passed is a non empty array
     * @param value Value to be evaluated
     * @param message Error message to be generated
     * @param title Title/Category of error
     */
    Assert.isNonEmptyArray = function (value, message, title) {
        if (title === void 0) { title = ''; }
        if (!value && value.length > 0)
            throw new category_error_1.CategoryError(message, title);
    };
    return Assert;
}());
exports.Assert = Assert;
