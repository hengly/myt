/** Text content that can be edited.
    
    Events:
        contentEditable:boolean
        minWidth:number
    
    Attributes:
        contentEditble:boolean Makes the text editable or not.
        minWidth:number The minimum width for the component. Defaults to 
            undefined which is effectively 0.
        minHeight:number The minimum height for the component. Defaults to 
            undefined which is effectively 0.
    
    Private Attributes:
        _selRange:object Stores the start and end of the selection.
*/
myt.EditableText = new JS.Class('EditableText', myt.BaseInputText, {
    include: [myt.SizeToDom],
    
    
    // Life Cycle //////////////////////////////////////////////////////////////
    /** @overrides myt.BaseInputText */
    initNode: function(parent, attrs) {
        if (attrs.whiteSpace === undefined) attrs.whiteSpace = 'pre';
        if (attrs.contentEditable === undefined) attrs.contentEditable = true;
        
        this.callSuper(parent, attrs);
        
        this.attachToDom(this, '__cleanInput', 'keydown');
        
        this.attachToDom(this, '__userInteraction', 'keyup');
        this.attachToDom(this, '__userInteraction', 'mouseup');
        
        this.setCaretToEnd();
    },
    
    /** @overrides myt.NativeInputWrapper */
    createOurDomElement: function(parent) {
        var elem = document.createElement('div');
        elem.style.position = 'absolute';
        return elem;
    },
    
    
    // Attributes //////////////////////////////////////////////////////////////
    setMinWidth: function(v) {this.__setProp(v, 'minWidth');},
    setMinHeight: function(v) {
        if (BrowserDetect.browser === 'Firefox') v += 2;
        
        this.__setProp(v, 'minHeight');
    },
    setPadding: function(v) {
        this.setPaddingTop(v);
        this.setPaddingRight(v);
        this.setPaddingBottom(v);
        this.setPaddingLeft(v);
    },
    setPaddingTop: function(v) {this.__setProp(v, 'paddingTop');},
    setPaddingRight: function(v) {this.__setProp(v, 'paddingRight');},
    setPaddingBottom: function(v) {this.__setProp(v, 'paddingBottom');},
    setPaddingLeft: function(v) {this.__setProp(v, 'paddingLeft');},
    
    /** @private */
    __setProp: function(v, propName) {
        if (this[propName] !== v) {
            this[propName] = v;
            this.deStyle[propName] = v + 'px';
            if (this.inited) {
                this.fireNewEvent(propName, v);
                this.sizeViewToDom();
            }
        }
    },
    
    setContentEditable: function(v) {
        if (this.contentEditable !== v) {
            this.contentEditable = this.domElement.contentEditable = v;
            if (this.inited) this.fireNewEvent('contentEditable', v);
        }
    },
    
    
    // Methods /////////////////////////////////////////////////////////////////
    /** @overrides myt.BaseInputText */
    filterInputPress: function(domEvent) {
        // Implement maxLength
        var maxLength = this.maxLength;
        if (maxLength >= 0 && this.getCharacterCount() === maxLength) domEvent.preventDefault();
        
        this.callSuper(domEvent);
    },
    
    /** @overrides myt.NativeInputWrapper */
    getDomValue: function() {
        return this.domElement.innerHTML;
    },
    
    /** @overrides myt.NativeInputWrapper */
    setDomValue: function(v) {
        var de = this.domElement;
        if (de.innerHTML !== v) {
            de.innerHTML = v;
            this.sizeViewToDom();
            this.restoreSelection();
        }
    },
    
    /** @private */
    __cleanInput: function(event) {
        // Prevent enter key from inserting a div
        if (myt.KeyObservable.getKeyCodeFromEvent(event) === 13) {
            event.value.preventDefault();
            
            // Instead, insert a linefeed if wrapping is allowed.
            if (this.whitespace !== 'nowrap') {
                document.execCommand('insertHTML', false, this.isCaretAtEnd() ? '\n\n' : '\n');
            }
        }
    },
    
    /** @overrides myt.BaseInputText */
    __syncToDom: function(event) {
        this.callSuper(event);
        
        this.saveSelection();
        this.sizeViewToDom();
        this.restoreSelection();
    },
    
    // Caret handling
    getCharacterCount: function() {
        var elem = this.domElement.firstChild;
        return elem ? elem.length : 0;
    },
    
    isCaretAtEnd: function() {
        return this.getCaretPosition() === this.getCharacterCount();
    },
    
    /** @overrides myt.BaseInputText */
    getCaretPosition: function() {
        var selection = this.getSelection();
        return selection ? selection.end : 0;
    },
    
    /** @overrides myt.BaseInputText */
    setCaretPosition: function(start, end) {
        if (end === undefined || start === end) {
            // Don't update if the current position already matches.
            if (this.getCaretPosition() === start) return;
            
            end = start;
        }
        this.saveSelection({
            start:start,
            startElem:this.domElement.firstChild,
            end:end,
            endElem:this.domElement.firstChild
        });
    },
    
    // Selection handling
    /** @overrides myt.FocusObservable */
    doFocus: function() {
        this.callSuper();
        this.restoreSelection();
    },
    
    /** @private */
    __userInteraction: function(event) {
        this.saveSelection();
        return true;
    },
    
    /** @overrides myt.BaseInputText */
    getSelection: function() {
        var range;
        if (window.getSelection) {
            var sel = window.getSelection();
            if (sel.rangeCount > 0) {
                // Sometimes when deleting we get an unexpected node
                if (sel.extentNode === this.domElement) return null;
                
                range = sel.getRangeAt(0);
            }
        } else if (document.selection) {
            range = document.selection.createRange();
        }
        
        return {
            start:range ? range.startOffset : 0,
            startElem:range ? range.startContainer : this.domElement.firstChild,
            end:range ? range.endOffset : 0,
            endElem:range ? range.endContainer : this.domElement.firstChild
        };
    },
    
    /** @overrides myt.BaseInputText */
    setSelection: function(selection) {
        if (selection) {
            var startElem = selection.startElem,
                endElem = selection.endElem;
            if (startElem && startElem.parentNode && endElem && endElem.parentNode) {
                var range = document.createRange();
                range.setStart(startElem, Math.min(selection.start, startElem.length));
                range.setEnd(endElem, Math.min(selection.end, endElem.length));
                
                if (window.getSelection) {
                    var sel = window.getSelection();
                    if (sel.rangeCount > 0) sel.removeAllRanges();
                    sel.addRange(range);
                } else if (document.selection) {
                    range.select();
                }
            }
        }
    }
});
