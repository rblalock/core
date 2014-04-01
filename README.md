[![Core.js](https://github.com/rblalock/core/raw/master/corejs.png)](https://github.com/mcongrove/core)

Core.js is a boilerplate for [Titanium Alloy](https://github.com/appcelerator/alloy). Use it to quickly start building applications without all the overhead of having to create screen management methods, utility functions and device detection.

Getting Started
===============

The `lib` folder is where the core.js singleton and the helpers are located.  Copy this in to
your Alloy project to start using.

If you want to run the sample apps: Clone this repository into your Titanium Studio Workspace:

```
	cd ~/Documents/Titanium_Studio_Workspace
	git clone git@github.com:rblalock/core.git
```

Now you can open Titanium Studio and import the project, which is in the `examples` folder:

```
	File > Import… > Existing Mobile Project > Select the examples folder (it's where the app is)
```

At this point you should have the project imported, open, and ready to edit.

Generated Documentation
===================

1. Install JSDuck for doc generation
2. Run this command from your project root dir: `jsduck ./lib --config ./documentation/jsduck.json`
3. The documentation html will be in `documentation/generatedDocumentation`

High-Level Overview
===================

##### core.js

The `/app/lib/core.js` file is home to the bulk of the boilerplate (hence the name). It provides access to commonly used methods including:

 * Device information
 * Network connection information
 * Global event handlers (resume, exit, orientation change, etc.)
 * Screen management via the Navigator object (which should be a module specific to your navigation
 strategy).

Any methods you create that are used throughout the application and relate to any of these functions should probably also be included in the `core.js` file.

##### http.js

The included `/app/lib/http.js` library is used to make HTTP requests and includes support for the most-used functionality. The HTTP library also adds some bonuses, such as data pass-through, which lets you send identifying information along with the HTTP request and receive it in the data return callback, helping associate data return with data requests.

##### utilities.js

A growing list of utility helper methods are available in the `/app/lib/utilities.js` file. These include:

 * File existance
 * Number formatting
 * HEX to HSB color conversion
 * String cleaning, escaping, decoding and translating

Ti.mocha Tests
===================
You can toggle the ti.mocha tests in `examples/app/config.json` -> mochaTesting

License and Credits
===================

Copyright 2014 [Rick Blalock](https://github.com/rblalock), [Matthew Congrove](https://github.com/mcongrove)

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   [http://www.apache.org/licenses/LICENSE-2.0](http://www.apache.org/licenses/LICENSE-2.0)

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
