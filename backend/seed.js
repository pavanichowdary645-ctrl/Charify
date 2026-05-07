require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Cause = require('./models/Cause');

const causes = [
  {
    title: 'Clean Water for Rural Villages',
    description: 'Providing clean and safe drinking water to over 5,000 families in remote rural areas who currently rely on contaminated water sources.',
    category: 'Health',
    goalAmount: 50000,
    raisedAmount: 32400,
    image: 'https://images.unsplash.com/photo-1541544537156-7627a7a4aa1c?w=600&q=80',
  },
  {
    title: 'Education for Every Child',
    description: 'Building schools and providing scholarships to underprivileged children in underserved communities to ensure quality education for all.',
    category: 'Education',
    goalAmount: 80000,
    raisedAmount: 61000,
    image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&q=80',
  },
  {
    title: 'Plant a Million Trees',
    description: 'Combating deforestation and climate change by planting one million trees across degraded forest lands and urban areas.',
    category: 'Environment',
    goalAmount: 30000,
    raisedAmount: 18750,
    image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=600&q=80',
  },
  {
    title: 'Feed the Hungry — Daily Meals Program',
    description: 'Delivering nutritious daily meals to homeless individuals and families living in poverty across the city.',
    category: 'Food',
    goalAmount: 20000,
    raisedAmount: 19100,
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80',
  },
  {
    title: 'Earthquake Relief — Rebuild Homes',
    description: 'Emergency relief and reconstruction support for thousands of families who lost their homes in the recent devastating earthquake.',
    category: 'Disaster Relief',
    goalAmount: 120000,
    raisedAmount: 74500,
    image: 'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?w=600&q=80',
  },
  {
    title: 'Rescue & Rehabilitate Street Animals',
    description: 'Rescuing injured and abandoned street animals, providing veterinary care, shelter, and finding them loving forever homes.',
    category: 'Animal Welfare',
    goalAmount: 15000,
    raisedAmount: 9200,
    image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&q=80',
  },
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  // Create or reuse a seed NGO user
  let ngo = await User.findOne({ email: 'seedngo@victorypulse.com' });
  if (!ngo) {
    const hashed = await bcrypt.hash('seed1234', 10);
    ngo = await User.create({ name: 'VictoryPulse Foundation', email: 'seedngo@victorypulse.com', password: hashed, role: 'ngo' });
    console.log('NGO user created');
  }

  for (const c of causes) {
    const exists = await Cause.findOne({ title: c.title });
    if (!exists) {
      await Cause.create({ ...c, ngo: ngo._id });
      console.log(`Created: ${c.title}`);
    } else {
      console.log(`Skipped (exists): ${c.title}`);
    }
  }

  console.log('Seeding complete!');
  process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });
