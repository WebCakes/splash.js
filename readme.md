## Description
Splash.JS is an Object Oriented style plugin.  
This plugin takes 1 DOM element and resizes its height based on the height (and width) of the browser window.  
The plugin can also take 1-2 other elements (above and/or below) and again resize the middle element based on those 1-2 element(s)' height(s).  
It is especially useful for very large window sizes.

Please see the [examples](examples) directory for very simplified use-cases.

## Requirements: 
jQuery v1.9+.x -- [Download Here](http://jquery.com/download/)

## How to Use: 
### 1. Prepare resources
1. [Download jQuery](http://jquery.com/download/).
2. [Donwload Splash.JS](jquery.splash.min.js).
3. Include/Link/Source Files in your project in the above order.

### 2. Create a new instance of Splash.

```javascript
var myapp = new Splash();
```

### 3. Initialize the plugin.

```javascript
var myapp = new Splash();
myapp.init( $('#myIntroHeader'), $('#myWelcomeMessage'), $('#myStaticNavigation'), "body.frontpage", true );
```

The `init()` method can take 6 parameters.
These are the parameters in order and the data they expect.

1. The Dynamic Element => jQuery object -- **Required**
  * This is the element that changes its height depending on the height of the browser.
2. The Sticky Element => jQuery object -- Optional *( default: null )*
  * This is the element that will *stick* to the bottom of the page.
3. The Static Element => jQuery object -- Optional *( default: null )*
  * This is the element that doesn't move and acts as a regular DOM element. This is best used for Navigation elements.
4. A Page Element => jQuery Selector String -- Optional *( default: null )*
  * This is an element on the page that the plugin checks to see if it exists before running. `"body.frontpage"` looks for `<body class="frontpage">` before executing. 
5. Responsive / onResize => true or false Boolean -- Optional *( default: false )*
  * This executes the dynamic element height resizing method as the user resizes the window. This allows for immediate refreshing of the height without a page load.
6. Debug => true or false Boolean -- Optional *( default: false )*
  * This turns on debug messages within the browser's console.

**If you do not need to use an optional parameter please set it to its default**

```javascript
myapp.init( $('#myIntroHeader'), null, null, null, false, false );
```

### Other Methods

```javascript
myapp.setSplashElements( $('#myIntroHeader'), $('#myWelcomeMessage'), $('#myStaticNavigation') ); // Set Splash elements manually
myapp.setDynamicElementsHeight( 500 ); // Set the height of the dynamic element manually
myapp.setHeightBreakpoint( 1000 ); // When to execute height changes based on width
myapp.setWidthBreakpoint( 767 ); // When to execute height changes based on width
myapp.setPageElementCheck( "body.frontpage" ); // Add a page element to check for before executing
```

Please see the [examples](examples) directory for further code examples.


## How to Contribute:
### Install Grunt

**Unfamiliar with npm? Don't have node installed?** [Download and install node.js](http://nodejs.org/download/) before proceeding.

From the command line:

1. Install `grunt-cli` globally with `npm install -g grunt-cli`.
2. Navigate to the theme directory, then run `npm install`. npm will look at `package.json` and automatically install the necessary dependencies.

When completed, you'll be able to run the various Grunt commands provided from the command line.

### Available Grunt commands

* `grunt watch` — Will watch for changes inside `jquery.splash.js` and run jshint to make sure code is clean.
* `grunt build` — Will run jshint for a clean code check and minify `jquery.splash.js` into `jquery.splash.min.js`.

### Contributing

Everyone is welcome to help contribute and improve this project. There are several ways you can contribute:

* Reporting issues.
* Suggesting new features.
* Writing or refactoring code.
* Fixing issues.
* Replying to questions within GitHub issues.

Task List
----------
- [ ] Accomodate potential Padding Height when calculating Dynamic Elements's Height
- [ ] Organize Global Variables properly.
  * Globals should only be used if they're absolutely needed.
- [ ] Refactor similar methods into one.

Possible Future Features
-----------------
