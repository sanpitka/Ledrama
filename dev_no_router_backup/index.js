// @ts-nocheck

import '../uibuilder/uibuilder.esm.min.js'  // Adds `uibuilder` and `$` to globals
//import 'https://cdn.jsdelivr.net/npm/vue@3/dist/vue.global.js'

// For Vue v3
//import { createApp } from '../uibuilder/vendor/vue/dist/vue.esm-browser.js' // Dev ver local install. Chg to .prod.js for prod
//import { createApp }  from 'https://cdn.jsdelivr.net/npm/vue@3/dist/vue.esm-browser.js' // As above but loaded remotely

// Import the custom component directly (Note that it is a .js file, not a .vue file)


// logLevel 2+ shows more built-in logging. 0=error,1=warn,2=info,3=log,4=debug,5=trace.
// uibuilder.set('logLevel', 2) // uibuilder.set('logLevel', 'info')
// Using the log output yourself:
// uibuilder.log('info', 'a prefix', 'some info', {any:'data',life:42})

// Show the latest incoming msg from Node-RED
//uibuilder.showMsg(true, 'body')

// Helper function to send a message back to Node-RED using the standard send function
// - see the HTML file for use. Can, of course, add any custom data in the msg.
window.fnSendToNR = function fnSendToNR(payload) {
    uibuilder.send({
        'topic': 'msg-from-uibuilder-front-end',
        'payload': payload,
    })
}

window.openPage = function openPage(pageUrl) {
    const iframe = document.getElementById('content-iframe');
    iframe.src = pageUrl;
}

// Listen for incoming messages from Node-RED and action
// uibuilder.onChange('msg', (msg) => {
//     // do stuff with the incoming msg
// })


/*
// Using the Vue options API style for beginner simplicity
// No need to pre-define Quasar's $q when working with the options API
const app = createApp({
    // Define Vue reactive variables
    data() {
        return {
            
        };
    },

    components: {

    },

    // Dynamic data
    computed: {},

    // Supporting functions
    methods: {

        // Use the uib helper function to send something to NR
        doEvent(event) { uibuilder.eventSend(event) },


    },

    // Lifecycle hooks
    mounted() {

    },
})

app.mount('#app')


*/