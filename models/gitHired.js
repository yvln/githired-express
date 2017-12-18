const bcrypt = require('bcryptjs'),
      db = require('../db/config'),
      axios = require('axios');

const Jobs = {};

Jobs.search = (req, res, next) => {
        // desc/loc can be any string
        // full_time has to be a boolean
        // gitHub jobs search
        const { jobDescription, jobLocation, full_time } = req.body;

        const jobsData = [];
        axios.get(`https://jobs.github.com/positions.json?description=${jobDescription}&location=${jobLocation}&full_time=${full_time}`)
            .then(gitHubjobData => {
                // console.log('jobData is ', gitHubjobData.data);
                gitHubjobData.data.forEach(job => {
                    let job_id = job.id;
                    let created_at = job.created_at;
                    let title = job.title;
                    let location = job.location;
                    let type = job.type;
                    let description = job.description;
                    let how_to_apply = job.how_to_apply;
                    let company = job.company;
                    let company_url = job.company_url;
                    let company_logo = job.company_logo;
                    let url = job.url;
                    jobsData.push({
                        searched_on: "GitHub Jobs",
                        job_id: job_id,
                        created_at: created_at,
                        title: title,
                        location: location,
                        type: type,
                        description: description,
                        how_to_apply: how_to_apply,
                        company: company,
                        company_url: company_url,
                        company_logo: company_logo,
                        url: url,
                    }) //end of push
                }) //end of forEach
                res.locals.jobsData = jobsData;
                next();
            }).catch(err => { console.log('error in jobs.search', err) })
    },

    Jobs.salary = (req, res, next) => {

        const { jobDescription, jobLocation, country } = req.body;
        // console.log("jobDescription",jobDescription);
        // console.log("jobLocation",jobLocation);
        // console.log("country",country);
        // country being determined by drop down in search field on front-end
        axios.get(`https://api.adzuna.com:443/v1/api/jobs/${country}/history?app_id=${process.env.ADZUNA_AP_ID}&app_key=${process.env.ADZUNA_API_KEY}&what=${jobDescription}&where=${jobLocation}&months=12`)
            .then(salaryData => {
                console.log('salaryData is ', salaryData.data.month);
                const emptyObject = [];
                for (let i in salaryData.data.month) {
                    emptyObject.push(i)
                }
                if (emptyObject.length === 0) {
                    res.locals.salaryData = { salaryData: [] }
                } else {
                    res.locals.salaryData = { salaryData: salaryData.data.month };
                }
                next();
            }).catch(err => {
              console.log('error in jobs.salary', err),
              console.log(`https://api.adzuna.com:443/v1/api/jobs/${country}/history?app_id=${process.env.ADZUNA_AP_ID}&app_key=${process.env.ADZUNA_API_KEY}&what=${jobDescription}&where=${jobLocation}&months=12`)
              })

    },


    Jobs.findAll = (req, res, next) => {
        const user_id = req.params.id;
        db.manyOrNone('SELECT * FROM jobs_data WHERE user_id = $1', [user_id])
            .then(jobs => {
                res.locals.jobs = jobs;
                console.log('jobs from findAll: ', jobs)
                next();
            })
            .catch(err => {
                console.log(`Error returning all: ${err}`)
            })
    },

    Jobs.findById = (req, res, next) => {
        const { id } = req.params;
        db.one(`SELECT * FROM jobs_data WHERE id = $1`, [id])
            .then(oneJobData => {
                res.locals.oneJobData = oneJobData;
                next();
            })
    },

    Jobs.create = (req, res, next) => {
        const {
            user_id,
            searched_on,
            job_id,
            created_at,
            title,
            location,
            type,
            description,
            how_to_apply,
            company,
            company_url,
            company_logo,
            url,
            contacted,
            contacted_on,
            contact_name,
            contact_email,
            contact_role,
            contact_number,
            applied,
            applied_on,
            notes,
            date_of_last_edit
        } = req.body;

        db.one(`INSERT INTO jobs_data (
        	user_id,
        	searched_on,
				  job_id,
				  created_at,
				  title,
				  location,
				  type,
				  description,
				  how_to_apply,
				  company,
				  company_url,
				  company_logo,
				  url,
				  contacted,
				  contacted_on,
				  contact_name,
				  contact_email,
				  contact_role,
				  contact_number,
				  applied,
				  applied_on,
				  notes,
				  date_of_last_edit
        	)
    		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23) returning *`, [
    			    user_id,
              searched_on,
              job_id,
              created_at,
              title,
              location,
              type,
              description,
              how_to_apply,
              company,
              company_url,
              company_logo,
              url,
              contacted,
              contacted_on,
              contact_name,
              contact_email,
              contact_role,
              contact_number,
              applied,
              applied_on,
              notes,
              date_of_last_edit
            ])
            .then(newJob => {
                res.locals.newJob = newJob;
                next();
            })
            .catch(err => console.log(err));
    },

    Jobs.saveResults = (req, res, next) => {
        // data come through front end on the API
        // save the data in state on front end
        // send saved data back to back-end as req.body
        // jobs_data[0] will be replaced by req.body
        const { user_id, searched_on, job_id, created_at, title, location, type, description, how_to_apply, company, company_url, company_logo, url } = req.body;
        db.one(
            `INSERT INTO jobs_data (user_id,
																	  searched_on,
																	  job_id,
																	  created_at,
																	  title,
																	  location,
																	  type,
																	  description,
																	  how_to_apply,
																	  company,
																	  company_url,
																	  company_logo,
																	  url)
							VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) returning *`,
              [user_id, searched_on, job_id, created_at, title, location, type, description, how_to_apply, company, company_url, company_logo, url]
        )
        next();

    },

    Jobs.update = (req, res, next) => {

        const id = req.params.jobId;

        const {
            searched_on,
            job_id,
            created_at,
            title,
            location,
            type,
            description,
            how_to_apply,
            company,
            company_url,
            company_logo,
            url,
            contacted,
            contacted_on,
            contact_name,
            contact_email,
            contact_role,
            contact_number,
            applied,
            applied_on,
            notes,
            date_of_last_edit
        } = req.body;

        db.one(
            `UPDATE jobs_data
              SET searched_on = $1, job_id = $2, created_at = $3, title = $4, location = $5,
              type = $6, description = $7, how_to_apply = $8, company = $9, company_url = $10,
              company_logo = $11, url = $12, contacted = $13, contacted_on = $14, contact_name = $15,
              contact_email = $16, contact_role = $17, contact_number = $18, applied = $19, applied_on = $20,
              notes = $21, date_of_last_edit = $22
              WHERE id = $23 returning *`,
              [
                searched_on,
                job_id,
                created_at,
                title,
                location,
                type,
                description,
                how_to_apply,
                company,
                company_url,
                company_logo,
                url,
                contacted,
                contacted_on,
                contact_name,
                contact_email,
                contact_role,
                contact_number,
                applied,
                applied_on,
                notes,
                date_of_last_edit,
                id]
        ).then((editedJobsData) => {
            res.locals.editedJobsData = editedJobsData;
            next();
        });

    },

    Jobs.destroy = (req, res, next) => {

    const id = req.params.jobId;
    db.none(
        'DELETE FROM jobs_data WHERE id = $1', [id]
    ).then(() => {
        next();
    }).catch(err => {
        console.log(`ERROR AT DESTROY MODEL: ${err}`);
    })

} // end of destroy


module.exports = Jobs;
