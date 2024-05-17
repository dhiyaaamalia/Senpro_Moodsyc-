from flask import Flask, request, jsonify, render_template

app = Flask(__name__)
@app.route('auth')
def auth():
    return render_template('auth')

if __name__ == "__main__":
    app.run(debug=True)