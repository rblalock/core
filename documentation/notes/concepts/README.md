# December 24th - Initial Ideas and Concepts

Below is the general flow of the initial concepts:

## File Structure
* Super simple file structure to stub out concepts: [http://www.screencast.com/t/MG6m5auy](http://www.screencast.com/t/MG6m5auy)
* /mmp/ is where the middleware code lives.  End developers should never have to touch this and in fact this could be an npm where they never have to see it in there project.
* /lib/middleware.js – Pretty much all the stubbed out logic & flow for routing and such
* /lib/mock_acs/ - This just returns a JSON object that simulates an API endpoint configuration.  Obviously this will be stored somewhere but for the time being I’m putting it here as a make believe database.
* /lib/mock_ds/ - While I’m stubbing out stuff, these are my make believe data sources / adapters.  All they do is return a JSON object of data that has been “queried”.
* /endpoints/ This is where the end developer can hook in to the middleware / routing lifecycle, override things, etc. e.g. Based on the endpoint like `/v1/employees`, they have an employees.js where they can use custom logic, etc.

## Middleware Flow
1.  MMP is setup when server is booted, registers routes, etc.
2.  Requests such as `/1/employees` are handled by a core route that determines what object to use, etc.
3.  The configuration for the endpoint is loaded from ACS
4.  The configuration is used to prepare the queries for the adapters / datasources
5.  Each query is passed to it’s related adapter to query the data source (all async).
6.  Once we have a response for all queries (using a setInterval that checks for now…which we probably don’t want for production ;-), the middleware starts preparing the response.
7.  Response is formatted according to the endpoint’s configuration.  Currently the response is hard coded since this is where all the data mashup and fun logic will go.
8.  Response is sent to the client.

## Developer Flow
I don’t have much yet for developers other than a config object for the /employee/ endpoint and the /endpoints/employee.js which will let the developer write custom code and apply it throughout the lifecycle of the middleware routines (all optional).
The only lifecycle methods I have right now are: onConfigurationLoad, beforeAdapterQuery, afterAdapterQuery, beforeResponse.
Currently these endpoint files are the typical CommonJS exports.someFunc interface.  There are lots to discuss around this.  Should they be part of the Express lifecycle instead using next(), etc?  Should they be based on events instead of exports.*? Etc. etc. etc.
Adding /_describe to any endpoint will return the configuration for that endpoint (fields, types, etc.)
Here’s an end product video of what happens:
[http://www.screencast.com/t/KBpcQoyp2ltf](http://www.screencast.com/t/KBpcQoyp2ltf)

And the console from that request:  [https://gist.github.com/rblalock/ecd67e6853d39b7da727](https://gist.github.com/rblalock/ecd67e6853d39b7da727)