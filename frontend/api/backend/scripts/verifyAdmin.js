const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');

dotenv.config();

const testLogin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/golfdb');
        console.log('MongoDB Connected...');

        const user = await User.findOne({ email: 'admin@digitalheroes.com' }).select('+passwordHash');
        if (!user) {
            console.log('User NOT found!');
            process.exit(1);
        }

        console.log('User found:', user.email);
        console.log('Role:', user.role);
        
        const isMatch = await user.matchPassword('Admin123!');
        console.log('Password match:', isMatch);

        if (!isMatch) {
            console.log('Re-hashing password manually...');
            user.passwordHash = 'Admin123!';
            await user.save();
            console.log('Password reset and saved.');
            
            const isMatchNow = await user.matchPassword('Admin123!');
            console.log('Password match after reset:', isMatchNow);
        }
        
        await mongoose.disconnect();
        process.exit(0);
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
};

testLogin();
