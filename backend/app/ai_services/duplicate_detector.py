import math
from typing import List, Dict, Any, Optional
from app.ai_services.nlp_utils import compute_cosine_similarity, compute_jaccard_similarity

def calculate_haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Calculates great-circle distance between two GPS coordinates in kilometers."""
    R = 6371.0 # Earth's radius in kilometers
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = (math.sin(dlat / 2) ** 2 +
         math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) *
         math.sin(dlon / 2) ** 2)
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return round(R * c, 2)

def detect_duplicates(
    new_title: str,
    new_description: str,
    new_district: str,
    new_lat: Optional[float],
    new_lon: Optional[float],
    existing_challenges: List[Dict[str, Any]],
    similarity_threshold: float = 0.35
) -> List[Dict[str, Any]]:
    """
    Scans existing challenges to detect duplicates using semantic text similarity
    (TF-IDF cosine similarity) and geospatial proximity (Haversine distance).
    Never deletes; flags for human administrative review.
    """
    matches = []
    if not existing_challenges:
        return matches

    new_full_text = f"{new_title} {new_description}".lower()

    for item in existing_challenges:
        cand_id = item.get("id")
        cand_title = item.get("title", "")
        cand_desc = item.get("description", "")
        cand_district = item.get("district", "")
        cand_lat = item.get("latitude")
        cand_lon = item.get("longitude")

        cand_full_text = f"{cand_title} {cand_desc}".lower()

        # Compute TF-IDF cosine similarity + token overlap
        cos_sim = compute_cosine_similarity(new_full_text, cand_full_text)
        jaccard_sim = compute_jaccard_similarity(new_full_text, cand_full_text)
        text_sim = max(cos_sim, (jaccard_sim * 1.3))

        # Check geographic distance
        distance_km = None
        geo_bonus = 0.0
        same_district = (new_district.strip().lower() == cand_district.strip().lower())

        if new_lat is not None and new_lon is not None and cand_lat is not None and cand_lon is not None:
            distance_km = calculate_haversine_distance(new_lat, new_lon, cand_lat, cand_lon)
            if distance_km < 5.0:
                geo_bonus = 0.25
            elif distance_km < 15.0:
                geo_bonus = 0.15
            elif distance_km < 35.0:
                geo_bonus = 0.08
        elif same_district:
            geo_bonus = 0.12

        composite_score = min(1.0, round(text_sim * 0.75 + geo_bonus, 2))

        if composite_score >= similarity_threshold or (same_district and text_sim > 0.30):
            explanation_parts = []
            explanation_parts.append(f"Semantic similarity: {int(text_sim * 100)}%")
            if distance_km is not None:
                explanation_parts.append(f"Distance: {distance_km} km")
            elif same_district:
                explanation_parts.append(f"Both situated in {new_district} district")

            matches.append({
                "matched_challenge_id": cand_id,
                "matched_title": cand_title,
                "matched_district": cand_district,
                "similarity_score": composite_score,
                "distance_km": distance_km,
                "explanation": ". ".join(explanation_parts) + ". Flagged for official triage."
            })

    # Sort descending by similarity
    matches.sort(key=lambda x: x["similarity_score"], reverse=True)
    return matches
