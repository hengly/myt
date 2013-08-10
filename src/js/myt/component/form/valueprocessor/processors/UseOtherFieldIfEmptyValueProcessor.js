/** Pulls the current value from another form field if the provided value
    is undefined/null/empty. */
myt.UseOtherFieldIfEmptyValueProcessor = new JS.Class('UseOtherFieldIfEmptyValueProcessor', myt.ValueProcessor, {
    // Constructor /////////////////////////////////////////////////////////////
    /** @overrides myt.ValueProcessor
        @param otherField:myt.FormElement The form field to pull the 
            value from. */
    initialize: function(id, otherField) {
        this.callSuper(id);
        
        this.otherField = otherField;
    },
    
    
    // Methods /////////////////////////////////////////////////////////////////
    /** @overrides myt.ValueProcessor */
    process: function(v) {
        return (v == null || v === "") ? this.otherField.getCurrentValue() : v;
    }
});
