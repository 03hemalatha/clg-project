import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './src/models/User.js';
import connectDB from './src/config/db.js';

dotenv.config();

const createUser = async () => {
  try {
    await connectDB();
    
    // Check if user exists
    const existingUser = await User.findOne({ email: 'sameer@gmail.com' });
    
    if (existingUser) {
      console.log('❌ User already exists!');
      console.log('Email:', existingUser.email);
      console.log('Role:', existingUser.role);
      process.exit(0);
    }
    
    // Create new user
    const user = await User.create({
      name: 'Sameer',
      email: 'sameer@gmail.com',
      password: 'sameer123', // Change this to your desired password
      role: 'STUDENT', // Change to 'FACULTY' or 'ADMIN' if needed
      studentId: 'STU004',
      department: 'Computer Science',
    });
    
    console.log('✅ User created successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Name:', user.name);
    console.log('Email:', user.email);
    console.log('Password: sameer123');
    console.log('Role:', user.role);
    console.log('Student ID:', user.studentId);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

createUser();
