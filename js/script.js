// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Initialize day.js plugins
    dayjs.extend(dayjs_plugin_utc);
    dayjs.extend(dayjs_plugin_timezone);
    
    // Initialize dropdowns
    initCountryDropdown();
    initCurrencyDropdowns();
    setPopularKHRConversions();
    
    // Load pinned items
    loadPinnedItems();
    
    // Start local time display
    updateLocalTime();
    setInterval(updateLocalTime, 1000);
    
    // Detect user's local timezone and currency
    detectUserLocation();
});

// Detect user's local timezone and currency
function detectUserLocation() {
    try {
        // Get timezone
        const userTimezone = dayjs.tz.guess();
        if (userTimezone) {
            // Try to find in our countries data
            const country = countriesWithTimezones.find(c => 
                c.timezones.includes(userTimezone));
            
            if (country) {
                document.getElementById('country-select').value = country.code;
                updateCities();
                document.getElementById('city-select').value = userTimezone;
            }
        }
        
        // Get currency (this is just a guess based on locale)
        const userCurrency = Intl.NumberFormat().resolvedOptions().currency;
        if (userCurrency && allCurrencies.some(c => c.code === userCurrency)) {
            document.getElementById('from-currency').value = userCurrency;
        }
    } catch (e) {
        console.log("Couldn't detect user location:", e);
    }
}

// Update local time display
function updateLocalTime() {
    const now = dayjs();
    document.getElementById('current-local-time').textContent = now.format('h:mm:ss A');
    document.getElementById('current-local-date').textContent = now.format('ddd, MMM D, YYYY');
}

// Swap currency conversion direction
function swapCurrencies() {
    const from = document.getElementById('from-currency');
    const to = document.getElementById('to-currency');
    const temp = from.value;
    from.value = to.value;
    to.value = temp;
    convertCurrency();
}

// Set specific conversion
function setConversion(from, to, amount) {
    document.getElementById('from-currency').value = from;
    document.getElementById('to-currency').value = to;
    document.getElementById('amount').value = amount;
    convertCurrency();
}

// ... (rest of your existing functions from previous version)