export default class Song {
  constructor({ id, mid, singer, name, album, duration, image, url, aliaName }) {
    this.id = id;
    this.singer = singer;
    this.name = name;
    this.album = album;
    this.aliaName = aliaName;
    // this.duration = duration
    this.image = image
  }
}
/**
 * 对数据中歌手名字做拼接
 * @param arr
 * @returns {string}
 */
function singerName(arr) {
  let name = [];
  name = arr.map((item) => {
    return item.name
  });
  return name.join('/')
}

export function createSong(music) {
  return new Song({
    id: music.id,
    singer: singerName(music.ar),
    name: music.name,
    album: music.al.name,
    image: music.al.picUrl,
    test: '1'
  })
}

/**
 * 格式化推荐歌曲数据
 * @param music
 * @returns {Song}
 */
export function createRecommendSong(music) {
  return new Song({
    id: music.id,
    name: music.name,
    image: music.picUrl,
    singer: singerName(music.song.artists),
  })
}

export function createSearchSong(music) {
  return new Song({
    id: music.id,
    singer: singerName(music.artists),
    name: music.name,
    album: music.album.name,
    image: music.artists[0].img1v1Url
  })
}
