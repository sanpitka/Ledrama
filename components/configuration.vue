<script>
import {loadScript} from './load-script.mjs'
//loadScript('../uibuilder/uibuilder.esm.min.js');  // Adds `uibuilder` and `$` to globals
import ControllerList from './controllerlist.mjs';
import Groupsettings from './grouplist.mjs';
import { Tooltip, Toast } from '/uibuilder/vendor/bootstrap/dist/js/bootstrap.bundle.js';
// TODO: include filter button

export default {
    components: {
        ControllerList,
        Groupsettings
    },
    data() {
        return {
            selectedControllers: [],
            group_number: 0,
            total_pixels: 0,
            pixels: 0,
            lights: 1,
            strips: 1,
            manual_strips: false,
            output_message: [],
            selection: 'mqtt',
        }
    },
    methods: {
        getSelectedMacs(selectedRows) {
            //console.log("Selected macs from event: ", selectedMacs);
            this.selectedControllers = selectedRows;
            this.calculateUniverse(selectedRows);
        },
        getSelectedGroup(selectedGroup) {
            //console.log("Selected group from event: ", selectedGroup);
            this.group_number = selectedGroup;
        },
        calculateStrips(event) {

            //console.log(event.target.id);
            if (event.target.id === 'number-of-strips') {
                //console.log("Manual override of strips")
                this.manual_strips = true;
            } else if (this.strips !== this.lights && this.manual_strips === false) {
                this.strips = this.lights; //default amount of strips on start should be the number of lights connected
            }

            if (this.strips > 15) {
                this.strips = 16; // max amount of strips controller can calculate is 16
                //TODO: trigger info for user
            }
            if (this.strips < 1) {
                this.strips = 1; // minimum of strips is 1
                //TODO: trigger info for user
            }

            if (this.lights < 1) {
                this.lights = 1; // minimum of lights is 1
                //TODO: trigger info for user
            }
            // Calculate the total amount of pixels
            this.total_pixels = this.lights * this.pixels;

        },
        calculateUniverse(selectedControllers) {
            // Calculate default starting universe for each controller
            let increment = 6; // default settings uses 6 universes per controller

            let subnet = 0;
            let universe = 0;

            // Depleted, all 6 universes are used all the time
            // Calculate the universes needeed for current LED-light configuration
            // if (this.total_pixels > 0) {
            //     increment = Math.ceil(this.total_pixels / 170); // 170 pixels per universe
            // }

            selectedControllers.forEach((controller) => {
                //console.log("Controller: ", controller);
                if (!controller.artnet_off) {

                    controller.artnet_universe = universe;
                    controller.artnet_subnet = subnet;
                    this.$forceUpdate(); // force update to show the default universe value
                    universe += increment;
                    if (universe > 15) {
                        universe = Math.abs(16 - universe); // jump to next subnet, if next universe is over 15
                        subnet++; // increment subnet
                    }
                } else {
                    // Reset the values if Artnet off is selected
                    controller.artnet_universe = null;
                    controller.artnet_subnet = null;
                    this.$forceUpdate(); // force update to show universe value
                }

            });

        },
        async sendConfiguration() {
            console.log("Apply button pressed.");

            // if (this.selection == 'mqtt') {
            //     // Validate required values
            //     if (this.selectedControllers.length > 0 && this.group_number > 0) {
            //         // Send the configuration data from JSON Preview to backend
            //         uibuilder.send(this.output_message);
            //         console.log("Sent MQTT configuration data to backend: ", JSON.stringify(this.output_message));
            //         applyBtnEffect();
            //     } else {
            //         console.log("Group or controller missing");
            //         // Grop or controller data missing
            //         //TODO: trigger info for user
            //         let errmsg = "Can't apply configuration: "
            //         if (this.selectedControllers.length === 0) {
            //             errmsg += "no controllers selected";
            //         }
            //         if (this.group_number == 0) {
            //             if (errmsg != "Can't apply configuration: ") {
            //                 errmsg += ", "
            //             }
            //             errmsg += "no group selected";
            //         }
            //         window.alert(errmsg);
            //     }
            // } 
            
            if (this.selection == 'mqtt') {
                // Validate required values
                if (this.selectedControllers.length > 0 && this.group_number > 0) {
                    // Send the configuration data from JSON Preview to backend
                    const response = await fetch('/api/config', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(this.output_message)
                    });
        
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                        // add toast here
                        applyBtnEffect(response.status)
                    } else {
                        console.log("Sent MQTT configuration data to backend: ", JSON.stringify(this.output_message));
                        // Add toast here
                        applyBtnEffect(response.status)
                    }
                } else {
                    console.log("Group or controller missing");
                    // Grop or controller data missing
                
                    let errmsg = "Can't apply configuration: "
                    if (this.selectedControllers.length === 0) {
                        errmsg += "no controllers selected";
                    }
                    if (this.group_number == 0) {
                        if (errmsg != "Can't apply configuration: ") {
                            errmsg += ", "
                        }
                        errmsg += "no group selected";
                    }
                    window.alert(errmsg);
                }
            }
            
            else if (this.selection == 'artnet') {
                // Send the Artnet configuration data to the backend
                if (this.selectedControllers.length > 0) {
                    let output = [];
                    this.selectedControllers.forEach((controller) => {

                        if (controller.artnet_off) {
                            let jsonData = {
                                topic: "ledrama/artnet/set/" + controller.mac + "/enabled",
                                payload: 0   
                            }
                            output.push(jsonData);
                        } else {
                            let universe = {
                                topic: "ledrama/artnet/set/" + controller.mac + "/universe",
                                payload: controller.artnet_universe
                            }
                            output.push(universe);
                    
                            let subnet = {
                                topic: "ledrama/artnet/set/" + controller.mac + "/subnet",
                                payload: controller.artnet_subnet
                            }
                            output.push(subnet);

                            let jsonData = {
                                topic: "ledrama/artnet/set/" + controller.mac + "/enabled",
                                payload: 1
                            }
                            output.push(jsonData);
                        }

                        let saveData = {
                            topic: "ledrama/artnet/" + controller.mac + "/save",
                            payload: ""
                        }
                        output.push(saveData);
                    });

                    //uibuilder.send(output);
                    const response = await fetch('/api/artnet', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(output)
                    });

                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                        // add toast here
                        applyBtnEffect(response.status)
                    } else {
                        console.log("Sent Artnet configuration data to backend: ", JSON.stringify(output));
                        // Add toast here
                        applyBtnEffect(response.status)
                    }
                    
                    //applyBtnEffect();
                } else {
                    window.alert("No controllers selected");
                }
            }    
        },
        
    },
    mounted() {
        new Tooltip(document.body, {
        selector: "[data-bs-toggle='tooltip']",
        })
        

    },
    watch: {
        selection(val) {
            //console.log("Selection changed");
            this.$forceUpdate(); // try force update to update values when changing between settings
        },
    },
    computed: {
        generateJSONpreview() {
            const not_set = "Select one or multiple controllers and select group to see a preview of the JSON messages."
            let output = [];

            // Check if values are 0
            if (this.selectedControllers.length === 0 || this.group_number === 0) {
                return not_set; // Return default text
            }

            if (this.selectedControllers.length > 0) {

                // Generate the full output message for each selected controller
                this.selectedControllers.forEach((controller) => {

                    for (let i = 0; i < this.strips; i++) {
                        let strip_size = 1025;
                        if (this.pixels !== 0) {
                            strip_size = Math.round(this.total_pixels / this.strips);
                        }

                        let jsonData = {
                            topic: "ledrama/config/set/" + controller.mac + "/" + i,
                            payload: {
                                sGroup: this.group_number,
                                useStrips: this.strips,
                                sRange: [i * strip_size, (i + 1) * strip_size - 1] // pixels start from index 0
                            }
                        };
                        //console.log(jsonData)
                        // Convert the object to a JSON string with indentation for readability
                        // Ignore arrays for indentation
                        // const replacer = (key, value) => {
                        //     if (Array.isArray(value)) {
                        //         return JSON.stringify(value);
                        //     } else {
                        //         return value;
                        //     }
                        // };
                        //output.push(JSON.stringify(jsonData, replacer, 2).replaceAll('"', ''));
                        output.push(jsonData);
                        //console.log(output)
                    }
                });
            }

            this.output_message = output;
            //console.log(this.output_message);
            return output;
        },
        generateError() {
            // Does not actually generate an error because the values are set down, but checks if the settings are valid
            let errmsg = "";
            if (this.total_pixels > 1020) {
                errmsg += "Pixel limit exceeded for controller. Reduce the number of lights connected.\n";
                console.log("Pixel limit exceeded.")
                do {
                    this.lights -= 1;
                    this.total_pixels = this.lights * this.pixels;
                } while (this.total_pixels > 1020);
            }
            
            let strip_size = Math.floor(this.total_pixels / this.strips);
            
            if (this.total_pixels > 0 && strip_size < 1) { 
                errmsg +="Strip size too small. Reduce the number of strips.\n" ;
                console.log("Strip size too small.", strip_size) 
                do { 
                    this.strips -=1; 
                    strip_size = Math.floor(this.total_pixels / this.strips); 
                } while (strip_size < 1); 
            } 
            return errmsg; 
        }
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
            toastMessage.innerHTML = "Success";
        } else if (responseCode == 400) {
            btnEffect.innerHTML = `
            <span>Error!</span>`;
            toastMessage.innerHTML = "Error 400: Invalid configuration?";
            // TODO: put message in toast instead
        } else {
            btnEffect.innerHTML = `
            <i class="bi bi-check2"><span>Unknown error encountered!</span></i>`;
            toastMessage.innerHTML = `Unknown error encountered! ${responseCode}`;
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
</script>

<template>
    <link type="text/css" rel="stylesheet" href="css/common.css" media="all">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet"
        integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
    <!-- <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css" rel="stylesheet"> -->
    <div id="app">
        <!-- Toast -->
        <div role="alert" aria-live="assertive" aria-atomic="true" class="toast" data-bs-autohide="false">
            <div class="toast-container p-3 top-0 start-50 translate-middle-x" id="successToast">
                <div class="toast">
                    <div class="toast-header">
                        <i class="bi bi-check-square"></i>
                        <strong class="me-auto">Success!</strong>
                        <small>Just now</small>
                    </div>
                    <div class="toast-body" id="toastMessage">
                        Placeholder
                    </div>
                </div>
            </div>
        </div>
        <div class="container-fluid">
            <div class="row row-cols-2">

                <div class="col">
                    <h1>Configuration page</h1>
                </div>
                <div class="col">
                    <button class="btn btn-primary btn-configuration-apply" id="applyBtnEffect" @click="sendConfiguration">Apply</button>
                </div>
            </div>
            <div>Select one or more controllers from the list for configuration. If no advanced settings are set, the
                controller(s) will be configured as one 1025 pixels long strip.<br>
                            Hover over the fields for more information.
            </div>
            <div class="row row-cols-2">
                <div class="col">
                    <ControllerList @selected-mac-updated="getSelectedMacs"></ControllerList>
                </div>
                <div class="col">
                    <div class="row mt-3">

                        <Groupsettings @group-number-updated="getSelectedGroup" v-if="selection == 'mqtt'"></Groupsettings>

                        <!-- <div>
                            <p>Group selection is always required for configuration.</p>
                        </div> -->
                    </div>
                    <div class="row mt-3">
                        <!--<button class="btn btn-primary" type="button" data-bs-toggle="collapse"
                                    data-bs-target="#advancedSettings" aria-expanded="false"
                                    aria-controls="collapseExample">Advanced settings</button>-->

                        <div class="" id="advancedSettings">
                            <h3>Advanced settings</h3>

                            <input type="radio" class="btn-check" name="options-outlined" id="mqtt-outlined"
                                                            autocomplete="off" value="mqtt" v-model="selection">
                            <label class="btn btn-outline-secondary" for="mqtt-outlined">MQTT settings</label>

                            <input type="radio" class="btn-check" name="options-outlined" id="artnet-outlined"
                                                            autocomplete="off" value="artnet" v-model="selection">
                            <label class="btn btn-outline-secondary" for="artnet-outlined">Artnet settings</label>

                            <!-- MQTT instructions -->
                            <div id="instructions_mqtt" v-if="selection == 'mqtt'">
                                <h4>Settings for MQTT control</h4>
                                <p>Use these advanced settings if you control the LED-lights with 'Effect control'-tab
                                    or MQTT-messages.</p>
                                <p>
                                    The number and type of LED-lights connected to the controller, and the number
                                    of strips alter the final look on the effect.
                                </p>
                                <p>
                                    Some values are limited automatically to fit the controller's capabilities.
                                </p>
                            </div>

                            <!-- Artnet instructions -->
                            <div id="instructions_artnet" v-if="selection == 'artnet'">
                                <h4>Settings for Artnet control (WIP)</h4>
                                <p>Use these advanced settings if you control the LED-lights with Artnet.</p>
                                <p>
                                    Default starting network, subnet and universe for first controller is 0.<br>
                                    The number of universes used per controller is 6.<br>
                                    The maximum amount of pixels a controller can handle is 1020.<br>
                                    You can check how many lights can be connected to the controller by selecting the
                                    LED type and number of lights connected.
                                </p>
                                <p>
                                    <i>Pressing Apply will set the universes and turn Artnet ON for all the selected
                                    controllers, if Artnet off is not selected.</i><br>
                                    If Artnet off is selected, Artnet will be turned off for the selected controller(s)
                                    without setting the universes.
                                </p>
                                <p><strong>NOTE: these settings are not stored in the database and will reset every time!<br></strong></p>
                            </div>

                            <div class="input-group mb-3">
                                <label class="input-group-text" for="type-of-leds" data-bs-html="true" data-bs-toggle="tooltip" data-bs-placement="top"
                                            title="The length of LED-lights connected to the controller.<br>Different length LED-lights have different amounts of pixels, 1 pixel per 10 cm.">LED type</label>
                                <select class="form-select" id="type-of-leds" v-model="pixels"
                                            @change="calculateStrips" >
                                            <option value="0">Choose LED type...</option>
                                            <option value="5">0,5 m plastic</option>
                                            <option value="10">1 m plastic</option>
                                            <option value="15">1,5 m plastic</option>
                                            <option value="20">2,0 m aluminum</option>
                                            <option value="25">2,5 m plastic</option>
                                        </select>

                            </div>
                            <div class="input-group">
                                <span class="input-group-text" data-bs-html="true" data-bs-toggle="tooltip" data-bs-placement="top" title="The number of LED-lights connected to the controller.<br>The maximum number of LED-lights the controller can handle depends on the length of the LED-light.<br>Maximum amount of pixels a controller can handle is 1024.">Number of LED lights connected</span>
                                <input type="number" id="number-of-leds" class="form-control" v-model="lights" @change="calculateStrips">

                            </div>

                            <div class="input-group"  v-if="selection == 'mqtt'">
                                <span class="input-group-text" data-bs-html="true" data-bs-toggle="tooltip" data-bs-placement="top" title="Strips are virtual parts that the controller handles.<br>The connected LED-lights can be separated into 1-16 parts, e.g. grouped by every LED-light or every two LED-lights.<br>This changes the scale and repetition of lighting effects over all the connected LED-lights:<br>having one strip makes the effect span over all the connected lights,<br>while having 10 strips repeats the same effect 10 times over all the connected lights.">Number of strips (parts) to divide to</span>
                                <input type="number" id="number-of-strips" class="form-control" v-model="strips" @change="calculateStrips">
                            </div>

                            <!-- Show an error message if some setting are wrong. Not printing anything at this moment, just checking the values -->
                            <div class="error-message">{{ generateError }}</div>

                            <!-- Artnet settings -->
                            <div id="artnetsettings" v-if="selection == 'artnet'">                         
                                <div class="container">
                                    <div class="row mt-1 text-center">
                                        <div class="col-2"><strong>id #</strong></div>
                                        <div class="col-4"><strong>MAC</strong></div>
                                        <div class="col"><strong>Subnet</strong></div>
                                        <div class="col"><strong>Starting universe</strong></div>
                                        <div class="col"><strong>Artnet off</strong></div>
                                        <div class="col-sm-12">
                                            <div style='border-bottom:1px solid #ccc;'></div>
                                        </div>
                                        <div class="row mt-1 text-center" v-for="controller in selectedControllers" :id="controller.mac">
                                            <div class="col-2">{{ controller.id }}</div>
                                            <div class="col-4">{{ controller.mac }}</div>
                                            <div class="col"><input type="number" :id="'artnetsubnet.' + controller.mac" class="form-control" min="0" max="15" v-model="controller.artnet_subnet"></div>
                                            <div class="col"><input type="number" :id="'artnetuniverse.' + controller.mac" class="form-control" min="0" max="15" v-model="controller.artnet_universe"></div>
                                            <div class="col"><input type="checkbox" v-model="controller.artnet_off" class="form-check-input" @change="calculateUniverse(selectedControllers)"></div>
                                        </div>
                            
                                    </div>
                                </div>
                            </div>
                            <!-- End of Artnet settings -->

                            <div v-if="selection == 'mqtt'">
                                <br>
                                <h4>JSON preview</h4>
                                <textarea rows="10" cols="40" id="jsonpreview" readonly>{{ generateJSONpreview }} </textarea>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

</template>