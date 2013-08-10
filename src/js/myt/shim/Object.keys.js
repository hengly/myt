/** Provides support for Object.keys in IE8 and earlier.
    Taken from: http://whattheheadsaid.com/2010/10/a-safer-object-keys-compatibility-implementation */
Object.keys = Object.keys || (function() {
    var hasOwnProperty = Object.prototype.hasOwnProperty,
        hasDontEnumBug = !{toString:null}.propertyIsEnumerable("toString"),
        DontEnums = [
            'toString',
            'toLocaleString',
            'valueOf',
            'hasOwnProperty',
            'isPrototypeOf',
            'propertyIsEnumerable',
            'constructor'
        ],
        DontEnumsLength = DontEnums.length;
    
    return function(o) {
        if (typeof o != "object" && typeof o != "function" || o === null)
            throw new TypeError("Object.keys called on a non-object");
        
        var result = [];
        for (var name in o) {
            if (hasOwnProperty.call(o, name)) result.push(name);
        }
        
        if (hasDontEnumBug) {
            for (var i = 0; i < DontEnumsLength; i++) {
                if (hasOwnProperty.call(o, DontEnums[i])) result.push(DontEnums[i]);
            }
        }
        
        return result;
    };
})();

/** Provides support for Array.isArray in IE8 and earlier.
    Taken from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/isArray */
if (!Array.isArray) {
    Array.isArray = function(v) {
        return Object.prototype.toString.call(v) === "[object Array]";
    };
}

/** Provides support for String.trim in IE8 and earlier.
    Taken from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/Trim */
if (!String.prototype.trim) {
    String.prototype.trim = function() {
        return this.replace(/^\s+|\s+$/g,'');
    };
    String.prototype.trimLeft = function() {
        return this.replace(/^\s+/,'');
    };
    String.prototype.trimRight = function() {
        return this.replace(/\s+$/,'');
    };
}
