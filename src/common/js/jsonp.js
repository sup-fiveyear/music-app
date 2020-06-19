import originJsonp from "jsonp";

/**
 *
 * @param url 纯净的url
 * @param data 请求携带的参数
 * @param option 配置信息，详见jsonp库提供的配置
 */
export default function jsonp(url, data, option) {
  url += (url.indexOf("?") > 0 ? +"&" : "?") + flatData(data);
  return new Promise((resolve, reject) => {
    originJsonp(url, option, (err, data) => {
      if (err) {
        reject(err);
      }
      resolve(data);
    });
  });

  /**
   * - 拉平数据，并进行url拼接
   * - ！只支持一层拉平操作
   * @param data
   * @returns {string | string}
   */
  function flatData(data) {
    let url = "";
    for (let d in data) {
      //  兼容undefined
      let value = data[d] !== undefined ? d : "";
      url += `&${d}=${encodeURIComponent(value)}`;
    }
    console.log(`flatData处理完的url为 ${url}`);
    console.log(`url.substring(1)结果为：${url.substring(1)}`);
    let resUrl = url ? url.substring(1) : "";
    return resUrl;
  }
}
