document.addEventListener('DOMContentLoaded', function() {
    loadUrlHistory();
    loadCounter();

    document.getElementById('generateButton').addEventListener('click', generateAndDisplayUrl);
    document.getElementById('clearUrls').addEventListener('click', clearUrlHistory);
    document.getElementById('urlHistory').addEventListener('click', function(event) {
        if (event.target.className === 'copy-url') {
            copyToClipboard(event.target.dataset.url);
        }
    });

    document.querySelectorAll('.tag').forEach(tag => {
        tag.addEventListener('click', function() {
            const input = document.getElementById(this.parentNode.getAttribute('data-input'));
            input.value = this.textContent.trim();
        });
    });
});

function generateAndDisplayUrl() {
    let url = document.getElementById('url').value.trim();
    if (!url.startsWith('https://')) {
        url = 'https://' + url;
    }
    if (!/^(https:\/\/).+\.[a-zA-Z]{2,}$/i.test(url)) {
        alert('Enter a valid URL starting with https:// and a top-level domain (e.g., .com, .net).');
        return;
    }
    const source = document.getElementById('source').value.trim();
    const medium = document.getElementById('medium').value.trim();
    const campaign = document.getElementById('campaign').value.trim();
    const term = document.getElementById('term').value.trim();
    const content = document.getElementById('content').value.trim();
    const date = new Date().toLocaleDateString();
    let fullUrl = `${url}?utm_source=${encodeURIComponent(source)}&utm_medium=${encodeURIComponent(medium)}`;
    if (campaign) fullUrl += `&utm_campaign=${encodeURIComponent(campaign)}`;
    if (term) fullUrl += `&utm_term=${encodeURIComponent(term)}`;
    if (content) fullUrl += `&utm_content=${encodeURIComponent(content)}`;
    document.getElementById('fullUrl').value = fullUrl;
    const entry = { name: document.getElementById('urlName').value || 'Unnamed UTM Link', url: fullUrl, date: date };
    const urls = JSON.parse(localStorage.getItem('urls') || '[]');
    urls.push(entry);
    localStorage.setItem('urls', JSON.stringify(urls));
    addUrlToList(entry);
    incrementCounter();
}

function addUrlToList(entry) {
    const li = document.createElement('li');
    li.innerHTML = `<strong>${entry.name} (${entry.date})</strong> - ${entry.url} <button class="copy-url" data-url="${entry.url}">Copy URL</button>`;
    document.getElementById('urlHistory').prepend(li);
}

function incrementCounter() {
    chrome.storage.local.get('utmCount', function(data) {
        let currentCount = data.utmCount || 0;
        currentCount++;
        document.getElementById('count').textContent = currentCount;
        chrome.storage.local.set({'utmCount': currentCount});
    });
}

function loadCounter() {
    chrome.storage.local.get('utmCount', function(data) {
        document.getElementById('count').textContent = data.utmCount || 0;
    });
}

function clearUrlHistory() {
    document.getElementById('urlHistory').innerHTML = '';
    localStorage.setItem('urls', JSON.stringify([]));
    chrome.storage.local.set({'utmCount': 0});
    document.getElementById('count').textContent = '0';
}

function copyToClipboard(url) {
    navigator.clipboard.writeText(url).then(() => {
        alert('URL copied to clipboard!');
    }, err => {
        console.error('Failed to copy URL:', err);
    });
}

function loadUrlHistory() {
    const urls = JSON.parse(localStorage.getItem('urls') || '[]');
    urls.forEach(addUrlToList);
}
