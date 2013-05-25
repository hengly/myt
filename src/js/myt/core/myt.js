/**
 * Myt: A simple javascript UI framework
 * http://github.com/maynarddemmon/myt
 * Copyright (c) 2012-2013 Maynard Demmon and contributors
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * Parts of the Software incorporates code and/or design patterns from various
 * public domain sources and has been noted as such in the source.
 * 
 * Parts of the Software incorporates code from the following open-source 
 * projects:
 * * JS.Class, (c) 2007-2012 James Coglan and contributors (MIT License)
 * * Easing Functions, (c) 2001 Robert Penner (BSD License)
 * * jQuery Easing v1.3, (c) 2008 George McGinley Smith (BSD License)
 * * jQuery Cookie Plugin v1.3.1, (c) 2013 Klaus Hartl (MIT License)
 * * parseUri 1.2.2, (c) Steven Levithan <stevenlevithan.com> (MIT License)
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
myt = {
    /** The root path to image assets for the myt package. MYT_IMAGE_ROOT
        should be set by the page that includes this script. */
    IMAGE_ROOT:global.MYT_IMAGE_ROOT || '',
    
    /** Used to generate globally unique IDs. */
    __GUID_COUNTER: 0,
    
    /** Generates a globally unique id, (GUID).
        @return number */
    generateGuid: function() {
        return ++this.__GUID_COUNTER;
    },
    
    /** Event listener code Adapted from:
            http://javascript.about.com/library/bllisten.htm
        A more robust solution can be found here:
            http://msdn.microsoft.com/en-us/magazine/ff728624.aspx */
    addEventListener: function() {
        if (window.addEventListener) {
            /** Adds an event listener to a dom element. 
                @param elem:DomElement the dom element to listen to.
                @param type:string the name of the event to listen to.
                @param callback:function the callback function that will be
                    registered for the event.
                @param capture:boolean (optional) indicates if the listener is 
                    registered during the capture phase or bubble phase.
                @returns void */
            return function(elem, type, callback, capture) {
                elem.addEventListener(type, callback, capture !== undefined ? capture : false);
            };
        } else {
            return function(elem, type, callback) {
                var prop = type + callback;
                elem['e' + prop] = callback;
                elem[prop] = function(){elem['e' + prop](window.event);}
                elem.attachEvent('on' + type, elem[prop]);
            };
        }
    }(),
    removeEventListener: function() {
        if (window.addEventListener) {
            return function(elem, type, callback, capture) {
                elem.removeEventListener(type, callback, capture !== undefined ? capture : false);
            };
        } else {
            return function(elem, type, callback) {
                var prop = type + callback;
                elem.detachEvent('on' + type, elem[prop]);
                elem[prop] = null;
                elem["e" + prop] = null;
            };
        }
    }(),
    
    /** Takes a '.' separated string such as "foo.bar.baz" and resolves it
        into the value found at that location relative to a starting scope.
        If no scope is provided global scope is used.
        @param objName:string the name to resolve.
        @param scope:Object (optional) the scope to resolve from. If not
            provided global scope is used.
        @returns the referenced object or undefined if resolution failed. */
    resolveName: function(objName, scope) {
        if (!objName || objName.length === 0) return undefined;
        
        var scope = scope || global;
        var parts = objName.split(".");
        for (var i = 0, len = parts.length; i < len; i++) {
            scope = scope[parts[i]];
            if (!scope) {
                console.warn("resolveName failed for ", objName, " at part: ", i, parts[i]);
                return undefined;
            }
        }
        return scope;
    }
};
