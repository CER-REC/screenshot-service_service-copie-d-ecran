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

  const requestUrl = decodeURIComponent(req.query.pageUrl)

  const chromeless = new Chromeless()

  // TODO: more work to validate the url here...
  // TODO: definitely will want to build a proper URL object, verify is well 
  // formed, verify the destination, etc... 
  // TODO: also, need to parameterize port or something for dev/prod

  const screenshotPromise = chromeless
    .goto(`http://localhost:3001${requestUrl}`)
    .screenshot()
  .catch( error => {
    res.send('failure!')
  })


  const responsePromise = screenshotPromise.then( screenshotFilePath => {
    return readFile(screenshotFilePath)
  })
  .then( screenshotBuffer => {

    res.setHeader('content-type', 'image/png')
    // content-disposition=attachment prompts the browser to start a file 
    // download rather than navigate to the image.
    res.setHeader('content-disposition', 'attachment')

    res.write(screenshotBuffer)
    res.end()

  })
  .catch( error => {
    // TODO: more ...  
    res.send('failure!')
  })

  Promise.join(screenshotPromise, responsePromise, screenshotFilePath => {
    return unlink(screenshotFilePath)
  })
  .catch( error => {
    // TODO: more ...  
    // res.send('failure!')
  })


})


app.listen(3002)
