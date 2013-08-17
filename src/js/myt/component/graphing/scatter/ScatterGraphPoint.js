/** A data point in an myt.ScatterGraph
    
    Attributes:
        id:string The unique ID of the point relative to the ScatterGraph it
            is in.
        x:number The raw x value of the data.
        y:number The raw y value of the data.
        px:number the converted x pixel location.
        py:number the converted y pixel location.
        config:object holds arbitrary config information. Typically used to
            provide drawing hints.
*/
myt.ScatterGraphPoint = new JS.Class('ScatterGraphPoint', {
    // Constructor /////////////////////////////////////////////////////////////
    /** Create a new Path. */
    initialize: function(id, x, y, config) {
        this.setId(id);
        this.setX(x);
        this.setY(y);
        this.setConfig(config);
    },
    
    
    // Accessors ///////////////////////////////////////////////////////////////
    setId: function(v) {this.id = v;},
    setX: function(v) {this.x = v;},
    setY: function(v) {this.y = v;},
    setPy: function(v) {this.px = v;},
    setCP: function(v) {this.py = v;},
    setConfig: function(v) {this.config = v;}
    
    
    // Methods /////////////////////////////////////////////////////////////////
});
