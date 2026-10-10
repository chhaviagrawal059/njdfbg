import re
from typing import Dict, Any, List
from app.ai_services.nlp_utils import tokenize

CATEGORIES = [
    "Water Resources",
    "Healthcare",
    "Agriculture",
    "Education",
    "Environment",
    "Renewable Energy",
    "Rural Livelihoods",
    "Accessibility",
    "Urban Infrastructure",
    "Public Administration"
]

DOMAIN_KEYWORDS: Dict[str, List[str]] = {
    "Water Resources": [
        "water", "drinking water", "arsenic", "fluoride", "borewell", "handpump", "well", "pond", "reservoir",
        "contamination", "purification", "filtration", "leakage", "pipeline", "sewage", "groundwater", "jal"
    ],
    "Healthcare": [
        "health", "hospital", "clinic", "doctor", "medicine", "anganwadi", "telemedicine", "malaria", "dengue",
        "maternal", "infant", "malnutrition", "ambulance", "phc", "chc", "disease", "treatment", "vaccine"
    ],
    "Agriculture": [
        "crop", "farmer", "farming", "paddy", "irrigation", "soil", "fertilizer", "pest", "harvest", "seed",
        "lac", "mahua", "cold storage", "mandis", "drought", "yield", "horticulture", "kisan"
    ],
    "Education": [
        "school", "student", "teacher", "classroom", "books", "digital learning", "computer lab", "dropout",
        "literacy", "library", "higher education", "vocational", "skill training", "tribal youth"
    ],
    "Environment": [
        "pollution", "air quality", "forest", "mining dust", "coal dump", "overburden", "erosion", "deforestation",
        "solid waste", "plastic", "biodiversity", "wildlife", "conservation", "river clean"
    ],
    "Renewable Energy": [
        "solar", "microgrid", "electricity", "power cut", "wind", "biomass", "off-grid", "battery", "streetlight",
        "clean energy", "inverter", "transmission", "lighting"
    ],
    "Rural Livelihoods": [
        "handicraft", "artisan", "self help group", "shg", "tribal craft", "weaving", "bamboo", "forest produce",
        "employment", "poultry", "dairy", "goat farming", "fisheries", "market linkage"
    ],
    "Accessibility": [
        "disabled", "wheelchair", "ramp", "visually impaired", "hearing", "braille", "assistive", "special needs",
        "elderly", "mobility", "barrier free"
    ],
    "Urban Infrastructure": [
        "road", "pothole", "bridge", "drainage", "traffic", "street lights", "sanitation", "garbage collection",
        "public transport", "bus stop", "culvert", "urban housing"
    ],
    "Public Administration": [
        "ration card", "aadhaar", "pension", "land records", "corruption", "portal", "grievance", "public service",
        "panchayat office", "block office", "transparency", "e-governance", "certificates"
    ]
}

def categorize_problem(text: str) -> Dict[str, Any]:
    """
    Classifies a problem submission into Jharkhand societal focus domains
    using keyword matching and semantic domain weighting.
    Returns primary category, secondary category, confidence score, and matched keywords.
    """
    text_clean = text.lower()
    scores: Dict[str, float] = {}
    matched_words: Dict[str, List[str]] = {}

    for cat, keywords in DOMAIN_KEYWORDS.items():
        found = []
        for kw in keywords:
            if re.search(r'\b' + re.escape(kw) + r'\b', text_clean):
                found.append(kw)
        
        # Base score from keyword count
        score = len(found) * 2.0
        # Extra weight if keyword in title or start of description
        if any(kw in text_clean[:80] for kw in found):
            score += 1.5
            
        scores[cat] = score
        matched_words[cat] = found

    # Sort categories by score
    sorted_cats = sorted(scores.items(), key=lambda x: x[1], reverse=True)
    top_cat, top_score = sorted_cats[0]
    sec_cat, sec_score = sorted_cats[1]

    # Calculate confidence score between 0.45 and 0.98
    if top_score == 0:
        return {
            "suggested_category": "Public Administration",
            "secondary_category": "Urban Infrastructure",
            "confidence_score": 0.50,
            "matched_keywords": [],
            "explanation": "No specific technical domain keywords detected; routed to Public Administration for administrative triage."
        }
    
    confidence = min(0.96, max(0.60, (top_score / (top_score + sec_score + 1.0)) + 0.35))
    
    return {
        "suggested_category": top_cat,
        "secondary_category": sec_cat if sec_score > 0 else None,
        "confidence_score": round(confidence, 2),
        "matched_keywords": matched_words.get(top_cat, []),
        "explanation": f"Matched critical domain indicators: {', '.join(matched_words.get(top_cat, [])[:4])} with domain relevance {round(confidence * 100)}%."
    }
