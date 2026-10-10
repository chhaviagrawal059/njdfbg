import json
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_
from app.database import get_db
from app.models.portal_models import (
    Challenge, ChallengeMedia, DuplicateMatch, AuditLog, User, Notification, InstitutionalProfile
)
from app.schemas.schemas import ChallengeCreate, ChallengeOut, ChallengeUpdateStatus
from app.auth import get_current_user, get_optional_user, require_role
from app.ai_services import (
    categorize_problem, detect_duplicates, calculate_priority_score
)

router = APIRouter(prefix="/challenges", tags=["Challenges"])

@router.post("/submit", response_model=ChallengeOut)
def submit_challenge(
    challenge_in: ChallengeCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # 1. AI Categorization
    cat_result = categorize_problem(f"{challenge_in.title} {challenge_in.description}")
    assigned_category = challenge_in.category or cat_result["suggested_category"]
    cat_confidence = cat_result["confidence_score"]

    # 2. AI Prioritization
    priority_res = calculate_priority_score(
        severity=challenge_in.severity or "Medium",
        urgency=challenge_in.urgency or "Medium",
        affected_population=challenge_in.affected_population,
        description=challenge_in.description,
        category=assigned_category,
        feasibility=challenge_in.feasibility or "Medium"
    )

    # 3. Create challenge record
    new_challenge = Challenge(
        title=challenge_in.title,
        description=challenge_in.description,
        category=assigned_category,
        district=challenge_in.district,
        village=challenge_in.village,
        block=challenge_in.block,
        latitude=challenge_in.latitude,
        longitude=challenge_in.longitude,
        affected_population=challenge_in.affected_population,
        urgency=challenge_in.urgency,
        status="Submitted",
        priority_score=priority_res["priority_score"],
        priority_tier=priority_res["priority_tier"],
        priority_breakdown_json=json.dumps(priority_res["breakdown"]),
        ai_suggested_category=cat_result["suggested_category"],
        ai_category_confidence=cat_confidence,
        is_safety_override=priority_res["is_safety_override"],
        override_reason=priority_res["override_reason"],
        submitted_by=current_user.id
    )
    db.add(new_challenge)
    db.commit()
    db.refresh(new_challenge)

    # 4. Save media if provided
    if challenge_in.media_urls:
        for url in challenge_in.media_urls:
            media = ChallengeMedia(
                challenge_id=new_challenge.id,
                media_type="image",
                file_name=url.split("/")[-1],
                file_url=url,
                description="Citizen uploaded evidence"
            )
            db.add(media)

    # 5. Run AI Duplicate Detection against existing challenges
    existing = db.query(Challenge).filter(Challenge.id != new_challenge.id).all()
    existing_dicts = [
        {
            "id": c.id,
            "title": c.title,
            "description": c.description,
            "district": c.district,
            "latitude": c.latitude,
            "longitude": c.longitude
        }
        for c in existing
    ]
    duplicate_candidates = detect_duplicates(
        new_title=new_challenge.title,
        new_description=new_challenge.description,
        new_district=new_challenge.district,
        new_lat=new_challenge.latitude,
        new_lon=new_challenge.longitude,
        existing_challenges=existing_dicts
    )

    for dup in duplicate_candidates:
        dup_match = DuplicateMatch(
            challenge_id=new_challenge.id,
            matched_challenge_id=dup["matched_challenge_id"],
            similarity_score=dup["similarity_score"],
            distance_km=dup["distance_km"],
            explanation=dup["explanation"],
            status="Pending Review"
        )
        db.add(dup_match)

    # 6. Audit Trail
    audit = AuditLog(
        actor_id=current_user.id,
        actor_name=current_user.full_name,
        role=current_user.role,
        action="CHALLENGE_SUBMITTED",
        entity_type="Challenge",
        entity_id=new_challenge.id,
        previous_state=None,
        new_state="Submitted",
        reason="Citizen reported community problem"
    )
    db.add(audit)

    # 7. Notification to Admins
    admins = db.query(User).filter(User.role == "admin").all()
    for admin in admins:
        notif = Notification(
            user_id=admin.id,
            title=f"New Problem Reported: {new_challenge.title[:40]}...",
            message=f"Citizen reported problem in {new_challenge.district}. Priority: {new_challenge.priority_tier}",
            link=f"/challenges/{new_challenge.id}"
        )
        db.add(notif)

    db.commit()
    db.refresh(new_challenge)
    return new_challenge

@router.get("/", response_model=List[ChallengeOut])
def list_challenges(
    category: Optional[str] = None,
    district: Optional[str] = None,
    status: Optional[str] = None,
    priority_tier: Optional[str] = None,
    search: Optional[str] = None,
    my_submissions: bool = False,
    current_user: Optional[User] = Depends(get_optional_user),
    db: Session = Depends(get_db)
):
    query = db.query(Challenge)

    if my_submissions and current_user:
        query = query.filter(Challenge.submitted_by == current_user.id)
    if category and category != "All":
        query = query.filter(Challenge.category == category)
    if district and district != "All":
        query = query.filter(Challenge.district == district)
    if status and status != "All":
        query = query.filter(Challenge.status == status)
    if priority_tier and priority_tier != "All":
        query = query.filter(Challenge.priority_tier.contains(priority_tier))
    if search:
        search_fmt = f"%{search}%"
        query = query.filter(
            or_(
                Challenge.title.ilike(search_fmt),
                Challenge.description.ilike(search_fmt),
                Challenge.district.ilike(search_fmt)
            )
        )

    return query.order_by(Challenge.created_at.desc()).all()

@router.get("/{challenge_id}")
def get_challenge_detail(challenge_id: int, db: Session = Depends(get_db)):
    ch = db.query(Challenge).filter(Challenge.id == challenge_id).first()
    if not ch:
        raise HTTPException(status_code=404, detail="Challenge not found")

    # Fetch associated data
    media = ch.media
    duplicates = [
        {
            "id": d.id,
            "matched_challenge_id": d.matched_challenge_id,
            "matched_title": d.matched_challenge.title if d.matched_challenge else "",
            "similarity_score": d.similarity_score,
            "distance_km": d.distance_km,
            "explanation": d.explanation,
            "status": d.status
        }
        for d in ch.duplicate_matches
    ]
    assignments = [
        {
            "id": a.id,
            "institution_id": a.institution_id,
            "institution_name": a.institution.institution_name if a.institution else "",
            "status": a.status,
            "match_score": a.match_score,
            "match_explanation": a.match_explanation,
            "assigned_at": a.assigned_at,
            "decline_reason": a.decline_reason
        }
        for a in ch.assignments
    ]
    proposals = [
        {
            "id": p.id,
            "institution_id": p.institution_id,
            "institution_name": p.institution.institution_name if p.institution else "",
            "title": p.title,
            "problem_summary": p.problem_summary,
            "technical_approach": p.technical_approach,
            "estimated_cost": p.estimated_cost,
            "proposed_duration_months": p.proposed_duration_months,
            "status": p.status,
            "milestones": [
                {
                    "id": m.id,
                    "milestone_number": m.milestone_number,
                    "title": m.title,
                    "description": m.description,
                    "target_date": m.target_date,
                    "status": m.status,
                    "evidence_url": m.evidence_url
                }
                for m in p.milestones
            ],
            "team": {
                "mentor_name": p.team.mentor_name,
                "mentor_email": p.team.mentor_email,
                "department": p.team.department,
                "students": json.loads(p.team.student_members_json) if p.team else []
            } if p.team else None
        }
        for p in ch.proposals
    ]
    feedback = [
        {
            "id": f.id,
            "rating": f.rating,
            "feedback_text": f.feedback_text,
            "solution_working": f.solution_working,
            "verification_status": f.verification_status,
            "created_at": f.created_at
        }
        for f in ch.feedback
    ]

    return {
        "challenge": ch,
        "media": media,
        "duplicate_matches": duplicates,
        "assignments": assignments,
        "proposals": proposals,
        "feedback": feedback
    }

@router.patch("/{challenge_id}/status")
def update_challenge_status(
    challenge_id: int,
    status_update: ChallengeUpdateStatus,
    current_user: User = Depends(require_role(["admin", "university"])),
    db: Session = Depends(get_db)
):
    ch = db.query(Challenge).filter(Challenge.id == challenge_id).first()
    if not ch:
        raise HTTPException(status_code=404, detail="Challenge not found")

    old_status = ch.status
    ch.status = status_update.status

    if status_update.category:
        ch.category = status_update.category
    if status_update.priority_score is not None:
        ch.priority_score = status_update.priority_score
    if status_update.override_reason:
        ch.override_reason = status_update.override_reason

    # Audit log
    audit = AuditLog(
        actor_id=current_user.id,
        actor_name=current_user.full_name,
        role=current_user.role,
        action="CHALLENGE_STATUS_UPDATE",
        entity_type="Challenge",
        entity_id=ch.id,
        previous_state=old_status,
        new_state=status_update.status,
        reason=status_update.reason or f"Status transitioned to {status_update.status}"
    )
    db.add(audit)

    # Notify Citizen Submitter
    notif = Notification(
        user_id=ch.submitted_by,
        title=f"Status Update on: {ch.title[:35]}...",
        message=f"Your submitted problem has transitioned from '{old_status}' to '{status_update.status}'.",
        link=f"/challenges/{ch.id}"
    )
    db.add(notif)

    db.commit()
    db.refresh(ch)
    return {"message": "Status updated successfully", "challenge": ch}
