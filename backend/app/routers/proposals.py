import json
import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.portal_models import (
    Challenge, InstitutionalProfile, ProjectProposal, ProjectTeam,
    Milestone, AuditLog, Notification, User
)
from app.schemas.schemas import ProposalCreate, MilestoneUpdateStatus
from app.auth import get_current_user, require_role

router = APIRouter(prefix="/proposals", tags=["Proposals & Milestones"])

@router.post("/submit")
def submit_proposal(
    req: ProposalCreate,
    current_user: User = Depends(require_role(["university"])),
    db: Session = Depends(get_db)
):
    ch = db.query(Challenge).filter(Challenge.id == req.challenge_id).first()
    if not ch:
        raise HTTPException(status_code=404, detail="Challenge not found")

    inst = db.query(InstitutionalProfile).filter(InstitutionalProfile.user_id == current_user.id).first()
    if not inst:
        raise HTTPException(status_code=400, detail="University profile not found")

    # Create proposal
    proposal = ProjectProposal(
        challenge_id=ch.id,
        institution_id=inst.id,
        title=req.title,
        problem_summary=req.problem_summary,
        technical_approach=req.technical_approach,
        required_expertise_json=json.dumps(req.required_expertise),
        estimated_cost=req.estimated_cost,
        proposed_duration_months=req.proposed_duration_months,
        risks_json=json.dumps(req.risks),
        evaluation_metrics_json=json.dumps(req.evaluation_metrics),
        status="Submitted",
        submitted_at=datetime.datetime.utcnow()
    )
    db.add(proposal)
    db.commit()
    db.refresh(proposal)

    # Create project team
    team = ProjectTeam(
        proposal_id=proposal.id,
        mentor_name=req.mentor_name,
        mentor_email=req.mentor_email,
        department=req.department,
        student_members_json=json.dumps(req.student_members)
    )
    db.add(team)

    # Create milestones
    now = datetime.datetime.utcnow()
    for m in req.milestones:
        target_days = m.get("target_days", 30)
        target_date = now + datetime.timedelta(days=target_days)
        mile = Milestone(
            proposal_id=proposal.id,
            milestone_number=m.get("milestone_number", 1),
            title=m.get("title", "Project Milestone"),
            description=m.get("description", ""),
            target_date=target_date,
            status="Pending",
            deliverables_json=json.dumps(m.get("deliverables", []))
        )
        db.add(mile)

    # Update challenge status
    ch.status = "Proposal Submitted"

    # Audit log
    audit = AuditLog(
        actor_id=current_user.id,
        actor_name=current_user.full_name,
        role=current_user.role,
        action="PROPOSAL_SUBMITTED",
        entity_type="ProjectProposal",
        entity_id=proposal.id,
        previous_state="Assigned to University",
        new_state="Proposal Submitted",
        reason=f"University team submitted technical proposal: {proposal.title}"
    )
    db.add(audit)

    # Notify admins
    admins = db.query(User).filter(User.role == "admin").all()
    for admin in admins:
        notif = Notification(
            user_id=admin.id,
            title=f"New Proposal: {proposal.title[:35]}...",
            message=f"{inst.institution_name} submitted proposal for challenge #{ch.id}",
            link=f"/challenges/{ch.id}"
        )
        db.add(notif)

    db.commit()
    return {"message": "Proposal submitted successfully", "proposal_id": proposal.id}

@router.post("/{proposal_id}/approve")
def approve_proposal(
    proposal_id: int,
    current_user: User = Depends(require_role(["admin"])),
    db: Session = Depends(get_db)
):
    prop = db.query(ProjectProposal).filter(ProjectProposal.id == proposal_id).first()
    if not prop:
        raise HTTPException(status_code=404, detail="Proposal not found")

    prop.status = "Approved"
    prop.approved_at = datetime.datetime.utcnow()

    ch = prop.challenge
    ch.status = "In Progress"

    # Set first milestone in progress
    first_milestone = db.query(Milestone).filter(
        Milestone.proposal_id == prop.id,
        Milestone.milestone_number == 1
    ).first()
    if first_milestone:
        first_milestone.status = "In Progress"

    audit = AuditLog(
        actor_id=current_user.id,
        actor_name=current_user.full_name,
        role=current_user.role,
        action="PROPOSAL_APPROVED",
        entity_type="ProjectProposal",
        entity_id=prop.id,
        previous_state="Proposal Submitted",
        new_state="Approved / In Progress",
        reason="Government administration approved technical proposal"
    )
    db.add(audit)

    # Notify university
    notif = Notification(
        user_id=prop.institution.user_id,
        title=f"Proposal Approved: {prop.title[:35]}",
        message="Your proposal has been approved! The project is now In Progress.",
        link=f"/challenges/{ch.id}"
    )
    db.add(notif)

    db.commit()
    return {"message": "Proposal approved, project is now In Progress"}

@router.post("/milestone/status")
def update_milestone_status(
    req: MilestoneUpdateStatus,
    current_user: User = Depends(require_role(["university", "admin"])),
    db: Session = Depends(get_db)
):
    milestone = db.query(Milestone).filter(Milestone.id == req.milestone_id).first()
    if not milestone:
        raise HTTPException(status_code=404, detail="Milestone not found")

    old_status = milestone.status
    milestone.status = req.status
    if req.evidence_url:
        milestone.evidence_url = req.evidence_url
    if req.deliverables:
        milestone.deliverables_json = json.dumps(req.deliverables)

    if req.status in ["Completed", "Verified"]:
        milestone.completion_date = datetime.datetime.utcnow()

    # Automatic stage progression based on milestone number
    ch = milestone.proposal.challenge
    if milestone.milestone_number == 2 and req.status == "Completed":
        ch.status = "Prototype Testing"
    elif milestone.milestone_number == 3 and req.status == "Completed":
        ch.status = "Pilot/Implementation"
    elif milestone.milestone_number == 4 and req.status == "Completed":
        ch.status = "Outcome Verification"
    elif milestone.milestone_number == 4 and req.status == "Verified":
        ch.status = "Completed"

    audit = AuditLog(
        actor_id=current_user.id,
        actor_name=current_user.full_name,
        role=current_user.role,
        action="MILESTONE_UPDATED",
        entity_type="Milestone",
        entity_id=milestone.id,
        previous_state=old_status,
        new_state=req.status,
        reason=f"Milestone #{milestone.milestone_number} ({milestone.title}) updated to {req.status}"
    )
    db.add(audit)
    db.commit()

    return {"message": "Milestone status updated", "new_status": req.status, "challenge_status": ch.status}
