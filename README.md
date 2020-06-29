# 说明

## 在线预览

## 本地运行

## 项目结构

# 总结

## 命名规范

## 代码组织

### vuex

## 业务组件

### 推荐页面

TODO:
热门歌曲副标题 - 浅色

播放 icon

### 歌手速览

通过该页面的学习和开发，总结如下收获：

- 定制化数据处理
- 联动组件
  - 字母表交互：拖动、单点，实时更新内容区域
  - 内容区域交互：拖动，实时更新字母表
- vuex 处理路由间传参
- 通讯录/排行榜/地区搜索等功能的开发思路

#### 格式化数据

需要对数据进行**格式化**操作，主要用于分组展示歌手，以及字母表的渲染。

- 通过统一的 Singer 类，对歌手数据进行封装
- 对歌手数据处理分组：
  - 获取歌手拼音后记录首字母，为标题展示提供数据。
  - 对歌手进行分组，已首字母为基准。
  - 根据首字母的[ASCII 码进行排序](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/charAt)
- 默认前十条数据为热门歌手
  - 将热门数据放入处理好的数据首位

#### 长列表滚动

由于前期对 BetterScroll 组件进行了封装，在这里直接调用该组件即可。

#### 组件联动

**内容区域拖动，能够实时更新字母表的功能实现思路可以归纳如下步骤：**

1. 获取当前滚动位置
2. 计算每个歌手区间`[热门，Z]`的高度，存储到数组中
3. 监控 scrollY 的变化，计算滚动位置对应的索引值
4. 传递给字母表，使其改变高亮对应的索引项

> 代码中已用 NOTE x 标注了逻辑顺序，在当前文件中通过 todoTree 进行标签筛选，即可快速代码逻辑

**点击字母表，跳转到对应的歌手区间功能的实现思路，归纳如下步骤：**

1. 在遍历生成每个字母时，向 dom 元素上挂载`data-index = index`
2. 监听`touchstart`事件，当触发事件时取出 index，映射回歌手列表
3. 调用 betterScroll 封装好的滚动接口，滚动到指定位置即可

**拖动字母表，动态更新歌手区间和高亮字母表，归纳如下步骤：**

1. 记录`touchstart`事件触发时的索引（anchorIndex）和 y 轴坐标 y1
2. 监听`touchmove`事件，当最后一次触发时其 y 轴坐标(y2)和 y1 进行 diff，取出差值
3. 拿差值 / ANCHOR_HEIGHT 并向下取整，得到的就是当前**移动的索引数量**（delta）
4. 取 anchorIndex 和 delta 相加后得到即为最终的索引位置
5. 调用 betterScroll 封装好的接口，将歌手区间移动到指定位置即可
6. 当歌手区间发生移动后 scrollY 随之改变，会自动计算对应到字母表中的高亮索引并更新

#### vuex 处理路由间传参

当点击某一歌手后，需要跳转到二级路由 -> 歌手详情页面。

可以通过 vuex 来管理歌手信息，这样当路由发生跳转的同时会将数据存储到 vuex 中，当下一个事件循环渲染组件时即可拿到歌手数据。

TODO: 移动端 手势移动触发顺序

## 基础组件

### ArtistsView

- 用于展示歌手页面的傻瓜组件
- 该组件接受一个数组作为数据源
- 布局结构采用经典的 `ul + flex` 来实现。
- 交互功能已在联动组件部分进行总结，这里不做赘述。

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
  currentIndex: -1

  /*mode =>>
  sequence: 0, 顺序播放
  loop: 1, 单曲循环
  random: 2 随机播放
*/
};
```

最后把额外对应的 mutations 以及 mutations-types 进行编写，对于 actions 等到需要有 **异步请求** 或 **合并多个 mutations** 时在写~

在设计组件状态时，跟黄哥学到了一条规则：**state 中只保存最底层的数据，对数据的计算全部移入到 getter 中。**

例如在状态中定义了 `currentIndex` 标识当前歌曲播放的索引，可以通过 `playlist[currentIndex]` 获取对应的歌曲名。

```js
/getters.js

export const currentSong = (state) => {
  return state.playlist[state.currentIndex] || {}
}
```

#### 拆分

可以拆分如下步骤：

1. 搭建播放器基础页面
2. 调通 vuex 状态流，并获取正确数据
3. 初步增加播放器交互事件
   - 收起、弹出播放器
   - 控制 radio 的播放状态
4. 歌曲前进后退功能
5. 进度条功能
6. 播放顺序以及收藏功能

### v-lazy 实现原理

### 封装高可用轮播图组件

## css 总结

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
