require('dotenv').config();
const mongoose = require('mongoose');
const Cause = require('./models/Cause');

const updates = [
  {
    title: 'Clean Water for Rural Villages',
    // Clear water pouring from a tap into hands — directly about clean water access
    image: 'https://images.unsplash.com/photo-1563459802257-2a97df940f11?w=600&q=80',
  },
  {
    title: 'Education for Every Child',
    // Open books and pencils on a school desk — education theme
    image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&q=80',
  },
  {
    title: 'Plant a Million Trees',
    // Person holding a small green plant/sapling ready to plant
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&q=80',
  },
  {
    title: 'Feed the Hungry — Daily Meals Program',
    // Bowl of food / meal being prepared for distribution
    image: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=600&q=80',
  },
  {
    title: 'Earthquake Relief — Rebuild Homes',
    // Destroyed cracked wall / disaster scene
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
  },
  {
    title: 'Rescue & Rehabilitate Street Animals',
    // Dog looking up at camera — stray/rescue dog
    image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&q=80',
  },
];

async function updateImages() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');
  for (const u of updates) {
    const result = await Cause.findOneAndUpdate(
      { title: u.title },
      { image: u.image },
      { returnDocument: 'after' }
    );
    if (result) console.log(`✅ Updated: ${u.title}`);
    else console.log(`⚠️  Not found: ${u.title}`);
  }
  console.log('Done!');
  process.exit(0);
}

updateImages().catch(err => { console.error(err); process.exit(1); });
