const Pool = require('pg').Pool
const sql = require('./migrations/createData').sql

const pool = new Pool({
	connectionLimit: 100,
	host: 'localhost',
	user: 'db_user',
	password: 'db_password',
	database: 'db_user'
});


const test = (request, response) => {
	pool.query('SELECT 1+1', (error, results) => {
		if (error) {
			throw error
		}
		response.status(200).json('all is fine!')
	})
}

const getAppointments = (request, response) => {
	pool.query(`select 
					doc.id, 
					doc.name,
					doc.role,
					doc.pic,
					(select array_to_json(array_agg(row_to_json(x))) from 
						(
							select app.id, app.start, app.end, app.patient_name as patient_name, app.procedure
							from appointments as app WHERE  app.doctor_id = doc.id
						) as x
					) as appointments	
				from doctors as doc`,
		(error, results) => {
			if (error) {
				throw error
			}
			response.status(200).json(results.rows)
		})
}

const addAppointment = (request, response) => {
	const patientName = request.body.patient_name
	const procedure = request.body.procedure
	const start = request.body.start
	const end = request.body.end
	const doctorId = request.body.doctor_id

	pool.query(`INSERT INTO appointments (start, "end", patient_name, procedure, doctor_id) 
				VALUES ($1, $2, $3, $4, $5)
				RETURNING id`,
		[
			start,
			end,
			patientName,
			procedure,
			doctorId
		], (err, results) => {
			if (err) return response.status(500).json({
				type: 'error',
				message: 'db error',
				err
			})
			if (results.length == 0) return response.status(404).json({
				type: 'error',
				message: "Appointment couldn't be created"
			})
			return response.status(200).json({
				type: 'success',
				id: results.rows[0].id,
				rows: results.rowCount,
				message: "Appointment is created"
			})
		})
}

const putAppointment = (request, response) => {
	const appId = request.body.id
	if (!appId) return response.status(400).json({
		type: 'error',
		message: 'Appointment ID is missing.'
	})

	const patientName = request.body.patient_name
	const procedure = request.body.procedure
	const start = request.body.start
	const end = request.body.end

	pool.query(`UPDATE appointments SET 
					start=$2, "end"=$3, patient_name=$4, procedure=$5
				WHERE id=$1`,
		[
			appId,
			start,
			end,
			patientName,
			procedure
		], (err, results) => {
			if (err) return response.status(500).json({
				type: 'error',
				message: 'db error',
				err
			})
			if (results.length == 0) return response.status(404).json({
				type: 'error',
				message: "Appointment couldn't be updated"
			})
			return response.status(200).json({
				type: 'success',
				rows: results.rowCount,
				message: "Appointment is updated"
			})
		})
}

const deleteAppointment = (request, response) => {
	const appId = request.body.id
	if (!appId) return response.status(400).json({
		type: 'error',
		message: 'Appointment ID is missing.'
	})

	pool.query('DELETE FROM appointments WHERE id=$1', [appId], (err, results) => {
		if (err) return response.status(500).json({
			type: 'error',
			message: 'db error',
			err
		})
		if (results.length == 0) return response.status(404).json({
			type: 'error',
			message: "Appointment couldn't be deleted"
		})
		return response.status(200).json({
			type: 'success',
			rows: results.rowCount,
			message: "Appointment is deleted"
		})
	})
}

const migrate = (request, response) => {
	pool.query(sql, (error, results) => {
		if (error) {
			throw error
		}
		response.status(200).json(results)
	})
}

module.exports = {
	test,
	migrate,
	getAppointments,
	addAppointment,
	putAppointment,
	deleteAppointment
}
