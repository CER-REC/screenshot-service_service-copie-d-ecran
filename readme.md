# Screenshot Service for NEB Data Visualizations


## The Approach

Previously, for the Energy Futures visualization, we ran a node server with JSDOM and adapted the entire visualization to function on both server and browser. There were many issues

- We needed to integrate with IIS. This meant using IIS Node, which works fine, but which added complexity.
- We had to check the entire Node app into TFS, and copy the files on deploy. For the node server, this was tens of thousands of files
- We needed to integrate with Teambuild and TFS, which would break whenever a dependency included a file that TFS couldn't check in
- We needed to include the Phantomjs executable, but had no reliable way of killing it when deploying, which meant that the file couldn't be overwritten and deployments would frequently fail. 

That was a year and a half ago, and since then headless browser screenshotting technology has improved remarkably. The new approach is to create a small, single purpose screenshot server, which provides a service that all of the other visualizations can re-use for little effort.

The workflow will be like this:

- The user clicks on the screenshot button
- The browser app makes a POST request to the screenshot service with the URL to the 'screenshot version' of the current configuration of the visualization
- The screenshot service has headless Chrome request the page to be screenshotted, Chrome prepares the entire visualization, writes the screenshot image to a file.
- The screenshot service reads the file, responds with its content, and cleans up the file.


Proof of concept works like:

curl --data "{\"url\": \"http://localhost:3001/incident-visualization?language=en&columns=year\"}" -H "Content-Type: application/json" localhost:3002/screenshot





