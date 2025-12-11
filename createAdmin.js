const mongoose = require('mongoose');
require('dotenv').config({ path: './config/.env' });
const User = require('./models/Users');

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const existing = await User.findOne({ username: 'admin' });
    if (existing) {
      console.log('Deleting old admin...');
      await User.deleteOne({ username: 'admin' });
    }

    // Notice: plain password (schema will hash it automatically)
    const admin = new User({
      username: 'admin',
      password: 'admin123',
    });

    await admin.save();
    console.log('✅ Admin created successfully with username: admin / password: admin123');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();