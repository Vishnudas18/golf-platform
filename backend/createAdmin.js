const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash('adminPASS123', salt);
        
        // Use raw collection to avoid potential schema conflicts
        const User = mongoose.connection.db.collection('users');
        
        const adminExists = await User.findOne({ email: 'admin@golfgives.com' });
        if (adminExists) {
            console.log('Admin account already exists.');
            process.exit(0);
        }

        await User.insertOne({
            name: 'System Admin',
            email: 'admin@golfgives.com',
            passwordHash,
            role: 'admin',
            stripeCustomerId: 'acct_mock_admin',
            isActive: true,
            createdAt: new Date(),
            charityPercent: 10
        });

        console.log('Admin account created successfully:');
        console.log('Email: admin@golfgives.com');
        console.log('Password: adminPASS123');
        process.exit(0);
    } catch (err) {
        console.error('Error creating admin:', err);
        process.exit(1);
    }
};

createAdmin();
