from flask import Flask, request, jsonify
from flask_cors import CORS
from checker import check_code

app = Flask(__name__)
CORS(app)

@app.route("/")
def home():
    return "Code Style Enforcer API Running"


@app.route("/check", methods=["POST"])
def check():
    data = request.get_json()

    code = data.get("code", "")

    violations = check_code(code)

    return jsonify(violations)


if __name__ == "__main__":
    app.run(port=5000, debug=True)