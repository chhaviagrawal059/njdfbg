import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_roles_endpoint():
    res = client.get("/api/auth/roles")
    assert res.status_code == 200
    roles = res.json()
    assert len(roles) == 8
    role_names = [r["role"] for r in roles]
    assert "student" in role_names
    assert "startup" in role_names
    assert "csr" in role_names
    assert "investor" in role_names
    assert "citizen" in role_names
    assert "university" in role_names
    assert "industry" in role_names
    assert "admin" in role_names

def test_demo_switch_student_and_startup():
    res_student = client.post("/api/auth/demo-switch/student")
    assert res_student.status_code == 200
    assert res_student.json()["user"]["role"] == "student"

    res_startup = client.post("/api/auth/demo-switch/startup")
    assert res_startup.status_code == 200
    assert res_startup.json()["user"]["role"] == "startup"

    res_csr = client.post("/api/auth/demo-switch/csr")
    assert res_csr.status_code == 200
    assert res_csr.json()["user"]["role"] == "csr"

    res_inv = client.post("/api/auth/demo-switch/investor")
    assert res_inv.status_code == 200
    assert res_inv.json()["user"]["role"] == "investor"

def test_funding_marketplace_endpoint():
    res = client.get("/api/funding")
    assert res.status_code == 200
    data = res.json()
    assert len(data) >= 1
    sample = data[0]
    assert "total_budget" in sample
    assert "requested_funding" in sample
    assert "amount_pledged" in sample
    assert "amount_approved" in sample
    assert "amount_disbursed" in sample
    assert "funding_milestones" in sample
    assert "expected_impact" in sample

def test_certificates_and_verification():
    res = client.get("/api/rewards/certificates")
    assert res.status_code == 200
    certs = res.json()
    assert len(certs) >= 1

    cert_id = certs[0]["certificate_id"]
    verify_res = client.get(f"/api/rewards/certificates/verify/{cert_id}")
    assert verify_res.status_code == 200
    verify_data = verify_res.json()
    assert verify_data["valid"] is True
    assert verify_data["certificate_id"] == cert_id

def test_investor_startups_and_meetings():
    res = client.get("/api/investor/startups")
    assert res.status_code == 200
    startups = res.json()
    assert len(startups) >= 1
    assert "startup_name" in startups[0]
    assert "funding_ask" in startups[0]

def test_village_achievements_showcase():
    res = client.get("/api/rewards/achievements")
    assert res.status_code == 200
    achievements = res.json()
    assert len(achievements) >= 3
    
    # Verify rich structure of village problem -> solution -> metrics -> rewards
    sample = achievements[0]
    assert "problem_statement" in sample
    assert "crisis" in sample["problem_statement"]
    assert "village" in sample
    assert "engineering_solution" in sample
    assert "team_name" in sample["engineering_solution"]
    assert "impact_metrics" in sample
    assert "before" in sample["impact_metrics"]
    assert "after" in sample["impact_metrics"]
    assert "rewards_and_goodies" in sample
    assert sample["rewards_and_goodies"]["points_earned"] > 0
    assert "corporate_goodie" in sample["rewards_and_goodies"]

def test_impact_points_and_goodies_store():
    # 1. Fetch points for student Amit Soren (id 8)
    res_pts = client.get("/api/rewards/points/8")
    assert res_pts.status_code == 200
    pts_data = res_pts.json()
    assert pts_data["points_earned"] >= 2000
    assert pts_data["points_balance"] >= 0
    assert len(pts_data["recent_activity"]) >= 1

    # 2. Fetch goodies catalog
    res_goodies = client.get("/api/rewards/goodies")
    assert res_goodies.status_code == 200
    goodies = res_goodies.json()
    assert len(goodies) >= 7
    goodie_sample = goodies[0]
    assert "points_cost" in goodie_sample
    assert "sponsor" in goodie_sample

    # 3. Redeem goodie
    redeem_payload = {
        "user_id": 8,
        "goodie_id": goodies[0]["id"],
        "shipping_address": "BIT Mesra Hostels, Ranchi, Jharkhand - 835215"
    }
    res_redeem = client.post("/api/rewards/goodies/redeem", json=redeem_payload)
    assert res_redeem.status_code == 200
    redeem_data = res_redeem.json()
    assert redeem_data["success"] is True
    assert "JH-GOODIE-" in redeem_data["voucher_code"]
    assert redeem_data["remaining_points"] < pts_data["points_balance"]

