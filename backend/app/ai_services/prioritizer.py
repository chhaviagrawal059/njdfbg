from typing import Dict, Any, Tuple

CRITICAL_HAZARD_KEYWORDS = [
    "arsenic", "fluoride", "toxic", "poison", "cholera", "collapse",
    "landslide", "electrocution", "fatal", "outbreak", "death", "contaminate",
    "mine collapse", "bridge cracking", "chemical leak"
]

def calculate_priority_score(
    severity: str,               # Low, Medium, High, Critical
    urgency: str,                # Low, Medium, High, Immediate
    affected_population: int,    # e.g., 200, 2500, 15000
    description: str,
    category: str,
    feasibility: str = "Medium"  # Low (difficult), Medium (moderate), High (quick turnaround)
) -> Dict[str, Any]:
    """
    Transparent, explainable multi-factor priority calculator (Rule-based decision matrix).
    Accurately labeled as an explainable heuristic framework, not a black-box model.
    Includes Emergency Safety Override Rule so severe public health/life risks
    are not deprioritized due to low engineering feasibility.
    """
    # 1. Severity Score (0 - 100)
    sev_map = {"Low": 25, "Medium": 50, "High": 80, "Critical": 100}
    sev_score = sev_map.get(severity, 50)

    # 2. Urgency Score (0 - 100)
    urg_map = {"Low": 25, "Medium": 50, "High": 80, "Immediate": 100, "Critical": 100}
    urg_score = urg_map.get(urgency, 50)

    # 3. Population Factor (0 - 100)
    if affected_population >= 10000:
        pop_score = 100
        pop_label = "Very High (10,000+ citizens)"
    elif affected_population >= 3000:
        pop_score = 80
        pop_label = "High (3,000 - 9,999 citizens)"
    elif affected_population >= 800:
        pop_score = 60
        pop_label = "Moderate (800 - 2,999 citizens)"
    elif affected_population >= 200:
        pop_score = 40
        pop_label = "Localized (200 - 799 citizens)"
    else:
        pop_score = 25
        pop_label = "Village/Hamlet (<200 citizens)"

    # 4. Public Health & Safety Hazard (0 - 100)
    desc_lower = description.lower()
    matched_hazards = [kw for kw in CRITICAL_HAZARD_KEYWORDS if kw in desc_lower]
    
    if len(matched_hazards) >= 2 or category in ["Healthcare", "Water Resources"] and severity in ["High", "Critical"]:
        safety_score = 100
        safety_label = f"Extreme Hazard ({', '.join(matched_hazards[:3]) if matched_hazards else 'Water/Health Crisis'})"
    elif matched_hazards:
        safety_score = 80
        safety_label = f"Elevated Hazard ({matched_hazards[0]})"
    elif category in ["Healthcare", "Water Resources"]:
        safety_score = 65
        safety_label = "Vital Public Need"
    else:
        safety_score = 35
        safety_label = "Standard Infrastructure/Service"

    # 5. Technical Feasibility (0 - 100)
    feas_map = {"High": 90, "Medium": 60, "Low": 30}
    feas_score = feas_map.get(feasibility, 60)

    # Multi-factor formula:
    # Severity (25%) + Urgency (20%) + Population (20%) + Health/Safety (20%) + Feasibility (15%)
    weighted_score = (
        (sev_score * 0.25) +
        (urg_score * 0.20) +
        (pop_score * 0.20) +
        (safety_score * 0.20) +
        (feas_score * 0.15)
    )

    # Emergency Safety Override Rule:
    # If acute life or health risk exists, problem must not be deprioritized by low technical feasibility!
    is_safety_override = False
    override_reason = None

    if safety_score >= 90 and (sev_score >= 80 or urg_score >= 80):
        is_safety_override = True
        weighted_score = max(weighted_score, 92.0)
        override_reason = (
            f"Emergency Safety Rule Triggered: Detected acute safety hazard ({matched_hazards or ['Critical Severity']}). "
            "Priority escalated to Critical regardless of engineering complexity."
        )

    # Priority Tier assignment
    if weighted_score >= 85:
        tier = "Critical (Safety Override)" if is_safety_override else "Critical"
    elif weighted_score >= 70:
        tier = "High"
    elif weighted_score >= 45:
        tier = "Medium"
    else:
        tier = "Low"

    breakdown = {
        "severity": {"value": severity, "score": sev_score, "weight": "25%"},
        "urgency": {"value": urgency, "score": urg_score, "weight": "20%"},
        "population": {"affected": affected_population, "label": pop_label, "score": pop_score, "weight": "20%"},
        "health_and_safety": {"label": safety_label, "score": safety_score, "weight": "20%"},
        "feasibility": {"value": feasibility, "score": feas_score, "weight": "15%"},
        "formula": "Score = (Severity×0.25) + (Urgency×0.20) + (Population×0.20) + (Safety×0.20) + (Feasibility×0.15)"
    }

    return {
        "priority_score": round(weighted_score, 1),
        "priority_tier": tier,
        "is_safety_override": is_safety_override,
        "override_reason": override_reason,
        "breakdown": breakdown
    }
