<script>
const { loadModule } = window["vue3-sfc-loader"];
import Groupsettings from './grouplist.mjs';
import Effectlist from './effectlist.mjs';
import colorpicker from '../colorpicker.vue'

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

export default {
    
    components: {
        colorpicker: colorpicker,
        Groupsettings: Groupsettings,
        Effectlist: Effectlist,

    }, data() {
        return {
            output_message: {},
            group: 0,
            effect: {},
            sEffect: 0,
            fxSpeed: 0,
            bpm: 0,
            gDef: [0, 0, 0, 0, 255, 85, 100, 0],
            gMapMode: 0,
            gScale: 100,
            noise: false,
            nVal: 0,
            nHue: 0,
            nSat: 0,
            nContrast: 0,
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
            this.gScale = this.checkValue(val, 0, 255);
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
            this.nContrast = this.checkValue(val, 0, 255);
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
            if (this.sEffect === 0) {
                return not_set; // Return default text
            } else {
                // Create an object with the current data values
                let payload = {};
                payload.sEffect = this.sEffect;
                payload.gDef = [...this.gDef];
                if (this.sEffect > 1) {
                    payload.fxSpeed = this.fxSpeed;
                }
                if (this.sEffect > 0 && this.sEffect < 3) {
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
        }

    },
    methods: {
        openModal() {
            document.getElementById('pickerModal').style.display = 'block';
        },
        closeModal() {
        document.getElementById('pickerModal').style.display = 'none';
        },
        clearEffect() {
            this.output_message = new Object();
            this.effect = new Object();
            this.sEffect = 0;
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
            if (this.group == 0 || this.sEffect == 0) {
                let errmsg = "Can't apply effect: "
                if (this.sEffect == 0) {
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
    },

}
</script>
<template>
    <link type="text/css" rel="stylesheet" href="../common.css" media="all">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet"
        integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css" rel="stylesheet">
    <div class="container-fluid">
        <h1>Lighting effect controls</h1>
        <div id="app">
            <div class="row row-cols-4">
                <!-- Vue dependant code starts here -->
                <div class="col">
    
                    <div class="row mt-3">
                        <h4>Saved effects</h4>
                        <Effectlist @effect-updated="getEffect"></Effectlist>
                    </div>
                </div>
    
                <div class="col">
                    <div class="row mt-3">
                        <h4>Color picker
                            <i class="fa fa-info-circle" aria-hidden="true" @click="openModal" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="Click for help"></i>
                        </h4>
                        <!-- Color Picker Helper -->
                        <div id="pickerModal" class="modal" role="dialog">
                            <div class="modal-dialog">
    
                                <!-- Modal content-->
                                <div class="modal-content">
                                    <div class="modal-header">
                                        <h4 class="modal-title">Color Picker Help</h4>
                                    </div>
                                    <div class="modal-body">
                                        <p>The final gradient is located under the big color selector screen. The points of
                                            the gradient
                                            are displayed as small white circles.</p>
                                        <ul>
                                            <li>Edit a specific color point by clicking on its circle and selecting a new
                                                color from the
                                                bottom color bar</li>
                                            <li>Colors can be adjusted on the color bar, or set as hex values or RGB values
                                            </li>
                                            <li>Move color points by dragging them on the gradient bar</li>
                                            <li>Add more color points by clicking on empty spaces between the white circles
                                            </li>
                                            <li>Remove color points by double-clicking on the color point circle</li>
                                        </ul>
                                        <p>The minimum number of colors in a gradient is 2, and the maximum is 16. Alfa
                                            values other
                                            than 100 are ignored.</p>
                                        <p><strong>NOTE:</strong> Colors that are very dark may not display on LED-lights
                                            correctly,
                                            brighter colors are recommended.</p>
                                    </div>
                                    <div class="modal-footer">
                                        <button type="button" class="btn btn-default" onclick="closeModal()">Close</button>
                                    </div>
                                </div>
    
                            </div>
                        </div>
                        <div id="picker">
                            <!-- <script type="module" src="./colorpicker.js.mjs"></script> -->
                            <colorpicker :newgradient="db_gradient" @change="getHSV"></colorpicker>
                        </div>
                    </div>
                    <div class="row mt-3">
                        <h4>JSON preview:</h4>
                        <textarea name="json-output" id="jsonpreview" cols="20" rows="10" readonly>{{ generateJSONpreview }}</textarea>
                    </div>
                </div>
    
                <!-- Effect settings -->
    
                <form class="row mt-3 was-validated" onsubmit="return false">
                    <div class="row">
                        <h4>Effect settings</h4>
                        <div class="input-group set-into-group">
                            <label class="input-group-text">Effect style: </label>
                            <select v-model="sEffect" class="form-select" required aria-label="effect style select" id="effect-style-select">
                    <!--<option value="">Set effect style</option> -->
                    <option value="0">BPM (cycle through rainbow colors, flash inbetween)</option>
                    <option value="1">BPM2 (change all lights from selected color to another)</option>
                    <option value="2">BPM3 (change all lights from color to another, optional flash inbetween)</option>
                    <option value="3">Gradient (move colors along the led lights)</option>
                    <option v-if="(sEffect > 3)">{{ sEffect }}</option>
                  </select>
                            <div class="invalid-feedback">Effect style required</div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="input-group set-into-group">
                            <label class="input-group-text">Gradient mode: </label>
                            <select v-model="gMapMode" class="form-select" required aria-label="gradient style select" id="gradient-style-select" v-bind:disabled="(sEffect < 3)">
                    <option value="">Set gradient mode</option>
                    <option value="1">Top to bottom</option>
                    <option value="2">Bottom to top</option>
                    <option value="3">Outwards from center</option>
                    <option value="4">Inwards to center</option>
                    <option v-if="(gMapMode > 4)">{{gMapMode}}</option>
                  </select>
                            <div class="invalid-feedback">Effect style required</div>
                        </div>
                    </div>
    
                    <div class="row mt-3">
                        <div>
                            <table class="table table-borderless table-dark" style="border: none">
                                <div class="range-wrap">
                                    <tr>
                                        <td>Effect speed</td>
                                        <td><input type="range" style="border: 0" min="0" max="160" v-model="fxSpeed" class="form-range" id="fxSpeed-slider" v-bind:disabled="(sEffect < 2 && sEffect != 0)">
                                        </td>
                                        <td><input type="number" min="0" max="255" v-model="fxSpeed" class="form-number" id="fxSpeed-number" v-bind:disabled="(sEffect < 2 && sEffect != 0)">
                                        </td>
                                    </tr>
                                </div>
                                <div class="range-wrap">
                                    <tr>
                                        <td>BPM</td>
                                        <td><input type="range" style="border: 0" min="0" max="160" v-model="bpm" class="form-range" id="bpm-slider" v-bind:disabled="(sEffect < 0 || sEffect == 3)">
                                        </td>
                                        <td><input type="number" min="0" max="255" v-model="bpm" class="form-number" id="bpm-number" v-bind:disabled="(sEffect < 0 || sEffect == 3)">
                                        </td>
                                    </tr>
                                </div>
                                <div class="range-wrap">
                                    <tr>
                                        <td>Gradient scale</td>
                                        <td><input type="range" style="border: 0" min="0" max="300" v-model="gScale" class="form-range" id="gScale-slider" v-bind:disabled="(sEffect < 3)">
                                        </td>
                                        <td><input type="number" min="0" max="999" v-model="gScale" class="form-number" id="gScale-number" v-bind:disabled="(sEffect < 3)">
                                        </td>
                                    </tr>
                                </div>
                            </table>
                        </div>
    
                        <div data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="Only available if noise 
                            is applicable to the selected effect">
                            <input
                              type="checkbox"
                              id="noisetogglecheckbox"
                              class="btn-check"
                              v-bind:disabled="(sEffect == 0)"
                              v-model="noise"
                              id="noise"
                              data-bs-toggle="tooltip"
                              data-bs-placement="top"
                              data-bs-title="Select to see more options">
                            <label class="accordion" for="noisetogglecheckbox">Add noise to effect</label>
                        </div>
    
                        <div id="noisesettings" v-if="noise">
    
                            <table class="table table-borderless table-dark" style="border: none">
                                <div class="range-wrap">
                                    <tr>
                                        <td>Noise amount</td>
                                        <td><input type="range" style="border: 0" min="0" max="255" v-model="nVal" class="form-range" id="nAmount-slider">
                                        </td>
                                        <td><input type="number" min="0" max="255" v-model="nVal" class="form-number" id="nAmount-number">
                                        </td>
                                    </tr>
                                </div>
                                <div class="range-wrap">
                                    <tr>
                                        <td>Noise hue</td>
                                        <td><input type="range" style="border: 0" min="0" max="255" v-model="nHue" class="form-range" id="nHue-slider">
                                        </td>
                                        <td><input type="number" min="0" max="255" v-model="nHue" class="form-number" id="nHue-number">
                                        </td>
                                    </tr>
                                </div>
                                <div class="range-wrap">
                                    <tr>
                                        <td>Noise saturation</td>
                                        <td><input type="range" style="border: 0" min="0" max="255" id="nsat-setting" v-model="nSat" class="form-range" id="nSaturation-slider">
                                        </td>
                                        <td><input type="number" min="0" max="255" v-model="nSat" class="form-number" id="nSaturation-number">
                                        </td>
                                    </tr>
                                </div>
                                <div class="range-wrap">
                                    <tr>
                                        <td>Noise contrast</td>
                                        <td><input type="range" style="border: 0" min="0" max="10" v-model="nContrast" class="form-range" id="nContrast-slider">
                                        </td>
                                        <td><input type="number" min="0" max="10" v-model="nContrast" class="form-number" id="nContrast-number">
                                        </td>
                                    </tr>
                                </div>
                                <div class="range-wrap">
                                    <tr>
                                        <td>Noise size</td>
                                        <td><input type="range" style="border: 0" min="0" max="1000" v-model="nScaleX" class="form-range" id="nSize-slider">
                                        </td>
                                        <td><input type="number" min="0" max="1000" v-model="nScaleX" class="form-number" id="nSize-number">
                                        </td>
                                    </tr>
                                </div>
                                <div class="range-wrap">
                                    <tr>
                                        <td>Noise speed</td>
                                        <td><input type="range" style="border: 0" min="0" max="255" v-model="nScaleY" class="form-range" id="nSpeed-slider">
                                        </td>
                                        <td><input type="number" min="0" max="255" v-model="nScaleY" class="form-number" id="nSpeed-number">
                                        </td>
                                    </tr>
                                </div>
                            </table>
                        </div>
    
                    </div>
    
                    <div class="row">
                        <Groupsettings @group-number-updated="getGroup"></Groupsettings>
                    </div>
                    <div class="row">
                        <div class="btn-group me-2" role="group">
                            <button class="btn btn-danger" @click="clearEffect">Clear all</button>
                            <button class="btn btn-primary" type="submit" @click="applyEffect">Apply effect</button>
                        </div>
                    </div>
                </form>
    
                <div class="col">
                    <div class="row mt-3">
                        <h4 style="color:white;">Effect preview</h4>
                        <div class="d-flex justify-content-center">
                            <canvas id="ledCanvas" style="width:25px;height:500px; border:1px solid gray" width="25"
                                height="500"></canvas>
                        </div>
                        <!--<div id="controls"></div>-->
                        <div id="effectControls"></div>
                    </div>
                </div>
            </div>
        </div><!-- End of Vue app -->
    </div>
</template>