/**
 * Admin Seed Script
 * 
 * Usage: node src/scripts/makeAdmin.js <email>
 * Example: node src/scripts/makeAdmin.js admin@example.com
 * 
 * This promotes an existing user to admin role.
 */

import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import User from '../models/User.js';

const email = process.argv[2];

if (!email) {
  console.error('Usage: node src/scripts/makeAdmin.js <email>');
  process.exit(1);
}

async function makeAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      console.error(`User not found: ${email}`);
      process.exit(1);
    }

    user.role = 'admin';
    user.isActive = true;
    await user.save();

    console.log(`✅ Successfully made ${user.name} (${user.email}) an admin.`);
    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

makeAdmin();
