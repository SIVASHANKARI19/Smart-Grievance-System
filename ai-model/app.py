from flask import Flask, request, jsonify
import os
import random
from flask_cors import CORS
import joblib
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from textblob import TextBlob
from keywords import (
    URGENCY_KEYWORDS,
    EMERGENCY_KEYWORDS,
    COMPOUND_PHRASES,
    TIME_INDICATORS,
    SCALE_INDICATORS,
    ABSENCE_KEYWORDS,
    repetition_score
)
from officers import DEPARTMENT_OFFICERS

app = Flask(__name__)
CORS(app, origins=[
    "https://smart-grievance-system-frontend.vercel.app",
    "https://smart-grievance-system-frontend-2i0zfyvo4.vercel.app"
])

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# ─────────────────────────────────────────
# MODEL LOADING / AUTO RETRAINING
# ─────────────────────────────────────────
def load_models():
    try:
        v = joblib.load(os.path.join(BASE_DIR, "vectorizer.pkl"))
        v.transform(["test"])  # verify fitted
        d = joblib.load(os.path.join(BASE_DIR, "dept_model.pkl"))
        p = joblib.load(os.path.join(BASE_DIR, "priority_model.pkl"))
        print("✅ Models loaded from pkl")
        return v, d, p
    except Exception as e:
        print(f"⚠️ PKL load failed: {e} — retraining...")
        data = pd.read_csv(os.path.join(BASE_DIR, "data.csv"))
        v = TfidfVectorizer()
        X_vec = v.fit_transform(data['description'])
        d = MultinomialNB()
        d.fit(X_vec, data['department'])
        p = MultinomialNB()
        p.fit(X_vec, data['priority'])
        print("✅ Retrained successfully")
        return v, d, p

vectorizer, dept_model, priority_model = load_models()

# ─────────────────────────────────────────
# TYPO CORRECTION
# ─────────────────────────────────────────
def correct_text(text):
    """Auto-correct typos using TextBlob"""
    try:
        corrected = str(TextBlob(text).correct())
        if corrected != text:
            print(f"📝 Typo corrected: '{text}' → '{corrected}'")
        return corrected
    except Exception as e:
        print(f"⚠️ Spell correction failed: {e} — using original text")
        return text

# ─────────────────────────────────────────
# OFFICER ASSIGNMENT
# ─────────────────────────────────────────
def assign_officer(department, priority):
    """
    Assign officer based on department and priority.
    - Critical: always assign senior officer (first in list)
    - High: assign second officer if available
    - Others: random assignment
    """
    officers = DEPARTMENT_OFFICERS.get(department, [])

    if not officers:
        return {
            "id": "UNASSIGNED",
            "name": "Department Head",
            "phone": "N/A",
            "email": "N/A"
        }

    if priority == "Critical":
        # Senior officer handles critical complaints
        return officers[0]
    elif priority == "High" and len(officers) > 1:
        # Second officer handles high priority
        return officers[1]
    else:
        # Random assignment for medium/low
        return random.choice(officers)

# ─────────────────────────────────────────
# PRIORITY CALCULATION
# ─────────────────────────────────────────
def calculate_priority(description, repeat_count=0):
    """
    Calculate priority score based on:
    1. Urgency keywords (broken, urgent, etc.)
    2. Emergency keywords (fire, accident, etc.)
    3. Compound phrases (no drinking water, etc.)
    4. Time indicators (now, ongoing, etc.)
    5. Scale indicators (entire, widespread, etc.)
    6. Absence keywords (no, missing, etc.)
    7. Repetition score (how many people reported same issue)
    """
    text = description.lower()
    total_score = 0

    # Check compound phrases first (higher priority)
    for phrase, score in COMPOUND_PHRASES.items():
        if phrase in text:
            total_score += score

    # Check emergency keywords (take the maximum)
    emergency_score = max(
        (score for keyword, score in EMERGENCY_KEYWORDS.items() if keyword in text),
        default=0
    )
    total_score += emergency_score

    # Check urgency keywords (cap at 40)
    urgency_score = sum(
        score for keyword, score in URGENCY_KEYWORDS.items() if keyword in text
    )
    total_score += min(urgency_score, 40)

    # Check time indicators (cap at 20)
    time_score = sum(
        score for keyword, score in TIME_INDICATORS.items() if keyword in text
    )
    total_score += min(time_score, 20)

    # Check scale indicators (cap at 15)
    scale_score = sum(
        score for keyword, score in SCALE_INDICATORS.items() if keyword in text
    )
    total_score += min(scale_score, 15)

    # Check absence keywords (cap at 15)
    absence_score = sum(
        score for keyword, score in ABSENCE_KEYWORDS.items() if keyword in text
    )
    total_score += min(absence_score, 15)

    # Repetition score (crowd-sourced priority)
    repetition = repetition_score(repeat_count)
    total_score += repetition

    return total_score

