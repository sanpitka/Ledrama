var modal = document.getElementById("filterModal");
var filterBtn = document.getElementById("filterBtn");
var closeBtn = document.getElementsByClassName("close")[0];
var setFiltersBtn = document.getElementById("set-filters-btn");
var removeFiltersBtn = document.getElementById("rmv-filters-btn");
var lanCheckbox = document.getElementById("lan");
var wifiCheckbox = document.getElementById("wifi");
var notSetCheckbox = document.getElementById("notset");
var macInput = document.getElementById("mac")

// When the user clicks on the button, open the modal
filterBtn.onclick = function () {
    modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
closeBtn.onclick = function () {
    modal.style.display = "none";
}

setFiltersBtn.onclick = function () {
    if (lanCheckbox.checked && wifiCheckbox.checked && notSetCheckbox.checked && macInput.value == "") {
        filterBtn.style.backgroundColor = "#f1f1f1"
        modal.style.display = "none";
    }
    else {
        filterBtn.style.backgroundColor = "#00ABE7";
        modal.style.display = "none";
    }
}

//Remove all the filters
removeFiltersBtn.onclick = function () {
    filterBtn.style.backgroundColor = "#f1f1f1";
    lanCheckbox.checked = "true";
    wifiCheckbox.checked = "true";
    notSetCheckbox.checked = "true";
    macInput.value = "";
    modal.style.display = "none";

}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}