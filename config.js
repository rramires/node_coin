const production = false;
const DIFFICULTY = production ? 6 : 4;
const MINE_RATE = production ? 600000 : 3000; // 10 min ou 3 seg

module.exports = { DIFFICULTY, MINE_RATE };