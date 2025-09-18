import { useMemo } from "react";

/**
 * useSplitArray - 将数组分成 n 份的 Hook
 * @param {Array} arr - 要分组的数组
 * @param {number} n - 分成几份，默认4等分
 * @returns {Array[]} - 分组后的二维数组,除不尽的最后一组拿剩余元素
 */
export function useSplitArray(arr, n = 4) {
  return useMemo(() => {
    if (!Array.isArray(arr)) return [];
    if (n <= 0) return [];

    const len = arr.length;
    const baseSize = Math.floor(len / n);
    const result = [];

    for (let i = 0; i < n; i++) {
      if (i < n - 1) {
        result.push(arr.slice(i * baseSize, (i + 1) * baseSize));
      } else {
        result.push(arr.slice(i * baseSize)); // 最后一组拿剩余元素
      }
    }

    return result;
  }, [arr, n]);
}
