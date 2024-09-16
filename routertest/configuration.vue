<script>
import {loadScript} from './load-script.mjs'
loadScript('../../uibuilder/uibuilder.esm.min.js');  // Adds `uibuilder` and `$` to globals
import ControllerList from './controllerlist.mjs';
import Groupsettings from './grouplist.mjs';
// TODO: include filter button

export default {
    components: {
        ControllerList: ControllerList,
        Groupsettings: Groupsettings
    },
    data() {
        return {
            selectedMacs: [],
            group_number: 0,
            total_pixels: 0,
            pixels: 0,
            lights: 1,
            strips: 1,
            manual_strips: false,
            output_message: [],
        }
    },
    methods: {
        getSelectedMacs(selectedMacs) {
            //console.log("Selected macs from event: ", selectedMacs);
            this.selectedMacs = selectedMacs;

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
            // check that the pixel count does not exceed 1024
            this.total_pixels = this.lights * this.pixels;

            //console.log("Total pixels: " + this.total_pixels);
            if (this.total_pixels >= 1024) {
                console.log("Pixel limit exceeded.")
                //TODO: trigger info for user
            }


        },
        sendConfiguration() {
            console.log("Apply button pressed.");

            // Validate required values
            if (this.selectedMacs.length > 0 && this.group_number > 0) {

                //TODO: collect and format configuration data for backend
                uibuilder.send(this.output_message);
                console.log("Sent configuration data to backend: ", JSON.stringify(this.output_message));
            } else {
                console.log("Group or controller missing");
                // Grop or controller data missing
                //TODO: trigger info for user
                let errmsg = "Can't apply configuration: "
                if (this.selectedMacs.length === 0) {
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
        },
    },
    mounted() {

    },
    computed: {
        generateJSONpreview() {
            const not_set = "Select one or multiple controllers and select group to see a preview of the JSON messages."
            let output = [];

            // Check if values are 0
            if (this.selectedMacs.length === 0 || this.group_number === 0) {
                return not_set; // Return default text
            }

            if (this.selectedMacs && this.selectedMacs.length > 0) {

                // Generate the full output message for each selected controller
                this.selectedMacs.forEach((mac) => {

                    for (let i = 0; i < this.strips; i++) {
                        let strip_size = 1024;
                        if (this.pixels !== 0) {
                            strip_size = Math.round(this.total_pixels / this.strips);
                        }

                        let jsonData = {
                            topic: "ledrama/config/set/" + mac + "/" + i,
                            payload: {
                                sGroup: this.group_number,
                                useStrips: this.strips,
                                sRange: [i * strip_size, (i + 1) * strip_size - 1] // -1, because pixels start from index 0
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
        }
    },

}


</script>
<template>
                <link type="text/css" rel="stylesheet" href="../common.css" media="all">
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet"
                    integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
                <!-- <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css" rel="stylesheet"> -->
        <div id="app">
            <div class="container-fluid">
                <h1>Configuration page</h1>
                <div>Select one or more controllers from the list for configuration. If no advanced settings are set, the
                    controller(s) will be configured as one long strip.</div>
                <div class="row row-cols-2">
                    <div class="col">
                        <ControllerList @selected-mac-updated="getSelectedMacs"></ControllerList>
                    </div>
                    <div class="col">
                        <div class="row mt-3">
        
                            <Groupsettings @group-number-updated="getSelectedGroup"></Groupsettings>
        
                            <div>
                                <p>Group selection is always required for configuration.</p>
                            </div>
                        </div>
                        <div class="row mt-3">
                            <!--<button class="btn btn-primary" type="button" data-bs-toggle="collapse"
                                    data-bs-target="#advancedSettings" aria-expanded="false"
                                    aria-controls="collapseExample">Advanced settings</button>-->
        
                            <div class="" id="advancedSettings">
                                <h2>Advanced settings</h2>
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
                                <div class="input-group">
                                    <span class="input-group-text" data-bs-html="true" data-bs-toggle="tooltip" data-bs-placement="top" title="Strips are virtual parts that the controller handles.<br>The connected LED-lights can be separated into 1-16 parts, e.g. grouped by every LED-light or every two LED-lights.<br>This changes the scale and repetition of lighting effects over all the connected LED-lights:<br>having one strip makes the effect span over all the connected lights,<br>while having 10 strips repeats the same effect 10 times over all the connected lights.">Number of strips (parts) to divide to</span>
                                    <input type="number" id="number-of-strips" class="form-control" v-model="strips" @change="calculateStrips">
        
                                </div>
                                <div>
                                    <br>
                                    <h4>JSON preview</h4>
                                    <textarea rows="10" cols="40" id="jsonpreview" readonly>{{ generateJSONpreview }} </textarea>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col">
                                <div class="d-flex justify-content-end">
                                    <button class="btn btn-primary" @click="sendConfiguration">Apply</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

</template>

