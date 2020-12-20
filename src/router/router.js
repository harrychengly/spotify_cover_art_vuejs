import Vue from 'vue';
import Router from 'vue-router';
import HomePage from "../layout/HomePage.vue";
Vue.use(Router);

export default new Router({
    mode: 'history',
    routes: [{
        path: '/',
        name: 'Home',
        component: HomePage,
        meta: {
            title: 'Spotify Authorization Code example page',
        },
    }, ]
});