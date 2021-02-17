const express = require('express');
const db = require('./db')

const router = express.Router()

router.get('/', function (req, res) {
	res.send('TEST')
})

router.get('/test', db.test)

router.get('/appointments', db.getAppointments)

router.get('/migrate', db.migrate)

module.exports = router;
