
if (process.env.NODE_ENV === 'development') {
  require('dotenv').config({path: '.env.dev'})
}
else if (process.env.NODE_ENV === 'production') {
  require('dotenv').config({path: '.env.prod'})
}

const Chromeless = require('chromeless').Chromeless
const Express = require('express')
const Promise = require('bluebird')

const Url = require('url')
const Path = require('path')
const Fs = require('fs')

const unlink = Promise.promisify(Fs.unlink)
const readFile = Promise.promisify(Fs.readFile)

const app = Express()

app.get('/screenshot', (req, res) => {

  const chromeless = new Chromeless()

  const reqWidth = parseInt(req.query.width)
  const reqHeight = parseInt(req.query.height)
  const width = isNaN(reqWidth) ? 1000 : (reqWidth + 20)
  const height = isNaN(reqHeight) ? 600 : (reqHeight + 20)

  const urlPromise = new Promise( (resolve, reject) => {
    const requestUrl = decodeURIComponent(req.query.pageUrl)
    const url = Url.parse(`${process.env.REQUEST_ENDPOINT}${requestUrl}`)

    resolve(url)
  })

  const screenshotPromise = urlPromise.then( url => {
    return chromeless
      .setViewport({width: width, height: height, scale: 1})
      .goto(url.href)
      .screenshot()
    .catch( error => {
      res.send('failure!')
    })
  })

  const responsePromise = screenshotPromise.then( screenshotFilePath => {
    return readFile(screenshotFilePath)
  })
  .then( screenshotBuffer => {

    res.setHeader('content-type', 'image/png')
    // content-disposition=attachment prompts the browser to start a file 
    // download rather than navigate to the image.
    res.setHeader('content-disposition', 'attachment; filename=image.png')

    res.write(screenshotBuffer)
    res.end()

  })
  .catch( error => {
    // TODO: more ...  
    res.status(500).send()
  })

  Promise.join(screenshotPromise, responsePromise, screenshotFilePath => {
    return unlink(screenshotFilePath)
  })
  .catch( error => {
    // TODO: more ...  
  })


})

// IIS-Node passes in a named pipe to listen to in process.env.PORT
app.listen(process.env.PORT || process.env.PORT_NUMBER)
