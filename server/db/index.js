const mongoose = require('mongoose');

async function connectToMongoDB() {
    const url = 'mongodb+srv://Joydeep:FeMH83FYwpJuuJTq@sentient.m9yxcx5.mongodb.net/sentient';
    const clusterName = url.split('@')[1].split('.')[0];
    const dbName = url.split('/').pop().split('?')[0];

    try {
        await mongoose.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log(`Connected to MongoDB cluster: ${clusterName}, database: ${dbName}`);
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
}

connectToMongoDB();

const AdminSchema = new mongoose.Schema({
    username: String,
    password: String
});

const UserSchema = new mongoose.Schema({
    email: String,
    password: String,
    appliedJobs: [
        {
            type: mongoose.Schema.Types.ObjectId,  // the objectId is from the Job table 
            ref: 'Job'
        }
    ]
});

const JobSchema = new mongoose.Schema({
    title: String,
    description: String,
    salary: Number
});

const Admin = mongoose.model('Admin', AdminSchema);
const User = mongoose.model('User', UserSchema);
const Job = mongoose.model('Job', JobSchema);

module.exports = {
    Admin,
    User,
    Job
};
