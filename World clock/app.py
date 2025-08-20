from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/world-clock')
def world_clock():
    return render_template('world_clock.html')

@app.route('/currency-converter')
def currency_converter():
    return render_template('currency_converter.html')

@app.route('/pinned-items')
def pinned_items():
    return render_template('pinned_items.html')

if __name__ == '__main__':
    app.run(debug=True)