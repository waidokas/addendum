const express = require('express')
var cors = require('cors')
var data = require('./data')


const app = express()
const port = 3000


app.use(cors())
app.use(express.json({
	limit: '2mb'
}))

app.use('/', data)

app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`)
})
