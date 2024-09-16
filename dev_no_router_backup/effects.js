const options = {
    moduleCache: {
        vue: Vue,
    },

    getFile(url) {
        return fetch(url).then(response => response.ok ? response.text() : Promise.reject(response));
    },

    addStyle(styleStr) {
        const style = document.createElement('style');
        style.textContent = styleStr;
        const ref = document.head.getElementsByTagName('style')[0] || null;
        document.head.insertBefore(style, ref);
    },

    log(type, ...args) {
        console.log(type, ...args);
    }
}
//import '../uibuilder/vendor/vue/dist/vue.esm-browser.js'
const { loadModule } = window["vue3-sfc-loader"];
//import { createApp } from '../uibuilder/vendor/vue/dist/vue.esm-browser.js'
import Groupsettings from './grouplist.js';
import Effectlist from './effectlist.js';
//import {ColorPicker} from './colorpicker.js.mjs'

const app = Vue.createApp({
    components: {
        colorpicker: Vue.defineAsyncComponent(() => loadModule('./colorpicker.vue', options)),
        groupsettings: Groupsettings,
        effectlist: Effectlist,
        //colorpicker: ColorPicker

    }, data() {
        return {
            output_message: {},
            group: 0,
            effect: {},
            sEffect: -1,
            fxSpeed: 0,
            bpm: 0,
            gDef: [0, 0, 0, 0, 255, 85, 100, 0],
            gMapMode: 0,
            gScale: 100,
            noise: false,
            nVal: 0,
            nHue: 0,
            nSat: 0,
            nContrast: 0.0,
            nScaleX: 0,
            nScaleY: 0,
            db_gradient: {
                type: 'linear',
                points: [
                    {
                        left: 0,
                        red: 0,
                        green: 0,
                        blue: 0,
                        alpha: 1
                    },
                    {
                        left: 100,
                        red: 255,
                        green: 0,
                        blue: 0,
                        alpha: 1
                    }
                ]
            }
        }
    },
    watch: { //Tracks that input values stay between min and max values
        fxSpeed(val) {
            this.fxSpeed = this.checkValue(val, 0, 255);
        },
        bpm(val) {
            this.bpm = this.checkValue(val, 0, 255);
        },
        gScale(val) {
            this.gScale = this.checkValue(val, 0, 1000);
        },
        nVal(val) {
            this.nVal = this.checkValue(val, 0, 255);
        },
        nHue(val) {
            this.nHue = this.checkValue(val, 0, 255);
        },
        nSat(val) {
            this.nSat = this.checkValue(val, 0, 255);
        },
        nContrast(val) {
            this.nContrast = this.checkValue(val, 0, 10);
        },
        nScaleX(val) {
            this.nScaleX = this.checkValue(val, 0, 1000);
        },
        nScaleY(val) {
            this.nScaleY = this.checkValue(val, 0, 255);
        }
    },
    computed: {
        generateJSONpreview() {
            const not_set = "Select a saved effect or set effect style to see a preview of the JSON message."

            // Check if effect is present
            if (this.sEffect < 0) {
                return not_set; // Return default text
            } else {
                // Create an object with the current data values
                let payload = {};
                payload.sEffect = this.sEffect;
                payload.gDef = [...this.gDef];
                if (this.sEffect == 0 || this.sEffect > 1) {
                    payload.fxSpeed = this.fxSpeed;
                }
                if (this.sEffect > -1 && this.sEffect < 3) {
                    payload.bpm = this.bpm;
                }
                if (this.sEffect == 3) {
                    payload.gMapMode = this.gMapMode;
                    payload.gScale = this.gScale;
                }
                if (this.noise) {
                    payload.nVal = this.nVal;
                    payload.nHue = this.nHue;
                    payload.nSat = this.nSat;
                    payload.nContrast = this.nContrast;
                    payload.nScaleX = this.nScaleX;
                    payload.nScaleY = this.nScaleY;
                }

                // Search loaded effects for keys that are not editable on this GUI, and add them to the preview
                if (this.effect.payload !== undefined) {
                    for (let key in this.effect.payload) {
                        if (this[key] === undefined) {
                            payload[key] = this.effect[key];
                        }
                    }
                }

                this.effect.payload = payload;
            }

            // Create an object with the current data values
            const jsonData = {
                topic: "ledrama/effect/set/" + this.group,
                payload: this.effect.payload
            };
            this.output_message = jsonData;

            // Convert the object to a JSON string with indentation for readability
            // Ignore arrays for indentation
            const replacer = (key, value) => {
                if (Array.isArray(value)) {
                    return JSON.stringify(value);
                } else {
                    return value;
                }
            };

            return JSON.stringify(jsonData, replacer, 2).replaceAll('"', '');
        },
    },
    methods: {
        openModal() {
            document.getElementById('pickerModal').style.display = 'block';
        },
        clearEffect() {
            this.output_message = new Object();
            this.effect = new Object();
            this.sEffect = -1;
            this.fxSpeed = 0;
            this.bpm = 0;
            this.gDef = new Array(0, 0, 0, 0, 255, 85, 100, 0);
            this.db_gradient = new Object({
                type: 'linear',
                points: [
                    {
                        left: 0,
                        red: 0,
                        green: 0,
                        blue: 0,
                        alpha: 1
                    },
                    {
                        left: 100,
                        red: 255,
                        green: 0,
                        blue: 0,
                        alpha: 1
                    }
                ]
            });
            this.gMapMode = 0;
            this.gScale = 100;
            this.noise = false;
            this.nVal = 0;
            this.nHue = 0;
            this.nSat = 0;
            this.nContrast = 0;
            this.nScaleX = 0;
            this.nScaleY = 0;
            this.$forceUpdate(); // Force DOM update when an array changes to update Json preview properly
        },
        getHSV(hsv) {
            this.gDef = hsv;
            this.$forceUpdate(); // Force DOM update when the array changes to update Json preview properly
            //console.log("Received hsv: ", this.gDef)
        },
        getGroup(selectedGroup) {
            this.group = selectedGroup;
            //console.log("Received group: ", this.group);
        },
        getEffect(selectedEffect) {
            this.effect = selectedEffect;
            //console.log("Received effect: ", JSON.stringify(this.effect));

            if (this.effect.hasOwnProperty('payload')) {
                // Set values from loaded effect
                for (let key in this.effect.payload) {
                    // If the key exists in the Vue instance, add it to the payload
                    if (this[key] !== undefined && this[key] !== this.effect.payload[key]) {
                        this[key] = this.effect.payload[key];

                        if (key === 'gDef') {
                            if (this.effect.payload.gDef.length % 4 === 0) {
                                // Convert effect color array to RGB gradient object to update the colorpicker component GUI
                                this.convertToRGB(this.effect.payload.gDef);
                            } else {
                                console.log("Error in gDef data array: unexpected array length.");
                            };
                        }

                        if (key === 'nVal' || key === 'nHue' || key === 'nSat' || key === 'nContrast' || key === 'nScaleX' || key === 'nScaleY') {
                            if (!this.noise) this.noise = true;
                        };
                    };
                };
            };

        },
        convertToRGB(hsv_array) {
            //console.log(hsv_array);
            let rgbarray = [];

            for (let i = 0; i < hsv_array.length; i++) {
                let j = Math.floor(i / 4);

                if (i % 4 === 0) {
                    rgbarray[j] = {
                        left: Math.round((hsv_array[i] / 255) * 100),
                        alpha: 1
                    };
                } else {
                    let hsv = {
                        h: hsv_array[i] / 255,
                        s: hsv_array[i + 1] / 255,
                        v: hsv_array[i + 2] / 255
                    };
                    let rgb = hsvToRgb(hsv.h, hsv.s, hsv.v);
                    rgbarray[j] = {
                        ...rgbarray[j],
                        red: rgb.r,
                        green: rgb.g,
                        blue: rgb.b
                    };
                    i += 2;
                }


            }

            this.db_gradient.points = rgbarray;
            console.log(JSON.stringify(this.db_gradient));

            function hsvToRgb(h, s, v) {
                let r, g, b, i, f, p, q, t;
                i = Math.floor(h * 6);
                f = h * 6 - i;
                p = v * (1 - s);
                q = v * (1 - f * s);
                t = v * (1 - (1 - f) * s);
                switch (i % 6) {
                    case 0: r = v, g = t, b = p; break;
                    case 1: r = q, g = v, b = p; break;
                    case 2: r = p, g = v, b = t; break;
                    case 3: r = p, g = q, b = v; break;
                    case 4: r = t, g = p, b = v; break;
                    case 5: r = v, g = p, b = q; break;
                }
                return {
                    r: Math.round(r * 255),
                    g: Math.round(g * 255),
                    b: Math.round(b * 255)
                };
            }
        },
        checkValue(val, min, max) { //Params: current value, minumum value, maximum value
            if (val > max) {
                return max;
            }
            else if (val < min) {
                return min;
            }
            else {
                return val;
            }
        },
        applyEffect() {

            // Check that a group and an effect type is selected
            if (this.group == 0 || this.sEffect < 0) {
                let errmsg = "Can't apply effect: "
                if (this.sEffect < 0) {
                    errmsg += "no effect selected";
                }
                if (this.group == 0) {
                    if (errmsg != "Can't apply effect: ") {
                        errmsg += ", "
                    }
                    errmsg += "no group selected";
                }
                window.alert(errmsg);
            } else if (this.sEffect == 3 && this.gMapMode == 0) {
                // Chect that gradient mode is selected if gradient effect is selected
                let errmsg = "Can't apply effect: No gradient mode selected"
                window.alert(errmsg);
            } else {
                // Send effect data to backend
                uibuilder.send(this.output_message)
                console.log("Sent effect data to backend: ", JSON.stringify(this.output_message));
            }
        },
        setupAccordion() {
            const acc = document.getElementsByClassName("accordion");

            for (let i = 0; i < acc.length; i++) {
                acc[i].addEventListener("click", function () {
                    this.classList.toggle("active");
                });
            }
        }
    },
    mounted() {
        this.setupAccordion();
    }
});

app.mount('#app');



/*
//Set max and min value for the plus-minus box here
const MAX_VALUE = 1023
const MIN_VALUE = 0

$(document).ready(function () {
    // Plus button click
    $(".plus-btn").click(function () {
        var currentValue = parseInt($(this).parent().prev().val());
        if (currentValue < MAX_VALUE) {
            $(this).parent().prev().val(currentValue + 1);
        }
    });

    // Minus button click
    $(".minus-btn").click(function () {
        var currentValue = parseInt($(this).parent().next().val());
        if (currentValue > MIN_VALUE) {
            $(this).parent().next().val(currentValue - 1);
        }
    });
});
*/
