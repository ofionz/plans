import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';
import ru from "../locales/ru";

Vue.use(Vuetify);

export default new Vuetify({
    theme: {
        themes: {
            light: {
                primary: '#698899',
                secondary: '#b0bec5',
                accent: '#8c9eff',
                error: '#f60e0e',
                submit: '#00E676'
            },
        },
    },
    lang: {
        locales: { ru },
        current: "ru",
    },
});
