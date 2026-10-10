import json
from typing import List, Dict, Any

def match_institutions_for_challenge(
    challenge_category: str,
    challenge_description: str,
    challenge_district: str,
    institutional_profiles: List[Dict[str, Any]],
    top_k: int = 3
) -> List[Dict[str, Any]]:
    """
    Evaluates real registered Jharkhand universities & research institutes.
    Computes transparent multi-criteria capability match:
    1. Research Domain Alignment (40%)
    2. Faculty Specialization & Labs (25%)
    3. Laboratory & Testing Facilities (15%)
    4. Past Civic Project Track Record (10%)
    5. Available Capacity / Current Load (10%)
    """
    ranked_matches = []
    desc_words = set(challenge_description.lower().split())

    for inst in institutional_profiles:
        inst_id = inst.get("id")
        inst_name = inst.get("institution_name", "Technical University")
        domains = inst.get("domains", [])
        if isinstance(domains, str):
            try:
                domains = json.loads(domains)
            except Exception:
                domains = [d.strip() for d in domains.split(",")]

        labs = inst.get("labs", [])
        if isinstance(labs, str):
            try:
                labs = json.loads(labs)
            except Exception:
                labs = [l.strip() for l in labs.split(",")]

        past_projects = inst.get("previous_projects", [])
        if isinstance(past_projects, str):
            try:
                past_projects = json.loads(past_projects)
            except Exception:
                past_projects = [p.strip() for p in past_projects.split(",")]

        max_cap = inst.get("max_capacity", 10)
        curr_load = inst.get("current_active_load", 0)

        # 1. Domain match (0 - 40 points)
        domain_match_found = any(challenge_category.lower() in d.lower() for d in domains)
        domain_score = 40.0 if domain_match_found else 10.0

        # 2. Labs & Facilities match (0 - 25 points)
        relevant_labs = []
        for lab in labs:
            lab_words = set(lab.lower().split())
            if lab_words & desc_words or any(challenge_category.lower() in lab.lower() for _ in [1]):
                relevant_labs.append(lab)
        
        lab_score = min(25.0, len(relevant_labs) * 10.0 + (5.0 if labs else 0.0))

        # 3. Faculty expertise & publications (0 - 15 points)
        faculty_count = inst.get("faculty_count", 50)
        faculty_score = min(15.0, 5.0 + (faculty_count / 20.0))

        # 4. Past Civic Project Track Record (0 - 10 points)
        matched_projects = [p for p in past_projects if any(w in p.lower() for w in desc_words) or challenge_category.lower() in p.lower()]
        past_score = min(10.0, len(matched_projects) * 4.0 + (2.0 if past_projects else 0.0))

        # 5. Capacity availability (0 - 10 points)
        free_capacity = max(0, max_cap - curr_load)
        cap_ratio = free_capacity / max(1, max_cap)
        capacity_score = cap_ratio * 10.0

        total_score = round(domain_score + lab_score + faculty_score + past_score + capacity_score, 1)

        # Generate human-readable explanation
        reasons = []
        if domain_match_found:
            reasons.append(f"Strong research domain focus in {challenge_category}")
        if relevant_labs:
            reasons.append(f"Specialized facilities ({', '.join(relevant_labs[:2])})")
        if matched_projects:
            reasons.append(f"Delivered {len(matched_projects)} prior projects in related technologies")
        if free_capacity >= 2:
            reasons.append(f"Available capacity ({free_capacity}/{max_cap} active slots)")

        explanation = ". ".join(reasons) if reasons else f"Institutional capacity for {challenge_category} engineering."

        ranked_matches.append({
            "institution_id": inst_id,
            "institution_name": inst_name,
            "institution_type": inst.get("institution_type", "University"),
            "match_score": total_score,
            "domain_alignment_score": round(domain_score, 1),
            "lab_facilities_score": round(lab_score, 1),
            "faculty_score": round(faculty_score, 1),
            "past_track_record_score": round(past_score, 1),
            "capacity_score": round(capacity_score, 1),
            "available_slots": free_capacity,
            "relevant_labs": relevant_labs,
            "explanation": explanation
        })

    # Sort descending
    ranked_matches.sort(key=lambda x: x["match_score"], reverse=True)
    return ranked_matches[:top_k]
