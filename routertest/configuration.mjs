import '../../uibuilder/uibuilder.esm.min.js'  // Adds `uibuilder` and `$` to globals
import ControllerList from '../controllerlist.js';
import Groupsettings from '../grouplist.js';

export default {
    components: {
        controllerlist: ControllerList,
        groupsettings: Groupsettings
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

