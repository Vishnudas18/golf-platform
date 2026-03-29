const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const setupAdmin = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        
        const email = 'admin@golfgives.com';
        const password = 'GolfGives2024!';
        
        // Use raw collection to be safe
        const db = mongoose.connection.db;
        const users = db.collection('users');
        
        console.log(`Checking for user: ${email}`);
        const user = await users.findOne({ email });
        
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);
        
        const userData = {
            name: 'GolfGives Admin',
            email: email,
            passwordHash: passwordHash,
            role: 'admin',
            stripeCustomerId: 'acct_mock_admin',
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        
        if (user) {
            console.log('Updating existing user...');
            await users.updateOne({ email }, { $set: userData });
        } else {
            console.log('Creating new admin user...');
            await users.insertOne(userData);
        }
        
        console.log('-----------------------------------');
        console.log('ADMIN ACCOUNT READY:');
        console.log(`Email: ${email}`);
        console.log(`Password: ${password}`);
        console.log('-----------------------------------');
        
        process.exit(0);
    } catch (err) {
        console.error('Setup failed:', err);
        process.exit(1);
    }
};

setupAdmin();
