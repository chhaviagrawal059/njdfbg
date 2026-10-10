import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.portal_models import (
    Challenge, InstitutionalProfile, InstitutionAssignment, AuditLog, Notification, User
)
from app.schemas.schemas import AssignInstitutionRequest, AssignmentResponseRequest
from app.auth import get_current_user, require_role

router = APIRouter(prefix="/assignments", tags=["Assignments"])

@router.post("/assign")
def assign_institution(
    req: AssignInstitutionRequest,
    current_user: User = Depends(require_role(["admin"])),
    db: Session = Depends(get_db)
):
    ch = db.query(Challenge).filter(Challenge.id == req.challenge_id).first()
    if not ch:
        raise HTTPException(status_code=404, detail="Challenge not found")

    inst = db.query(InstitutionalProfile).filter(InstitutionalProfile.id == req.institution_id).first()
    if not inst:
        raise HTTPException(status_code=404, detail="Institution not found")

    # Update challenge
    old_status = ch.status
    ch.status = "Assigned to University"
    ch.assigned_institution_id = inst.id

    assignment = InstitutionAssignment(
        challenge_id=ch.id,
        institution_id=inst.id,
        status="Assigned",
        match_score=req.match_score or 0.0,
        match_explanation=req.match_explanation,
        assigned_by=current_user.id
    )
    db.add(assignment)

    inst.current_active_load += 1

    # Audit log
    audit = AuditLog(
        actor_id=current_user.id,
        actor_name=current_user.full_name,
        role=current_user.role,
        action="INSTITUTION_ASSIGNED",
        entity_type="Challenge",
        entity_id=ch.id,
        previous_state=old_status,
        new_state="Assigned to University",
        reason=f"Administrator formally assigned challenge to {inst.institution_name}"
    )
    db.add(audit)

    # Notify University user
    notif = Notification(
        user_id=inst.user_id,
        title=f"New Societal Challenge Assigned: {ch.title[:35]}...",
        message=f"Government administration has assigned problem '{ch.title}' in {ch.district} to your institution.",
        link=f"/challenges/{ch.id}"
    )
    db.add(notif)

    db.commit()
    return {"message": "Institution assigned successfully", "assignment_id": assignment.id}

@router.post("/respond")
def respond_assignment(
    req: AssignmentResponseRequest,
    current_user: User = Depends(require_role(["university"])),
    db: Session = Depends(get_db)
):
    assignment = db.query(InstitutionAssignment).filter(InstitutionAssignment.id == req.assignment_id).first()
    if not assignment:
        raise HTTPException(status_code=404, detail="Assignment not found")

    ch = assignment.challenge
    inst = assignment.institution

    assignment.status = req.status
    assignment.responded_at = datetime.datetime.utcnow()

    if req.status == "Declined":
        assignment.decline_reason = req.decline_reason
        ch.status = "Declined (Pending Reassignment)"
        inst.current_active_load = max(0, inst.current_active_load - 1)
        action_name = "ASSIGNMENT_DECLINED"
    else:
        ch.status = "Assigned to University"
        action_name = "ASSIGNMENT_ACCEPTED"

    audit = AuditLog(
        actor_id=current_user.id,
        actor_name=current_user.full_name,
        role=current_user.role,
        action=action_name,
        entity_type="Challenge",
        entity_id=ch.id,
        previous_state="Assigned to University",
        new_state=ch.status,
        reason=req.decline_reason if req.status == "Declined" else "University accepted societal innovation task"
    )
    db.add(audit)
    db.commit()

    return {"message": f"Assignment {req.status}", "status": req.status}

@router.get("/my-assignments")
def get_my_assignments(
    current_user: User = Depends(require_role(["university"])),
    db: Session = Depends(get_db)
):
    inst = db.query(InstitutionalProfile).filter(InstitutionalProfile.user_id == current_user.id).first()
    if not inst:
        return []

    assignments = db.query(InstitutionAssignment).filter(InstitutionAssignment.institution_id == inst.id).all()
    return [
        {
            "assignment_id": a.id,
            "status": a.status,
            "match_score": a.match_score,
            "match_explanation": a.match_explanation,
            "assigned_at": a.assigned_at,
            "challenge": a.challenge
        }
        for a in assignments
    ]
