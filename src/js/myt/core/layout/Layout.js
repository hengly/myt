/** A layout controls the positioning of views within a parent view.
    
    Attributes:
        locked:boolean When true, the layout will not update.
        lockedCounter:number Counter created by myt.ThresholdCounter.
        subviews:array An array of Views managed by this layout.
        __deferredLayout:boolean Marks a layout as deferred if the global
            layout lock, myt.Layout.locked, is true during a call to 
            'canUpdate' on the layout.
*/
myt.Layout = new JS.Class('Layout', myt.Node, {
    // Class Methods ///////////////////////////////////////////////////////////
    extend: {
        /** Increments the global lock that prevents all layouts from
            updating. */
        incrementGlobalLock: function() {
            if (myt.Layout._lockCount === undefined) myt.Layout._lockCount = 0;
            
            var wasUnlocked = myt.Layout._lockCount === 0;
            myt.Layout._lockCount++;
            if (wasUnlocked) myt.Layout.__setLocked(true);
        },
        
        /** Decrements the global lock that prevents all layouts from 
            updating. */
        decrementGlobalLock: function() {
            if (myt.Layout._lockCount === undefined) myt.Layout._lockCount = 0;
            
            if (myt.Layout._lockCount === 0) return;
            
            myt.Layout._lockCount--;
            if (myt.Layout._lockCount === 0) myt.Layout.__setLocked(false);
        },
        
        /** Adds a layout to a list of layouts that will get updated when the
            global lock is no longer locked. */
        deferLayoutUpdate: function(layout) {
            // Don't add a layout that is already deferred.
            if (layout.__deferredLayout) return;
            
            myt.Layout.deferredLayouts.push(layout);
            layout.__deferredLayout = true;
        },
        
        /** Called to set/unset the global lock. Will update all the
            deferred layouts. */
        __setLocked: function(v) {
            if (myt.Layout.locked === v) return;
            myt.Layout.locked = v;
            
            if (v) {
                if (!myt.Layout.deferredLayouts) myt.Layout.deferredLayouts = [];
            } else {
                var layouts = myt.Layout.deferredLayouts;
                var layout, i = layouts.length;
                while (i) {
                    layout = layouts[--i];
                    delete layout.__deferredLayout;
                    layout.update();
                }
                layouts.length = 0;
            }
        }
    },
    
    
    // Life Cycle //////////////////////////////////////////////////////////////
    /** @overrides myt.Node */
    initNode: function(parent, attrs) {
        this.locked = true;
        this.lockedCounter = 1;
        this.subviews = [];
        
        var initiallyLocked = attrs.locked === true;
        delete attrs.locked;
        
        this.callSuper(parent, attrs);
        
        if (!initiallyLocked) this.decrementLockedCounter();
        
        this.update();
    },
    
    /** @overrides myt.Node */
    destroyAfterOrphaning: function() {
        this.callSuper();
        this.subviews.length = 0;
    },
    
    
    // Accessors ///////////////////////////////////////////////////////////////
    /** @overrides myt.Node */
    setParent: function(parent) {
        if (this.parent === parent) return;
        
        // Lock during parent change so that old parent is not changed.
        var wasNotLocked = !this.locked;
        if (wasNotLocked) this.locked = true;
        
        // Stop monitoring parent
        var svs, i;
        if (this.parent) {
            svs = this.subviews;
            i = svs.length;
            while (i) this.removeSubview(svs[--i]);
            
            this.detachFrom(this.parent, '__handleParentSubviewAddedEvent', 'subviewAdded');
            this.detachFrom(this.parent, '__handleParentSubviewRemovedEvent', 'subviewRemoved');
        }
        
        this.callSuper(parent);
        
        // Start monitoring new parent
        if (this.parent) {
            svs = this.parent.getSubviews();
            for (i = 0, len = svs.length; len > i; ++i) {
                this.addSubview(svs[i]);
            }
            this.attachTo(this.parent, '__handleParentSubviewAddedEvent', 'subviewAdded');
            this.attachTo(this.parent, '__handleParentSubviewRemovedEvent', 'subviewRemoved');
        }
        
        // Clear temporary lock and update if this happened after initialization.
        if (wasNotLocked) {
            this.locked = false;
            if (this.inited && this.parent) this.update();
        }
    },
    
    
    // Methods /////////////////////////////////////////////////////////////////
    /** Checks if the layout is locked or not. Should be called by the
        "update" method of each layout to check if it is OK to do the update.
        If myt.Layout.locked is true (the global layout lock) then a deferred
        layout update will be setup for this Layout. Once the global lock is
        unlocked this Layout's 'update' method will be invoked.
        @returns true if not locked, false otherwise. */
    canUpdate: function() {
        if (myt.Layout.locked) {
            myt.Layout.deferLayoutUpdate(this);
            return false;
        }
        if (this.locked) return false;
        
        return true;
    },
    
    /** Updates the layout. Subclasses should call super to check lock state.
        @returns void */
    update: function() {},
    
    // Subview Methods //
    /** Checks if this Layout has the provided View in the subviews array.
        @param sv:View the view to check for.
        @returns true if the subview is found, false otherwise. */
    hasSubview: function(sv) {
        var subs = this.subviews;
        if (subs) {
            var i = subs.length;
            while (i) {
                if (sv === subs[--i]) return true;
            }
        }
        return false;
    },
    
    /** Gets the index of the provided View in the subviews array.
        @param sv:View the view to check for.
        @returns the index of the subview or -1 if not found. */
    getSubviewIndex: function(sv) {
        var subs = this.subviews;
        if (subs) {
            var i = subs.length;
            while (i) {
                if (sv === subs[--i]) return i;
            }
        }
        return -1;
    },
    
    /** Adds the provided View to the subviews array of this Layout.
        @param sv:View the view to add to this layout.
        @returns void */
    addSubview: function(sv) {
        if (this.ignore(sv)) return;
        
        this.subviews.push(sv);
        this.startMonitoringSubview(sv);
        if (!this.locked) this.update();
    },
    
    /** Subclasses should implement this method to start listening to
        events from the subview that should trigger the update method.
        @param sv:View the view to start monitoring for changes.
        @returns void */
    startMonitoringSubview: function(sv) {},
    
    /** Calls startMonitoringSubview for all views. Used by Layout 
        implementations when a change occurs to the layout that requires
        refreshing all the subview monitoring.
        @returns void */
    startMonitoringAllSubviews: function() {
        var svs = this.subviews;
        var i = svs.length;
        while (i) this.startMonitoringSubview(svs[--i]);
    },
    
    /** Removes the provided View from the subviews array of this Layout.
        @param sv:View the view to remove from this layout.
        @returns the index of the removed subview or -1 if not removed. */
    removeSubview: function(sv) {
        if (this.ignore(sv)) return;
        
        var idx = this.getSubviewIndex(sv);
        if (idx !== -1) {
            this.stopMonitoringSubview(sv);
            this.subviews.splice(idx, 1);
            if (!this.locked) this.update();
        }
        return idx;
    },
    
    /** Subclasses should implement this method to stop listening to
        events from the subview that would trigger the update method. This
        should remove all listeners that were setup in startMonitoringSubview.
        @param sv:View the view to stop monitoring for changes.
        @returns void */
    stopMonitoringSubview: function(sv) {},
    
    /** Calls stopMonitoringSubview for all views. Used by Layout 
        implementations when a change occurs to the layout that requires
        refreshing all the subview monitoring.
        @returns void */
    stopMonitoringAllSubviews: function() {
        var svs = this.subviews;
        var i = svs.length;
        while (i) this.stopMonitoringSubview(svs[--i]);
    },
    
    /** Used to check if a subview can be added to this Layout or not. The
        default implementation is to return the 'ignoreLayout' attributes of
        the subview.
        @param sv:View the view to check.
        @returns boolean true means the subview will be skipped, false
            otherwise. */
    ignore: function(sv) {
        return sv.ignoreLayout;
    },
    
    /** Moves the subview before the target subview in the order the subviews
        are layed out.
        @returns void */
    moveSubviewBefore: function(sv, target) {
        var targetIdx = this.getSubviewIndex(target);
        if (targetIdx < 0) return;
        
        var curIdx = this.getSubviewIndex(sv);
        if (curIdx < 0) return;
        
        var svs = this.subviews;
        svs.splice(curIdx, 1);
        if (curIdx < targetIdx) --targetIdx;
        svs.splice(targetIdx, 0, sv);
    },
    
    /** Moves the subview after the target subview in the order the subviews
        are layed out.
        @returns void */
    moveSubviewAfter: function(sv, target) {
        var targetIdx = this.getSubviewIndex(target);
        if (targetIdx < 0) return;
        
        var curIdx = this.getSubviewIndex(sv);
        if (curIdx < 0) return;
        
        var svs = this.subviews;
        svs.splice(curIdx, 1);
        if (curIdx < targetIdx) --targetIdx;
        svs.splice(targetIdx + 1, 0, sv);
    },
    
    sortSubviews: function(sortFunc) {
        this.subviews.sort(sortFunc);
    },
    
    /** If our parent adds a new subview we should add it. */
    __handleParentSubviewAddedEvent: function(event) {
        var v = event.value;
        if (v.parent === this.parent) this.addSubview(v);
    },
    
    /** If our parent removes a subview we should remove it. */
    __handleParentSubviewRemovedEvent: function(event) {
        var v = event.value;
        if (v.parent === this.parent) this.removeSubview(v);
    }
});

/** Create locked counter functions for the myt.Layout class. */
myt.ThresholdCounter.createFixedThresholdCounter(myt.Layout, 1, 'locked');
