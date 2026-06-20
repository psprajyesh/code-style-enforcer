import re

def check_code(code):
    violations = []

    # Rule 1: camelCase
    if re.search(r'\b[a-z]+_[a-z]+\b', code):
        violations.append({
            "rule": "Use camelCase",
            "fix": "Replace snake_case with camelCase"
        })

    # Rule 2: No console.log
    if "console.log(" in code:
        violations.append({
            "rule": "No console.log",
            "fix": "Remove console.log statement"
        })

    # Rule 3: Function comments
    if "function" in code and "/**" not in code and "//" not in code:
        violations.append({
            "rule": "Missing function comment",
            "fix": "Add a comment above the function"
        })

    # Rule 4: Hardcoded secrets
    if "api_key" in code.lower() or "token" in code.lower():
        violations.append({
            "rule": "Hardcoded secret detected",
            "fix": "Move secrets to environment variables"
        })

    return violations


if __name__ == "__main__":
    sample_code = """
    function calculate_total(a, b) {
        console.log(a);
        return a + b;
    }
    """

    print(check_code(sample_code))