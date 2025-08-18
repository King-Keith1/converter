// ==============================================
// Timezone API Service (using free reliable APIs)
// ==============================================

async function getCurrentTime(timezone = 'UTC') {
    try {
        // Try WorldTimeAPI first (no API key needed)
        const wtResponse = await fetchWithTimeout(`https://worldtimeapi.org/api/timezone/${timezone}`, {}, 3000);
        
        if (wtResponse.ok) {
            const data = await wtResponse.json();
            if (data.datetime) {
                return formatTime(data.datetime, timezone);
            }
        }
        
        // Fallback to TimeAPI.io if first fails
        const tzResponse = await fetchWithTimeout(`https://timeapi.io/api/Time/current/zone?timeZone=${timezone}`, {}, 3000);
        
        if (tzResponse.ok) {
            const data = await tzResponse.json();
            return `${data.hour}:${data.minute}:${data.second}`;
        }
        
        // Final fallback to local calculation
        return calculateLocalTime(timezone);
        
    } catch (error) {
        console.error('Error fetching time:', error);
        return calculateLocalTime(timezone);
    }
}

function calculateLocalTime(timezone) {
    try {
        return dayjs().tz(timezone).format('HH:mm:ss');
    } catch {
        return "Time unavailable";
    }
}

function formatTime(datetimeString, timezone) {
    try {
        const date = new Date(datetimeString);
        return date.toLocaleTimeString('en-US', {
            timeZone: timezone,
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    } catch {
        return datetimeString.split('T')[1].split('.')[0]; // Simple extraction if formatting fails
    }
}

// ==============================================
// Currency API Service (using multiple fallbacks)
// ==============================================

async function getCurrencyConversion(from, to, amount) {
    // Try multiple API endpoints with fallbacks
    const endpoints = [
        `https://api.exchangerate-api.com/v4/latest/${from}`, // Free tier
        `https://open.er-api.com/v6/latest/${from}`,         // Free alternative
        `https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/${from}/${to}.json` // GitHub-based
    ];
    
    for (const endpoint of endpoints) {
        try {
            const response = await fetchWithTimeout(endpoint, {}, 3000);
            
            if (response.ok) {
                const data = await response.json();
                
                // Handle different API response formats
                let rate;
                if (data.rates) {
                    rate = data.rates[to];
                } else if (data[to]) {
                    rate = data[to];
                } else if (data.conversion_rates) {
                    rate = data.conversion_rates[to];
                }
                
                if (rate) {
                    return (amount * rate).toFixed(4);
                }
            }
        } catch (error) {
            console.log(`Failed with ${endpoint}:`, error);
            continue;
        }
    }
    
    // Final fallback to hardcoded rates for major currencies
    return getHardcodedConversion(from, to, amount);
}

function getHardcodedConversion(from, to, amount) {
    // Hardcoded rates (update these periodically)
    const rates = {
        USD: { EUR: 0.93, GBP: 0.79, JPY: 151.53, KHR: 4100 },
        EUR: { USD: 1.07, GBP: 0.85, JPY: 162.38, KHR: 4400 },
        GBP: { USD: 1.26, EUR: 1.17, JPY: 190.45, KHR: 5200 },
        JPY: { USD: 0.0066, EUR: 0.0062, GBP: 0.0052, KHR: 27 },
        KHR: { USD: 0.00024, EUR: 0.00023, GBP: 0.00019, JPY: 0.037 }
    };
    
    if (rates[from] && rates[from][to]) {
        return (amount * rates[from][to]).toFixed(4);
    }
    
    return "N/A";
}

// ==============================================
// Utility Functions
// ==============================================

async function fetchWithTimeout(resource, options = {}, timeout = 5000) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    
    const response = await fetch(resource, {
        ...options,
        signal: controller.signal  
    });
    
    clearTimeout(id);
    return response;
}

// Initialize day.js for time calculations
function initDayJS() {
    if (typeof dayjs !== 'undefined' && typeof dayjs_plugin_utc !== 'undefined' && typeof dayjs_plugin_timezone !== 'undefined') {
        dayjs.extend(dayjs_plugin_utc);
        dayjs.extend(dayjs_plugin_timezone);
    } else {
        console.error("Day.js plugins not loaded");
    }
}

// Call this at the start of your application
initDayJS();