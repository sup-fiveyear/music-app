import Vue from "vue";
import VueRouter from "vue-router";
import Reacommend from "components/recommend/recommend";
import Search from "components/search/search";
import Singer from "components/singer/singer";
import Rank from "components/rank/rank";
Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    redirect: "/recommend"
  },
  {
    path: "/recommend",
    component: Reacommend
  },
  {
    path: "/search",
    component: Search
  },
  {
    path: "/singer",
    component: Singer
  },
  {
    path: "/rank",
    component: Rank
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
