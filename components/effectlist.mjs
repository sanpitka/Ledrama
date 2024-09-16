// effectlist.js

import { Toast } from '/uibuilder/vendor/bootstrap/dist/js/bootstrap.bundle.js';

export default {
    // Define Vue reactive variables
    data() {
        return {
            effectData: [],
            filteredData: [],
            selected_effect: {},
            newEffectName: '',
            search: "",
            saveEffectName: "",
            effectNames: [],
        };
    },
    template:
        `<div class="row">
            <div class="list-group" id="savedEffects">
                <input id="effect-search" v-model="search" type="text" placeholder="Search..." @input="filterEffects">
                <li id="myList" name="listItem" v-for="effect in filteredData" :key="effect.name" class="list-group-item">
                    <input class="form-check-input me-1" v-model="selected_effect" :value="effect" type="radio" name="listGroupRadio" :id="effect.name" @change="updateEffect">
                    <label class="form-check-label stretched-link" :for="effect.name">{{ effect.name }}</label>
                </li>
            </div>
        </div>
        `,

    components: {

    },

    // Dynamic data
    computed: {


    },

    // Supporting functions
    methods: {

        async fetchData() {
            try {
                const response = await fetch('/api/effects');
                const data = await response.json();
                this.effectData = data;
                this.filteredData = [...this.effectData];
                this.effectData.forEach((effect => this.effectNames.push(effect.name)));
                this.$emit('effectListUpdated', this.effectData);
            }
            catch (error) {
                console.error('Error fetching data:', error);
            }
        },

        parseData(data) {
            try {
                const parsedArray = JSON.parse(data);
                if (Array.isArray(parsedArray)) {
                    return parsedArray;
                } else {
                    console.error("Effectlist was not an array.");
                    return null;
                }
            } catch (error) {
                console.error("Error parsing JSON:", error.message);
                return null;
            }
        },
        updateEffect() {
            // broadcast the group to parent component
            //console.log("Child selected effect: ", JSON.stringify(this.selected_effect));
            try {
                this.$emit('effectUpdated', this.selected_effect);
                //this.selected_effect = new Object();
            } catch (error) {
                console.log(error)
            }
        },
        filterEffects() {
            this.filteredData = [...this.effectData];
            var searchInput = this.search.toLowerCase();
            if (searchInput.length > 0) {
                this.filteredData = this.filteredData.filter(function (obj) {
                    return obj.name.toLowerCase().includes(searchInput);
                });
            }
        },
        async createNewEffect() {
            try {
                const newEffectData = {
                    //"topic": "set/topic/here",
                    "name": this.newEffectName,
                    "payload": {
                        "sEffect": 0,
                        "nVal": 0,
                        "bpm": 0
                    }
                }
                // TODO: Switch to POST request?
                uibuilder.send(newEffectData);
                console.log("Sent new effect to backend: " + JSON.stringify(newEffectData));
                // TODO probably: Update effects list after creating a new one

            } catch (error) {
                console.log(error);
            }

        },
        closeSaveModal() {
            document.getElementById("closeSaveModal").click()
        },
        saveEffect() {
            try {
                console.log("Entered name: " + this.saveEffectName);
                if (this.saveEffectName != null && this.saveEffectName != "") { //TODO Filter out more bad names
                    let keys = [];
                    this.effectData.forEach((effect => keys.push(effect.name)));
                    //keys.forEach((element) => console.log(element));
                    if (!keys.includes(this.saveEffectName)) {
                        //uibuilder.send(this.selected_effect);
                        console.log("Sent new effect to backend: " + JSON.stringify(this.selected_effect));
                        this.saveBtnEffect();
                        this.createNewEffect();
                        this.closeSaveModal();
                    }
                    else {
                        //Alert user of existing name
                        console.log("Name already exists. Overwrite?");
                    }
                }
                else {
                    //Alert of invalid name
                    console.log("Invalid effect name");
                }
            } catch (error) {
                console.log(error);
            }
        },
        checkEffectNameClash() {
            const inputBox = document.getElementById("save-effect-name")
            inputBox.classList.remove("is-invalid");
            // TODO: Make this use Set instead, its O(1), while includes is O(n)
            // https://www.tech-hour.com/javascript-performance-and-optimization
            if (this.effectNames.includes(inputBox.value)) {
                console.log("hit");
                inputBox.classList.add("is-invalid");
            }

        },
        saveBtnEffect() {

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
                btnEffect.innerHTML = `
                <i class="bi bi-check2"><span>Success!</span></i>`;
                new Promise((resolve, reject) => {
                    setTimeout(function () {
                        resolve("Success!")
                    }, 1500)
                }).then(function () {
                    btnEffect.innerHTML = "Save";
                })
                var toastElList = [].slice.call(document.querySelectorAll('.toast'))
                var toastList = toastElList.map(function (toastEl) {
                    // Creates an array of toasts (it only initializes them)
                    return new Toast(toastEl) // No need for options; use the default options
                });
                toastList.forEach(toast => toast.show()); // This shows them
            })
        },
    },
    emits: ['effectUpdated', 'effectListUpdated'],

    // Lifecycle hooks
    mounted() {
    },

    beforeMount() {
        this.fetchData();
    },
};

