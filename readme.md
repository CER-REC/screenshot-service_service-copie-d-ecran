# Screenshot Service for NEB Data Visualizations


## Dependencies

- Node (> 6.10) + NPM
- IISNode
- Chrome > v60

## Installing and Running

- Check out the repository
- `npm install`
- `npm run start-dev-unix` (if on OSX)

The application depends on having some environment variables properly set. At this writing, the Incident Visualization in dev mode is configured to use this service if it is running on the local system, also in dev mode.

## The Approach

Previously, for the Energy Futures visualization, we ran a node server with JSDOM and adapted the entire visualization to function on both server and browser. There were many issues:

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

- The production and test servers are firewalled off from the internet: any request made by Chrome to any server but our own will block the request until it times out. That means: no analytics, no foreign fonts, no WET template stylesheets on the page!
- The firewall is actually useful in this case though, as it will prevent the end from being used as an open-ended screenshot service by just anyone who discovers it. The service must run on the same app server as the visualizations do.
- Only one kind of request has been opened up for us in the firewall: requests to Bitly for short URLs


Ultimately, for ease of deployment, I have checked this node app into TFS. Zipping up the entire project to deploy it has its own problems, especially around path length.

Todo:
-when Chromeless and its dependency CUID are updated to no longer depend on core-js (which can't be checked into TFS), change the Chromeless dependency in package.json away from my forked repo.


Proof of concept works like:

curl localhost:3002/screenshot?pageUrl=incident-visualization%2Fscreenshot%3Fcolumns%3Dprovince%2CincidentTypes%2Cstatus%26incidentTypes%3Drelease%2CenvironmentalEffects%2Cfatality%2Cfire%2CseriousInjury%2Cobdl%2Cexplosion%26province%3DNS%2CPE%2CNB%2CNL%2CMB%2CNT%2CON%2CYT%2CAB%2CNU%2CSK%2CBC%2CQC%26status%3Dclosed%2Csubmitted%2CinitiallySubmitted%26language%3Dfr










