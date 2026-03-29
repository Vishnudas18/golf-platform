const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Charity = require('../models/Charity');

dotenv.config();

const charities = [
  {
    name: 'Save the Oceans',
    slug: 'save-the-oceans',
    description: 'Protecting marine life and cleaning our oceans through innovative technology and community action.',
    website: 'https://oceansave.org',
    logo: 'https://images.unsplash.com/photo-1582967788606-a171c1070dd9?auto=format&fit=crop&q=80&w=400',
    isActive: true,
    isFeatured: true
  },
  {
    name: 'Green Earth Initiative',
    slug: 'green-earth',
    description: 'Reforestation and renewable energy projects to combat climate change globally.',
    website: 'https://greenearth.org',
    logo: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=400',
    isActive: true,
    isFeatured: false
  },
  {
    name: 'Tech for All',
    slug: 'tech-for-all',
    description: 'Providing technology education and resources to underprivileged communities worldwide.',
    website: 'https://techforall.org',
    logo: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&q=80&w=400',
    isActive: true,
    isFeatured: true
  }
];

const seedCharities = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected to seed charities...');

    for (const charity of charities) {
      await Charity.findOneAndUpdate(
        { slug: charity.slug },
        charity,
        { upsert: true, new: true }
      );
    }

    console.log('Charities seeded successfully!');
    process.exit();
  } catch (error) {
    console.error('Error seeding charities:', error.message);
    process.exit(1);
  }
};

seedCharities();
