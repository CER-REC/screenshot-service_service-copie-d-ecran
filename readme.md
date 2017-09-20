# Screenshot Service for NEB Data Visualizations


## The Approach

Previously, for the Energy Futures visualization, we ran a node server with JSDOM and adapted the entire visualization to function on both server and browser. There were many issues

- We needed to integrate with IIS. This meant using IIS Node, which works fine, but which added complexity.
- We had to check the entire Node app into TFS, and copy the files on deploy. For the node server, this was tens of thousands of files
- We needed to integrate with Teambuild and TFS, which would break whenever a dependency included a file that TFS couldn't check in
- We needed to include the Phantomjs executable, but had no way of killing it when deploying, which meant that the file couldn't be overwritten and deployments would frequently fail because the node server was running. 
- All sorts of awful workarounds in the visualization itself to get it to work in the pseudo DOM world of JSDOM.

That was a year and a half ago, and since then headless browser screenshotting technology has improved remarkably. The new approach is to create a small, single purpose screenshot server, which provides a service that all of the visualizations can use for little effort. Hopefully, we will rarely need to re-deploy this

The workflow will be like this:

- The user clicks on the screenshot button
- The browser app makes a POST request to the screenshot service with the URL to the 'screenshot version' of the current configuration of the visualization
- The screenshot service has headless Chrome request the page to be screenshotted, Chrome prepares the entire visualization, writes the screenshot image to a file.
- The screenshot service reads the file, responds with its content, and cleans up the file.

Some important notes:

- The production server is firewalled off from the internet: any request made by Chrome to any server but our own will block the request until it times out. That means: no analytics, no foreign fonts on the page!
- The firewall is actually useful in this case though, as it will prevent the end from being used as an open-ended screenshot service by just anyone who discovers it. The service must run on the same app server as the visualizations do.
- Only one kind of request has been opened up for us in the firewall: requests to Bitly for short URLs
- We're not going to follow the usual app deployment process this time, it's just too painful to store node apps with all of their dependencies in TFS, even a tiny one like this. I'm making an exception for this service: we'll deploy it as a package and manage it with nodemon

Proof of concept works like:

curl --data "{\"url\": \"http://localhost:3001/incident-visualization?language=en&columns=year\"}" -H "Content-Type: application/json" localhost:3002/screenshot





