# Screenshot Service for NEB Data Visualizations

## About

This project constitutes a stand alone Node.js server for taking screenshots of a web page. It's only capable of taking screenshots of localhost, and is intended to be deployed along side other applications under IISNode.

## Dependencies

- Node (> 6.10) + NPM
- Git
- Chrome > v60

## Installing and Running

- Check out the repository with `git clone`
- `npm install`
- `npm run start-dev-unix` (if on OSX) or `npm run start-dev-win` if on Windows

The application on some environment variables, which may be set through the .env files or through web.config with IISNode.

- `REQUEST_PROTOCOL` Used to build the URL for making page requests
- `REQUEST_HOST` Used to build the URL for making page requests
- `USE_HTTP_BASIC_AUTH` If set, the app will include HTTP basic auth credentials in its requests.
- `REQUEST_USERNAME` Used to build the URL for making page requests, if USE_HTTP_BASIC_AUTH is set.
- `REQUEST_PASSWORD` Used to build the URL for making page requests, if USE_HTTP_BASIC_AUTH is set.
- `PORT` 
- `PORT_NUMBER` 

## API

The service constitutes a single endpoint at `/screenshot`, which accepts GET requests with three URL parameter arguments: 

- `pageUrl` - A URL encoded fragment of a URL, everything from 
- `width` - *optional* An integer, how wide the Chrome window taking the screenshot should be
- `height` - *optional* An integer, how tall the Chrome window taking the screenshot should be

Defaults are applied to width and height if not supplied. It is the consumer's responsibility to provide dimensions to the service that will adequately capture the image.

e.g: [localhost:3002/screenshot?pageUrl=%2Fpipeline-incidents%2Fscreenshot&width=1200&height=800]()

## Usage with the [Pipeline Incident Visualization](https://github.com/NEBGitHub/incidents-pipeliniers_pipeline-incidents)

The Pipeline Incident Visualization is configured to use this service in development mode if it is running on the local system, also in development mode. To use them together, run the incident app and the screenshot service app at the same time, in separate terminal windows, and click the screenshot button in the app.

Initially, this service is only in use with the incident visualization, but the intent is to use it for all future visualization apps and potentially to replace the old PhantomJS based approach in the [Energy Futures visualization](https://github.com/NEBGitHub/energy-futures-vis-avenir-energetique) as well.

## The Approach

- The user clicks on the screenshot button
- The browser app makes a GET request to the screenshot service with the URL to the 'screenshot version' of the current configuration of the visualization (e.g. http://localhost:3001/pipeline-incidents/screenshot)
- The screenshot service has headless Chrome request the page to be screenshotted, Chrome prepares the visualization page, and writes the screenshot image to a file.
- The screenshot service reads the file, responds with its content, and cleans up the file.







# Service de prise d’instantanés d’écran aux fins de la visualisation des données de l’Office

## À propos de l’outil

Le projet constitue un serveur autonome Node.js conçu pour prendre des instantanés d’écran d’une page Web. Il ne peut le faire que pour l’ordinateur hôte. Il est conçu pour être déployé avec d’autres applications sous IISNode.

## Dépendances

- Node (> 6.10) + NPM
- Git
- Chrome > v60

## Installation et utilisation

- Copiez le référentiel avec `git clone`
- `npm install`
- `npm run start-dev-unix` (dans OSX) ou `npm run start-dev-win` (dans Windows)

Certaines variables d’environnement sont nécessaires à l’utilisation de l’application; elles peuvent être définies dans les fichiers .env ou web.config (IISNode).

- `REQUEST_PROTOCOL` Sert à créer l’adresse URL pour lancer des demandes de page.
- `REQUEST_HOST` Sert à créer l’adresse URL pour lancer des demandes de page.
- `USE_HTTP_BASIC_AUTH` Lorsque la variable est définie, l’application intègre des justificatifs d’identité de base dans les demandes de page.
- REQUEST_USERNAME` Sert à créer l’adresse URL pour lancer des demandes de page si la variable USE_HTTP_BASIC_AUTH est définie.
- `REQUEST_PASSWORD` Sert à créer l’adresse URL pour lancer des demandes de page si la variable USE_HTTP_BASIC_AUTH est définie.
- `PORT` 
- `PORT_NUMBER` 

## API

Le service constitue un point terminal unique à `/screenshot`, qui accepte les demandes GET à trois arguments de paramètre URL : 

- `pageUrl` - Fragment codé d’adresse URL (tout à partir de ce point) 
- `width` - *facultatif* Nombre entier; largeur de la fenêtre Chrome pour l’instantané d’écran
- `height` - *facultatif* Nombre entier; hauteur de la fenêtre Chrome pour l’instantané d’écran

Des valeurs par défaut sont utilisées si la largeur et la hauteur ne sont pas précisées. Il incombe au consommateur de préciser les dimensions requises pour les instantanés d’écran.

Exemple : [localhost:3002/screenshot?pageUrl=%2Fpipeline-incidents%2Fscreenshot&width=1200&height=800]()

## Utilisation avec [l’outil de visualisation des incidents pipeliniers](https://github.com/NEBGitHub/incidents-pipeliniers_pipeline-incidents)

L’application de visualisation des incidents pipeliniers est configurée pour utiliser le service de prise d’instantanés d’écran en mode de développement sur le système local, lui-même en mode de développement. Pour les utiliser ensemble, lancez l’application de visualisation des incidents et l’application de prise d’instantanés d’écran en même temps, dans deux fenêtres de terminal différentes, et cliquez sur le bouton correspondant au service de prise d’instantanés d’écran.

À ce point-ci, le service n’est utilisé qu’avec l’application de visualisation des incidents pipeliniers, mais il est prévu de s’en servir pour toutes les futures applications de visualisation et peut-être même pour remplacer l’ancien outil PhantomJS [utilisé pour l’application de visualisation de l’avenir énergétique] (https://github.com/NEBGitHub/energy-futures-vis-avenir-energetique).

## Approche

- L’utilisateur n’a qu’à cliquer sur le bouton de prise d’instantané d’écran.
- L’application de navigateur fait une demande GET au service de prise d’instantanés d’écran au moyen de l’adresse URL de la « version de prise d’instantanés d’écran » définie dans la configuration actuelle de l’application de visualisation (p. ex., http://localhost:3001/incidents-pipeliniers/screenshot).
- Le service de prise d’instantanés d’écran commande à Chrome Headless de prendre l’instantané d’écran. Chrome prépare la page de visualisation et enregistre l’instantané dans un fichier.
- Le service de prise d’instantanés d’écran lit le fichier, y ajoute son propre contenu et nettoie le fichier.


