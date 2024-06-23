/*
 *
 * Tab switching form code thanks to W3 schools!
 * https://www.w3schools.com/howto/howto_js_form_steps.asp?
 *
 */

let currentTabIndex = 0; // Current tab is set to be the first tab (0)
showTab(currentTabIndex); // Display the current tab
populateQualitySuggestions();

// This function will display the specified tab of the form
function showTab(tabIndex) {
    const tabs = document.getElementsByClassName("tab");
    const currentTab = tabs[tabIndex];
    currentTab.style.display = "block"; // Activate tab

    // Hide/show suggested quality master list 
    document.getElementById("desiredQualitiesMasterList").style.display = currentTab.className.includes("desiredQualities") ? "block" : "none";
    document.getElementById("challengingQualitiesMasterList").style.display = currentTab.className.includes("challengingQualities") ? "block" : "none";

    if (currentTab.id === "balance") {
        setupBalance();
    }

    // update the Previous/Next buttons:
    const nextButton = document.getElementById("nextBtn");
    const prevButton = document.getElementById("prevBtn");

    prevButton.style.display = tabIndex > 1 ? "inline" : "none";

    if (tabIndex !== 0) {
        nextButton.innerHTML = "Next";
    }
    if (tabIndex === tabs.length - 1) {
        nextButton.style.display = "none";
        prevButton.style.display = "none";
        populateFinalQualities();
    }
}

function navigateTab(action) { // action: 1 for next tab, -1 for previous tab
    const tabs = document.getElementsByClassName("tab");
    const currentTab = tabs[currentTabIndex];

    // If it's the priority list tab, don't the the user proceed unless the list is valid
    if (currentTab.id.includes("balance") && action === 1 && !validatePriorityList()) return;

    currentTab.style.display = "none"; // Deactivate tab

    // Display the upcoming tab:
    currentTabIndex += action;
    showTab(currentTabIndex);
}

function populateQualitySuggestions() { // I hate JS. So much
    // Populate desired quality master list
    const desiredSuggestionsDiv = document.getElementById("desiredQualitiesMasterList");
    const desiredQualityMasterListDiv = desiredSuggestionsDiv.getElementsByClassName("qualityList").item(0);
    for (const qualityName of desiredQualityMasterList) { // Where does this come from, you may ask... The answer is (JS) magic!
        addQualityToSuggestionListDiv(desiredQualityMasterListDiv, qualityName);
    }

    // Populate challenging quality master list
    const challengeSuggestionsDiv = document.getElementById("challengingQualitiesMasterList");
    const challengingQualityMasterListDiv = challengeSuggestionsDiv.getElementsByClassName("qualityList").item(0);
    for (const qualityName of challengingQualityMasterList) {
        addQualityToSuggestionListDiv(challengingQualityMasterListDiv, qualityName);
    }
}

function addQuality() { // This is on a button press
    const currentTab = document.getElementsByClassName("tab")[currentTabIndex];
    const qualityListDiv = currentTab.getElementsByClassName("qualityList").item(0);
    const input = currentTab.getElementsByTagName("input").item(0);

    const qualityName = input?.value;
    if (!qualityName) return;

    addQualityToUserListDiv(qualityListDiv, qualityName);
    input.value = "";
    input.focus();
}

function addQualityToCurrentTab(qualityName) {
    const currentTab = document.getElementsByClassName("tab")[currentTabIndex];
    const qualityListDiv = currentTab.getElementsByClassName("qualityList").item(0);
    addQualityToUserListDiv(qualityListDiv, qualityName);
}
function addQualityToSuggestionListDiv(listDiv, qualityName) {
    return addToQualityListDiv(listDiv, qualityName, "qualitySelection", () => addQualityToCurrentTab(qualityName))
}
function addQualityToUserListDiv(listDiv, qualityName) {
    return addToQualityListDiv(listDiv, qualityName, "qualityActive", () => removeQualityFrom(listDiv, qualityName))
}
function addToQualityListDiv(listDiv, qualityName, className = "", onClick = null) {
    if (qualityExists(listDiv.children, qualityName)) return;

    const qualityButton = document.createElement("button");
    qualityButton.type = "button";
    qualityButton.className = `qualityListItem ${className}`;
    qualityButton.innerText = qualityName;
    if (onClick) qualityButton.onclick = onClick;
    listDiv.appendChild(qualityButton);
}

function qualityExists(qualityList, qualityName) {
    return Array.from(qualityList).filter(q => q.innerText === qualityName).length > 0;
}

function removeQualityFrom(listDiv, qualityName) {
    const qualityEle = Array.from(listDiv.children).filter(c => c.innerText === qualityName)[0];
    listDiv.removeChild(qualityEle);
}

function validatePriorityList() {
    const priorityRow = Array.from(document.getElementsByClassName("priorityDataColumn"));
    return priorityRow.filter(c => c.innerText.includes("[EMPTY]")).length === 0;
}

