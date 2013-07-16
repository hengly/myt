/** Provides a 'mouseOver' attribute that tracks mouse over/out state. Also
    provides a mechanism to smoothe over/out events so only one call to
    'doSmoothMouseOver' occurs per idle event.
    
    Requires Disableable and MouseObservable super mixins.
    
    Attributes:
        mouseOver:boolean
        __attachedToOverIdle:boolean Used by the code that smoothes out
            mouseover events. Indicates that we are registered with the
            idle event.
        __lastOverIdleValue:boolean Used by the code that smoothes out
            mouseover events. Stores the last mouseOver value.
*/
myt.MouseOver = new JS.Module('MouseOver', {
    // Life Cycle //////////////////////////////////////////////////////////////
    /** @overrides */
    initNode: function(parent, attrs) {
        if (attrs.mouseOver === undefined) attrs.mouseOver = false;
        
        this.callSuper(parent, attrs);
        
        this.attachToDom(this, 'doMouseOver', 'mouseover');
        this.attachToDom(this, 'doMouseOut', 'mouseout');
    },
    
    
    // Accessors ///////////////////////////////////////////////////////////////
    setMouseOver: function(v) {
        if (this.mouseOver === v) return;
        this.mouseOver = v;
        // No event needed
        
        // Smooth out over/out events by delaying until the next idle event.
        if (this.inited && !this.__attachedToOverIdle) {
            this.__attachedToOverIdle = true;
            this.attachTo(myt.global.idle, '__doMouseOverOnIdle', 'idle');
        }
    },
    
    /** @overrides myt.Disableable */
    setDisabled: function(v) {
        // When disabled make sure mouseOver is not true.
        if (this.mouseOver && v) this.setMouseOver(false);
        
        this.callSuper(v);
    },
    
    
    // Methods /////////////////////////////////////////////////////////////////
    __doMouseOverOnIdle: function() {
        this.detachFrom(myt.global.idle, '__doMouseOverOnIdle', 'idle');
        this.__attachedToOverIdle = false;
        
        // Only call doSmoothOver if the over/out state has changed since the
        // last time it was called.
        var isOver = this.mouseOver;
        if (this.__lastOverIdleValue !== isOver) {
            this.__lastOverIdleValue = isOver;
            this.doSmoothMouseOver(isOver);
        }
    },
    
    /** Called when mouseOver state changes. This method is called after
        an event filtering process has reduced frequent over/out events
        originating from the dom.
        @returns void */
    doSmoothMouseOver: function(v) {
        if (this.inited) this.updateUI();
    },
    
    /** Called when the mouse is over this view. Subclasses must call super.
        @returns void */
    doMouseOver: function(e) {
        if (!this.disabled) this.setMouseOver(true);
    },
    
    /** Called when the mouse leaves this view. Subclasses must call super.
        @returns void */
    doMouseOut: function(e) {
        if (!this.disabled) this.setMouseOver(false);
    }
});
