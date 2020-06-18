## 说明

## 在线预览

## 本地运行

## 目录结构

## 沉淀

### 样式配置

#### 全局 variable 文件

首先我们需要一个 variable.styl 文件，作为所有有规律的、大范围使用的、颜色和字体等，这样能够在开发中能够降低代码的冗余性，提高代码质量。

并且在后期维护项目上，会变得相对轻松些。

#### 全局 base 文件

同 variable 文件，具有相同性质和意义。只不过其控制的范围更广一些，作为整个项目 css 样式的默认底片。

#### 暴露接口 index 文件

主要是将拆分出不同功能的 css 文件，进行整合并向外统一暴露，使得导入样式配置及其简单整洁。

#### mixin 文件

「主要是为组件提供统一的功能」将功能抽离出来，可以在多个组件中进行复用.

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

### vue-router 收获

#### router-link tag 和 active 配合
