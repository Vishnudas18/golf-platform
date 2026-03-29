const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');

dotenv.config();

const listUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/golfdb');
        console.log('MongoDB Connected...');

        const users = await User.find({}, 'name email role');
        console.log('--- User List ---');
        users.forEach(u => {
            console.log(`- ${u.name} (${u.email}) Role: [${u.role}]`);
        });
        console.log('-----------------');
        
        await mongoose.disconnect();
        process.exit(0);
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
};

listUsers();
