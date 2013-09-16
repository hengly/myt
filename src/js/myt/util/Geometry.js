/** Provides common geometry related functions. */
myt.Geometry = {
    // Methods /////////////////////////////////////////////////////////////////,
    /** Tests if the provided point is inside this path.
        @param x:number the x coordinate to test.
        @param y:number the y coordinate to test.
        @param boundingBox:object a bounding box object that bounds the path.
        @param path:array an array of points where the index 0,2,4,... are
            the x values and index 1,3,5,... are the y values.
        
        Alternate params:
        @param x:object A point object with x and y properties.
        
        @return true if inside, false otherwise. */
    isPointInPath: function(x, y, boundingBox, path) {
        if (typeof x === 'object') {
            path = boundingBox;
            boundingBox = y;
            y = x.y;
            x = x.x;
        }
        
        // First test bounding box
        if (this.rectContainsPoint(x, y, boundingBox)) {
            // Test using Jordan Curve Theorem
            var len = path.length;
            
            // Must at least be a triangle to have an inside.
            if (len >= 6) {
                var c = false, x1 = path[0], y1 = path[1], x2, y2;
                while (len) {
                    y2 = path[--len];
                    x2 = path[--len];
                    if (((y2 > y) !== (y1 > y)) && (x < (x1 - x2) * (y - y2) / (y1 - y2) + x2)) c = !c;
                    x1 = x2;
                    y1 = y2;
                }
                return c;
            }
        }
        return false;
    },
    
    /** Checks if the provided point is inside or on the edge of the provided 
        rectangle.
        @param pX:number the x coordinate of the point to test.
        @param pY:number the y coordinate of the point to test.
        @param rX:number the x coordinate of the rectangle.
        @param rY:number the y coordinate of the rectangle.
        @param rW:number the width of the rectangle.
        @param rH:number the height of the rectangle.
        
        Alternate Params:
        @param pX:object a point object with properties x and y.
        @param rX:object a rect object with properties x, y, width and height.
        
        @returns boolean True if the point is inside or on the rectangle. */
    rectContainsPoint: function(pX, pY, rX, rY, rW, rH) {
        if (typeof pX === 'object') {
            rH = rW;
            rW = rY;
            rY = rX;
            rX = pY;
            pY = pX.y;
            pX = pX.x;
        }
        
        if (typeof rX === 'object') {
            rH = rX.height;
            rW = rX.width;
            rY = rX.y;
            rX = rX.x;
        }
        
        return pX >= rX && pY >= rY && pX <= rX + rW && pY <= rY + rH;
    },
    
    /** Checks if the provided point lies inside or on the edge of the
        provided circle.
        @param pX:number the x coordinate of the point to test.
        @param pY:number the y coordinate of the point to test.
        @param cX:number the x coordinate of the center of the circle.
        @param cY:number the y coordinate of the center of the circle.
        @param cR:number the radius of the circle.
        @return boolean True if the point is inside or on the circle. */
    circleContainsPoint: function(pX, pY, cX, cY, cR) {
        return this.measureDistance(pX, pY, cX, cY, true) <= cR * cR;
    },
    
    /** Measure the distance between two points.
        @param x1:number the x position of the first point.
        @param y1:number the y position of the first point.
        @param x2:number the x position of the second point.
        @param y2:number the y position of the second point.
        @param squared:boolean (optional) If true, the squared distance will
            be returned.
        @returns number the distance between the two points. */
    measureDistance: function(x1, y1, x2, y2, squared) {
        var diffX = x2 - x1, 
            diffY = y2 - y1, 
            diffSquared = diffX * diffX + diffY * diffY;
        return squared ? diffSquared : Math.sqrt(diffSquared);
    },
    
    /** Convert radians to degrees.
        @param deg:number degrees.
        @returns number: radians. */
    degreesToRadians: function(deg) {
        return deg * Math.PI / 180;
    },
    
    /** Convert degrees to radians.
        @param rad:number radians.
        @returns number: degrees. */
    radiansToDegrees: function(rad) {
        return rad * 180 / Math.PI;
    },
    
    // Geometry on a sphere
    /** Checks if the provided lat/lng point lies inside or on the edge of the
        provided circle.
        @param pLat:number the latitude of the point to test.
        @param pLng:number the longitude of the point to test.
        @param cLat:number the latitude of the center of the circle.
        @param cLng:number the longitude of the center of the circle.
        @param cR:number the radius of the circle in kilometers.
        @param sphereRadius:number (optional) the radius of the sphere the
            measurement is being taken on in kilometers. If not provided the
            radius of the earth is used.
        @return boolean True if the point is inside or on the circle. */
    circleContainsLatLng: function(pLat, pLng, cLat, cLng, cR, sphereRadius) {
        return this.measureLatLngDistance(pLat, pLng, cLat, cLng, sphereRadius) <= cR;
    },
    
    /** Measures the distance between two points on a sphere using latitude
        and longitude.
        @param lat1:number the latitude of the first point.
        @param lng1:number the longitude of the first point.
        @param lat2:number the latitude of the second point.
        @param lng2:number the longitude of the second point.
        @param sphereRadius:number (optional) the radius of the sphere the
            measurement is being taken on in kilometers. If not provided the
            radius of the earth is used.
        @returns number the distance between the points in kilometers. */
    measureLatLngDistance: function(lat1, lng1, lat2, lng2, sphereRadius) {
        // Taken from: http://www.movable-type.co.uk/scripts/latlong.html
        if (sphereRadius === undefined) sphereRadius = 6371; // kilometers for earth
        lat1 = this.degreesToRadians(lat1);
        lng1 = this.degreesToRadians(lng1);
        lat2 = this.degreesToRadians(lat2);
        lng2 = this.degreesToRadians(lng2);
        return sphereRadius * Math.acos(
            Math.sin(lat1) * Math.sin(lat2) + 
            Math.cos(lat1) * Math.cos(lat2) * Math.cos(lng2 - lng1)
        );
    }
};
