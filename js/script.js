// Store pinned items in localStorage
let pinnedItems = {
    timezones: [],
    currencies: []
};

// Load pinned items when page loads
document.addEventListener('DOMContentLoaded', function() {
    loadPinnedItems();
});

// Timezone functions
function showTime() {
    const timezone = document.getElementById('timezone').value;
    const timezoneName = document.getElementById('timezone').options[document.getElementById('timezone').selectedIndex].text;
    
    getCurrentTime(timezone)
        .then(time => {
            document.getElementById('time-result').textContent = `${timezoneName}: ${time}`;
        })
        .catch(error => {
            document.getElementById('time-result').textContent = 'Error fetching time';
            console.error(error);
        });
}

function startLiveTime() {
    const timezone = document.getElementById('timezone').value;
    const timezoneName = document.getElementById('timezone').options[document.getElementById('timezone').selectedIndex].text;
    
    // Update immediately
    getCurrentTime(timezone)
        .then(time => {
            document.getElementById('time-result').textContent = `${timezoneName}: ${time}`;
        });
    
    // Then update every second
    const intervalId = setInterval(() => {
        getCurrentTime(timezone)
            .then(time => {
                document.getElementById('time-result').textContent = `${timezoneName}: ${time}`;
            });
    }, 1000);
    
    // Store interval ID so we can clear it later if needed
    document.getElementById('time-result').dataset.intervalId = intervalId;
}

function pinTimezone() {
    const timezone = document.getElementById('timezone').value;
    const timezoneName = document.getElementById('timezone').options[document.getElementById('timezone').selectedIndex].text;
    
    // Check if already pinned
    if (!pinnedItems.timezones.some(item => item.id === timezone)) {
        pinnedItems.timezones.push({
            id: timezone,
            label: timezoneName
        });
        
        savePinnedItems();
        renderPinnedTimezones();
    }
}

// Currency functions
function convertCurrency() {
    const from = document.getElementById('from-currency').value;
    const to = document.getElementById('to-currency').value;
    const amount = document.getElementById('amount').value;
    const fromName = document.getElementById('from-currency').options[document.getElementById('from-currency').selectedIndex].text;
    const toName = document.getElementById('to-currency').options[document.getElementById('to-currency').selectedIndex].text;
    
    getCurrencyConversion(from, to, amount)
        .then(result => {
            document.getElementById('conversion-result').textContent = 
                `${amount} ${fromName} = ${result} ${toName}`;
        })
        .catch(error => {
            document.getElementById('conversion-result').textContent = 'Error converting currency';
            console.error(error);
        });
}

function pinCurrency() {
    const from = document.getElementById('from-currency').value;
    const to = document.getElementById('to-currency').value;
    const fromName = document.getElementById('from-currency').options[document.getElementById('from-currency').selectedIndex].text;
    const toName = document.getElementById('to-currency').options[document.getElementById('to-currency').selectedIndex].text;
    const id = `${from}-${to}`;
    
    // Check if already pinned
    if (!pinnedItems.currencies.some(item => item.id === id)) {
        pinnedItems.currencies.push({
            id: id,
            label: `${fromName} to ${toName}`,
            from: from,
            to: to
        });
        
        savePinnedItems();
        renderPinnedCurrencies();
    }
}

// Pinned items management
function loadPinnedItems() {
    const savedItems = localStorage.getItem('pinnedItems');
    if (savedItems) {
        pinnedItems = JSON.parse(savedItems);
        renderPinnedTimezones();
        renderPinnedCurrencies();
        
        // Start live updates for pinned items
        startPinnedItemsUpdates();
    }
}

function savePinnedItems() {
    localStorage.setItem('pinnedItems', JSON.stringify(pinnedItems));
}

function renderPinnedTimezones() {
    const container = document.getElementById('pinned-timezones');
    container.innerHTML = '';
    
    pinnedItems.timezones.forEach(item => {
        const element = document.createElement('div');
        element.className = 'list-group-item d-flex justify-content-between align-items-center';
        element.id = `timezone-${item.id.replace(/\//g, '-')}`;
        
        const content = document.createElement('div');
        content.innerHTML = `<strong>${item.label}</strong><div class="time-display">Loading...</div>`;
        
        const button = document.createElement('button');
        button.className = 'btn btn-sm btn-danger';
        button.textContent = 'Unpin';
        button.onclick = () => unpinItem('timezone', item.id);
        
        element.appendChild(content);
        element.appendChild(button);
        container.appendChild(element);
        
        // Start updating this timezone
        updatePinnedTimezone(item.id, element);
    });
}

function renderPinnedCurrencies() {
    const container = document.getElementById('pinned-currencies');
    container.innerHTML = '';
    
    pinnedItems.currencies.forEach(item => {
        const element = document.createElement('div');
        element.className = 'list-group-item d-flex justify-content-between align-items-center';
        element.id = `currency-${item.id}`;
        
        const content = document.createElement('div');
        content.innerHTML = `<strong>${item.label}</strong><div class="conversion-display">Loading...</div>`;
        
        const button = document.createElement('button');
        button.className = 'btn btn-sm btn-danger';
        button.textContent = 'Unpin';
        button.onclick = () => unpinItem('currency', item.id);
        
        element.appendChild(content);
        element.appendChild(button);
        container.appendChild(element);
        
        // Start updating this currency
        updatePinnedCurrency(item.from, item.to, element);
    });
}

function unpinItem(type, id) {
    if (type === 'timezone') {
        pinnedItems.timezones = pinnedItems.timezones.filter(item => item.id !== id);
    } else if (type === 'currency') {
        pinnedItems.currencies = pinnedItems.currencies.filter(item => item.id !== id);
    }
    
    savePinnedItems();
    
    if (type === 'timezone') {
        renderPinnedTimezones();
    } else {
        renderPinnedCurrencies();
    }
}

function startPinnedItemsUpdates() {
    // Timezones update every second
    pinnedItems.timezones.forEach(item => {
        const element = document.getElementById(`timezone-${item.id.replace(/\//g, '-')}`);
        if (element) {
            setInterval(() => updatePinnedTimezone(item.id, element), 1000);
        }
    });
    
    // Currencies update every minute (to avoid API rate limits)
    pinnedItems.currencies.forEach(item => {
        const element = document.getElementById(`currency-${item.id}`);
        if (element) {
            setInterval(() => updatePinnedCurrency(item.from, item.to, element), 60000);
        }
    });
}

function updatePinnedTimezone(timezone, element) {
    getCurrentTime(timezone)
        .then(time => {
            const display = element.querySelector('.time-display');
            if (display) display.textContent = time;
        });
}

function updatePinnedCurrency(from, to, element) {
    getCurrencyConversion(from, to, 1)
        .then(result => {
            const display = element.querySelector('.conversion-display');
            if (display) display.textContent = `1 ${from} = ${result} ${to}`;
        });
}