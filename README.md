# 说明

### 在线预览

### 本地运行

### 项目结构

# 沉淀

## 命名规范

## 代码组织

### vuex

## 业务组件

## 通用组件

## 难点总结

### 音乐播放器

#### 状态设计
通过功能分析，可以将状态拆分如下几类：(TODO: 功能截图)

- 控制播放器的状态：
    
    - 是否在播放?
    - 是否全屏展示？

- 控制播放器歌曲的状态：

    - 播放的歌曲列表？
    - 歌单的序列？
    - 播放模式？随机？顺序播放？
    - 当前播放到第几个？

- 播放器文案：
    - 待定
        
通过对播放器状态的初步分析，可以写出如下字段

```js
const state = {
  singer: {},
  playing: false,
  fullScreen: false,
  playlist: [], // 源歌单数据
  sequenceList: [],
  mode: playMode.sequence,
  currentIndex: -1,

/*mode =>>
  sequence: 0, 顺序播放
  loop: 1, 单曲循环
  random: 2 随机播放
*/
}
```

最后把额外对应的 mutations 以及 mutations-types 进行编写，对于 actions 等到需要有 **异步请求** 或 **合并多个mutations** 时在写~

在设计组件状态时，跟黄哥学到了一条规则：**state中只保存最底层的数据，对数据的计算全部移入到getter中。**

例如在状态中定义了 `currentIndex` 标识当前歌曲播放的索引，可以通过 `playlist[currentIndex]` 获取对应的歌曲名。

```js
/getters.js

export const currentSong = (state) => {
  return state.playlist[state.currentIndex] || {}
}
```

#### 播放功能

audio 延时调用audio.play方法

控制音乐



### v-lazy 实现原理

### 封装高可用轮播图组件

## css总结

### 初始化配置

#### 全局 variable 文件

首先我们需要一个 variable.styl 文件，作为所有有规律的、大范围使用的、颜色和字体等，这样能够在开发中能够降低代码的冗余性，提高代码质量。

并且在后期维护项目上，会变得相对轻松些。

#### 全局 base 文件

同 variable 文件，具有相同性质和意义。只不过其控制的范围更广一些，作为整个项目 css 样式的默认底片。

#### 暴露接口 index 文件

主要是将拆分出不同功能的 css 文件，进行整合并向外统一暴露，使得导入样式配置及其简单整洁。

#### mixin 文件

「主要是为组件提供统一的功能」将功能抽离出来，可以在多个组件中进行复用.（）

### 移动端相关

#### meta 配置

#### 300ms 点击问题

### webpack hack

#### webpack alias

不知道在项目打包部署时是否会遇到坑，先这样使用着~

```js
const path = require("path");
function resolve(dir) {
  return path.join(__dirname, dir);
}
module.exports = {
  lintOnSave: true,
  chainWebpack: config => {
    config.resolve.alias
      .set("@$", resolve("src"))
      .set("common", resolve("src/common"))
      .set("components", resolve("src/components"));
  }
};
```

#### webpack chain

[地址](https://github.com/neutrinojs/webpack-chain)，能够配置的东西太多了...

#### webpack devServer 代理请求

[DevServer](https://webpack.docschina.org/configuration/dev-server/)



### 抽离 scroll 代理组件

### keep-alive 提升性能

为什么 需要加载 router-view 上面？ 直接加到 Recommend 为什么不可以？

### vue-router 收获

#### router-link tag 和 active 配合

### 开发技巧

#### jsonp

[封装好的 jsonp](https://github.com/sup-fiveyear/jsonp),其实现原理精简为如下思路：

promisify

### css

#### 居中

```stylus
    position absolute
    width 100%
    top 50%
    transform translateY(50%)
```

#### line-height : 1
