import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';
import ru from "../locales/ru";

Vue.use(Vuetify);

export default new Vuetify({
    theme: {
        themes: {
            light: {
                primary: '#108d9c',
                secondary: '#3949AB',
                accent: '#6b81f8',
                error: '#f60e0e',
                submit: '#AED581'
            },
        },
    },
    lang: {
        locales: { ru },
        current: "ru",
    },
});
