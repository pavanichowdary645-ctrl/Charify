require('dotenv').config();
const mongoose = require('mongoose');
const Cause = require('./models/Cause');

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected');

  await Cause.updateOne(
    { title: 'Plant a Million Trees' },
    { $set: { image: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=600&q=80' } }
  );
  console.log('✅ Plant a Million Trees updated');

  await Cause.updateOne(
    { title: 'Earthquake Relief \u2014 Rebuild Homes' },
    { $set: { image: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=600&q=80' } }
  );
  console.log('✅ Earthquake Relief updated');

  process.exit(0);
}

run().catch(err => { console.error(err); process.exit(1); });
