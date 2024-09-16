<template>
    <div>
            <script type="module" src="../controllerlist.js"></script>
            <script type="module" src="../grouplist.js"></script>
            <link type="text/css" rel="stylesheet" href="../common.css" media="all">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                textarea {
                    resize: none;
                }
            </style>
        <div class="container-fluid">
            <h1>Configuration page</h1>
            <div class="row row-cols-2">
                <div class="col">
                    <div id="controllerlist">
                        <div class="btn-toolbar justify-content-between" role="toolbar"
                            aria-label="Toolbar with button groups">
                            <div class="btn-group me-2" role="group" aria-label="First group">
                                <button type="button" class="btn btn-secondary" id="selectAllBtn" @click="selectAll">Select
                                all</button>
                                <button type="button" class="btn btn-secondary" id="selectNoneBtn"
                                @click="selectNone">Remove selection</button>

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
                                                <input type="checkbox" id="lan" name="lan" checked />
                                                <label for="lan">lan</label>
                                            </div>
                                            <div>
                                                <input type="checkbox" id="wifi" name="wifi"
                                                checked />
                                                <label for="wifi">wifi</label>
                                            </div>
                                            <div>
                                                <input type="checkbox" id="notset" name="notset" 
                                                checked />
                                                <label for="notset">not set</label>
                                            </div>
                                            <br>
                                            <div>
                                                Filter by MAC
                                                <input type="text" id="mac" name="mac" size="20" />
                                            </div>
                                            <br>
                                            <div class="flex">
                                                <button class="btn" id="rmv-filters-btn" @click="removeFilters">Remove
                                                filters</button>
                                                <button class="btn" id="set-filters-btn" @click="filterData">Set
                                                filters</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div id="controllerlist">
                            <table>
                                <thead>
                                    <tr>
                                        <th>MAC</th>
                                        <th>Device type</th>
                                        <th>Last registered online</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="rowData in filteredData" :key="rowData.mac" @click="selectRow(rowData)">
                                        <td>{{ rowData.mac }}</td>
                                        <td>{{ rowData.type }}</td>
                                        <td>{{ rowData.last_seen }}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <Groupsettings id="groupsettings" @selectedMacUpdated="getSelectedMacs">
                    <div class="col bg-primary-subtle">

                        <div class="row">
                            <div class="input-group set-into-group">
                                <label class="input-group-text" for="groupSelect">Set selected controller(s) into group:
                            </label>
                                <select class="form-select" v-model="group_number" id="groupSelect">
                                <option value="0">Choose group...</option>
                                <option v-for="group in groupData" :key="group.group_id" :value="group.group_id">{{
                                    group.group_name }}</option>
                            </select>
                            </div>
                        </div>
                        <div class="row">
                            <button class="btn btn-primary" type="button" data-bs-toggle="collapse"
                            data-bs-target="#advancedSettings" aria-expanded="false" aria-controls="collapseExample">
                            Advanced settings
                        </button>
                            <div class="collapse" id="advancedSettings">
                                <div class="input-group mb-3">
                                    <label class="input-group-text" for="type-of-leds">LED type</label>
                                    <select class="form-select" id="type-of-leds" v-model="pixels"
                                    @change="calculateStrips">
                                    <option value="0">Choose...</option>
                                    <option value="5">0,5 m plastic</option>
                                    <option value="10">1 m plastic</option>
                                    <option value="15">1,5 m plastic</option>
                                    <option value="20">2,0 m aluminum</option>
                                    <option value="25">2,5 m plastic</option>
                                </select>
                                </div>
                                <div class="input-group">
                                    <span class="input-group-text">Number of LED lights connected</span>
                                    <input type="number" id="number-of-leds" class="form-control" v-model="lights"
                                    @change="calculateStrips">
                                </div>

                                <div class="input-group">
                                    <span class="input-group-text">Number of parts (strips) to divide to</span>
                                    <input type="number" id="number-of-strips" class="form-control" v-model="strips">
                                </div>
                                <div>
                                    <br>
                                    <h4>JSON preview</h4>
                                    <textarea rows="20" cols="50" readonly>{{ generateJSONpreview }} </textarea>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col">
                                <div class="d-flex justify-content-end"><button class="btn btn-primary">Apply</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </Groupsettings>



            </div>
        </div>
    </div>
</template>

<script>
    export default {

    data() {
        return {
            local: "This variable is local to the Home view"
        }
    },
}
</script>

<style scoped>
    .blueclass {
        color: blue;
    }
</style>