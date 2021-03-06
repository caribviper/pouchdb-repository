"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var caribviper_common_1 = require("caribviper-common");
/**Manages index implementing IDataIndex */
var DataIndex = (function () {
    /**
     * Creates a new DataIndex
     * @param name Name of the index
     * @param fields Fields of the index
     */
    function DataIndex(name) {
        var fields = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            fields[_i - 1] = arguments[_i];
        }
        caribviper_common_1.Assert.isTruthy(name, 'DataIndex: Name cannot be null/empty');
        caribviper_common_1.Assert.isNonEmptyArray(fields, 'DataIndex: Fields cannot be null');
        this.name = caribviper_common_1.Utilities.getPropertyName(name);
        this.fields = fields;
    }
    return DataIndex;
}());
exports.DataIndex = DataIndex;
/**Manages the index container by implementing IDataIndexContainer */
var DataIndexContainer = (function () {
    /**
     * Creates a new DataIndexContainer
     * @param index IDataIndex with the index
     */
    function DataIndexContainer(index) {
        this.index = index;
    }
    /**
     * Creates a new DataIndexContainer with defined index based on paramaters passed
     * @param name Name of the index
     * @param fields Fields of the index
     */
    DataIndexContainer.createIndex = function (name) {
        var fields = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            fields[_i - 1] = arguments[_i];
        }
        caribviper_common_1.Assert.isTruthy(name, 'DataIndexContainer: Name cannot be null/empty');
        return new DataIndexContainer(new (DataIndex.bind.apply(DataIndex, [void 0, caribviper_common_1.Utilities.getPropertyName(name)].concat(fields)))());
    };
    return DataIndexContainer;
}());
exports.DataIndexContainer = DataIndexContainer;
