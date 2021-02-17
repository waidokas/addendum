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
							select app.id, app.start, app.end, app.patient_name, app.procedure
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
	getAppointments,
	migrate
}
