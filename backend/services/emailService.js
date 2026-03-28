const transporter = require('../config/nodemailer');

const sendWelcomeEmail = async (user) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: user.email,
    subject: 'Welcome to GolfGives!',
    html: `<h1>Welcome, ${user.name}!</h1><p>Thank you for joining GolfGives. Start tracking your scores and winning prizes today.</p>`,
  };
  await transporter.sendMail(mailOptions);
};

const sendDrawResultEmail = async (user, drawResult) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: user.email,
    subject: `GolfGives Draw Result - ${drawResult.month}/${drawResult.year}`,
    html: `<h1>Results are in!</h1><p>Numbers drawn: ${drawResult.drawnNumbers.join(', ')}</p>`,
  };
  await transporter.sendMail(mailOptions);
};

const sendWinnerEmail = async (user, prize) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: user.email,
    subject: 'You are a GolfGives Winner!',
    html: `<h1>Congratulations, ${user.name}!</h1><p>You have won £${prize.toFixed(2)} in our monthly draw. Please log in to your dashboard to claim your prize.</p>`,
  };
  await transporter.sendMail(mailOptions);
};

const sendSubscriptionConfirmation = async (user, plan) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: user.email,
    subject: 'Subscription Confirmed - GolfGives',
    html: `<h1>Subscription Active!</h1><p>Your ${plan} subscription is now active. Good luck with the draws!</p>`,
  };
  await transporter.sendMail(mailOptions);
};

module.exports = {
  sendWelcomeEmail,
  sendDrawResultEmail,
  sendWinnerEmail,
  sendSubscriptionConfirmation,
};
