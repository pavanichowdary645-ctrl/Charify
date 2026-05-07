require('dotenv').config();
const mongoose = require('mongoose');
const Cause = require('./models/Cause');

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected');

  await Cause.updateOne(
    { title: 'Earthquake Relief \u2014 Rebuild Homes' },
    { $set: { image: 'https://plus.unsplash.com/premium_photo-1716985683568-b05f58cc5c87?q=80&w=715&auto=format&fit=crop' } }
  );
  console.log('\u2705 Earthquake Relief image updated');
  process.exit(0);
}

run().catch(err => { console.error(err); process.exit(1); });
