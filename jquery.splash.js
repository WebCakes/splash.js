// Title       :  Splash.JS
// Description :  A plugin that will dynamically adjust an element's height based on browser window's height and other factors
// Author      :  James Mann -- WebCakes
// Websites    :  http://www.jameswmann.com, http://www.webcakes.ca
// Version     :  1.0.0

// Global Variables
var windowWidth;
var windowHeight;
var heightBreakpoint = 0;
var widthBreakpoint = 767; // Based on Bootstrap's "Small" grid breakpoint
var pullHeight;
var pageElementCheck;
var onResize = false;
var dynamicElements; // Elements that require the height to be changed based on the height of the browser window.
var staticElements;  // Elements that do not move and that are above the dynamic element.
var stickyElements;  // Elements that are below the dynamic element and that we want to be 'sticky' at the bottom of the fullscreen.
var splashElements = {}; // All Elements that are involved with the Splash Screen

// Create a class
var Splash = function() {
  var app = this;
  var debug = false;

  this.init = function( elements, options ) {
    var dynamicObject, stickyObject, staticObject;
    var pageObjectCheck;

    // Go through the 'elements' object
    if ( elements && $.type( elements ) === "object" ) {
      if ( elements.dynamicObject !== undefined ) {
        dynamicObject = elements.dynamicObject;
      }
      if ( elements.stickyObject !== undefined ) {
        stickyObject = elements.stickyObject;
      }
      if ( elements.staticObject !== undefined ) {
        staticObject = elements.staticObject;
      }
    } else {
      app.log( "No Elements have been set." );
      elements = {};
    }

    // Go through the 'options' object
    if ( options && $.type( options ) === "object" ) {
      if ( options.pageObjectCheck !== undefined && $.type( options.pageObjectCheck ) === "string" ) {
        // If the option exists and is a string, set it.
        app.setPageElementCheck( options.pageObjectCheck );
      }
      if ( options.onResizeBoolean !== undefined && $.type( options.onResizeBoolean ) === "boolean" ) {
        // If the option exists and is a boolean, set it.
        onResize = options.onResizeBoolean;

        if ( onResize ) {
          app.log( "Reponsive on-resize: Enabled" );
        } else {
          app.log( "Reponsive on-resize: Disabled" );
        }
      }
      if ( options.debugBoolean !== undefined && $.type( options.debugBoolean ) === "boolean" ) {
        // If the option exists and is a boolean, set it.
        debug = options.debugBoolean;
      }
    } else {
      app.log( "No Options have been set." );
      options = {};
    }

    if ( app.checkForPageElement() ) {
      if ( dynamicObject ) {
        app.setSplashElements( dynamicObject, stickyObject, staticObject );
      } else {
        app.log( "You must set your Splash Elements or Height Breakpoint Manually and run." );
      }

      app.setDynamicElementsHeight();

      if ( onResize ) {
        $( window ).resize( function() {
          app.setDynamicElementsHeight();
        });
      }
    }
  };

  // Set the Splash Elements which will allows us to calulate the total height of the elements on page load
  this.setSplashElements = function( dynamicObject, stickyObject, staticObject ) {
    if ( dynamicObject && dynamicObject instanceof jQuery ) {
      dynamicElements = dynamicObject;
      splashElements.dynamicElements = dynamicObject;
      app.log( "Dynamic Elements: " );
      app.log( dynamicElements );

      if ( stickyObject instanceof jQuery ) {
        stickyElements = stickyObject;
        splashElements.stickyElements = stickyObject;
        app.log( "Sticky Elements: " );
        app.log( stickyElements );
      }

      if ( staticObject instanceof jQuery ) {
        staticElements = staticObject;
        splashElements.staticElements = staticObject;
        app.log( "Static Elements: " );
        app.log( staticElements );
      }

      app.log( "Splash Elements: " );
      app.log( splashElements );
      app.setHeightBreakpoint();
    } else {
      app.log( "First Parameter (Dynamic Elements) must be a jQuery object." );
    }
  };

  // Return the current width of the browser window
  this.getWindowWidth = function() {
    windowWidth = $( window ).width();
    app.log( "Browser Window's Width: " + windowWidth );
    return windowWidth;
  };

  // Return the current height of the browser window
  this.getWindowHeight = function() {
    windowHeight = $( window ).height();
    app.log( "Browser Window's Height: " + windowHeight );
    return windowHeight;
  };

  // Returns the height of the Dynamic Element based on other Splash screen Elements ( Sticky / Static )
  this.calculatePullHeight = function() {
    var stickyHeight;
    var staticHeight;

    if ( stickyElements && stickyElements instanceof jQuery ) {
      stickyHeight = stickyElements.outerHeight();
      app.log( "Sticky Element Height: " + stickyHeight );
    } else {
      stickyHeight = 0;
    }

    if ( staticElements && staticElements instanceof jQuery ) {
      staticHeight = staticElements.outerHeight();
      app.log( "Static Element Height: " + staticHeight );
    } else {
      staticHeight = 0;
    }

    pullHeight = stickyHeight + staticHeight;
    app.log( "Pull Height: " + pullHeight );

    return pullHeight;
  };

  this.setDynamicElementsHeight = function( i ) {
    app.calculatePullHeight();

    if ( i && $.type( i ) === "number" && ( i > 0 ) ) {
      dynamicElements.css({ 'height': i + 'px' });
      app.log( "Manually Set Dynamic Elements' Height to: " + i );
    } else if ( pullHeight >= 0 && heightBreakpoint > 0 ) {
      // If the height of the window is greater than the height of the Height Breakpoint
      // And the width of the window is greater than the width of the Width Breakpoint
      // And the calculated window height minus the pullHeight is not a negative number
      app.getWindowWidth();
      app.getWindowHeight();
      if ( ( windowHeight > heightBreakpoint && windowWidth > widthBreakpoint ) && ( ( windowHeight - pullHeight ) > 0 ) ) {
        dynamicElements.css({ 'height': ( windowHeight - pullHeight ) + 'px' });
        app.log( "Dynamic Elements' Height: " + ( windowHeight - pullHeight ) );
      } else if ( dynamicElements.attr( 'style' ) ) {
        // If the window sizeing parameters no longer matches the above
        // check for any inline styling that may have been applied
        // Remove Inline jQuery Styles if they exist
        dynamicElements.removeAttr( 'style' );
        app.log( "Dynamic Elements' Height has been reset." );
      }
    } else {
      app.log( "Unable to Set Dynamic Elements' height. Pull Height and Height Breakpoint aren't set properly." );
    }
  };

  // Set the Height Breakpoint based on total height of splashElements
  this.setHeightBreakpoint = function( i ) {
    // Calculate the height of each element we want on the fullscreen view.
    // This allows us to dynamically set the 'trigger' for the function as-
    // beyond the height of the element's inital page load height.
    // This prevents a 'jumping' effect when its trigger (due to the difference in inital heights)

    if ( i && $.type( i ) === "number" && ( i > 0 ) ) {
      heightBreakpoint = i;
      app.log( "Manually Set Height Breakpoint to: " + i );
    } else if ( splashElements ) {
      heightBreakpoint = 0;

      $.each( splashElements, function( key, obj ) {
        heightBreakpoint += obj.outerHeight();
      });
      app.log( "Breakpoint Height: " + heightBreakpoint );
    } else {
      app.log( "Unable to set Height Breakpoint. No Splash Elements have been set" );
    }
  };

  // Set the Width Breakpoint based on total width of splashElements
  this.setWidthBreakpoint = function( i ) {
    if ( i && $.type( i ) === "number" && ( i > 0 ) ) {
      widthBreakpoint = i;
      app.log( "Manually Set Height Breakpoint to: " + i );
    } else {
      app.log( "Unable to set Width Breakpoint" );
    }
  };

  // Set Page Element Check to check against when running setDynamicElementsHeight()
  this.setPageElementCheck = function( pageObjectCheck ) {
    if ( pageObjectCheck && $.type( pageObjectCheck ) === "string" ) {
      pageElementCheck = pageObjectCheck;
      app.log( "Element to Check for before running: " + pageElementCheck );
    } else {
      app.log( "Page Element Check must be a jQuery selector (string)." );
    }
  };

  // Check to see if a specifc Page Element exists on the page
  this.checkForPageElement = function( pageObjectCheck ) {
    if ( pageObjectCheck && $.type( pageObjectCheck ) === "string" ) {
      pageElementCheck = pageObjectCheck;
      app.log( "Manually Checking for: " + pageElementCheck );
    } else if ( pageElementCheck ) {
      if ( $( pageElementCheck ).length ) {
        app.log( "Page Element Exists. Success! Continuing..." );
        return true;
      } else {
        app.log( "Page Element does not exist. Stopping..." );
        return false;
      }
    } else {
      app.log( "No Page Element to check for. Passing..." );
      return true;
    }
  };

  // Safe way of debugging ( console.logs() can break older versions of IE )
  this.log = function( data ) {
    if ( window.console && debug ) {
      console.log( data );
    }
  };
};
