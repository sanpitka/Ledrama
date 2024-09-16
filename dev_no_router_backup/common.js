// Easy import the same version of bootstrap for all pages
import 'https://ledrama-dev.vector.fi/uibuilder/vendor/bootstrap/dist/js/bootstrap.bundle.js';
import '../uibuilder/uibuilder.esm.min.js';

window.openPage = function openPage(pageUrl) {
    const iframe = document.getElementById('content-iframe');
    iframe.src = pageUrl;
}

// Tooltips
const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))

// Bootstrap popovers
const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]')
const popoverList = [...popoverTriggerList].map(popoverTriggerEl => new bootstrap.Popover(popoverTriggerEl))
