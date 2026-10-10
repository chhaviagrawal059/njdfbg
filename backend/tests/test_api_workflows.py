import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_api_root():
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert "Jharkhand" in data["portal"]
    assert data["api_status"] == "Online"

def test_demo_login_admin():
    response = client.post("/api/auth/demo-switch/admin")
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["user"]["role"] == "admin"

def test_demo_login_university():
    response = client.post("/api/auth/demo-switch/university")
    assert response.status_code == 200
    data = response.json()
    assert data["user"]["role"] == "university"

def test_get_challenges_list():
    response = client.get("/api/challenges/")
    assert response.status_code == 200
    challenges = response.json()
    assert len(challenges) >= 6

def test_get_analytics_overview():
    response = client.get("/api/analytics/overview")
    assert response.status_code == 200
    data = response.json()
    assert data["total_challenges"] >= 6
    assert "awaiting_validation" in data
    assert "avg_community_rating" in data

def test_get_marketplace_opportunities():
    response = client.get("/api/marketplace/opportunities")
    assert response.status_code == 200
    opps = response.json()
    assert len(opps) >= 3

def test_ai_categorize_endpoint():
    payload = {"text": "drinking water in village well is yellow with high fluoride and chemical odor"}
    response = client.post("/api/ai/categorize", json=payload)
    assert response.status_code == 200
    res = response.json()
    assert res["suggested_category"] == "Water Resources"

def test_ai_prioritize_endpoint():
    payload = {
        "severity": "Critical",
        "urgency": "Immediate",
        "affected_population": 4000,
        "description": "toxic arsenic chemical poisoning in drinking water",
        "category": "Water Resources",
        "feasibility": "Medium"
    }
    response = client.post("/api/ai/prioritize", json=payload)
    assert response.status_code == 200
    res = response.json()
    assert res["is_safety_override"] is True
