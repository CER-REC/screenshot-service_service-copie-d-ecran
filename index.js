
if (process.env.NODE_ENV === 'development') {
  require('dotenv').config({path: '.env.dev'})
}
else if (process.env.NODE_ENV === 'production') {
  require('dotenv').config({path: '.env.prod'})
}


const Chromeless = require('chromeless').Chromeless
const Express = require('express')
const Promise = require('bluebird')

const Path = require('path')
const Fs = require('fs')

const unlink = Promise.promisify(Fs.unlink)
const readFile = Promise.promisify(Fs.readFile)

const app = Express()

app.get('/screenshot', (req, res) => {

  const chromeless = new Chromeless()

  const reqWidth = parseInt(req.query.width)
  const reqHeight = parseInt(req.query.height)
  // + 20, because there's still enough overlap to trigger scrollbars on chrome
  // in windows. 
  // TODO: add overflow: hidden to screenshot endpoints to better maintain
  // dimensions
  const width = isNaN(reqWidth) ? 1000 : (reqWidth + 20)
  const height = isNaN(reqHeight) ? 600 : (reqHeight + 20)



  const requestUrl = decodeURIComponent(req.query.pageUrl)

  let url
  if (process.env.USE_HTTP_BASIC_AUTH) {

    // We want a URL like: http://user:pass@host.com/pathname/

    url = `${process.env.REQUEST_PROTOCOL}${process.env.REQUEST_USERNAME}:${process.env.REQUEST_PASSWORD}@${process.env.REQUEST_HOST}${requestUrl}`
  }
  else {

    // We want a URL like: http://host.com/pathname/

    url = `${process.env.REQUEST_PROTOCOL}${process.env.REQUEST_HOST}${requestUrl}`
  }


  const screenshotPromise = chromeless
    .setViewport({width: width, height: height, scale: 1})
    .goto(url)
    .screenshot()

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
    console.error(error)
    res.status(500).send()
  })

  Promise.join(screenshotPromise, responsePromise, screenshotFilePath => {
    return unlink(screenshotFilePath)
  })
  .catch( error => {
    console.error(error)
  })


})

// IIS-Node passes in a named pipe to listen to in process.env.PORT
app.listen(process.env.PORT || process.env.PORT_NUMBER)
