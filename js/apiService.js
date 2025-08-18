// Time API - Using WorldTimeAPI (free, no API key needed)
async function getCurrentTime(timezone = 'UTC') {
    try {
        const response = await fetch(`https://worldtimeapi.org/api/timezone/${timezone}`);
        const data = await response.json();
        
        if (data.datetime) {
            const date = new Date(data.datetime);
            return date.toLocaleString('en-US', {
                timeZone: timezone,
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                timeZoneName: 'short'
            });
        }
        throw new Error('Invalid time data');
    } catch (error) {
        console.error('Error fetching time:', error);
        return 'Error fetching time';
    }
}

// Currency API - Using ExchangeRate-API (free tier available)
// Note: In production, you should get your own API key
const API_KEY = 'YOUR_API_KEY'; // Get from https://www.exchangerate-api.com/

async function getCurrencyConversion(from, to, amount) {
    try {
        // For demo purposes, we'll use a free API with limited requests
        // In production, use a proper API with your own key
        const response = await fetch(`https://open.er-api.com/v6/latest/${from}`);
        const data = await response.json();
        
        if (data.result === 'success' && data.rates && data.rates[to]) {
            const rate = data.rates[to];
            return (amount * rate).toFixed(4);
        }
        throw new Error('Invalid conversion data');
    } catch (error) {
        console.error('Error converting currency:', error);
        return 'Error';
    }
}

// Fallback function if primary API fails
async function getCurrencyConversionFallback(from, to, amount) {
    try {
        // This is a very simple fallback with hardcoded rates
        // Only works for major currencies
        const rates = {
            USD: { EUR: 0.93, GBP: 0.79, JPY: 151.53 },
            EUR: { USD: 1.07, GBP: 0.85, JPY: 162.38 },
            GBP: { USD: 1.26, EUR: 1.17, JPY: 190.45 },
            JPY: { USD: 0.0066, EUR: 0.0062, GBP: 0.0052 }
        };
        
        if (rates[from] && rates[from][to]) {
            return (amount * rates[from][to]).toFixed(4);
        }
        throw new Error('Currency not supported in fallback');
    } catch (error) {
        console.error('Error in fallback conversion:', error);
        return 'Error';
    }
}