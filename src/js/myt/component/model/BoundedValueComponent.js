/** A numeric value component that stays within a minimum and maximum value.
    
    Events:
        minValue:number
        maxValue:number
        snapToInt:boolean
    
    Attributes:
        minValue:number the largest value allowed. If undefined or null no
            min value is enforced.
        maxValue:number the lowest value allowed. If undefined or null no
            max value is enforced.
        snapToInt:boolean If true values can only be integers. Defaults to true.
*/
myt.BoundedValueComponent = new JS.Module('BoundedValueComponent', {
    include: [myt.ValueComponent],
    
    // Life Cycle //////////////////////////////////////////////////////////////
    initNode: function(parent, attrs) {
        if (attrs.snapToInt === undefined) attrs.snapToInt = true;
        
        if (!attrs.valueFilter) {
            var self = this;
            attrs.valueFilter = function(v) {
                var max = self.maxValue;
                if (max != null && v > max) return max;
                
                var min = self.minValue;
                if (min != null && v < min) return min;
                
                return v;
            };
        }
        
        this.callSuper(parent, attrs);
    },
    
    
    // Accessors ///////////////////////////////////////////////////////////////
    setSnapToInt: function(v) {
        if (this.snapToInt !== v) {
            this.snapToInt = v;
            if (this.inited) {
                this.fireNewEvent('snapToInt', v);
                
                // Update min, max and value since snap has been turned on
                if (v) {
                    this.setMinValue(this.minValue);
                    this.setMaxValue(this.maxValue);
                    this.setValue(this.value);
                }
            }
        }
    },
    
    setMinValue: function(v) {
        if (v != null && this.snapToInt) v = Math.round(v);
        
        if (this.minValue !== v) {
            var max = this.maxValue;
            if (max != null && v > max) v = max;
            
            this.minValue = v;
            if (this.inited) {
                this.fireNewEvent('minValue', v);
                
                // Rerun setValue since the filter has changed.
                this.setValue(this.value);
            }
        }
    },
    
    setMaxValue: function(v) {
        if (v != null && this.snapToInt) v = Math.round(v);
        
        if (this.maxValue !== v) {
            var min = this.minValue;
            if (min != null && v < min) v = min;
            
            this.maxValue = v;
            if (this.inited) {
                this.fireNewEvent('maxValue', v);
                
                // Rerun setValue since the filter has changed.
                this.setValue(this.value);
            }
        }
    },
    
    /** @overrides myt.ValueComponent */
    setValue: function(v) {
        this.callSuper(this.snapToInt && v != null && !isNaN(v) ? Math.round(v) : v);
    }
});
