let activeTabTimes = {};
let totalTimeSpent = 0;

// Function to update the activity chart
function updateActivityChart() {
    const ctx = document.getElementById('activityChart').getContext('2d');
    const labels = Object.keys(activeTabTimes);
    const data = Object.values(activeTabTimes);

    const chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Time Spent (seconds)',
                data: data,
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Function to track time spent on active tabs
function trackActiveTabs() {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        const currentTab = tabs[0];
        const url = currentTab.url;

        if (!activeTabTimes[url]) {
            activeTabTimes[url] = 0;
        }

        // Increment time spent on the current tab every second
        setInterval(() => {
            activeTabTimes[url]++;
            totalTimeSpent++;
            document.getElementById('timeValue').innerText = totalTimeSpent;
            updateActivityChart();
        }, 1000);
    });
}

// Function to display top websites based on time spent
function displayTopWebsites() {
    const topWebsitesList = document.getElementById('topWebsites');
    topWebsitesList.innerHTML = ''; // Clear existing list

    const sortedWebsites = Object.entries(activeTabTimes).sort((a, b) => b[1] - a[1]).slice(0, 5);
    sortedWebsites.forEach(([url, time]) => {
        const li = document.createElement('li');
        li.innerText = `${url}: ${time} seconds`;
        topWebsitesList.appendChild(li);
    });
}

// Initialize tracking when the document is loaded
document.addEventListener('DOMContentLoaded', function () {
    trackActiveTabs();
    setInterval(displayTopWebsites, 5000); // Update top websites every 5 seconds
});