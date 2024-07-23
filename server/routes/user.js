const { Router } = require("express");
const userMiddleware = require("../middleware/user");
const { User, Job } = require("../db");
const router = Router();
const jwt = require("jsonwebtoken");
const { Jwt_Secret } = require("../config");

// User Routes
router.post('/signup', async (req, res) => {
    const { email, password } = req.body; 
console.log(req.body);
    try {
        // Create the new user
        const user = await User.create({ email, password }); 
        res.json({ message: 'User created successfully' });
    } catch (error) {
       console.log(error);  
       if (error.code === 11000) { 
            // duplicate key error 
           
            res.status(400).json({ message: 'Email already exists' });
        } else {
            console.error('Error creating user:', error);
            res.status(500).send({ message: 'Internal Server Error' });
        }
    }
});

router.post('/login', async(req, res) => {
    const { username, password } = req.body;

    const user = await User.findOne({ username, password });

    if (user) {
        const token = jwt.sign({ username, password }, Jwt_Secret);
        res.json({ token });
    } else {
        res.status(404).json({ message: 'Not a valid user' });
    }
});

router.get('/jobs', async(req, res) => {
    const jobs = await Job.find({});
    res.json({ jobs });
});

router.post('/apply/:jobId', userMiddleware, async (req, res) => {
    try {
        console.log('req.user:', req.user); // Log req.user
        const userId = req.user._id;
        const jobId = req.params.jobId;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.appliedJobs.push(jobId);
        await user.save();

        res.json({ message: 'Job application submitted successfully, we will reach out soon' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Internal Server Error' });
    }
});


router.get('/appliedJobs', userMiddleware, async(req, res) => {
    const userId = req.user._id;
    const user = await User.findById(userId).populate('appliedJobs');
    res.json({ appliedJobs: user.appliedJobs });
});

module.exports = router;
