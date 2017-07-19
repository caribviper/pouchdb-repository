"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Encapsulates an error messages with a title or category.
 */
var CategoryError = (function (_super) {
    __extends(CategoryError, _super);
    /**
     * Creates a new CategoryError messages
     * @param message Details of the message.
     * @param title Title/Category of the message
     */
    function CategoryError(message, title) {
        if (message === void 0) { message = ''; }
        if (title === void 0) { title = ''; }
        var _this = _super.call(this, message) || this;
        _this.title = title;
        return _this;
    }
    return CategoryError;
}(Error));
exports.CategoryError = CategoryError;
