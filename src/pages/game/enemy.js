export let enemyAll = {
  1: {
    name: '火',
    blood: 7, // 血
    shield: 1, // 盾
    attack: 2,
    currentBlood: 7,
  },
};

export let enemyTeam1 = [
  {...enemyAll[1]},
  {...enemyAll[1]},
  {...enemyAll[1]},
];
