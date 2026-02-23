/**
 * SmartQueue — Seed Admin Account
 * Run once: node seed-admin.js
 * Creates an admin user you can use to log in via the Admin panel.
 */

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

const ADMIN_EMAIL = 'admin@smartqueue.ai';
const ADMIN_PASSWORD = 'admin123';
const ADMIN_NAME = 'SmartQueue Admin';

async function seed() {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/smartqueue');
    console.log('✅ MongoDB connected');

    const existing = await User.findOne({ email: ADMIN_EMAIL });
    if (existing) {
        console.log('ℹ️  Admin account already exists:', ADMIN_EMAIL);
        process.exit(0);
    }

    const hash = await bcrypt.hash(ADMIN_PASSWORD, 10);
    await User.create({ name: ADMIN_NAME, email: ADMIN_EMAIL, password: hash, role: 'admin' });

    console.log('\n🎉 Admin account created!');
    console.log('   Email   :', ADMIN_EMAIL);
    console.log('   Password:', ADMIN_PASSWORD);
    console.log('\nUse these credentials in the Admin Login panel of fssm.html\n');
    process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });
