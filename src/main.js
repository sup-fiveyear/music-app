import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import { defaultImage } from "common/js/config";
import VueLazyload from "vue-lazyload";

import "common/stylus/index.styl";

Vue.use(VueLazyload, {
  loading: defaultImage
});

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
