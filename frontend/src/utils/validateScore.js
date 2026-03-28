export const validateScore = (value) => {
  if (!value) return { valid: false, message: 'Score is required' };
  const num = Number(value);
  if (num < 1 || num > 45) {
    return { valid: false, message: 'Score must be between 1 and 45' };
  }
  return { valid: true };
};
