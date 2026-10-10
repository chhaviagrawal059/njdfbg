import json
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.portal_models import (
    Challenge, CommunityFeedback, AuditLog, User
)
from app.schemas.schemas import FeedbackCreate
from app.auth import get_current_user

router = APIRouter(prefix="/feedback", tags=["Community Feedback & Outcome Verification"])

@router.post("/submit")
def submit_feedback(
    req: FeedbackCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    ch = db.query(Challenge).filter(Challenge.id == req.challenge_id).first()
    if not ch:
        raise HTTPException(status_code=404, detail="Challenge not found")

    fb = CommunityFeedback(
        challenge_id=ch.id,
        citizen_id=current_user.id,
        rating=req.rating,
        feedback_text=req.feedback_text,
        solution_working=req.solution_working,
        outcome_metrics_json=json.dumps(req.outcome_metrics or {}),
        verification_status="Verified"
    )
    db.add(fb)

    # If feedback confirms working solution, mark challenge as Completed
    if req.solution_working and ch.status in ["Outcome Verification", "Pilot/Implementation"]:
        old_status = ch.status
        ch.status = "Completed"
        audit = AuditLog(
            actor_id=current_user.id,
            actor_name=current_user.full_name,
            role=current_user.role,
            action="COMMUNITY_OUTCOME_VERIFIED",
            entity_type="Challenge",
            entity_id=ch.id,
            previous_state=old_status,
            new_state="Completed",
            reason=f"Citizen verified working outcome with {req.rating}-star rating"
        )
        db.add(audit)

    db.commit()
    return {"message": "Feedback submitted and recorded successfully", "feedback_id": fb.id}

@router.get("/{challenge_id}")
def get_challenge_feedback(challenge_id: int, db: Session = Depends(get_db)):
    feedbacks = db.query(CommunityFeedback).filter(CommunityFeedback.challenge_id == challenge_id).all()
    return [
        {
            "id": f.id,
            "citizen_name": f.citizen.full_name if f.citizen else "Local Citizen",
            "rating": f.rating,
            "feedback_text": f.feedback_text,
            "solution_working": f.solution_working,
            "created_at": f.created_at
        }
        for f in feedbacks
    ]
