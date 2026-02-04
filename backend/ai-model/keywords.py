# keywords.py
# Comprehensive keyword configuration for civic complaint priority calculation

# ============================================================
# URGENCY KEYWORDS (Score: 6-10)
# ============================================================
URGENCY_KEYWORDS = {
    # Immediate action required
    "urgent": 10,
    "immediately": 10,
    "asap": 10,
    "emergency": 10,
    "critical": 10,
    "dangerous": 9,
    "hazardous": 9,
    "unsafe": 9,
    "life threatening": 10,
    "life-threatening": 10,
    
    # Malfunction/Breakdown
    "not working": 8,
    "broken": 8,
    "damaged": 7,
    "collapsed": 9,
    "burst": 8,
    "leaking": 7,
    "overflow": 7,
    "overflowing": 7,
    "malfunctioning": 8,
    "out of order": 8,
    "failed": 8,
    "stopped": 7,
    "stuck": 7,
    "jammed": 7,
    
    # Time-sensitive
    "delay": 6,
    "delayed": 6,
    "overdue": 6,
    "pending": 6,
    "waiting": 6,
    "neglected": 7,
    "ignored": 7,
    
    # Severity indicators
    "serious": 8,
    "severe": 8,
    "major": 7,
    "huge": 7,
    "massive": 7,
    "extensive": 7,
    "widespread": 8,
    
    # Disruption
    "blocking": 8,
    "blocked": 8,
    "disrupted": 7,
    "disruption": 7,
    "paralyzed": 9,
    "standstill": 8,
}

# ============================================================
# EMERGENCY KEYWORDS (Score: 25-40)
# ============================================================
EMERGENCY_KEYWORDS = {
    # Fire & Explosion
    "fire": 40,
    "explosion": 40,
    "blast": 40,
    "burning": 35,
    "smoke": 30,
    "flames": 35,
    
    # Electrical Hazards
    "electric shock": 40,
    "electrocution": 40,
    "sparking": 35,
    "short circuit": 35,
    "live wire": 38,
    "exposed wire": 35,
    "transformer blast": 40,
    "transformer exploded": 40,
    
    # Gas Hazards
    "gas leak": 40,
    "lpg leak": 40,
    "cylinder leak": 40,
    "toxic fumes": 38,
    "poisonous gas": 40,
    
    # Water Disasters
    "flood": 35,
    "flooding": 35,
    "submerged": 35,
    "waterlogged": 30,
    "inundated": 35,
    "water gushing": 33,
    
    # Structural Hazards
    "collapse": 40,
    "collapsed": 40,
    "collapsing": 38,
    "falling": 35,
    "crumbling": 33,
    "sinking": 35,
    "tilted": 30,
    "leaning dangerously": 35,
    
    # Medical Emergencies
    "injury": 35,
    "injured": 35,
    "death": 40,
    "died": 40,
    "fatal": 40,
    "casualties": 38,
    "bleeding": 35,
    "unconscious": 38,
    "heart attack": 40,
    "stroke": 40,
    
    # Accidents
    "accident": 35,
    "crash": 35,
    "collision": 33,
    "hit and run": 38,
    "vehicle overturned": 35,
    
    # Crime & Violence
    "robbery": 35,
    "theft": 30,
    "murder": 40,
    "assault": 35,
    "rape": 40,
    "kidnapping": 40,
    "kidnapped": 40,
    "mob violence": 38,
    "rioting": 38,
    "shooting": 40,
    "stabbing": 38,
    
    # Contamination
    "contaminated": 35,
    "sewage overflow": 33,
    "toxic waste": 38,
    "chemical spill": 40,
    "radiation": 40,
    
    # Disease Outbreak
    "outbreak": 35,
    "epidemic": 38,
    "pandemic": 40,
    "contagious": 33,
    
    # Other Critical
    "landslide": 40,
    "earthquake": 40,
    "building on fire": 40,
    "drowning": 40,
    "choking": 38,
    "trapped": 38,
}

