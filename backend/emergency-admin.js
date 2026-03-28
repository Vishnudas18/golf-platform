const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');
const fs = require('fs');

async function run() {
    try {
        const env = fs.readFileSync('.env', 'utf8');
        const match = env.match(/MONGO_URI=(.+)/);
        if (!match) throw new Error('MONGO_URI not found in .env');
        const uri = match[1].trim().replace(/^'|^"|'$|"$/g, '');
        
        console.log('Connecting to:', uri.split('@')[1] || 'database');
        const client = new MongoClient(uri);
        await client.connect();
        
        const db = client.db();
        const users = db.collection('users');
        
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash('GolfGives2024!', salt);
        
        const adminData = {
            name: 'GolfGives Admin',
            email: 'admin@golfgives.com',
            passwordHash: passwordHash,
            role: 'admin',
            stripeCustomerId: 'acct_mock_admin',
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        
        await users.updateOne(
            { email: 'admin@golfgives.com' },
            { $set: adminData },
            { upsert: true }
        );
        
        console.log('\n-----------------------------------');
        console.log('SUCCESS: Admin Account Ready');
        console.log('Email: admin@golfgives.com');
        console.log('Password: GolfGives2024!');
        console.log('-----------------------------------\n');
        
        await client.close();
        process.exit(0);
    } catch (err) {
        console.error('Setup failed:', err.message);
        process.exit(1);
    }
}

run();
