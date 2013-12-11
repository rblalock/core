[![Core.js](https://github.com/mcongrove/core/raw/master/corejs.png)](https://github.com/mcongrove/core)

Core.js is a boilerplate for [Titanium Alloy](https://github.com/appcelerator/alloy). Use it to quickly start building applications without all the overhead of having to create screen management methods, utility functions and device detection.

Getting Started
---------------

To start your application using Core.js simply clone this repository into your Titanium Studio Workspace:

```
	cd ~/Documents/Titanium_Studio_Workspace
	git clone git@github.com:mcongrove/core.git
```

Now you can open Titanium Studio and import the project:

```
	File > Import… > Existing Mobile Project
```

At this point you should have the project imported, open, and ready to edit.

High-Level Overview
-----------------------

###### index.js

All Alloy projects start by opening the `/app/controllers/index.js` file. Instead of using this entry-point as a controller for the home screen, we instead "hijack" it and use it to instantiate our `core.js` file (after which we open our first screen).

###### core.js

The `/app/lib/core.js` file is home to the bulk of the boilerplate (hence the name). It provides access to commonly used methods including:

 * Device information
 * Network connection information
 * Global event handlers (resume, exit, orientation change, etc.)
 * Screen management

Any methods you create that are used throughout the application and relate to any of these functions should probably also be included in the `core.js` file.

###### http.js

The included `/app/lib/http.js` library is used to make HTTP requests and includes support for the most-used functionality. The HTTP library also adds some bonuses, such as data pass-through, which lets you send identifying information along with the HTTP request and receive it in the data return callback, helping associate data return with data requests.

###### utilities.js

A growing list of utility helper methods are available in the `/app/lib/utilities.js` file. These include:

 * File existance
 * Number formatting
 * HEX to HSB color conversion
 * String cleaning, escaping, decoding and translating

Screen Management
-----------------

Instead of using a `Ti.UI.Window` for each screen, `core.js` employs a view-based hierarchy for application screens. This allows for more flexibility in how screens are display as it removes the possibility of opening two windows simultaneously (which is very bad).

Each screen should have a `Ti.UI.View` with an `id` of `wrapper`.

###### /app/views/foo.xml

```xml
	<Alloy>
		<View id="wrapper">
			<Label>This is a screen</Label>
		</View>
	</Alloy>
```

We can open this screen by passing it's controller (or controller name, as a string) to the `App.openScreen` method, along with any parameters we may want to pass in.

###### /app/controllers/bar.js

```javascript
	// Open the 'foo' screen
	App.openScreen("foo", { … });
```

#### Multi-View Example

To demonstrate the flexibility of view-based hierarchy, let's examine a tablet use-case. For this example, we'll use the standard master/detail tablet UI.

###### /app/views/master.xml

```xml
	<Alloy>
		<View id="wrapper">
			<TableView id="screensTable">
				<TableViewRow title="Screen A" />
				<TableViewRow title="Screen B" />
				<TableViewRow title="Screen C" />
			</TableView>
		</View>
	</Alloy>
```

###### /app/views/detail.xml

```xml
	<Alloy>
		<View id="wrapper">
			<Label id="screenName">You're viewing Screen _</Label>
		</View>
	</Alloy>
```

The `home` controller is the screen that is opened when we fire up the application. It has a wrapper view and two containers for the master and detail views (on tablet). On a handheld, we simply have a single-view wrapper (which will be explained shortly).

###### /app/views/home.xml

```xml
	<Alloy>
		<View id="wrapper" formFactor="tablet">
			<View id="master" />
			<View id="detail" />
		</View>
		<View id="wrapper" formFactor="handheld" />
	</Alloy>
```

As you can imagine, if we were on a tablet and using windows we'd be in trouble at this point, as the `home` view would be trying to include two sub-windows (giving us a total of three). Instead, though, we simply have a view including two sub-views.

###### /app/controllers/home.js

```javascript
	// Grab the master screen
	var masterScreen = Alloy.createController("master");
	
	if(Alloy.isTablet) {
		// Handle the tablet use-case
		
		// Grab the detail screen
		var detailScreen = Alloy.createController("detail");
		
		// Add screens to the appropriate containers
		$.master.add(masterScreen.getView());
		$.detail(detailScreen.getView());
		
		// Handle a click on a table row in master screen,
		// update the name of the screen in the detail screen
		masterScreen.screensTable.addEventListener("click", function(_event) {
			detailScreen.screenName.text = "You're viewing " + _event.row.title;
		});
	} else {
		// Handle handheld use-case
		
		// Add master screen to wrapper
		$.wrapper.add(masterScreen.getView());
		
		// Handle a click on a table row in master screen,
		// open detail screen
		masterScreen.screensTable.addEventListener("click", function(_event) {
			App.openScreen("detail", {
				screenName: _event.row.title
			});
		});
	}
```

The beauty of this is that for tablets we have two side-by-side views, giving us the classic master/detail tablet UI. For handhelds, though, we can use the exact same controllers, views, and styles to display a typical parent/child UI paradigm (master screen is shown and, when a table row is clicked, the detail screen is opened).

License and Credits
-------------------

Copyright 2013 [Rick Blalock](https://github.com/rblalock), [Matthew Congrove](https://github.com/mcongrove)

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   [http://www.apache.org/licenses/LICENSE-2.0](http://www.apache.org/licenses/LICENSE-2.0)

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.