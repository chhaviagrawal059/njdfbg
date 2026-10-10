import pytest
from app.ai_services import (
    categorize_problem,
    detect_duplicates,
    calculate_priority_score,
    match_institutions_for_challenge,
    generate_ai_proposal_draft
)

def test_ai_categorizer_water():
    text = "Villagers in Khunti are facing toxic fluoride and arsenic in drinking water from borewell handpumps."
    result = categorize_problem(text)
    assert result["suggested_category"] == "Water Resources"
    assert result["confidence_score"] >= 0.70
    assert len(result["matched_keywords"]) > 0

def test_ai_categorizer_agriculture():
    text = "Harvested tribal lac and mahua flowers decay quickly due to high humidity and lack of solar cold storage."
    result = categorize_problem(text)
    assert result["suggested_category"] == "Agriculture"
    assert result["confidence_score"] >= 0.70

def test_ai_prioritizer_safety_override():
    # When toxic chemical contamination or extreme hazard is present
    result = calculate_priority_score(
        severity="Critical",
        urgency="Immediate",
        affected_population=5000,
        description="toxic arsenic contamination in drinking water causing acute poisoning risk",
        category="Water Resources",
        feasibility="Low" # Even with low engineering feasibility, safety override must protect lives!
    )
    assert result["is_safety_override"] is True
    assert "Safety Override" in result["priority_tier"]
    assert result["priority_score"] >= 90.0

def test_ai_duplicate_detection():
    existing = [
        {
            "id": 1,
            "title": "Severe fluoride contamination in drinking water wells",
            "description": "Borewell handpumps in Torpa village discharge unsafe fluoride water.",
            "district": "Khunti",
            "latitude": 22.9734,
            "longitude": 85.2589
        }
    ]
    matches = detect_duplicates(
        new_title="Fluoride in water wells in Torpa",
        new_description="Village handpumps have high fluoride chemical contamination in Torpa Khunti",
        new_district="Khunti",
        new_lat=22.9780,
        new_lon=22.2520,
        existing_challenges=existing
    )
    assert len(matches) > 0
    assert matches[0]["matched_challenge_id"] == 1
    assert matches[0]["similarity_score"] >= 0.40

def test_ai_university_matcher():
    mock_institutions = [
        {
            "id": 1,
            "institution_name": "BIT Mesra",
            "institution_type": "Technical University",
            "domains": ["Water Resources", "Environment"],
            "labs": ["Advanced Water Quality & Analytical Chemistry Lab"],
            "previous_projects": ["Solar Desalination Pilot"],
            "faculty_count": 300,
            "max_capacity": 10,
            "current_active_load": 2
        },
        {
            "id": 2,
            "institution_name": "Birsa Agricultural University",
            "institution_type": "Agricultural University",
            "domains": ["Agriculture", "Rural Livelihoods"],
            "labs": ["Post-Harvest Agro-Processing Lab"],
            "previous_projects": ["Lac drying unit"],
            "faculty_count": 150,
            "max_capacity": 8,
            "current_active_load": 1
        }
    ]
    matches = match_institutions_for_challenge(
        challenge_category="Water Resources",
        challenge_description="Purification of fluoride contaminated borewell drinking water",
        challenge_district="Khunti",
        institutional_profiles=mock_institutions,
        top_k=2
    )
    assert len(matches) > 0
    assert matches[0]["institution_name"] == "BIT Mesra"
    assert matches[0]["match_score"] > matches[1]["match_score"]

def test_ai_proposal_assistant():
    draft = generate_ai_proposal_draft(
        challenge_title="Fluoride Contamination in Handpumps",
        challenge_description="Over 18 handpumps discharge fluoride water above 3.5 mg/L",
        challenge_category="Water Resources",
        challenge_district="Khunti",
        institution_name="BIT Mesra"
    )
    assert "technical_approach" in draft
    assert len(draft["proposed_milestones"]) == 4
    assert draft["estimated_cost"] > 0
    assert "ai_generated_note" in draft
