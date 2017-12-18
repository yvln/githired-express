const User = require('../models/user'),

    router = require('express').Router(),
    bcrypt = require('bcryptjs'),
    Jobs = require('../models/gitHired.js');

// get all job data saved in db
router.get('/:id',
    Jobs.findAll,
    (req, res) => {
        const { jobs } = res.locals
        res.json({ allJobsData: jobs });
    });

// search gitHub jobs & adzuna jobs
router.post('/search',
    Jobs.search,
    // Jobs.salary,
    (req, res) => {
        // adzunaJobResults
        // adzunaJobs: adzunaJobResults
        const { jobsData, salaryData } = res.locals;
        res.json({ "JobsData": jobsData, "salaryData": salaryData });
    });

// route for show one job
router.get('/find/:id',
    Jobs.findById,
    (req, res) => {
        const { oneJobData } = res.locals
        res.json({ oneJobData: oneJobData });
    });

//route to save searched job to database
router.post('/save',
    Jobs.saveResults,
    (req, res) => {
        // const { savedJobResults } = res.locals;
        // console.log('saved results are ', savedJobResults);
        res.send('results saved to db');
    });

// route to edit job based on jobId
router.post('/find/:jobId/edit',
    Jobs.update,
    (req, res) => {
        const { editedJobsData } = res.locals
        res.json({ editedJobsData: editedJobsData });
    });

// route to create a new job from scratch (not saved from GitHub jobs)
router.post('/create',
	Jobs.create,
	(req, res) => {
    const { newJob } = res.locals;
    res.json({ newJob: newJob });
	});


// route to delete job
router.delete('/:jobId',
    Jobs.destroy,
    (req, res) => {
        res.send('job deleted from jobs_data');
    });


module.exports = router;
