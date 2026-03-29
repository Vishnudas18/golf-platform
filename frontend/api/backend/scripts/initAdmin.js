const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');

dotenv.config();

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/golfdb');
        console.log('MongoDB Connected to create admin...');

        const adminExists = await User.findOne({ email: 'admin@digitalheroes.com' });
        if (adminExists) {
            console.log('Admin user already exists!');
            process.exit(0);
        }

        const admin = await User.create({
            name: 'Digital Heroes Admin',
            email: 'admin@digitalheroes.com',
            passwordHash: 'Admin123!', // Hashed automatically by User model pre-save hook
            role: 'admin',
            isEmailVerified: true
        });

        console.log('Admin User Created Successfully:');
        console.log('Email: admin@digitalheroes.com');
        console.log('Password: Admin123!');
        
        await mongoose.disconnect();
        process.exit(0);
    } catch (error) {
        console.error('Error creating admin:', error.message);
        process.exit(1);
    }
};

createAdmin();
