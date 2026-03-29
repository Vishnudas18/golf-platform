const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please add a valid email'],
  },
  passwordHash: {
    type: String,
    required: [true, 'Please add a password'],
    select: false,
  },
  role: {
    type: String,
    enum: ['subscriber', 'admin'],
    default: 'subscriber',
  },
  charityId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Charity',
  },
  charityPercent: {
    type: Number,
    default: 10,
    min: 10,
    max: 100,
  },
  stripeCustomerId: String,
  isEmailVerified: {
    type: Boolean,
    default: false,
  },
  refreshToken: String,
}, {
  timestamps: true,
});

// Match entered password to hashed password in database
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.passwordHash);
};

// Encrypt password using bcrypt
userSchema.pre('save', async function() {
  if (!this.isModified('passwordHash')) {
    return;
  }

  // Safeguard: Do not hash if it already looks like a bcrypt hash
  // Bcrypt hashes usually start with $2a$ or $2b$
  if (this.passwordHash.startsWith('$2a$') || this.passwordHash.startsWith('$2b$')) {
    return;
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
  } catch (err) {
    throw new Error('Password hashing failed');
  }
});

module.exports = mongoose.model('User', userSchema);
