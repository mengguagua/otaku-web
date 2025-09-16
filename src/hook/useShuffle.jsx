import { useMemo } from "react";

// Fisher–Yates shuffle
function shuffle(array) {
  const arr = array.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * 所有以 use 开头的函数，React 默认它是一个 Hook。
 * Hook: useShuffle
 * @param {Array} array - 输入数组
 * @param {any[]} deps - 可选依赖（默认依赖 array 本身）
 * @returns {Array} 打乱后的数组
 * useMemo，用来缓存一个计算结果。第二个参数是一个数组，当数组中的依赖项发生变化时，才会重新计算。
 * 如果 useShuffle(items)只传一个参数： 那么 array = items，deps 没有传值，于是会用默认值 deps = [array]，也就是 deps = [items]。如果使用时候给第二个值，就取第二个值
 */
export function useShuffle(array, deps = [array]) {
  return useMemo(() => shuffle(array), deps);
}
