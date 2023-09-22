export const generateRandomToken = () => Math.random().toString(36);

export const getTokenFromReq = (req) =>
  req.headers.authorization?.split(" ")[1];

export const getWinChance = (score) => (score >= 30 ? 0.4 : 0.7);

export const simulateGamble = (winChance) => Math.random() < winChance;

export const SECRET = "r2isthebest";
