// ----- World Clock -----
function showSelectedTime() {
    let citySelect = document.getElementById("city-select");
    let result = document.getElementById("time-result");

    if (citySelect && citySelect.value) {
        let now = new Date();
        result.innerHTML = `Selected timezone (${citySelect.value}): ${now.toLocaleString()}`;
    } else {
        result.innerHTML = "Please select a timezone.";
    }
}

function startLiveTime() {
    setInterval(showSelectedTime, 1000);
}

function pinTimezone() {
    let citySelect = document.getElementById("city-select");
    let pinned = document.getElementById("pinned-timezones");

    if (citySelect && citySelect.value) {
        let item = document.createElement("div");
        item.className = "list-group-item";
        item.innerText = citySelect.value;
        pinned.appendChild(item);
    }
}

// ----- Currency Converter -----
function convertCurrency() {
    let amount = parseFloat(document.getElementById("amount").value) || 0;
    let from = document.getElementById("from-currency").value;
    let to = document.getElementById("to-currency").value;

    let result = document.getElementById("conversion-result");
    result.innerHTML = `${amount} ${from} = ${amount * 2} ${to} (demo rate)`; // replace with API later
}

function swapCurrencies() {
    let from = document.getElementById("from-currency");
    let to = document.getElementById("to-currency");
    [from.value, to.value] = [to.value, from.value];
}

function pinCurrency() {
    let from = document.getElementById("from-currency").value;
    let to = document.getElementById("to-currency").value;
    let pinned = document.getElementById("pinned-currencies");

    let item = document.createElement("div");
    item.className = "list-group-item";
    item.innerText = `${from} → ${to}`;
    pinned.appendChild(item);
}
