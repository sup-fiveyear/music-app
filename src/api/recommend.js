import axios from "axios";
import { HOST } from "../common/js/config";




export function getRecommendListDetail (id) {
  const url = HOST + `/playlist/detail?id=${id}`
  return axios.get(url)
}

/**
 * 获取轮播图数据
 * @returns {Promise<AxiosResponse<any>>}
 */
export function getBanner () {
  const url = HOST + '/banner'
  return axios.get(url)
}

/**
 * 获取最新歌曲
 * @returns {Promise<AxiosResponse<any>>}
 */
export function getRecommendSongs() {
  const url = HOST + "/personalized/newsong"
  return axios.get(url)
}

/**
 * 获取本周最热歌单，该接口无法实现下拉刷新功能
 * @returns {Promise<AxiosResponse<any>>}
 */
export function getRecommendList () {
  const url = HOST + '/personalized'
  return axios.get(url)
}
