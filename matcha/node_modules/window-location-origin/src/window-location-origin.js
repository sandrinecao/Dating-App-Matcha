/* jshint browser:true
 *
 * window-location-origin - version 0.0.1
 * Add support for browsers that don't natively support window.location.origin
 *
 * Authror: Kyle Welsby <kyle@mekyle.com>
 * License: MIT
 */

(function(location){
  'use strict';
  if (!location.origin) {
    var origin = location.protocol + "//" + location.hostname + (location.port && ":" + location.port);
    
    try {
      // Make it non editable
      Object.defineProperty(location, "origin", {
        enumerable: true,
        value: origin
      });
    } catch (e){
      // IE < 8
      location.origin = origin;
    }
  }
})(window.location);
