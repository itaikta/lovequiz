/*
*
* Tab switching form code thanks to W3 schools!
* https://www.w3schools.com/howto/howto_js_form_steps.asp?
*
*/

const qualities = {
    desired: [],
    your: [],
    challenging: [],
    married: [],
    roleModel: [],
    balancing: []
};


let currentTabindex = 0; // Current tab is set to be the first tab (0)
showTab(currentTabindex); // Display the current tab

function showTab(tabIndex) {
    // This function will display the specified tab of the form...
    const tabs = document.getElementsByClassName("tab");
    tabs[tabIndex].style.display = "block";
    
    // update the Previous/Next buttons:
    const nextButton = document.getElementById("nextBtn");
    const prevButton = document.getElementById("prevBtn");
    if (tabIndex > 1) {
        prevButton.style.display = "inline";
    } else {
        prevButton.style.display = "none";
    }
    if (tabIndex !== 0) {
        nextButton.innerHTML = "Next";
    }
    if (tabIndex === tabs.length - 1) {
        nextButton.style.display = "none";
        prevButton.style.display = "none";
    }
}

function navigateTab(action) { // When action == 1, go to next tab. When Action == -1, go to previous
    // This function will figure out which tab to display
    const tabs = document.getElementsByClassName("tab");
    // Exit the function if any field in the current tab is invalid:
    if (action === 1 && !validateForm()) return false;
    // Hide the current tab:
    tabs[currentTabindex].style.display = "none";
    // Increase or decrease the current tab
    currentTabindex += action;
    // if you have reached the end of the form...
    if (currentTabindex >= tabs.length) {
        // ... the form gets submitted:
        document.getElementById("regForm").submit();
        return false;
    }
    // Otherwise, display the correct tab:
    showTab(currentTabindex);
}

// This function deals with validation of the form fields
function validateForm() {
    let valid = true;
    const tabs = document.getElementsByClassName("tab");
    const currentTabInputs = tabs[currentTabindex].getElementsByTagName("input");
    // A loop that checks every input field in the current tab:
    for (let i = 0; i < currentTabInputs.length; i++) {
        // If a field is empty...
        if (currentTabInputs[i].value == "") {
            // add an "invalid" class to the field:
            currentTabInputs[i].className += " invalid";
            // and set the current valid status to false
            valid = false;
        }
    }
    return valid; // return the valid status
}
