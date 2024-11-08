let websiteVisits = {};
let chart;
let currentSite = null;
let startTime = null;

// Load data from Chrome storage
chrome.storage.local.get(['websiteVisits'], function(result) {
    websiteVisits = result.websiteVisits || {};
    updateDisplay();
});

function updateChart() {
    const sortedWebsites = Object.entries(websiteVisits).sort((a, b) => b[1] - a[1]).slice(0, 5);
    const labels = sortedWebsites.map(([url, _]) => {
        try {
            return new URL(url).hostname;
        } catch {
            return url;
        }
    });
    const data = sortedWebsites.map(([_, time]) => time);
    const totalTime = data.reduce((a, b) => a + b, 0);
    
    // Clear previous SVG chart if it exists
    d3.select('#activityChart').selectAll('*').remove();
    
    const width = 300, height = 300, radius = Math.min(width, height) / 2;
    const color = d3.scaleOrdinal(['#4285F4', '#34A853', '#FBBC05', '#EA4335', '#FF6D01']);
    
    const arc = d3.arc()
        .innerRadius(radius * 0.6)
        .outerRadius(radius * 0.8);
    
    const outerArc = d3.arc()
        .innerRadius(radius * 0.9)
        .outerRadius(radius * 0.9);
    
    const pie = d3.pie()
        .sort(null)
        .value(d => d);
    
    const svg = d3.select('#activityChart')
        .attr('width', width)
        .attr('height', height)
        .append('g')
        .attr('transform', `translate(${width / 2}, ${height / 2})`);
    
    const g = svg.selectAll('.arc')
        .data(pie(data))
        .enter().append('g')
        .attr('class', 'arc');
    
    g.append('path')
        .attr('d', arc)
        .attr('fill', (d, i) => color(i))
        .attr('stroke', '#ffffff')
        .attr('stroke-width', 2);
    
    // Add labels
    g.append('text')
        .attr('transform', d => {
            const pos = outerArc.centroid(d);
            const midAngle = d.startAngle + (d.endAngle - d.startAngle) / 2;
            pos[0] = radius * 0.95 * (midAngle < Math.PI ? 1 : -1);
            return `translate(${pos})`;
        })
        .attr('dy', '.35em')
        .style('text-anchor', d => {
            const midAngle = d.startAngle + (d.endAngle - d.startAngle) / 2;
            return midAngle < Math.PI ? 'start' : 'end';
        })
        .text((d, i) => labels[i])
        .style('fill', '#333333')
        .style('font-size', '12px')
        .style('font-weight', 'bold');
    
    // Add lines connecting slices to labels
    g.append('polyline')
        .attr('points', d => {
            const pos = outerArc.centroid(d);
            const midAngle = d.startAngle + (d.endAngle - d.startAngle) / 2;
            pos[0] = radius * 0.95 * (midAngle < Math.PI ? 1 : -1);
            return [arc.centroid(d), outerArc.centroid(d), pos];
        })
        .style('fill', 'none')
        .style('stroke', '#333333')
        .style('stroke-width', '1px');
    
    // Add favicons
    g.append('image')
        .attr('xlink:href', (d, i) => `https://www.google.com/s2/favicons?domain=${labels[i]}&sz=32`)
        .attr('width', 16)
        .attr('height', 16)
        .attr('transform', d => {
            const pos = arc.centroid(d);
            return `translate(${pos[0] * 1.3},${pos[1] * 1.3})`;
        });
    
    // Center text
    svg.append('text')
        .attr('text-anchor', 'middle')
        .attr('dy', '-1em')
        .style('font-size', '16px')
        .style('fill', '#333333')
        .text('TODAY');
    
    svg.append('text')
        .attr('text-anchor', 'middle')
        .attr('dy', '1.5em')
        .style('font-size', '24px')
        .style('fill', '#333333')
        .text(formatTime(totalTime));
    
    // Add legend below the chart
    const legendContainer = d3.select('#activityChart')
        .append('g')
        .attr('class', 'legend')
        .attr('transform', `translate(10, ${height + 20})`);

    const legendItems = legendContainer.selectAll('.legend-item')
        .data(labels)
        .enter()
        .append('g')
        .attr('class', 'legend-item')
        .attr('transform', (d, i) => `translate(0, ${i * 20})`);

    legendItems.append('rect')
        .attr('width', 10)
        .attr('height', 10)
        .attr('fill', (d, i) => color(i));

    legendItems.append('text')
        .attr('x', 15)
        .attr('y', 9)
        .text(d => d)
        .style('font-size', '12px')
        .style('fill', '#333333');

    // Adjust SVG height to accommodate legend
    d3.select('#activityChart')
        .attr('height', height + 20 + labels.length * 20);
}

function updateDisplay() {
    displayTopWebsites();
    updateChart();
}

function trackWebsiteTime() {
    const now = Date.now();
    if (currentSite && startTime) {
        const timeSpent = Math.round((now - startTime) / 1000);
        websiteVisits[currentSite] = (websiteVisits[currentSite] || 0) + timeSpent;
        chrome.storage.local.set({ websiteVisits: websiteVisits });
    }
    updateCurrentSite();
    startTime = now;
}

function updateCurrentSite() {
    console.log(chrome.tabs); // Check if chrome.tabs is defined
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        if (tabs[0] && tabs[0].url) {
            currentSite = new URL(tabs[0].url).hostname;
        }
    });
}

function displayTopWebsites() {
    const topWebsitesList = document.getElementById('topWebsites');
    topWebsitesList.innerHTML = '';

    const sortedWebsites = Object.entries(websiteVisits).sort((a, b) => b[1] - a[1]).slice(0, 5);
    sortedWebsites.forEach(([url, time]) => {
        const li = document.createElement('li');
        li.className = 'flex items-center justify-between mb-2 bg-gray-800 rounded-lg p-2';
        
        const leftDiv = document.createElement('div');
        leftDiv.className = 'flex items-center';

        const favicon = document.createElement('img');
        favicon.src = `https://www.google.com/s2/favicons?domain=${url}&sz=32`;
        favicon.className = 'mr-2 w-6 h-6';
        leftDiv.appendChild(favicon);

        const urlSpan = document.createElement('span');
        urlSpan.className = 'truncate mr-2 text-white';
        urlSpan.title = url;
        urlSpan.innerText = url;
        leftDiv.appendChild(urlSpan);

        li.appendChild(leftDiv);

        const timeSpan = document.createElement('span');
        timeSpan.className = 'font-semibold text-white';
        timeSpan.innerText = formatTime(time);
        li.appendChild(timeSpan);

        topWebsitesList.appendChild(li);
    });
}

function formatTime(seconds) {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ${minutes % 60}m`;
}

// Track time spent on each site every second
setInterval(trackWebsiteTime, 1000);

// Listen for tab updates
chrome.tabs.onActivated.addListener(updateCurrentSite);
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete') {
        updateCurrentSite();
    }
});

// Initialize the display
document.addEventListener('DOMContentLoaded', () => {
    updateCurrentSite();
    updateDisplay();
});
