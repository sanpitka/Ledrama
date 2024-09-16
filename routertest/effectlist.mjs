// effectlist.js

export default {
    // Define Vue reactive variables
    data() {
        return {
            effectData: [],
            filteredData: [],
            selected_effect: {},
        };
    },
    template:
        `<div class="row">
            <div class="list-group" id="savedEffects">
                <input id="myInput" v-model="search" type="text" placeholder="Search.." @input="filterEffects">
                <li id="myList" name="listItem" v-for="effect in filteredData" :key="effect.name" class="list-group-item">
                    <input class="form-check-input me-1" v-model="selected_effect" :value="effect" type="radio" name="listGroupRadio" :id="effect.name">
                    <label class="form-check-label stretched-link" :for="effect.name">{{ effect.name }}</label>
                </li>
            </div>
        </div>
        <div class="row">
            <div class="btn-group-vertical" role="group" aria-label="Vertical button group">
                <button class="btn btn-primary w-50 mx-auto" data-bs-toggle="tooltip" data-bs-placement="top" 
                    data-bs-title="Load selected effect on the page" @click="updateEffect">Load effect</button>
                <button class="btn btn-primary w-50 mx-auto" data-bs-toggle="popover" data-bs-title="To be implemented" 
                    data-bs-content="Save effect will open a window to save your new custom effect, or previously saved and modified effect">Save effect</button>
                <button class="btn btn-danger w-50 mx-auto mt-3" data-bs-toggle="popover" data-bs-title="To be implemented" 
                    data-bs-content="Delete effect will delete the selected effect from the above Saved effects-list">Delete effect</button>
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
        updateEffect(selectedEffect) {
            // broadcast the group to parent component
            //console.log("Child selected effect: ", JSON.stringify(this.selected_effect));
            try {
                this.$emit('effectUpdated', this.selected_effect);
                this.selected_effect = new Object();
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
        }
    },
    emits: ['effectUpdated'],

    // Lifecycle hooks
    mounted() {
    },

    beforeMount() {
        this.fetchData();
    },

};
