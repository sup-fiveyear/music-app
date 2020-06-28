const createRandom = (lowerBound,upperBound) => {
  return Math.floor(Math.random() * (upperBound - lowerBound + 1) + lowerBound)
}

/**
 * 对arr进行洗牌操作，返回一个新的数组
 *
 * 没有副作用
 * @param arr
 * @returns {*}
 */
export function shuffleDeck (arr) {
  let _arr = arr.slice(0);
  for(let i = 0;i < arr.length;i++){
    let j = createRandom(0,i);
  //    交换arr[i] 和 arr[j]
    [_arr[i],_arr[j]] = [_arr[j],_arr[i]];
  }
  return _arr;
}
