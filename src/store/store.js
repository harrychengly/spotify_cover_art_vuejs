import HomePage from "../layout/HomePage";
import Vuex from 'vuex';
import Vue from 'vue';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        user: null,
        artists: []
    },
    mutations: {
        mutateUser(state, payload) {
            state.user = payload;
        },

        setArtists(state, artists) {
            state.artists = artists
        }
    },
    getters: {
        getUser(state) {
            return state.user
        }
    },
    modules: {
        HomePage
    },
});