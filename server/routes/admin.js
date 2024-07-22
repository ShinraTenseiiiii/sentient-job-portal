const { Router } = require("express");
const adminMiddleware = require("../middleware/admin");
const { Admin, Job } = require("../db");
const router = Router();
const jwt = require("jsonwebtoken");
const { Jwt_Secret } = require("../config");

router.post('/signup', async(req, res) => {
    const { username, password } = req.body;
    await Admin.create({ username, password });
    res.json({ message: 'Admin created successfully' });
});

router.post('/signin', async(req, res) => {
    const { username, password } = req.body;

    const user = await Admin.findOne({ username, password });

    if (user) {
        const token = jwt.sign({ username, password }, Jwt_Secret);
        res.json({ token });
    } else {
        res.status(404).json({ message: 'Not a valid user' });
    }
});

router.post('/jobs', adminMiddleware, async(req, res) => {
    const { title, description, cvLink, salary } = req.body;

    const newJob = await Job.create({ title, description, cvLink, salary });
    res.json({ message: 'Job created', jobId: newJob._id });
});

router.get('/jobs', adminMiddleware, async(req, res) => {
    const jobListings = await Job.find({});
    res.json({ jobListings });
});

module.exports = router;
