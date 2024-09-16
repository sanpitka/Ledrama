<script>
    //const { loadModule } = window["vue3-sfc-loader"];
    import Groupsettings from './grouplist.mjs';
    import Effectlist from './effectlist.mjs';
    import ColorPicker from './colorpicker.vue';
    import { Tooltip, Popover, Toast } from '/uibuilder/vendor/bootstrap/dist/js/bootstrap.bundle.js';
    import ledpreview from './ledpreview.mjs';

/*const options = {
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
} */

export default {
    
    components: {
        ColorPicker,
        Groupsettings: Groupsettings,
        Effectlist: Effectlist,
        ledpreview: ledpreview

    }, data() {
        return {
            output_message: {},
            group: 0,
            effect: {
                payload: {
                }
            },
            sEffect: null,
            fxSpeed: 0,
            bpm: 0,
            gDef: [0, 170, 255, 255, 255, 0, 255, 255],
            sColor: [170, 255, 255],
            gMapMode: null,
            gScale: 100,
            noise: false,
            nVal: 0,
            nHue: 0,
            nSat: 255,
            nContrast: 4,
            nScaleX: 100,
            nScaleY: 100,
            db_gradient: {
                type: 'linear',
                points: [
                    {
                        left: 0,
                        red: 0,
                        green: 0,
                        blue: 255,
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
            },
            key: 0,
            newEffectName: "",
            effectList: [],
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
            this.gScale = this.checkValue(val, 1, 1000);
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
            this.nContrast = this.checkValue(val, 0, 8);
        },
        nScaleX(val) {
            this.nScaleX = this.checkValue(val, 1, 1000);
        },
        nScaleY(val) {
            this.nScaleY = this.checkValue(val, 1, 1000);
        },
        gDef: {
            handler(val) {
                // TODO: have either gDef or sColor present  
            },
            deep: true
        },
        sColor: {
            handler(val) {
                // TODO: have either gDef or sColor present
            },
            deep: true
        },
    },
    computed: {
        generateJSONpreview() {
            const not_set = "Select a saved effect or set effect style to see a preview of the JSON message."

            // Check if effect is present
            if (this.sEffect === null) {
                return not_set; // Return default text
            } else {
                // Create an object with the current data values
                var payload = {};
                payload.sEffect = this.sEffect;

                // No need for gDef gradient in hue effect
                if (this.sEffect > 0) {                    
                    payload.gDef = [...this.gDef];
                }
                if (this.sEffect > -1 && this.sEffect != 1) {
                    payload.fxSpeed = this.fxSpeed;
                }
                if (this.sEffect > -1 && this.sEffect != 3) {
                    payload.bpm = this.bpm;
                }
                if (this.sEffect >= 3) {
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
                else {
                    payload.nVal = 0;
                }

                // Search loaded effects for keys that are not editable on this GUI, and add them to the preview
                /*
                if (this.effect.payload !== undefined) {
                    for (let key in this.effect.payload) {
                        if (this[key] === undefined) {
                            payload[key] = this.effect[key];
                        }
                    }
                } 
                */
                this.effect.payload = payload;
            }

            // Create an object with the current data values
            const jsonData = {
                "topic": "ledrama/effect/set/" + this.group,
                "payload": payload
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
        setPayload(payload) {
            this.effect.payload = payload;
        },
        openModal() {
            document.getElementById('pickerModal').style.display = 'block';
        },
        closeModal() {
            document.getElementById('pickerModal').style.display = 'none';
        },
        clearRadio() {
            var radio = document.querySelector('input[name="listGroupRadio"]:checked');
            radio.checked = false;
        },
        clearEffect() {
            this.output_message = new Object();
            this.effect = {};
            this.effect.payload = {
            };
            this.sEffect = null;
            this.fxSpeed = 0;
            this.bpm = 0;
            this.gDef = [0, 170, 255, 255, 255, 0, 255, 255];
            this.db_gradient = {
                type: 'linear',
                points: [
                    {
                        left: 0,
                        red: 0,
                        green: 0,
                        blue: 255,
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
            };
            this.gMapMode = null;
            this.gScale = 100;
            this.noise = false;
            this.nVal = 0;
            this.nHue = 0;
            this.nSat = 255;
            this.nContrast = 4;
            this.nScaleX = 100;
            this.nScaleY = 100;
            this.key++;
            this.$forceUpdate(); // Force DOM update when an array changes to update Json preview properly
        },
        getHSV(hsv) {
            this.gDef = hsv;
            //this.$forceUpdate(); // Force DOM update when the array changes to update Json preview properly
            //console.log("Received hsv: ", this.gDef)
        },
        getGroup(selectedGroup) {
            this.group = selectedGroup;
            //console.log("Received group: ", this.group);
        },
        getEffect(selectedEffect) {
            this.clearEffect();
            try {
                // Make a shallow copy to avoid changes in the local object
                this.effect = { ...selectedEffect };
                //this.effect = selectedEffect;
                console.log("[effects.vue] Received effect: ", JSON.stringify(this.effect));
            } catch (error) {
                console.log(error)
            }

            if (this.effect.hasOwnProperty('payload')) {
                this.effect.payload = selectedEffect.payload;
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
        getEffectList(effectList) {
            console.log(effectList);
            this.effectList = effectList;
        },
        convertToRGB(hsv_array) {
            //console.log(hsv_array);
            let rgbarray = [];
            
            for (let i = 0; i < hsv_array.length; i +=4) {
                let hsv={ h: hsv_array[i + 1] / 255, s: hsv_array[i + 2] / 255, v: hsv_array[i + 3] / 255 };
                let rgb=hsvToRgb(hsv.h, hsv.s, hsv.v);
                rgbarray.push({ left: Math.round((hsv_array[i] / 255) * 100), alpha: 1, red: rgb.r, green: rgb.g, blue: rgb.b });
            }
            
            this.db_gradient.points = rgbarray;
            this.key++;
            this.$forceUpdate(); // Force DOM update to update colorpicker
            //console.log(JSON.stringify(rgbarray));
            
            function hsvToRgb(h, s, v) { 
                let r, g, b, i, f, p, q, t;
                i=Math.floor(h * 6);
                f=h * 6 - i;
                p=v * (1 - s);
                q=v * (1 - f * s);
                t=v * (1 - (1 - f) * s);
                
                switch (i % 6) {
                    case 0: 
                        r=v,
                        g=t,
                        b=p;
                        break; 
                    case 1: 
                        r=q,
                        g=v,
                        b=p; 
                        break;
                    case 2: 
                        r=p,
                        g=v,
                        b=t;
                        break;  
                    case 3: 
                        r=p,
                        g=q,
                        b=v;
                        break;
                    case 4:
                        r=t,
                        g=p,
                        b=v;
                        break;
                    case 5:
                        r=v,
                        g=p,
                        b=q;
                        break; 
                } 
                return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b* 255) };
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
        async applyEffect() {

            // Check that a group and an effect type is selected
            if (this.group == 0 || this.sEffect < 0) {
                let errmsg = "Can't apply effect: "
                if (this.sEffect == -1) {
                    errmsg += "no effect selected";
                }
                if (this.group == 0) {
                    if (errmsg != "Can't apply effect: ") {
                        errmsg += ", "
                    }
                    errmsg += "no group selected";
                }
                window.alert(errmsg);
            } else if (this.sEffect == 3 && this.gMapMode == null) {
                // Chect that gradient mode is selected if gradient effect is selected
                let errmsg = "Can't apply effect: No gradient mode selected"
                window.alert(errmsg);
            } else {
                // Send effect data to backend
                //uibuilder.send(this.output_message)
                let output = {
                    "topic": this.output_message.topic,
                    "payload": this.output_message.payload
                }

                try {
                    const response = await fetch('/api/effects', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(output)
                    });
            
                    if (!response.ok) {
                        //throw new Error(`HTTP error! status: ${response.status}`);
                        // add toast here
                        applyBtnEffect(response.status)
                    } else {
                        console.log("Sent effect data to backend: ", JSON.stringify(this.output_message));
                        // Add toast here
                        applyBtnEffect(response.status)
                    }
                } catch (error) {
                    console.error(error);
                    console.log('this.output_message:', this.output_message);
                }
                
                //console.log("Sent effect data to backend: ", JSON.stringify(this.output_message));
                //applyBtnEffect(200);
            }
            
        },
        setupAccordion() {
            const acc = document.getElementsByClassName("accordion");

            for (let i = 0; i < acc.length; i++) {
                acc[i].addEventListener("click", function () {
                    this.classList.toggle("active");
                });
            }
        },
        closeSaveModal() {
            document.getElementById("closeSaveModal").click()
        },
        saveEffect() {
            try {
                console.log("Entered name: " + this.newEffectName);
                if (this.checkEffectNameClash()) {
                    console.log("Sent new effect to backend: " + JSON.stringify(this.effect));
                    this.createNewEffect(); 
                    //this.saveBtnEffect();
                       
                }
            } catch (error) {
                console.log(error);
            }
        },
        checkEffectNameClash() {
            try {
                const nameInput = document.getElementById("save-effect-name")
                nameInput.classList.remove("is-invalid");
                let keys = [];
                this.effectList.forEach((effect => keys.push(effect.name)));
                //keys.forEach((element) => console.log(element));
                if (this.newEffectName == null || this.newEffectName == "") {
                    nameInput.classList.add("is-invalid");
                    document.getElementById("save-effect-nameFeedback").innerHTML = "Invalid name";
                }
                else if(keys.includes(this.newEffectName)) {
                    // TODO: Make this use Set instead, its O(1), while includes is O(n)
                    // https://www.tech-hour.com/javascript-performance-and-optimization
                    nameInput.classList.add("is-invalid");
                    document.getElementById("save-effect-nameFeedback").innerHTML = "Name already in use. Choose different name";
                }
                else {
                    return true;
                }
                return false;
            }
            catch(error) {
                console.log(error);
            }
        },
        async createNewEffect() {
            try {
                const newEffectData = {
                    //"topic": "set/topic/here",
                    "name": this.newEffectName,
                    "payload": this.effect.payload
                }
                
                // TODO: Check if this POST request works
                const response = await fetch("/api/database", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(newEffectData)
                });

                console.log(response)

                if (!response.ok) {
                    //throw new Error(`HTTP error! status: ${response.status}`);
                    // add toast here
                    saveBtnEffect(response.status)
                } else {
                    console.log("Sent effect data to backend: ", JSON.stringify(this.output_message));
                    // Add toast here
                    saveBtnEffect(response.status)
                }
                
                console.log("Sent new effect to backend: " + JSON.stringify(newEffectData));
                // TODO probably: Update effects list after creating a new one

            } catch (error) {
                console.log(error);
            }
        },
    },
    mounted() {
        this.setupAccordion();
        // Enabled tooltips
        new Tooltip(document.body, {
            selector: "[data-bs-toggle='tooltip']",
        });
        // Enables popovers
        var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'))
        var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
        return new Popover(popoverTriggerEl)
        })
        
    },

}

function applyBtnEffect(statusCode) {
    const responseCode = parseInt(statusCode);
    let btnEffect = document.getElementById("applyBtnEffect");
    let toastMessage = document.getElementById("toastMessage");
    
    btnEffect.innerHTML = `
    <div class="spinner-border spinner-border-sm" role="status">
        <span class="visually-hidden">Loading...</span>
    </div>
    `; // to replace anything you want when loading

    new Promise((resolve, reject) => {
        setTimeout( function() {
        resolve("Success!")
        }, 2500)
    }).then(function(){
        if (responseCode == 200) {
            btnEffect.innerHTML = `
            <i class="bi bi-check2"><span>Success!</span></i>`;
            toastMessage.innerHTML = "Success!";
        } else if (responseCode == 400) {
            btnEffect.innerHTML = `
            <span>Error!</span>`;
            toastMessage.innerHTML = "Error 400: Invalid configuration?";
        } else {
            btnEffect.innerHTML = `
            <span>Error!</span>`;
            toastMessage.innerHTML = `Unknown error encountered! ${responseCode}`;;
        }
        
        new Promise((resolve, reject) => {
            setTimeout( function() {
            resolve("Success!")
        }, 1500)
    }).then(function(){
        btnEffect.innerHTML = "Apply";

        var toastElList = [].slice.call(document.querySelectorAll('.toast'))
        var toastList = toastElList.map(function(toastEl) {
        // Creates an array of toasts (it only initializes them)
        return new Toast(toastEl) // No need for options; use the default options
        });
        toastList.forEach(toast => toast.show()); // This shows them
        })
    })
}

function saveBtnEffect(statusCode) {
    const responseCode = parseInt(statusCode);
    console.log(statusCode)
    let btnEffect = document.getElementById("save-button");
        
    btnEffect.innerHTML = `
        <div class="spinner-border spinner-border-sm" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>
    `; // to replace anything you want when loading
        
    new Promise((resolve, reject) => {
        setTimeout(function () {
            resolve("Success!")
    }, 2500)
    }).then(function () {
        if (responseCode == 200) {
            btnEffect.innerHTML = `
                <i class="bi bi-check2"><span>Success!</span></i>`;
        } else if (responseCode == 400) {
            btnEffect.innerHTML = `
                <span>Error!</span>`;
        } else {
            btnEffect.innerHTML = `
                <span>Error!</span>`;
        }
        new Promise((resolve, reject) => {
            setTimeout(function () {
            resolve("Success!")
        }, 1500)
        }).then(function () {
            btnEffect.innerHTML = "Save changes";

        });
    })      
}

</script>
<template>
    <link type="text/css" rel="stylesheet" href="css/common.css" media="all">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet"
        integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css"
        integrity="sha512-SnH5WK+bZxgPHs44uWIX+LLJAJ9/2PkPKZ5QiAj6Ta86w+fsb2TkcmfRyVX3pBnMFcV7oQPJkl9QevSCWr3W6A=="
        crossorigin="anonymous" referrerpolicy="no-referrer" />
    <div class="container-fluid">
        <h1>Lighting effect controls</h1>
        <div id="app">
            <!-- Toast -->
            <div role="alert" aria-live="assertive" aria-atomic="true" class="toast" data-bs-autohide="false">
                <div class="toast-container p-3 top-0 start-50 translate-middle-x" id="successToast">
                    <div class="toast">
                        <div class="toast-header">
                            <i class="bi bi-check-square"></i>
                            <strong class="me-auto">Information</strong>
                            <small>Just now</small>
                        </div>
                        <div class="toast-body" id="toastMessage">
                            Placeholder
                        </div>
                    </div>
                </div>
            </div>
            <div class="row">
                <!-- Vue dependant code starts here -->
                <div class="col saved-effects-col">

                    <div class="row ms-1 mt-3" id="effect-list">
                        <h4>Saved effects</h4>
                        <Effectlist @effect-updated="getEffect" @effect-list-updated="getEffectList" />
                    </div>

                    <div class="row btngroup-effect-list">
                        <button class="btn btn-primary btn-effect-list" data-bs-toggle="modal" data-bs-target="#saveEffectCreationModal"
                        data-bs-content="Save effect will open a window to save your new custom effect, or previously saved and modified effect">Save effect as...
                        </button>
                        <!--button class="btn btn-danger mt-3 btn-effect-list w-70 mx-auto" data-bs-toggle="popover" data-bs-title="To be implemented" -->
                        <!--data-bs-content="Delete effect will delete the selected effect from the above Saved effects-list">Delete effect-->
                        <!--</button>-->

                        <!-- Save Modal -->
                        <div class="modal fade" id="saveEffectCreationModal" tabindex="-1"
                            aria-labelledby="saveEffectCreationModalLabel" aria-hidden="true">
                            <div class="modal-dialog modal-dialog-centered">
                                <div class="modal-content">
                                    <div class="modal-header">
                                        <h1 class="modal-title fs-5" id="newEffectCreationModalLabel">Save effect</h1>
                                        <button type="button" id="closeSaveModal" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                    </div>
                                    <form class="row">
                                        <div class="modal-body">

                                            <div class="input-group has-validation">
                                                <label class="form-label">Name for your effect (WIP)</label>
                                                <input v-model="newEffectName" type="text" id="save-effect-name" class="form-control is-invalid" placeholder="Enter a name" @input="checkEffectNameClash" required>
                                                <div id="save-effect-nameFeedback" class="invalid-feedback">Invalid name</div>
                                            </div>
                                        </div>
                                        <div class="modal-footer">
                                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                            <button type="submit" class="btn btn-primary" id="save-button" @click="saveEffect">Save changes</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


                <!-- Effect settings -->
                <form class="col-4 mt-3 ms-4 was-validated" onsubmit="return false">
                    <div class="row">
                        <h4>Effect settings</h4>
                        <div class="btn-group mb-3" role="group">
                            <button class="btn btn-danger btn-effect-settings" @click="clearEffect; clearRadio">Clear all</button>
                            <button class="btn btn-primary btn-effect-settings" id="applyBtnEffect" type="submit" @click="applyEffect">Apply effect</button>
                        </div>
                        <Groupsettings id="set-to-group" @group-number-updated="getGroup"></Groupsettings>
                        <div class="input-group set-into-group">
                            <label class="input-group-text col-3">Effect style: </label>
                            <select v-model="sEffect" class="form-select" required aria-label="effect style select" id="effect-style-select">
                                <!-- <option value="-1">Set effect style</option>-->
                                <option value="0">BPM Cycling hue (cycle through rainbow colors, flash inbetween)</option>
                                <option value="1">BPM Along Gradient (change all lights from gradient color to another)</option>
                                <option value="2">BPM Traveling Gradient (move colors along the led lights, optional flash inbetween)</option>
                                <option value="3">Gradient (move colors along the led lights)</option>
                                <option v-if="(sEffect > 3)">{{ sEffect }}</option>
                            </select>
                            <div class="invalid-feedback">Effect style required</div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="input-group set-into-group">
                            <label class="input-group-text col-3">Gradient mode: </label>
                            <select v-model="gMapMode" class="form-select" required aria-label="gradient style select" id="gradient-style-select" v-bind:disabled="(sEffect < 3)">
                                <!--<option value="">Set gradient mode</option>-->
                                <option value="0">Top to bottom</option>
                                <option value="1">Bottom to top</option>
                                <option value="2">Outwards from center</option>
                                <option value="3">Inwards to center</option>
                                <option v-if="(gMapMode > 3)">{{gMapMode}}</option>
                            </select>
                            <div class="invalid-feedback">Effect style required</div>
                        </div>
                    </div>


                    <div class="row mt-4">
                        <div class="col" data-bs-toggle="tooltip" data-bs-placement="top"
                            data-bs-title="The speed LED colors change from one to another">
                            Effect speed
                        </div>
                        <div class="col-5">
                            <input type="range" style="border: 0" min="0" max="160" v-model="fxSpeed" class="form-range" id="fxSpeed-slider" v-bind:disabled="(sEffect == null || sEffect == 1)">
                        </div>
                        <div class="col mb-1 text-end">
                            <input type="number" min="0" max="255" v-model="fxSpeed" class="form-number w-75" id="fxSpeed-number" v-bind:disabled="(sEffect == null || sEffect == 1)">
                        </div>
                        <div class="col-sm-12">
                            <div style='border-bottom:1px solid #ccc;'></div>
                        </div>
                    </div>

                    <div class="row mt-3">
                        <div class="col" data-bs-toggle="tooltip" data-bs-placement="top"
                            data-bs-title="The speed LEDs flash on and off with">
                            BPM
                        </div>
                        <div class="col-5">
                            <input type="range" style="border: 0" min="0" max="160" v-model="bpm" class="form-range" id="bpm-slider" v-bind:disabled="(sEffect == null || sEffect == 3)">
                        </div>
                        <div class="col mb-1 text-end">
                            <input type="number" min="0" max="255" v-model="bpm" class="form-number w-75" id="bpm-number" v-bind:disabled="(sEffect == null || sEffect == 3)">
                        </div>
                        <div class="col-sm-12">
                            <div style='border-bottom:1px solid #ccc;'></div>
                        </div>
                    </div>

                    <div class="row mt-3">
                        <div class="col" data-bs-toggle="tooltip" data-bs-placement="top"
                            data-bs-title="The relative size of the gradient">
                            Gradient scale
                        </div>
                        <div class="col-5">
                            <input type="range" style="border: 0" min="1" max="300" v-model="gScale" class="form-range" id="gScale-slider" v-bind:disabled="(sEffect < 3)">
                        </div>
                        <div class="col mb-1 text-end">
                            <input type="number" min="1" max="1000" v-model="gScale" class="form-number w-75" id="gScale-number" v-bind:disabled="(sEffect < 3)">
                        </div>
                        <div class="col-sm-12">
                            <div style='border-bottom:1px solid #ccc;'></div>
                        </div>
                    </div>

                    <div class="row">
                        <div data-bs-toggle="tooltip" data-bs-placement="top"
                            data-bs-title="Add random noise to any effect">
                            <input
                                type="checkbox"
                                id="noisetogglecheckbox"
                                class="btn-check"
                                v-bind:disabled="(sEffect < 0)"
                                v-model="noise"
                                data-bs-toggle="tooltip"
                                data-bs-placement="top"
                            >
                            </input>
                            <label class="accordion" :class="{ active: noise }" for="noisetogglecheckbox">Add noise to effect</label>
                        </div>
                    </div>

                    <!-- Noise settings -->
                    <div class="row mt-3" id="noisesettings" v-if="noise">
                        <div class="col">
                            Noise amount
                        </div>
                        <div class="col-5">
                            <input type="range" style="border: 0" min="0" max="255" v-model="nVal" class="form-range" id="nAmount-slider">
                        </div>
                        <div class="col mb-1 text-end">
                            <input type="number" min="0" max="255" v-model="nVal" class="form-number w-75" id="nAmount-number">
                        </div>
                        <div class="col-sm-12">
                            <div style='border-bottom:1px solid #ccc;'></div>
                        </div>
                    </div>

                    <div class="row mt-3" id="noisesettings" v-if="noise">
                        <div class="col">
                            Noise hue
                        </div>
                        <div class="col-5">
                            <input type="range" style="border: 0" min="0" max="255" v-model="nHue" class="form-range" id="nHue-slider">
                        </div>
                        <div class="col mb-1 text-end">
                            <input type="number" min="0" max="255" v-model="nHue" class="form-number w-75" id="nHue-number">
                        </div>
                        <div class="col-sm-12">
                            <div style='border-bottom:1px solid #ccc;'></div>
                        </div>
                    </div>

                    <div class="row mt-3" id="noisesettings" v-if="noise">
                        <div class="col">
                            Noise saturation
                        </div>
                        <div class="col-5">
                            <input type="range" style="border: 0" min="0" max="255" id="nsat-setting nSaturation-slider" v-model="nSat" class="form-range">
                        </div>
                        <div class="col mb-1 text-end">
                            <input type="number" min="0" max="255" v-model="nSat" class="form-number w-75" id="nSaturation-number">
                        </div>
                        <div class="col-sm-12">
                            <div style='border-bottom:1px solid #ccc;'></div>
                        </div>
                    </div>

                    <div class="row mt-3" id="noisesettings" v-if="noise">
                        <div class="col">
                            Noise contrast
                        </div>
                        <div class="col-5">
                            <input type="range" style="border: 0" min="0.1" max="8" step="0.1" v-model="nContrast" class="form-range" id="nContrast-slider">
                        </div>
                        <div class="col mb-1 text-end">
                            <input type="number" min="0.1" max="8" step="0.1" v-model="nContrast" class="form-number w-75" id="nContrast-number">
                        </div>
                        <div class="col-sm-12">
                            <div style='border-bottom:1px solid #ccc;'></div>
                        </div>
                    </div>

                    <div class="row mt-3" id="noisesettings" v-if="noise">
                        <div class="col">
                            Noise size
                        </div>
                        <div class="col-5">
                            <input type="range" style="border: 0" min="1" max="1000" v-model="nScaleX" class="form-range" id="nSize-slider">
                        </div>
                        <div class="col mb-1 text-end">
                            <input type="number" min="1" max="1000" v-model="nScaleX" class="form-number w-75" id="nSize-number">
                        </div>
                        <div class="col-sm-12">
                            <div style='border-bottom:1px solid #ccc;'></div>
                        </div>
                    </div>

                    <div class="row mt-3" id="noisesettings" v-if="noise">
                        <div class="col">
                            Noise speed
                        </div>
                        <div class="col-5">
                            <input type="range" style="border: 0" min="1" max="255" v-model="nScaleY" class="form-range" id="nSpeed-slider">
                        </div>
                        <div class="col mb-1 text-end">
                            <input type="number" min="1" max="1000" v-model="nScaleY" class="form-number w-75" id="nSpeed-number">
                        </div>
                        <div class="col-sm-12">
                            <div style='border-bottom:1px solid #ccc;'></div>
                        </div>
                    </div>
                </form>

                <!-- Colorpicker -->
                <div class="col ms-4">
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
                                        <p>The final gradient is located under the big color selector screen. The points
                                            of
                                            the gradient
                                            are displayed as small white circles.</p>
                                        <ul>
                                            <li>Edit a specific color point by clicking on its circle and selecting a
                                                new
                                                color from the
                                                bottom color bar</li>
                                            <li>Colors can be adjusted on the color bar, or set as hex values or RGB
                                                values
                                            </li>
                                            <li>Move color points by dragging them on the gradient bar</li>
                                            <li>Add more color points by clicking on empty spaces between the white
                                                circles
                                            </li>
                                            <li>Remove color points by double-clicking on the color point circle</li>
                                        </ul>
                                        <p>The minimum number of colors in a gradient is 2, and the maximum is 16. Alfa
                                            values other
                                            than 100 are ignored.</p>
                                        <p><strong>NOTE:</strong> Colors that are very dark may not display on
                                            LED-lights
                                            correctly,
                                            brighter colors are recommended.</p>
                                    </div>
                                    <div class="modal-footer">
                                        <button type="button" class="btn btn-default" @click="closeModal">Close</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div id="picker">
                            <!-- <script type="module" src="./colorpicker.js.mjs"></script> -->
                            <ColorPicker :key="key" :gradient="db_gradient" @change="getHSV" />
                        </div>
                    </div>
                    <div class="row mt-3">
                        <h4>JSON preview:</h4>
                        <textarea class="ms-3 w-75" name="json-output" id="jsonpreview" rows="10" readonly>{{ generateJSONpreview }}</textarea>
                    </div>
                </div>

                <div class="col">
                    <div class="row mt-3 row4">
                        <h4 style="color:white;">Effect preview</h4>
                        <ledpreview :effect="effect"></ledpreview>
                    </div>
                </div>
            </div>
        </div><!-- End of Vue app -->
    </div>
</template> 