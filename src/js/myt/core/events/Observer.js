/** Provides a mechanism to remember which Observables this instance has 
    registered itself with. This can be useful when we need to cleanup the 
    instance later.
    
    When this module is used registration and unregistration must be done 
    using the methods below. Otherwise, it is possible for the relationship 
    between observer and observable to be broken.
    
    Attributes:
        None
    
    Private Attributes:
        __observablesByType: (Object) Stores arrays of Observables by Event type
        __methodNameCounter: (int) used to create unique method names when a
            callback should only be called once.
        __DO_ONCE_*: (function) the names used for methods that only get run
            one time. */
myt.Observer = new JS.Module('Observer', {
    // Methods /////////////////////////////////////////////////////////////////
    /** Does the same thing as this.attachToAndCallbackIfAttrNotEqual with
        a value of undefined.
        @param observable:myt.Observable the Observable to attach to.
        @param methodName:string the method name on this instance to execute.
        @param eventType:string the event type to attach for.
        @param attrName:string (optional: the eventType will be used if not
            provided) the name of the attribute on the Observable
            to pull the value from.
        @param once:boolean (optional) if true  this Observer will detach
            from the Observable after the event is handled once.
        @returns void */
    attachToAndCallbackIfAttrExists: function(observable, methodName, eventType, attrName, once) {
        this.attachToAndCallbackIfAttrNotEqual(observable, methodName, eventType, undefined, attrName, once);
    },
    
    /** Does the same thing as this.attachTo and also immediately calls the
        method if the provided attrName on the observable is exactly equal to 
        the provided value.
        @param observable:myt.Observable the Observable to attach to.
        @param methodName:string the method name on this instance to execute.
        @param eventType:string the event type to attach for.
        @param value:* the value to test equality against.
        @param attrName:string (optional: the eventType will be used if not
            provided) the name of the attribute on the Observable
            to pull the value from.
        @param once:boolean (optional) if true  this Observer will detach
            from the Observable after the event is handled once.
        @returns void */
    attachToAndCallbackIfAttrEqual: function(observable, methodName, eventType, value, attrName, once) {
        if (attrName === undefined) attrName = eventType;
        if (observable.get(attrName) === value) {
            this.syncTo(observable, methodName, eventType, attrName, once);
        } else {
            this.attachTo(observable, methodName, eventType, once);
        }
    },
    
    /** Does the same thing as this.attachTo and also immediately calls the
        method if the provided attrName on the observable does not exactly 
        equal the provided value.
        @param observable:myt.Observable the Observable to attach to.
        @param methodName:string the method name on this instance to execute.
        @param eventType:string the event type to attach for.
        @param value:* the value to test inequality against.
        @param attrName:string (optional: the eventType will be used if not
            provided) the name of the attribute on the Observable
            to pull the value from.
        @param once:boolean (optional) if true  this Observer will detach
            from the Observable after the event is handled once.
        @returns void */
    attachToAndCallbackIfAttrNotEqual: function(observable, methodName, eventType, value, attrName, once) {
        if (attrName === undefined) attrName = eventType;
        if (observable.get(attrName) !== value) {
            this.syncTo(observable, methodName, eventType, attrName, once);
        } else {
            this.attachTo(observable, methodName, eventType, once);
        }
    },
    
    /** Does the same thing as this.attachTo and also immediately calls the
        method with an event containing the attributes value. If 'once' is
        true no attachment will occur which means this probably isn't the
        correct method to use in that situation.
        @param observable:myt.Observable the Observable to attach to.
        @param methodName:string the method name on this instance to execute.
        @param eventType:string the event type to attach for.
        @param attrName:string (optional: the eventType will be used if not
            provided) the name of the attribute on the Observable
            to pull the value from.
        @param once:boolean (optional) if true  this Observer will detach
            from the Observable after the event is handled once.
        @returns void */
    syncTo: function(observable, methodName, eventType, attrName, once) {
        if (attrName === undefined) attrName = eventType;
        try {
            this[methodName](observable.createEvent(eventType, observable.get(attrName)));
        } catch (err) {
            myt.dumpStack(err);
        }
        
        // Providing a true value for once means we'll never actually attach.
        if (once) return;
        
        this.attachTo(observable, methodName, eventType, once);
    },
    
    /** Checks if this Observer is attached to the provided observable for
        the methodName and eventType.
        @param observable:myt.Observable the Observable to check with.
        @param methodName:string the method name on this instance to execute.
        @param eventType:string the event type to check for.
        @returns true if attached, false otherwise. */
    isAttachedTo: function(observable, methodName, eventType) {
        if (observable && methodName && eventType) {
            var observablesByType = this.__observablesByType;
            if (observablesByType) {
                var observables = observablesByType[eventType];
                if (observables) {
                    var i = observables.length;
                    while (i) {
                        // Ensures we decrement twice. First with --i, then 
                        // with i-- since the part after && may not be executed.
                        --i;
                        if (observable === observables[i--] && methodName === observables[i]) return true;
                    }
                }
            }
        }
        return false;
    },
    
    /** Gets an array of observables and method names for the provided type.
        The array is structured as:
            [methodName1, observableObj1, methodName2, observableObj2,...].
        @param eventType:string the event type to check for.
        @returns an array of observables. */
    getObservables: function(eventType) {
        // Lazy instantiate observers array.
        var observablesByType = this.__observablesByType;
        if (!observablesByType) observablesByType = this.__observablesByType = {};
        var observables = observablesByType[eventType];
        if (!observables) observables = observablesByType[eventType] = [];
        return observables;
    },
    
    /** Checks if any observables exist for the provided event type.
        @param eventType:string the event type to check for.
        @returns true if any exist, false otherwise. */
    hasObservables: function(eventType) {
        var observablesByType = this.__observablesByType;
        if (!observablesByType) return false;
        var observables = observablesByType[eventType];
        return observables && observables.length > 0;
    },
    
    /** Registers this Observer with the provided Observable
        for the provided eventType.
        @param observable:myt.Observable the Observable to attach to.
        @param methodName:string the method name on this instance to execute.
        @param eventType:string the event type to attach for.
        @param once:boolean (optional) if true  this Observer will detach
            from the Observable after the event is handled once.
        @returns boolean true if the observable was successfully registered, 
            false otherwise. */
    attachTo: function(observable, methodName, eventType, once) {
        if (observable && methodName && eventType) {
            var observables = this.getObservables(eventType);
            
            // Setup wrapper method when 'once' is true.
            if (once) {
                var self = this, origMethodName = methodName;
                
                // Generate one time method name.
                if (this.__methodNameCounter === undefined) {
                    this.__methodNameCounter = 0;
                } else {
                    this.__methodNameCounter++;
                }
                methodName = '__DO_ONCE_' + this.__methodNameCounter;
                
                // Setup wrapper method that will do the detachFrom.
                this[methodName] = function(e) {
                    self.detachFrom(observable, methodName, eventType);
                    delete self[methodName];
                    return self[origMethodName](e);
                };
            }
            
            // Register this observer with the observable
            if (observable.attachObserver(this, methodName, eventType)) {
                observables.push(methodName, observable);
                return true;
            }
        }
        return false;
    },
    
    /** Unregisters this Observer from the provided Observable
        for the provided eventType.
        @param observable:myt.Observable the Observable to attach to.
        @param methodName:string the method name on this instance to execute.
        @param eventType:string the event type to attach for.
        @returns boolean true if one or more detachments occurred, false 
            otherwise. */
    detachFrom: function(observable, methodName, eventType) {
        if (observable && methodName && eventType) {
            // No need to unregister if observable array doesn't exist.
            var observablesByType = this.__observablesByType;
            if (observablesByType) {
                var observables = observablesByType[eventType];
                if (observables) {
                    // Remove all instances of this observer/methodName/eventType 
                    // from the observable
                    var retval = false, i = observables.length;
                    while (i) {
                        --i;
                        if (observable === observables[i--] && methodName === observables[i]) {
                            if (observable.detachObserver(this, methodName, eventType)) {
                                observables.splice(i, 2);
                                retval = true;
                            }
                        }
                    }
                    
                    // Source wasn't found
                    return retval;
                }
            }
        }
        return false;
    },
    
    /** Tries to detach this Observer from all Observables it
        is attached to.
        @returns void */
    detachFromAllObservables: function() {
        var observablesByType = this.__observablesByType;
        if (observablesByType) {
            var observables, i;
            for (var eventType in observablesByType) {
                observables = observablesByType[eventType];
                i = observables.length;
                while (i) observables[--i].detachObserver(this, observables[--i], eventType);
                observables.length = 0;
            }
        }
    }
});
