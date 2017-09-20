const Chromeless = require('chromeless').Chromeless
const Express = require('express')
const Promise = require('bluebird')
const BodyParser = require('body-parser')


const app = Express()

app.use(BodyParser.json({}))

app.post('/screenshot', (req, res) => {

  const chromeless = new Chromeless()

  // TODO: more work to validate the url here...

  chromeless
    .goto(req.body.url)
    .screenshot()
  .then( screenshotUrl => {
    res.send(screenshotUrl)
  })
  .catch( error => {
    // TODO: more ...  
    res.send('failure!')
  })


  // console.log(screenshot) // prints local file path or S3 url

  // await chromeless.end()

  // res.send(screenshot)

  //res.send('ok')

})


app.listen(3002)



//async function run() {
//}

// run().catch(console.error.bind(console))