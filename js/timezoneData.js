// Comprehensive timezone data including Cambodia
const countriesWithTimezones = [
    { code: 'KH', name: 'Cambodia', timezones: ['Asia/Phnom_Penh'] },
    { code: 'US', name: 'United States', timezones: [
        'America/New_York', 'America/Chicago', 'America/Denver', 'America/Los_Angeles', 
        'America/Anchorage', 'Pacific/Honolulu'
    ]},
    { code: 'GB', name: 'United Kingdom', timezones: ['Europe/London'] },
    { code: 'JP', name: 'Japan', timezones: ['Asia/Tokyo'] },
    { code: 'AU', name: 'Australia', timezones: [
        'Australia/Sydney', 'Australia/Melbourne', 'Australia/Brisbane', 
        'Australia/Adelaide', 'Australia/Perth', 'Australia/Darwin'
    ]},
    // Add more countries as needed...
    { code: 'TH', name: 'Thailand', timezones: ['Asia/Bangkok'] },
    { code: 'VN', name: 'Vietnam', timezones: ['Asia/Ho_Chi_Minh'] },
    { code: 'LA', name: 'Laos', timezones: ['Asia/Vientiane'] },
    { code: 'SG', name: 'Singapore', timezones: ['Asia/Singapore'] },
    { code: 'CN', name: 'China', timezones: ['Asia/Shanghai'] },
    { code: 'IN', name: 'India', timezones: ['Asia/Kolkata'] },
    // Add all other countries...
];

// Initialize country dropdown
function initCountryDropdown() {
    const select = document.getElementById('country-select');
    
    // Sort countries alphabetically
    countriesWithTimezones.sort((a, b) => a.name.localeCompare(b.name));
    
    countriesWithTimezones.forEach(country => {
        const option = document.createElement('option');
        option.value = country.code;
        option.textContent = country.name;
        select.appendChild(option);
    });
}

// Update city dropdown based on selected country
function updateCities() {
    const countryCode = document.getElementById('country-select').value;
    const citySelect = document.getElementById('city-select');
    
    citySelect.innerHTML = '<option value="">Select a city</option>';
    
    if (!countryCode) return;
    
    const country = countriesWithTimezones.find(c => c.code === countryCode);
    if (country) {
        country.timezones.forEach(timezone => {
            const cityName = timezone.split('/')[1].replace(/_/g, ' ');
            const option = document.createElement('option');
            option.value = timezone;
            option.textContent = cityName;
            citySelect.appendChild(option);
        });
    }
}