# ─────────────────────────────────────────
# ROUTES
# ─────────────────────────────────────────
@app.route("/classify", methods=["POST"])
def classify():
    try:
        data = request.get_json(silent=True) or {}
        print("Incoming request data:", data)

        desc = data.get("description", "")
        repeat_count = data.get("repeatCount", 0)

        if not isinstance(desc, str) or not desc.strip():
            return jsonify({
                "error": "Description is required"
            }), 400

        try:
            repeat_count = int(repeat_count)
        except (TypeError, ValueError):
            repeat_count = 0

        # Auto-correct typos
        corrected_desc = correct_text(desc)

        # Predict department
        X_vec = vectorizer.transform([corrected_desc])
        department = dept_model.predict(X_vec)[0]

        # Calculate priority score
        score = calculate_priority(corrected_desc, repeat_count)

        # Force critical for mass complaints
        is_mass_complaint = repeat_count >= 30

        if is_mass_complaint:
            priority = "Critical"
            priority_reason = "Mass complaint - multiple citizens affected"
        elif score >= 70:
            priority = "Critical"
            priority_reason = "High emergency/urgency score"
        elif score >= 40:
            priority = "High"
            priority_reason = "Significant urgency detected"
        elif score >= 20:
            priority = "Medium"
            priority_reason = "Moderate priority issue"
        else:
            priority = "Low"
            priority_reason = "Routine complaint"

        # Assign officer
        officer = assign_officer(str(department), priority)

        result = {
            "department": str(department),
            "priority": priority,
            "priorityScore": int(score),
            "repeatCount": repeat_count,
            "isMassComplaint": is_mass_complaint,
            "reason": priority_reason,
            "originalDescription": desc,
            "correctedDescription": corrected_desc,
            "assignedOfficer": {
                "id": officer["id"],
                "name": officer["name"],
                "phone": officer["phone"],
                "email": officer["email"]
            }
        }

        print("Classification result:", result)
        return jsonify(result), 200

    except Exception as e:
        import traceback
        print("CLASSIFY ERROR:", str(e))
        traceback.print_exc()
        return jsonify({
            "error": "Internal server error",
            "details": str(e)
        }), 500


@app.route("/health", methods=["GET"])
def health_check():
    return jsonify({
        "status": "healthy",
        "message": "Civic Complaint Classifier API with Typo Correction & Officer Assignment is running"
    })


@app.route("/officers", methods=["GET"])
def get_officers():
    """Get all officers by department"""
    return jsonify({
        "departments": DEPARTMENT_OFFICERS
    })


@app.route("/test-scenarios", methods=["GET"])
def test_scenarios():
    scenarios = [
        {
            "scenario": "Normal complaint",
            "description": "Water supply issue in my house",
            "repeatCount": 2,
            "expected": "Medium priority"
        },
        {
            "scenario": "Mass complaint - forced CRITICAL",
            "description": "No water supply in Area-5",
            "repeatCount": 38,
            "expected": "CRITICAL (forced due to mass complaints)"
        },
        {
            "scenario": "Emergency + repetition",
            "description": "Gas leak reported, immediate danger",
            "repeatCount": 12,
            "expected": "CRITICAL (emergency keywords + repetition)"
        },
        {
            "scenario": "High repetition threshold",
            "description": "Garbage not collected for weeks",
            "repeatCount": 55,
            "expected": "CRITICAL (50+ complaints = massive impact)"
        },
        {
            "scenario": "Typo correction test",
            "description": "Watr pipe leakge in my stret",
            "repeatCount": 1,
            "expected": "Corrected to: Water pipe leakage in my street"
        }
    ]

    return jsonify({
        "message": "Priority calculation test scenarios",
        "scenarios": scenarios,
        "thresholds": {
            "mass_complaint": "30+ complaints → Force CRITICAL",
            "critical": "Score >= 70",
            "high": "Score >= 40",
            "medium": "Score >= 20",
            "low": "Score < 20"
        },
        "officer_assignment": {
            "Critical": "Senior officer (first in list)",
            "High": "Second officer",
            "Medium/Low": "Random assignment"
        }
    })


@app.route("/debug", methods=["GET"])
def debug():
    files = {}
    for f in ["vectorizer.pkl", "dept_model.pkl", "priority_model.pkl"]:
        path = os.path.join(BASE_DIR, f)
        files[f] = {
            "exists": os.path.exists(path),
            "size": os.path.getsize(path) if os.path.exists(path) else 0,
            "path": path
        }

    # Test in-memory vectorizer
    try:
        vectorizer.transform(["test"])
        files["vectorizer_status"] = "OK - fitted (in memory)"
    except Exception as e:
        files["vectorizer_status"] = str(e)

    # Test spell correction
    try:
        test_corrected = correct_text("Watr pipe leakge")
        files["spell_correction"] = f"✅ Working — 'Watr pipe leakge' → '{test_corrected}'"
    except Exception as e:
        files["spell_correction"] = f"❌ Failed: {str(e)}"

    # Test officer assignment
    try:
        test_officer = assign_officer("Water", "Critical")
        files["officer_assignment"] = f"✅ Working — Critical Water → {test_officer['name']}"
    except Exception as e:
        files["officer_assignment"] = f"❌ Failed: {str(e)}"

    return jsonify({
        "base_dir": BASE_DIR,
        "files": files
    })


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)