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
