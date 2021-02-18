const express = require('express');
const db = require('./db')

const router = express.Router()

router.get('/', function (req, res) {
	res.send('TEST')
})


router.get('/test', db.test)

router.get('/migrate', db.migrate)

/**
 * Appointment manipulation calls
 */
router.get('/appointments', db.getAppointments)

router.post('/appointments', db.addAppointment)

router.put('/appointments', db.putAppointment)

router.delete('/appointments', db.deleteAppointment)



module.exports = router;
