const calculatePool = (activeSubscribers, avgSubscriptionAmount, rolledOverJackpot) => {
  // total = activeSubscribers * avgSubscriptionAmount * 0.60
  const total = activeSubscribers * avgSubscriptionAmount * 0.60;
  
  return {
    total,
    jackpot: (total * 0.40) + rolledOverJackpot,
    fourMatchPool: total * 0.35,
    threeMatchPool: total * 0.25,
  };
};

module.exports = { calculatePool };
