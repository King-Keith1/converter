from flask import Flask, render_template, jsonify

app = Flask(__name__)

@app.route("/")
def home():
    return render_template("index.html")

# World Clock route
@app.route("/world-clock")
def world_clock():
    # For now just return test data
    return jsonify({
        "city": "New York",
        "time": "2025-08-21 16:15:00"
    })

# Currency Converter route
@app.route("/currency-converter")
def currency_converter():
    # Example static response
    return jsonify({
        "USD": 1.0,
        "EUR": 0.92,
        "ZAR": 18.5
    })

# Pinned Items route
@app.route("/pinned-items")
def pinned_items():
    return jsonify([
        {"type": "time", "city": "Tokyo", "time": "2025-08-21 23:15:00"},
        {"type": "currency", "pair": "USD/EUR", "rate": 0.92}
    ])

if __name__ == "__main__":
    app.run(debug=True)
