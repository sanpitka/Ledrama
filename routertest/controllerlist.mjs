// controllerlist.js

export default {
    // Define Vue reactive variables
    data() {
        return {
            tableData: [],
            selectedMac: [],
            filteredData: [],
            filters: { lan: true, wifi: true, notset: true, mac: "" },
        };
    },
    template: `
    <div class="btn-toolbar justify-content-between" role="toolbar" aria-label="Toolbar with button groups">
        <div class="btn-group me-2" role="group" aria-label="First group">
            <button type="button" class="btn btn-secondary" id="selectAllBtn" @click="selectAll">Select all</button>
            <button type="button" class="btn btn-secondary" id="selectNoneBtn" @click="selectNone">Remove selection</button>
        </div>
        <div>
            <!-- Trigger/Open The Filter Modal -->
            <button type="button" class="btn btn-primary" id="filterBtn">Filter...</button>

            <!-- The Modal -->
            <div id="filterModal" class="modal">

                <!-- Modal content -->
                <div class="modal-content">
                    <div class="flex">
                        <h3>Select filters</h3>
                        <span class="close" style="float: right">&times;</span>
                    </div>
                    <div>

                        Select type
                        <div>
                            <input type="checkbox" id="lan" name="lan" v-model="filters.lan" checked />
                            <label for="lan">lan</label>
                        </div>
                        <div>
                            <input type="checkbox" id="wifi" name="wifi" v-model="filters.wifi" checked />
                            <label for="wifi">wifi</label>
                        </div>
                        <div>
                            <input type="checkbox" id="notset" name="notset" v-model="filters.notset" checked />
                            <label for="notset">not set</label>
                        </div>
                        <br>
                        <div>
                            Filter by MAC
                            <input type="text" id="mac" name="mac" size="20" v-model="filters.mac"/>
                        </div>
                        <br>
                        <div class="flex">
                            <button class="btn" id="rmv-filters-btn" @click="removeFilters">Remove filters</button>
                            <button class="btn" id="set-filters-btn" @click="filterData">Set filters</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div id="controllerlist" class="scrollable">
        <table>
            <thead>
                <tr>
                    <th>MAC</th>
                    <th>Device type</th>
                    <th>Last registered online</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="rowData in filteredData" class="tr" :key="rowData.mac"
                    @click="selectRow(rowData)" :id="rowData.mac">
                    <td>{{ rowData.mac }}</td>
                    <td>{{ rowData.type }}</td>
                    <td>{{ rowData.last_seen }}</td>
                </tr>
            </tbody>
        </table>
    </div>`,

    components: {},

    // Dynamic data
    computed: {

    },

    // Supporting functions
    methods: {

        async fetchData() {
            try {
                const response = await fetch('/api/controllerlist'); // Replace with your API endpoint
                const data = await response.json();
                this.tableData = data;
                this.filteredData = [...this.tableData];

            } catch (error) {
                console.error('Error fetching data:', error);
            }
        },

        parseData(data) {
            try {
                const parsedArray = JSON.parse(data);
                if (Array.isArray(parsedArray)) {
                    return parsedArray;
                } else {
                    console.error("Controllerlist was not an array.");
                    return null;
                }
            } catch (error) {
                console.error("Error parsing JSON:", error.message);
                return null;
            }
        },

        selectRow(rowData) {
            //Find the row element
            const row = document.getElementById(rowData.mac)

            const macIndex = this.selectedMac.indexOf(rowData.mac);
            if (macIndex > -1) {
                this.selectedMac.splice(macIndex, 1);
                row.classList.remove('selected');
            } else {
                this.selectedMac.push(rowData.mac);
                row.classList.add('selected');
            }

            // Emit an event when selectedMac array is updated
            this.$emit('selectedMacUpdated', this.selectedMac);

            console.log("Selected Mac-addresses: ", this.selectedMac)
        },

        selectAll() {
            console.log("Select all pressed");
            this.filteredData.forEach(rowData => {
                if (!this.selectedMac.includes(rowData.mac)) {
                    this.selectRow(rowData);
                }
            });

        },

        selectNone() {
            console.log("Select none pressed")
            this.selectedMac = [];
            console.log("Selected macs emptied: " + this.selectedMac);

            const rows = document.getElementsByClassName('selected');
            Array.from(rows).forEach(tr => {
                tr.classList.remove('selected');
            });
        },

        filterData() {
            this.filteredData = [...this.tableData];
            var macFilter = this.filters.mac;

            if (this.filters.lan == false) {
                this.filteredData = this.filteredData.filter(function (obj) {
                    return obj.type !== "lan";
                });
                console.log(this.filteredData);
                console.log("Lan poistettu");
            }

            console.log(this.filteredData);

            if (this.filters.wifi == false) {
                this.filteredData = this.filteredData.filter(function (obj) {
                    return obj.type !== "wifi";
                });
                console.log(this.filteredData);
                console.log("Wifi poistettu")
            }

            console.log(this.filteredData);

            if (this.filters.notset == false) {
                this.filteredData = this.filteredData.filter(function (obj) {
                    return obj.type !== "not_set";
                });
                console.log(this.filteredData);
                console.log("Not set poistettu")
            }

            console.log(this.filteredData);

            if (macFilter.length > 0) {
                this.filteredData = this.filteredData.filter(function (obj) {
                    return obj.mac.startsWith(macFilter);
                });
                console.log(this.filteredData);
            }
        },

        removeFilters() {
            this.filters = { lan: true, wifi: true, notset: true, mac: "" };
            this.filteredData = [];
            this.filteredData = [...this.tableData];

        },

    },
    emits: ['selectedMacUpdated'],


    // Lifecycle hooks
    mounted() {

    },
    beforeMount() {
        this.fetchData();
    },
};
