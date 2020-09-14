require('./connect-mongo')
const express = require('express')
const bodyParser = require('body-parser')
const router = require('./router')
const path = require('path')
const staticFolderPath = path.join(__dirname, 'public')

const app = express()
const port = process.env.PORT || 8080

app.use(bodyParser.json())

app.use('/', express.static(staticFolderPath))

app.use(router)

app.use((err, req, res, next) => {
  let message = err.message
  let stack = err.stack
  res.status(400)
    .json({ message, stack })
})

app.listen(port, (err) => console.log(err || 'Server open at port ' + port))
