/** Provides button functionality to a view. Most of the functionality comes
    from the mixins included by this mixin. This mixin resolves issues that 
    arise when the various mixins are used together.
    
    By default Button instances are focusable.
*/
myt.Button = new JS.Module('Button', {
    include: [
        myt.Activateable, 
        myt.UpdateableUI, 
        myt.Disableable, 
        myt.MouseOverAndDown, 
        myt.KeyActivation
    ],
    
    
    // Class Methods and Attributes ////////////////////////////////////////////
    extend: {
        DEFAULT_FOCUS_SHADOW_PROPERTY_VALUE: '0px 0px 7px #666666'
    },
    
    
    // Life Cycle //////////////////////////////////////////////////////////////
    /** @overrides */
    initNode: function(parent, attrs) {
        if (attrs.focusable === undefined) attrs.focusable = true;
        
        this.callSuper(parent, attrs);
    },
    
    
    // Methods /////////////////////////////////////////////////////////////////
    /** @overrides myt.KeyActivation. */
    doActivationKeyDown: function(key) {
        this.updateUI();
    },
    
    /** @overrides myt.KeyActivation. */
    doActivationKeyUp: function(key) {
        this.callSuper(key);
        this.updateUI();
    },
    
    /** @overrides myt.UpdateableUI. */
    updateUI: function() {
        if (this.disabled) {
            this.drawDisabledState();
        } else if (this.activateKeyDown !== -1 || this.mouseDown) {
            this.drawActiveState();
        } else if (this.mouseOver) {
            this.drawHoverState();
        } else {
            this.drawReadyState();
        }
    },
    
    /** Draw the UI when the component is in the disabled state.
        @returns void */
    drawDisabledState: function() {},
    
    /** Draw the UI when the component is on the verge of being interacted 
        with. For mouse interactions this corresponds to the over state.
        @returns void */
    drawHoverState: function() {},
    
    /** Draw the UI when the component has a pending activation. For mouse
        interactions this corresponds to the down state.
        @returns void */
    drawActiveState: function() {},
    
    /** Draw the UI when the component is ready to be interacted with. For
        mouse interactions this corresponds to the enabled state when the
        mouse is not over the component.
        @returns void */
    drawReadyState: function() {},
    
    /** @overrides myt.FocusObservable */
    showFocusEmbellishment: function() {
        this.hideDefaultFocusEmbellishment();
        this.setStyleProperty('boxShadow', myt.Button.DEFAULT_FOCUS_SHADOW_PROPERTY_VALUE);
    },
    
    /** @overrides myt.FocusObservable */
    hideFocusEmbellishment: function() {
        this.hideDefaultFocusEmbellishment();
        this.setStyleProperty('boxShadow', 'none');
    }
});
