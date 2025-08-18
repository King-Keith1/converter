// Modify your convertCurrency function like this:
async function convertCurrency() {
    const from = document.getElementById('from-currency').value;
    const to = document.getElementById('to-currency').value;
    const amount = parseFloat(document.getElementById('amount').value) || 1;
    
    const resultElement = document.getElementById('conversion-result');
    resultElement.textContent = "Converting...";
    resultElement.className = "alert alert-warning";
    
    try {
        const result = await getCurrencyConversion(from, to, amount);
        
        if (result === "N/A") {
            throw new Error("Conversion not available");
        }
        
        resultElement.innerHTML = `
            <strong>${amount} ${from} = ${result} ${to}</strong>
            <div class="mt-2 small text-muted">Rate may vary by provider</div>
        `;
        resultElement.className = "alert alert-success";
        
    } catch (error) {
        console.error("Conversion error:", error);
        resultElement.innerHTML = `
            <strong>Conversion failed</strong>
            <div class="mt-2 small">Using approximate rate</div>
        `;
        resultElement.className = "alert alert-danger";
        
        // Show hardcoded rate as last resort
        const hardcodedResult = getHardcodedConversion(from, to, amount);
        if (hardcodedResult !== "N/A") {
            resultElement.innerHTML += `
                <div class="mt-2"><strong>Approximate:</strong> ${amount} ${from} ≈ ${hardcodedResult} ${to}</div>
            `;
        }
    }
}

// Update your time display function:
async function showSelectedTime() {
    const timezone = document.getElementById('city-select').value;
    if (!timezone) return;
    
    const timezoneName = document.getElementById('city-select').options[document.getElementById('city-select').selectedIndex].text;
    const resultElement = document.getElementById('time-result');
    
    resultElement.textContent = "Loading...";
    resultElement.className = "alert alert-warning";
    
    try {
        const time = await getCurrentTime(timezone);
        resultElement.textContent = `${timezoneName}: ${time}`;
        resultElement.className = "alert alert-primary";
    } catch (error) {
        console.error("Time error:", error);
        resultElement.textContent = `Couldn't fetch time for ${timezoneName}`;
        resultElement.className = "alert alert-danger";
    }
}