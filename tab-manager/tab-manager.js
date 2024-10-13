const activeTabs = [];

function addTab(tabName) {
    activeTabs.push(tabName);
    displayTabs();
}

function displayTabs() {
    const tabList = document.getElementById('tabList');
    tabList.innerHTML = ''; // Clear existing tabs
    activeTabs.forEach(tab => {
        const li = document.createElement('li');
        li.textContent = tab;
        tabList.appendChild(li);
    });
}

window.onload = function() {
    // Simulate adding some tabs for demonstration
    addTab('Home');
    addTab('About');
    addTab('Contact');
};

async function displayAllTabs() {
    const tabListDomElement = document.querySelector('.tab-list');
    const allTabs = await chrome.tabs.query({}); // Fetch all tabs

    // Clear existing tabs in the DOM
    tabListDomElement.innerHTML = '';

    // Create a document fragment to improve performance
    const tabRowFragment = document.createDocumentFragment();

    allTabs.forEach(tab => {
        const tabRow = createTabRow(tab); // Function to create a row for each tab
        tabRowFragment.appendChild(tabRow);
    });

    // Append all tab rows to the DOM
    tabListDomElement.appendChild(tabRowFragment);
}

// Helper function to create a tab row element
function createTabRow(tab) {
    const tabRow = document.createElement('div');
    tabRow.className = 'tab-row';
    tabRow.textContent = tab.title; // Display the tab title
    tabRow.dataset.tabId = tab.id; // Store the tab ID for reference
    return tabRow;
}
