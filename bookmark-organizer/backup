const bookmarks = JSON.parse(localStorage.getItem('bookmarks')) || []; // Load bookmarks from localStorage

document.getElementById('addBookmark').addEventListener('click', function() {
    const name = document.getElementById('bookmarkName').value;
    const url = document.getElementById('bookmarkUrl').value;
    const group = document.getElementById('bookmarkGroup').value;

    if (name && url && group) { // Ensure group is also checked
        bookmarks.push({ name, url, group });
        localStorage.setItem('bookmarks', JSON.stringify(bookmarks)); // Save bookmarks to localStorage
        document.getElementById('bookmarkName').value = '';
        document.getElementById('bookmarkUrl').value = '';
        document.getElementById('bookmarkGroup').value = '';
        alert('Bookmark added!');
    } else {
        alert('Please enter name, URL, and category.');
    }
});

document.getElementById('displayBookmarks').addEventListener('click', function() {
    const bookmarkList = document.getElementById('bookmarkList');
    bookmarkList.innerHTML = ''; // Clear existing bookmarks

    if (bookmarks.length === 0) {
        bookmarkList.innerHTML = '<li>No bookmarks available.</li>';
        return;
    }

    const groupedBookmarks = bookmarks.reduce((acc, bookmark) => {
        if (!acc[bookmark.group]) {
            acc[bookmark.group] = [];
        }
        acc[bookmark.group].push(bookmark);
        return acc;
    }, {});

    for (const group in groupedBookmarks) {
        const groupHeader = document.createElement('h3');
        groupHeader.className = 'font-semibold mt-4';
        groupHeader.innerText = group;
        bookmarkList.appendChild(groupHeader);

        groupedBookmarks[group].forEach(bookmark => {
            const li = document.createElement('li');
            li.innerHTML = `<a href="${bookmark.url}" target="_blank" class="text-blue-500 hover:underline">${bookmark.name}</a>`;
            bookmarkList.appendChild(li);
        });
    }
});
