import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import router from "./router";
import moment from "moment";
import VueHtmlToPaper from 'vue-html-to-paper';
import VueMask from 'v-mask'
import './directives/maindirectives';
import {bx24methods} from './utils/methodsBX24'

const options = {
    name: '_blank',
    specs: [
        'fullscreen=yes',
        'titlebar=yes',
        'scrollbars=yes'
    ],
    styles: [],
    timeout: 1000, // default timeout before the print window appears
    autoClose: true, // if false, the window will not close after printing
    windowTitle: window.document.title, // override the window title
}

Vue.use(VueHtmlToPaper, options);
Vue.prototype.$eventBus = new Vue();
Vue.use(VueMask);
Vue.mixin(bx24methods)
Vue.prototype.moment = moment;
Vue.config.productionTip = false


start();

async function start() {
    let {default: BX24Init} = await import('./utils/bx24');
    const BX24 = await BX24Init();

    if (BX24) {

        await BX24.init(function () {

            new Vue({
                vuetify,
                router,
                render: h => h(App),
            }).$mount('#app');
        })

    } else {
        new Vue({
            router,
            vuetify,
            render: h => h(App),
        }).$mount('#app');
    }
}
