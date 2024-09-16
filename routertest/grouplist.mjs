// grouplist.js

export default {
    // Define Vue reactive variables
    data() {
        return {
            groupData: [],
            group_number: 0,
        };
    },
    template:
        `<div class="input-group set-into-group">
            <label class="input-group-text" for="groupSelect">Select group: </label>
            <select class="form-select" v-model="group_number" id="groupSelect" @change="updateGroup" required>
                <option value="">Choose group...</option>
                <option v-for="group in groupData" :key="group.group_id" :value="group.group_id">{{ group.group_name }}</option>
            </select>
            <div class="invalid-feedback">Group is required</div>
        </div>`,

    components: {

    },

    // Dynamic data
    computed: {

    },

    // Supporting functions
    methods: {

        async fetchData() {
            try {
                const response = await fetch('/api/groups');
                const data = await response.json();
                this.groupData = data;
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
                    console.error("Grouplist was not an array.");
                    return null;
                }
            } catch (error) {
                console.error("Error parsing JSON:", error.message);
                return null;
            }
        },
        updateGroup() {
            // broadcast the group to parent component
            //console.log("Group number: ", this.group_number);
            this.$emit('groupNumberUpdated', this.group_number);
        }
    },
    emits: ['groupNumberUpdated'],

    // Lifecycle hooks
    mounted() {
    },

    beforeMount() {
        this.fetchData();
    },

};