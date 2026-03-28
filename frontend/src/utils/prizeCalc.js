export const estimatePrizePool = (subscriberCount, avgAmount = 25, rolledOver = 0) => {
  // total = count * avg * 0.60
  const total = subscriberCount * avgAmount * 0.60;
  
  return {
    total,
    jackpot: (total * 0.40) + rolledOver,
    fourMatchPool: total * 0.35,
    threeMatchPool: total * 0.25,
  };
};