function setupBalance() {
    const challengingListDiv = document.getElementById("challengingList");
    const finalChallengingListDiv = document.getElementById("challenging");
    finalChallengingListDiv.replaceChildren();

    for (const challengeEle of challengingListDiv.children) {
        const qualityListItem = document.createElement("div");
        qualityListItem.className = "qualityListItem";
        qualityListItem.innerText = challengeEle.innerText;
        finalChallengingListDiv.appendChild(qualityListItem);
    }

    const balanceDiv = document.getElementById("balanced");
    balanceDiv.replaceChildren();

    const qualityListTabs = document.getElementsByClassName("desiredQualities");
    const qualityCache = {};

    for (const qualityListTab of qualityListTabs) {
        const qualityListDiv = qualityListTab.getElementsByClassName("qualityList").item(0);

        for (const qualityEle of qualityListDiv.children) {
            if (qualityCache[qualityEle.innerText]) continue;

            qualityCache[qualityEle.innerText] = true;
            const qualityButton = document.createElement("button");
            qualityButton.type = "button";
            qualityButton.className = "qualityListItem qualitySelection";
            qualityButton.innerText = qualityEle.innerText;
            qualityButton.onclick = () => toggleQualitySelect(qualityButton);
            balanceDiv.appendChild(qualityButton);
        }
    }

    const warningMessage = document.getElementById("lowTraitsWarning");
    warningMessage.style.display = balanceDiv.children.length < 10 ? "block" : "none";
}

function toggleQualitySelect(qualityButton) {
    const quality = qualityButton.innerText;
    const priorityColumn = document.getElementsByClassName("priorityDataColumn");

    const [firstEmptyIndex, indexOfQuality] = findIndices(priorityColumn, quality);

    if (indexOfQuality === -1) { // If it doesn't exist in the priority row, then add it
        addPriority(priorityColumn, firstEmptyIndex, qualityButton, quality);
    }
    else { // If it does exist, remove it and bubble everything after it down
        removePriority(indexOfQuality, priorityColumn, qualityButton, firstEmptyIndex);
    }
}

function findIndices(priorityColumn, quality) {
    let firstEmptyIndex = 10; // Will remain 10 if the list is full
    let indexOfQuality = -1;

    for (let i = 0; i < priorityColumn.length; i++) {
        const currentTd = priorityColumn[i];
        if (currentTd.innerText.includes("[EMPTY]")) {
            firstEmptyIndex = i;
            break;
        }

        if (currentTd.innerText === quality) {
            indexOfQuality = i;
        }
    }

    return [firstEmptyIndex, indexOfQuality];
}

function addPriority(priorityColumn, firstEmptyIndex, qualityButton, quality) {
    const qualityRow = document.getElementById("balanced");
    priorityColumn[firstEmptyIndex].innerText = quality;
    qualityButton.className = "qualityListItem qualityActive";

    if (firstEmptyIndex === 9) { // If the list is full, disable buttons so more can't be added
        for (const qualityButtonI of qualityRow.children) {
            if (qualityButtonI.className.includes("qualitySelection")) {
                qualityButtonI.disabled = true;
            }
        }
    }
}

function removePriority(index, priorities = null, qualityButton = null, firstEmptyIndex = null) {
    if (!priorities) priorities = document.getElementsByClassName("priorityDataColumn");
    if (priorities[index].innerText.includes("[EMPTY]")) return;

    if (!firstEmptyIndex) firstEmptyIndex = findIndices(priorities, "")[0];

    const qualityRow = document.getElementById("balanced") ?? throwError("No balanced quality row found");
    if (!qualityButton) qualityButton = getQualityButton(qualityRow, priorities[index].innerText);

    const iTag = document.createElement("i");
    iTag.innerText = "[EMPTY]";
    priorities[index].innerHTML = ""; // bye bye
    priorities[index].appendChild(iTag);
    qualityButton.className = "qualityListItem qualitySelection";

    for (const qualityButtonI of qualityRow.children) {
        qualityButtonI.disabled = false;
    }

    if (index < 9) { // If this is the last one, then we don't need to bubble anything down
        for (let i = index; i < firstEmptyIndex - 1; i++) {
            swap(priorities, i, i + 1);
        }
    }
}

function getQualityButton(qualityRow, qualityName) {
    return Array.from(qualityRow.children).filter(q => q.innerText === qualityName)[0];
}

function shiftOrder(index, step) {
    const priorities = document.getElementsByClassName("priorityDataColumn");
    if (!priorities[index].innerText.includes("[EMPTY]") && // Current index is not empty
        !priorities[index + step].innerText.includes("[EMPTY]")) { // The one next to it is not empty

        swap(priorities, index, index + step);
    }
}

function swap(priorityList, index1, index2) {
    const temp = priorityList[index1].innerHTML;
    priorityList[index1].innerHTML = priorityList[index2].innerHTML;
    priorityList[index2].innerHTML = temp;
}

function populateFinalQualities() {
    const priorities = document.getElementsByClassName("priorityDataColumn");
    const finalQualities = document.getElementById("finalQualities").children;
    for (let i = 0; i < 10; i++) {
        finalQualities[i].innerHTML = priorities[i].innerHTML;
    }
}

function throwError(message) {
    throw new Error(message);
}