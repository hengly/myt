/** Provides Slider thumb functionality.
    
    Requires:
        myt.Button
    
    Events:
        None
    
    Attributes:
        None
*/
myt.SliderThumbMixin = new JS.Module('SliderThumbMixin', {
    include: [myt.Draggable],
    
    
    // Life Cycle //////////////////////////////////////////////////////////////
    /** @overrides myt.Checkbox */
    initNode: function(parent, attrs) {
        if (attrs.width === undefined) attrs.width = parent.thumbWidth;
        if (attrs.height === undefined) attrs.height = parent.thumbHeight;
        
        if (attrs.repeatKeyDown === undefined) attrs.repeatKeyDown = true;
        if (attrs.activationKeys === undefined) {
            attrs.activationKeys = [
                37, // left arrow
                38, // up arrow
                39, // right arrow
                40 // down arrow
            ];
        }
        
        this.callSuper(parent, attrs);
        
        if (parent.axis === 'x') {
            this.setY(parent.thumbOffset);
        } else {
            this.setX(parent.thumbOffset);
        }
        
        this.syncTo(parent, 'setDisabled', 'disabled');
        
        parent._syncThumbToValue(this, parent.getValue());
    },
    
    
    // Accessors ///////////////////////////////////////////////////////////////
    /** @overrides myt.Disableable */
    setDisabled: function(v) {
        // Adapt to event from syncTo
        if (v !== null && typeof v === 'object') v = v.value;
        
        this.callSuper(v);
    },
    
    /** @overrides myt.FocusObservable */
    setFocused: function(v) {
        this.callSuper(v);
        if (v) this.makeHighestZIndex();
    },
    
    /** @overrides myt.View */
    setX: function(v) {
        if (this.x !== v) {
            this.callSuper(v);
            
            if (this.parent.axis === 'x') this.parent._syncValueToThumb(this);
        }
    },
    
    /** @overrides myt.View */
    setY: function(v) {
        if (this.y !== v) {
            this.callSuper(v);
            
            if (this.parent.axis === 'y') this.parent._syncValueToThumb(this);
        }
    },
    
    
    // Methods /////////////////////////////////////////////////////////////////
    /** @overrides myt.Draggable */
    requestDragPosition: function(x, y) {
        if (!this.disabled) {
            var parent = this.parent,
                minPx = parent.getMinPixelValueForThumb(this),
                maxPx = parent.getMaxPixelValueForThumb(this),
                halfSize, pos, func;
            
            if (parent.axis === 'x') {
                halfSize = this.width / 2;
                pos = x;
                func = this.setX;
            } else {
                halfSize = this.height / 2;
                pos = y;
                func = this.setY;
            }
            
            func.call(this, Math.min(Math.max(pos, minPx - halfSize), maxPx - halfSize));
        }
    },
    
    /** @overrides myt.Button. */
    doActivationKeyDown: function(key, isRepeat) {
        var parent = this.parent;
        switch (key) {
            case 37: // Left
                parent.nudgeValueLeft(this);
                break;
            case 38: // Up
                parent.nudgeValueUp(this);
                break;
            case 39: // Right
                parent.nudgeValueRight(this);
                break;
            case 40: // Down
                parent.nudgeValueDown(this);
                break;
        }
        
        this.callSuper(key, isRepeat);
    }
});
