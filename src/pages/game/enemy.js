export let enemyAll = {
  1: {
    name: '火',
    blood: 11, // 血
    shield: 1, // 盾
    currentBlood: 11,
  },
};

export let enemyTeam1 = [
  {...enemyAll[1]},
  {...enemyAll[1]},
  {...enemyAll[1]},
];
