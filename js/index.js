'use strict'
const { createApp, ref } = Vue
const options = {
    moduleCache: {
        vue: Vue,
        vueRouter: VueRouter
    },
    async getFile(url) {
        const res = await fetch(url);
        if (!res.ok)
            throw Object.assign(new Error(res.statusText + ' ' + url), { res });
        return {
            getContentData: asBinary => asBinary ? res.arrayBuffer() : res.text(),
        }
    },
    addStyle(textContent) {

        const style = Object.assign(document.createElement('style'), { textContent });
        const ref = document.head.getElementsByTagName('style')[0] || null;
        document.head.insertBefore(style, ref);
    },
}

const { loadModule } = window['vue3-sfc-loader'];

window.asyncVue = sfc => Vue.defineAsyncComponent(() => loadModule(sfc + '.vue', options))
window.dynamicVue = com => ({
    name: 'DynamicWrapper',
    template: `<component :is="comp"></component>`,
    computed: {
        comp() {
            const com = this.com;
            return asyncVue(com);
        }
    },
    data() {
        return { com }
    }
})

const routes = [
    { path: "/", name: 'configuration', component: dynamicVue('components/configuration'), meta: { KeepAlive: true } },
    { path: "/effects", component: dynamicVue('components/effects'), meta: { KeepAlive: true } },

];

const router = VueRouter.createRouter({
    history: VueRouter.createWebHashHistory(),
    routes
})


const app = Vue.createApp({
    data() {
        return {
        }
    },
    methods: {
        switchToRoute(rt) {
            this.$router.push(rt)
        }
    },
    mounted: function () {
        uibuilder.onChange('msg', (msg) => {
            console.log(msg);
            if (msg.topic === "router/switch") { this.switchToRoute(msg.payload); }
        })
    },
})

app.use(router)
app.mount('#my-app')