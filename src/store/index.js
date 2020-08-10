import Vue from 'vue'
import Vuex from 'vuex'
import rootModule from "./rootModule";
import createLogger from 'vuex/dist/logger'


Vue.use(Vuex);
const debug = process.env.NODE_ENV !== "production";

/**
 * - 通过webpack 获取当前目录下的模块目录，并匹配所有的js文件
 *
 * - 取到每一个模块暴露出的对象，以及获取模块的名称
 *
 * - 向根模块进行模块挂载，并设置命名空间为true
 */
 const moduleFiles = require.context('./modules',false,/\.js$/);

  moduleFiles.keys().forEach(moduleFile => {
    let _store = moduleFiles(moduleFile).default;

    let   modulesName =moduleFile.replace(/^\.\//, '').replace(/\.js$/, '');

    let modules = rootModule.modules = (rootModule.modules || {});
    modules[modulesName] = _store;
    modules[modulesName].namespaced = true;
  });

rootModule.plugins = debug ? [createLogger()] :[];

export default new Vuex.Store(rootModule)
