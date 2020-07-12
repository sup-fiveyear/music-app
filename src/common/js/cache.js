import storage from 'good-storage'

const SEARCH_KEY = '__search__'
const SEARCH_MAX_LEN = 15

export function saveSearch (query) {
  // 存储所有搜索历史的数组
  let searchHistory = storage.get(SEARCH_KEY, [])
  insertArray(searchHistory, query, (item) => {
    return item === query
  }, SEARCH_MAX_LEN)
  storage.set(SEARCH_KEY, searchHistory)
  return searchHistory
}

/**
 *
 * @param arr
 * @param val
 * @param compare 外部传入的比较函数
 * @param maxLen
 */
function insertArray (arr, val, compare, maxLen) {
  const index = arr.findIndex(compare)
  if (index === 0) {
    return
  }
  if (index > 0) {
    arr.splice(index, 1)
  }
  arr.unshift(val)
  if (maxLen && arr.length > maxLen) {
    arr.pop()
  }
}

export function loadSearch () {
  return storage.get(SEARCH_KEY, [])
}

/**
 * 将storage 中所有搜索历史清空
 * @returns {*[]}
 */
export function clearSearch () {
  storage.remove(SEARCH_KEY)
  return []
}
