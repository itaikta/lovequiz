/*
*
* Tab switching form code thanks to W3 schools!
* https://www.w3schools.com/howto/howto_js_form_steps.asp?
*
*/

// Globals are so much fun. Gotta love JS

const qualities = {
    desired: [],
    your: [],
    challenging: [],
    married: [],
    roleModel: [],
    balancing: []
};

// The index of this array corresponds to the method that will be called to process the data from the current tab
const processTab = [
    null, // The first page is just the intro
    (tab) => populateArr(tab, qualities.desired),
    (tab) => populateArr(tab, qualities.your),
    (tab) => populateArr(tab, qualities.challenging),
    (tab) => populateArr(tab, qualities.married),
    (tab) => populateArr(tab, qualities.roleModel),
    
]

let currentTabIndex = 0; // Current tab is set to be the first tab (0)
showTab(currentTabIndex); // Display the current tab

// This function will display the specified tab of the form
function showTab(tabIndex) {
    console.log("Showing tab #", tabIndex);
    const tabs = document.getElementsByClassName("tab");
    const currentTab = tabs[tabIndex];
    currentTab.style.display = "block"; // Activate tab

    if (currentTab.id === "balance") {
        setupBalance(currentTab);
    }
    else if (currentTab.id === "priorities") {
        setupPriorities(currentTab); // TODO
    }
    
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

function navigateTab(action) { // action: 1 for next tab, -1 for previous tab
    const tabs = document.getElementsByClassName("tab");
    const currentTab = tabs[currentTabIndex];

    if (action === 1 && !validateForm(currentTab)) return;
    
    const processFun = processTab[currentTabIndex];
    if (processFun) processFun(currentTab);
    
    currentTab.style.display = "none"; // Deactivate tab

    // Display the upcoming tab:
    currentTabIndex += action;
    showTab(currentTabIndex);
}

// Validation of the form fields
function validateForm(tab) {
    let valid = true;
    const inputs = tab.getElementsByTagName("input");
    
    for (const input of inputs) {
        if (input.value == "") { // Field is empty
            input.className += " invalid"; // Sets the red background
            valid = false;
        }
    }

    return valid;
}

function populateArr(tab, arr) {
    const inputs = tab.getElementsByTagName("input");
    for (const input of inputs) {
        arr.push(input.value);
    }
    console.log(JSON.stringify(arr));
}

function setupBalance(currentTab) {
    const challengeDiv = currentTab.querySelector("#challenging");
    for (const challengeStr of qualities.challenging) {
        const challengeElement = document.createElement("div");
        challengeElement.className = "qualityListItem";
        challengeElement.innerText = challengeStr;
        challengeDiv.appendChild(challengeElement);
    }

    const balanceDiv = currentTab.querySelector("#balanced");
    let allOtherQualities = qualities.desired.concat(qualities.married, qualities.roleModel, qualities.your);
    console.log("All qualities:", JSON.stringify(allOtherQualities));
    for (const challengeStr of allOtherQualities) {
        const qualityButton = document.createElement("button");
        qualityButton.type = "button";
        qualityButton.className = "qualityListItem qualitySelection";
        qualityButton.innerText = challengeStr;
        qualityButton.onclick = () => toggleQualitySelect(qualityButton);
        balanceDiv.appendChild(qualityButton);
    }
}

function toggleQualitySelect(qualityButton) { // TODO
    console.log("buttonclick:", qualityButton.innerText);
}

function setupPriorities(currentTab) { // TODO
    console.log("PRIORITIES");
}