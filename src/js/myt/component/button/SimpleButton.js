/** An myt.Button that makes use of activeColor, hoverColor and readyColor
    attributes to fill the button.
    
    Events:
        None
    
    Attributes:
        activeColor:string A color string such as '#ff0000' or 'transparent'.
            Used when the button is in the active state. The default value 
            is transparent.
        hoverColor:string A color string such as '#ff0000' or 'transparent'.
            Used when the button is in the hover state. The default value 
            is transparent.
        readyColor:string A color string such as '#ff0000' or 'transparent'.
            Used when the button is in the ready or disabled state. The 
            default value is transparent.
*/
myt.SimpleButton = new JS.Class('SimpleButton', myt.View, {
    include: [myt.Button],
    
    
    // Life Cycle //////////////////////////////////////////////////////////////
    initNode: function(parent, attrs) {
        this.activeColor = this.hoverColor = this.readyColor = 'transparent';
        
        this.callSuper(parent, attrs);
    },
    
    
    // Accessors ///////////////////////////////////////////////////////////////
    setActiveColor: function(v) {
        if (this.activeColor !== v) {
            this.activeColor = v;
            // No event needed
            if (this.inited) this.updateUI();
        }
    },
    
    setHoverColor: function(v) {
        if (this.hoverColor !== v) {
            this.hoverColor = v;
            // No event needed
            if (this.inited) this.updateUI();
        }
    },
    
    setReadyColor: function(v) {
        if (this.readyColor !== v) {
            this.readyColor = v;
            // No event needed
            if (this.inited) this.updateUI();
        }
    },
    
    
    // Methods /////////////////////////////////////////////////////////////////
    /** @overrides myt.Button */
    drawDisabledState: function() {
        this.setOpacity(myt.Button.DEFAULT_DISABLED_OPACITY);
        this.setBgColor(this.readyColor);
    },
    
    /** @overrides myt.Button */
    drawHoverState: function() {
        this.setOpacity(1);
        this.setBgColor(this.hoverColor);
    },
    
    /** @overrides myt.Button */
    drawActiveState: function() {
        this.setOpacity(1);
        this.setBgColor(this.activeColor);
    },
    
    /** @overrides myt.Button */
    drawReadyState: function() {
        this.setOpacity(1);
        this.setBgColor(this.readyColor);
    }
});
