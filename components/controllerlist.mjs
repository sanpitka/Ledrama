// controllerlist.js

export default {
    // Define Vue reactive variables
    data() {
        return {
            tableData: [],
            selectedRows: [],
            filteredData: [],
            filters: { lan: true, wifi: true, notset: true, mac: "" },
        };
    },
    template: `
    <div class="btn-toolbar justify-content-between" role="toolbar" aria-label="Toolbar with button groups">
        <div class="btn-group me-2 btn-group-controllerlist" role="group" aria-label="First group">
            <button type="button" class="btn btn-primary btn-controller-list" id="selectAllBtn" @click="selectAll">Select all</button>
            <button type="button" class="btn btn-primary btn-controller-list" id="selectNoneBtn" @click="selectNone">Remove selection</button>
        </div>
    </div>
    <div id="controllerlist" class="scrollable">
        <table id="controllerTable">
            <thead>
                <tr>
                    <th data-bs-toggle="tooltip" data-bs-title="Controller ID number written on the physical controller" data-bs-placement="top" @click="sortTable(0)">ID #</th>
                    <th data-bs-toggle="tooltip" data-bs-title="MAC address the controller can be identified with online" data-bs-placement="top" @click="sortTable(1)">MAC</th>
                    <th data-bs-toggle="tooltip" data-bs-title="The way the controller connects to the internet" data-bs-placement="top" @click="sortTable(2)">Device type</th>
                    <th data-bs-toggle="tooltip" data-bs-title="Time the controller was last seen online by the server" data-bs-placement="top" @click="sortTable(3)">Last registered online</th>
                    <th data-bs-toggle="tooltip" data-bs-title="Group name and number the controller was last set to" data-bs-placement="top" @click="sortTable(4)">Last set to group</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="rowData in filteredData" class="tr" :key="rowData.mac"
                    @click="selectRow(rowData)" :id="rowData.mac">
                    <td>{{ rowData.controller_id }}</td>
                    <td>{{ rowData.mac }}</td>
                    <td>{{ rowData.type }}</td>
                    <td>{{ convertToHelsinkiTime(rowData.last_seen) }}</td>
                    <td>{{ rowData.group_name }} ({{ rowData.last_group }})</td>
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

            // Find the index of the row data in the selectedRows array
            const rowIndex = this.selectedRows.findIndex(row => row.mac === rowData.mac);

            if (rowIndex > -1) {
                // If it is in the array, remove it
                this.selectedRows.splice(rowIndex, 1);
                row.classList.remove('selected');
            } else {
                // Add the whole row data to the selectedRows array
                this.selectedRows.push(rowData);
                row.classList.add('selected');
            }

            // Emit an event when selectedMac array is updated
            this.$emit('selectedMacUpdated', this.selectedRows);

            //console.log("Selected Mac-addresses: ", this.selectedRows);
        },

        selectAll() {
            //console.log("Select all pressed");
            this.filteredData.forEach(rowData => {
                // Check if the rowData object is already in the selectedRows array
                const rowIndex = this.selectedRows.findIndex(row => row.mac === rowData.mac);
                if (rowIndex === -1) {
                    // If it's not in the array, add it
                    this.selectRow(rowData);
                }
            });
        },

        selectNone() {
            //console.log("Select none pressed")
            this.selectedRows = [];
            //console.log("Selected macs emptied: " + this.selectedRows);

            const rows = document.getElementsByClassName('selected');
            Array.from(rows).forEach(tr => {
                tr.classList.remove('selected');
            });
        },

        filterData() {
            this.filteredData = [...this.tableData];
            var macFilter = this.filters.mac.toUpperCase();

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
        sortTable(n) { //Param: column index
            var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
            table = document.getElementById("controllerTable");
            switching = true;
            dir = "asc";
            while (switching) {
                switching = false;
                rows = table.rows;
                for (i = 1; i < (rows.length - 1); i++) {
                    shouldSwitch = false;
                    x = rows[i].getElementsByTagName("TD")[n];
                    y = rows[i + 1].getElementsByTagName("TD")[n];
                    if (dir == "asc") {
                        if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                            shouldSwitch = true;
                            break;
                        }
                    } else if (dir == "desc") {
                        if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
                            shouldSwitch = true;
                            break;
                        }
                    }
                }
                if (shouldSwitch) {
                    rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
                    switching = true;
                    switchcount++;
                } else {
                    if (switchcount == 0 && dir == "asc") {
                        dir = "desc";
                        switching = true;
                    }
                }
            }
        },
        
        convertToHelsinkiTime(dateString) {
            const date = new Date(dateString);
            return date.toLocaleString('fi-FI', { timeZone: 'Europe/Helsinki' });
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
