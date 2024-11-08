const bookmarks = JSON.parse(localStorage.getItem('bookmarks')) || []; // Load bookmarks from localStorage
let currentEditIndex = -1;

document.getElementById('addBookmark').addEventListener('click', function() {
    const name = document.getElementById('bookmarkName').value;
    const url = document.getElementById('bookmarkUrl').value;
    const group = document.getElementById('bookmarkGroup').value;

    if (name && url && group) {
        bookmarks.push({ name, url, group });
        localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
        document.getElementById('bookmarkName').value = '';
        document.getElementById('bookmarkUrl').value = '';
        document.getElementById('bookmarkGroup').value = '';
        displayBookmarks();
    } else {
        alert('Please enter name, URL, and category.');
    }
});

function displayBookmarks() {
    const bookmarkList = document.getElementById('bookmarkList');
    bookmarkList.innerHTML = '';

    if (bookmarks.length === 0) {
        bookmarkList.innerHTML = '<p class="text-gray-500">No bookmarks available.</p>';
        return;
    }

    const groupedBookmarks = bookmarks.reduce((acc, bookmark, index) => {
        if (!acc[bookmark.group]) {
            acc[bookmark.group] = [];
        }
        acc[bookmark.group].push({...bookmark, index});
        return acc;
    }, {});

    for (const group in groupedBookmarks) {
        const categoryCard = document.createElement('div');
        categoryCard.className = 'bg-white custom-shadow rounded-lg p-4 mb-4';
        
        const groupHeader = document.createElement('h3');
        groupHeader.className = 'font-semibold text-lg mb-2 text-gray-800';
        groupHeader.innerText = group;
        categoryCard.appendChild(groupHeader);

        const bookmarksList = document.createElement('ul');
        bookmarksList.className = 'space-y-2';

        groupedBookmarks[group].forEach((bookmark) => {
            const li = document.createElement('li');
            li.className = 'flex items-center justify-between bg-gray-50 p-2 rounded';
            li.innerHTML = `
                <div class="flex items-center">
                    <img src="https://www.google.com/s2/favicons?domain=${encodeURIComponent(bookmark.url)}" alt="Favicon" class="mr-2 w-4 h-4">
                    <a href="${bookmark.url}" target="_blank" class="text-blue-600 hover:text-blue-800 font-medium">${bookmark.name}</a>
                </div>
                <div>
                    <button class="edit-btn bg-yellow-500 hover:bg-yellow-600 text-white py-1 px-2 rounded text-sm mr-1" data-index="${bookmark.index}">Edit</button>
                    <button class="delete-btn bg-red-500 hover:bg-red-600 text-white py-1 px-2 rounded text-sm" data-index="${bookmark.index}">Delete</button>
                </div>
            `;
            bookmarksList.appendChild(li);
        });

        categoryCard.appendChild(bookmarksList);
        bookmarkList.appendChild(categoryCard);
    }

    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', editBookmark);
    });
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', deleteBookmark);
    });
}

function editBookmark(event) {
    const index = parseInt(event.target.getAttribute('data-index'));
    currentEditIndex = index;
    const bookmark = bookmarks[currentEditIndex];
    
    document.getElementById('editName').value = bookmark.name;
    document.getElementById('editUrl').value = bookmark.url;
    document.getElementById('editGroup').value = bookmark.group;
    
    document.getElementById('editModal').style.display = 'block';
}

function saveEdit() {
    const newName = document.getElementById('editName').value;
    const newUrl = document.getElementById('editUrl').value;
    const newGroup = document.getElementById('editGroup').value;

    if (newName && newUrl && newGroup) {
        bookmarks[currentEditIndex] = { name: newName, url: newUrl, group: newGroup };
        localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
        closeEditModal();
        displayBookmarks();
    } else {
        alert('Please fill in all fields.');
    }
}

function closeEditModal() {
    document.getElementById('editModal').style.display = 'none';
    currentEditIndex = -1;
}

function deleteBookmark(event) {
    const index = parseInt(event.target.getAttribute('data-index'));
    if (confirm('Are you sure you want to delete this bookmark?')) {
        bookmarks.splice(index, 1);
        localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
        displayBookmarks();
    }
}

// Display bookmarks on page load
displayBookmarks();

// Event listeners
document.getElementById('displayBookmarks').addEventListener('click', displayBookmarks);
document.getElementById('saveEdit').addEventListener('click', saveEdit);
document.getElementById('cancelEdit').addEventListener('click', closeEditModal);



function dumpBookmarks() {
    browser.bookmarks.getTree().then(nodes => { // Changed chrome to browser
        $('#content').html(dumpTreeNodes(nodes));
    });
}

function dumpTreeNodes(nodes) {
    const list = $('<ul>');
    let i;
    for (i = 0; i < nodes.length; i++) {
        list.append(dumpNode(nodes[i]));
    }
    return list;
}

function dumpNode({ id, title, url, children }) {
    const anchor = $('<a target="_blank" class = "text-blue-600 hover:text-blue-800 font-medium">');
    anchor.attr('href', url);
    anchor.text(title);
    
    // Create an image element for the favicon
    const favicon = $('<img>').attr('src', `https://www.google.com/s2/favicons?domain=${encodeURIComponent(url)}`).css({
        width: '16px',
        height: '16px',
        marginRight: '5px'
    });

    // Wrap the favicon in an anchor tag
    const faviconLink = $('<a>').attr('href', url).attr('target', '_blank').append(favicon);

    // Create a container for the favicon and text
    const container = $('<div>').addClass('flex items-center bg-gray-50 p-2 rounded').append(faviconLink).append(anchor);

    // Append the favicon link to the span
    container.append(faviconLink).append(anchor);
    
    // Append favicon and anchor to the container
    // container.append(favicon).append(anchor);

    const child = $(title ? '<li class = "bg-white shadow-lg rounded-lg p-4 mb-4">' : '<div class = "bg-white shadow-lg rounded-lg p-4 mb-4">').append(container);
    if (children && children.length > 0) {
        child.append(dumpTreeNodes(children));
    }
    return child;
}

document.addEventListener('DOMContentLoaded', () => dumpBookmarks());



// // Wrap the favicon in an anchor tag
// const faviconLink = $('<a>').attr('href', url).attr('target', '_blank').append(favicon);


// // Append the favicon link to the span
// var span = $('<span>').append(faviconLink).append(anchor);
// const child = $(title ? '<li class = "bg-white custom-shadow rounded-lg p-4 mb-4">' : '<div class = "bg-white custom-shadow rounded-lg p-4 mb-4">').append(span);
