// Comprehensive currency data including Cambodian Riel (KHR)
const allCurrencies = [
    { code: 'USD', name: 'US Dollar', symbol: '$' },
    { code: 'EUR', name: 'Euro', symbol: '€' },
    { code: 'GBP', name: 'British Pound', symbol: '£' },
    { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
    { code: 'KHR', name: 'Cambodian Riel', symbol: '៛' },
    { code: 'THB', name: 'Thai Baht', symbol: '฿' },
    { code: 'VND', name: 'Vietnamese Dong', symbol: '₫' },
    { code: 'LAK', name: 'Lao Kip', symbol: '₭' },
    { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$' },
    { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
    { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
    // Add all other currencies...
];

// Initialize currency dropdowns
function initCurrencyDropdowns() {
    const fromSelect = document.getElementById('from-currency');
    const toSelect = document.getElementById('to-currency');
    
    // Sort currencies alphabetically by code
    allCurrencies.sort((a, b) => a.code.localeCompare(b.code));
    
    allCurrencies.forEach(currency => {
        const option1 = document.createElement('option');
        option1.value = currency.code;
        option1.textContent = `${currency.code} - ${currency.name}`;
        
        const option2 = option1.cloneNode(true);
        
        fromSelect.appendChild(option1);
        toSelect.appendChild(option2);
    });
    
    // Set default to USD to KHR for Cambodia focus
    fromSelect.value = 'USD';
    toSelect.value = 'KHR';
}

// Set popular Cambodian Riel conversions
function setPopularKHRConversions() {
    const popularConversions = [
        { from: 'USD', to: 'KHR', amount: 1 },
        { from: 'EUR', to: 'KHR', amount: 1 },
        { from: 'KHR', to: 'USD', amount: 1000 },
        { from: 'KHR', to: 'THB', amount: 1000 }
    ];
    
    const container = document.getElementById('popular-khr-conversions');
    container.innerHTML = '<h6 class="text-muted">Popular KHR Conversions:</h6><div class="d-flex flex-wrap gap-2" id="khr-buttons"></div>';
    
    const buttonsContainer = document.getElementById('khr-buttons');
    
    popularConversions.forEach(conv => {
        const fromCurrency = allCurrencies.find(c => c.code === conv.from);
        const toCurrency = allCurrencies.find(c => c.code === conv.to);
        
        const button = document.createElement('button');
        button.className = 'btn btn-sm btn-outline-secondary';
        button.textContent = `${conv.amount} ${fromCurrency.code} → ${toCurrency.code}`;
        button.onclick = () => setConversion(conv.from, conv.to, conv.amount);
        
        buttonsContainer.appendChild(button);
    });
}