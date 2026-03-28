const runRandomDraw = () => {
  const numbers = [];
  while (numbers.length < 5) {
    const randomNum = Math.floor(Math.random() * 45) + 1;
    if (!numbers.includes(randomNum)) {
      numbers.push(randomNum);
    }
  }
  return numbers.sort((a, b) => a - b);
};

const runWeightedDraw = (allUserScores) => {
  // allUserScores is an array of all score values submitted by active subscribers
  if (!allUserScores || allUserScores.length === 0) return runRandomDraw();

  const frequencyMap = {};
  allUserScores.forEach(val => {
    frequencyMap[val] = (frequencyMap[val] || 0) + 1;
  });

  const pool = [];
  for (let i = 1; i <= 45; i++) {
    const freq = frequencyMap[i] || 0;
    // Weight = max(1, 10 - frequency)
    // Less frequent scores have more entries in the pool
    const weight = Math.max(1, 10 - freq);
    for (let j = 0; j < weight; j++) {
      pool.push(i);
    }
  }

  const numbers = [];
  while (numbers.length < 5) {
    const randomIndex = Math.floor(Math.random() * pool.length);
    const selectedNum = pool[randomIndex];
    if (!numbers.includes(selectedNum)) {
      numbers.push(selectedNum);
    }
  }

  return numbers.sort((a, b) => a - b);
};

module.exports = {
  runRandomDraw,
  runWeightedDraw,
};
