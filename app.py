from flask import Flask, render_template, jsonify
from datetime import datetime

app = Flask(__name__)

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/api/data")
def get_data():
    return jsonify({
        "times": [
            {"city": "New York", "time": datetime.now().strftime("%H:%M:%S")},
            {"city": "London", "time": datetime.now().strftime("%H:%M:%S")},
            {"city": "Tokyo", "time": datetime.now().strftime("%H:%M:%S")}
        ],
        "currencies": {
            "EUR": 0.92,
            "ZAR": 18.5,
            "JPY": 148.3
        }
    })

if __name__ == "__main__":
    app.run(debug=True)
