const matchUserScores = (userScores, drawnNumbers) => {
  if (!userScores || !drawnNumbers) return null;

  // Extract values from userScores array
  const scoreValues = userScores.map(score => score.value);
  
  // Count how many match drawnNumbers
  const matchCount = scoreValues.filter(val => drawnNumbers.includes(val)).length;

  if (matchCount === 5) return 'fiveMatch';
  if (matchCount === 4) return 'fourMatch';
  if (matchCount === 3) return 'threeMatch';

  return null;
};

module.exports = {
  matchUserScores,
};