# ============================================================
# COMPOUND PHRASES (Higher Priority) - Score: 10-20
# ============================================================
COMPOUND_PHRASES = {
    # Critical water issues
    "no drinking water": 15,
    "contaminated water": 15,
    "sewage mixing": 18,
    "water line burst": 16,
    "major leakage": 14,
    "pipe burst": 15,
    "water pipe burst": 16,
    
    # Critical electricity issues
    "power outage": 12,
    "no electricity": 13,
    "no power": 13,
    "transformer exploded": 20,
    "live wires": 18,
    "electric pole fallen": 17,
    "wire fallen": 15,
    
    # Critical road issues
    "road collapsed": 18,
    "bridge damaged": 17,
    "deep pothole": 12,
    "manhole open": 15,
    "cave in": 17,
    
    # Critical traffic issues
    "major accident": 18,
    "traffic signal not working": 13,
    "heavy traffic jam": 10,
    "road blocked": 14,
    
    # Critical sanitation issues
    "garbage overflowing": 11,
    "drain choked": 12,
    "sewage overflow": 15,
    "public toilet blocked": 10,
    
    # Critical health issues
    "no doctor": 14,
    "ambulance delayed": 15,
    "no medicine": 13,
    "patient dying": 20,
    "no beds available": 14,
    "no ambulance": 15,
    
    # Critical safety issues
    "in progress": 12,
    "just happened": 13,
    "happening now": 14,
    "help needed": 12,
    "need help": 12,
}

# ============================================================
# TIME-SENSITIVE INDICATORS - Score: 6-9
# ============================================================
TIME_INDICATORS = {
    "now": 8,
    "currently": 7,
    "right now": 9,
    "at the moment": 8,
    "ongoing": 7,
    "happening": 8,
    "in progress": 9,
    "since morning": 6,
    "since yesterday": 6,
    "for days": 7,
    "for weeks": 8,
    "for months": 6,
    "still": 6,
    "yet": 6,
    "again": 7,
    "repeatedly": 7,
    "frequent": 6,
    "continuous": 7,
}

# ============================================================
# QUANTITY/SCALE INDICATORS - Score: 6-8
# ============================================================
SCALE_INDICATORS = {
    "entire": 7,
    "whole": 7,
    "complete": 6,
    "all": 6,
    "multiple": 7,
    "many": 6,
    "several": 6,
    "numerous": 7,
    "large": 6,
    "massive": 8,
    "widespread": 8,
    "area wide": 8,
    "colony": 7,
    "neighborhood": 6,
    "locality": 6,
    "zone": 6,
}

# ============================================================
# NEGATION/ABSENCE KEYWORDS - Score: 6-7
# ============================================================
ABSENCE_KEYWORDS = {
    "no": 7,
    "not": 6,
    "never": 7,
    "without": 6,
    "lacking": 6,
    "absent": 7,
    "missing": 7,
    "unavailable": 7,
    "shortage": 7,
    "insufficient": 6,
    "inadequate": 6,
    "scarce": 7,
    "depleted": 7,
}

# ============================================================
# REPETITION-BASED PRIORITY SCORING
# ============================================================
def repetition_score(repeat_count):
    """
    Calculate additional priority score based on how many people 
    have reported similar complaints.
    
    This implements crowd-sourced priority: if many citizens report
    the same issue, it indicates a widespread problem requiring 
    immediate attention.
    
    Args:
        repeat_count (int): Number of similar complaints registered
        
    Returns:
        int: Additional priority score (0-50)
    
    Thresholds:
        50+  complaints → 50 points (Massive public impact)
        30-49 complaints → 35 points (Major area-wide issue)
        15-29 complaints → 20 points (Significant neighborhood problem)
        5-14 complaints → 10 points (Multiple reports)
        1-4 complaints → 0 points (Individual issue)
    """
    if repeat_count >= 50:
        return 50   # Massive public impact - entire area affected
    elif repeat_count >= 30:
        return 35   # Major area-wide issue - multiple localities
    elif repeat_count >= 15:
        return 20   # Significant neighborhood problem
    elif repeat_count >= 5:
        return 10   # Multiple reports - emerging pattern
    else:
        return 0    # Individual complaint - normal priority