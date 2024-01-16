export let cardAll = {
  1: {
    name: '剑',
    number: 4, // 数值
    element: 0, // 元素
    type: 1, // 1攻 2守
    status: 1, // 1可使用 2不可使用
  },
  2: {
    name: '盾',
    number: 3,
    element: 0,
    type: 2, // 1攻 2守
    status: 1,
  }
};

let baseCard = [
  cardAll[1],
  cardAll[1],
  cardAll[1],
  cardAll[1],
  cardAll[2],
  cardAll[2],
  cardAll[2],
];

export let fate1 = [...baseCard]
