import Vue from "vue";
import VueRouter from "vue-router";
import Reacommend from "components/Recommend/Recommend";
import SongSquare from 'components/SongSquare/SongSquare'
import Search from "components/Search/Search";
import Singer from "components/Singer/Singer";
import Rank from "components/rank/rank";
import SingerDetail from 'components/Singer/SingerDetail';
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
    path: "/songSquare",
    component: SongSquare
  },
  {
    path: "/search",
    component: Search
  },
  {
    path: "/singer",
    component: Singer,
    children: [
      {
        path: ':id',
        component: SingerDetail
      }
    ]
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
