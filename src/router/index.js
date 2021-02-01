import Vue from 'vue'
import Router from 'vue-router'
const Home = r => require.ensure([], () => r(require('../view/home.vue')), 'home');
const PageA = r => require.ensure([], () => r(require('../view/part-a/page-a.vue')), 'part-a');
const PageB = r => require.ensure([], () => r(require('../view/part-b/page-b.vue')), 'part-b');

Vue.use(Router)

export default new Router({
  routes: [
    {path: '/',name: 'home',component: Home},
    {path: '/page-a',name: 'pageA',component: PageA},
    {path: '/page-b',name: 'pageB',component: PageB},
    {path: '*', redirect: '/' }
  ]
})
