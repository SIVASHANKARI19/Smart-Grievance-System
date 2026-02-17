from flask import Flask, request, jsonify
import joblib
from keywords import (
    URGENCY_KEYWORDS, 
    EMERGENCY_KEYWORDS, 
    COMPOUND_PHRASES,
    TIME_INDICATORS,
    SCALE_INDICATORS,
    ABSENCE_KEYWORDS,
    repetition_score
)

app = Flask(__name__)

vectorizer = joblib.load("vectorizer.pkl")
dept_model = joblib.load("dept_model.pkl")
priority_model = joblib.load("priority_model.pkl")

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
    
    Args:
        description (str): Complaint description text
        repeat_count (int): Number of similar complaints registered
        
    Returns:
        int: Total priority score
    """
    text = description.lower()
    total_score = 0
    
    # Check compound phrases first (they have higher priority)
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
    
    # 🔥 ADD REPETITION SCORE (crowd-sourced priority)
    repetition = repetition_score(repeat_count)
    total_score += repetition
    
    return total_score

@app.route("/classify", methods=["POST"])
def classify():
    """
    Classify civic complaint by department and priority.
    
    Expected JSON input:
    {
        "description": "complaint text here",
        "repeatCount": 5  // optional, defaults to 0
    }
    
    Returns:
    {
        "department": "predicted department",
        "priority": "Critical/High/Medium/Low",
        "priorityScore": numerical_score,
        "repeatCount": number_of_similar_complaints,
        "isMassComplaint": true/false
    }
    """
    data = request.json
    desc = data.get("description", "")
    repeat_count = data.get("repeatCount", 0)
    
    if not desc:
        return jsonify({
            "error": "Description is required"
        }), 400

    # Predict department using ML model
    X_vec = vectorizer.transform([desc])
    department = dept_model.predict(X_vec)[0]

    # Calculate priority score
    score = calculate_priority(desc, repeat_count)
    
    # 🚨 FORCE CRITICAL PRIORITY FOR MASS COMPLAINTS
    # If 30+ people report same issue → automatically CRITICAL
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

    return jsonify({
        "department": department,
        "priority": priority,
        "priorityScore": score,
        "repeatCount": repeat_count,
        "isMassComplaint": is_mass_complaint,
        "reason": priority_reason
    })

@app.route("/health", methods=["GET"])
def health_check():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "message": "Civic Complaint Classifier API with Repetition-Based Priority is running"
    })

@app.route("/test-scenarios", methods=["GET"])
def test_scenarios():
    """
    Test endpoint showing different priority scenarios.
    Useful for demo/viva/presentation.
    """
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
        "repetition_scoring": {
            "50+ complaints": "50 points (Massive public impact)",
            "30-49 complaints": "35 points (Major area-wide issue)",
            "15-29 complaints": "20 points (Significant neighborhood problem)",
            "5-14 complaints": "10 points (Multiple reports)",
            "1-4 complaints": "0 points (Individual issue)"
        }
    })

if __name__ == "__main__":
    app.run(debug=True)