import axios from "axios";
import { HOST } from "@/common/js/config";

/**
 * 发起对全部歌手的数据请求
 *
 * @export
 * @param {number} [limit=100] 希望请求数量的上线
 * @returns
 */
export function getArtists(limit = 100) {
  //TODO: 什么时候使用 encodeURIComponent encodeURI?
  const url = `${HOST}/top/artists?limit=${limit}`;
  return axios.get(url);
}

export function getSingerDetail(singerId) {
  const url = HOST + `/artists?id=${singerId}`

  return axios.get(url)
}
