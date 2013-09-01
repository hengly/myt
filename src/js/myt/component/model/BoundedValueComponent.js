/** A numeric value component that stays within a minimum and maximum value.
    
    Attributes:
        minValue:number the largest value allowed. If undefined or null no
            min value is enforced.
        maxValue:number the lowest value allowed. If undefined or null no
            max value is enforced.
*/
myt.BoundedValueComponent = new JS.Module('BoundedValueComponent', {
    include: [myt.ValueComponent],
    
    // Life Cycle //////////////////////////////////////////////////////////////
    initNode: function(parent, attrs) {
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
    setMinValue: function(v) {
        if (this.minValue === v) return;
        
        var max = this.maxValue;
        if (max != null && v > max) v = max;
        
        this.minValue = v;
        if (this.inited) {
            this.fireNewEvent('minValue', v);
            
            // Rerun setValue since the filter has changed.
            this.setValue(this.value);
        }
    },
    
    setMaxValue: function(v) {
        if (this.maxValue === v) return;
        
        var min = this.minValue;
        if (min != null && v < min) v = min;
        
        this.maxValue = v;
        if (this.inited) {
            this.fireNewEvent('maxValue', v);
            
            // Rerun setValue since the filter has changed.
            this.setValue(this.value);
        }
    }
});
