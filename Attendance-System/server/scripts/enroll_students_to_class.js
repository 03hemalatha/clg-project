import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../src/models/User.js';
import Class from '../src/models/Class.js';

dotenv.config({ path: './.env' });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/proxymukt';

const classCodeArg = process.argv[2] || 'CS701';

async function main() {
  try {
    console.log('Connecting to', MONGODB_URI);
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Fetching students...');
    const students = await User.find({ role: 'STUDENT' }).select('_id');
    const studentIds = students.map(s => s._id);

    console.log(`Found ${studentIds.length} students.`);

    const cls = await Class.findOne({ code: classCodeArg.toUpperCase() });
    if (!cls) {
      console.error('Class not found with code', classCodeArg);
      process.exit(1);
    }

    cls.students = studentIds;
    await cls.save();

    console.log(`Updated class ${cls.code} (${cls._id}) with ${studentIds.length} students.`);
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

main();
