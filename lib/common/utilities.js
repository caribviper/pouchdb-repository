"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Provides methods used throughout the system
 */
var Utilities = (function () {
    function Utilities() {
    }
    /**
     * Gets a random identifier based on current time inconjunction with the Math.random method
     */
    Utilities.getRandomId = function () {
        return "" + Date.now().toString() + Math.floor((Math.random() * 10000000000000000));
    };
    /**Create a guid */
    Utilities.guid = function () {
        return Utilities.guid_s4() + Utilities.guid_s4() + '-' + Utilities.guid_s4() + '-' + Utilities.guid_s4() + '-' +
            Utilities.guid_s4() + '-' + Utilities.guid_s4() + Utilities.guid_s4() + Utilities.guid_s4();
    };
    /**Aids in creating a guid */
    Utilities.guid_s4 = function () {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    };
    /**
     * Gets the property name of the passed property
     * @param property Field/property name to retrieved
     */
    Utilities.getPropertyName = function (property) {
        if (typeof property === 'string')
            return property;
        var name = property.toString();
        var start = name.indexOf('.');
        var end = name.indexOf(';');
        if (start > -1 && end > 0)
            return name.substring(start + 1, end);
        return '';
    };
    return Utilities;
}());
exports.Utilities = Utilities;
