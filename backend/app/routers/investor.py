import json
import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.portal_models import (
    StartupProfile, InvestorMeeting, User, ProjectProposal,
    Notification, AuditLog
)
from app.schemas.schemas import InvestorMeetingCreate
from app.auth import get_current_user

router = APIRouter(prefix="/investor", tags=["Angel & Startup Ecosystem"])

@router.get("/startups")
def list_innovative_startups(db: Session = Depends(get_db)):
    """
    Returns innovative startups in Jharkhand ready for angel/VC funding,
    pilot partnerships, and commercialization.
    """
    startups = db.query(StartupProfile).all()
    results = []
    for s in startups:
        user = s.user
        results.append({
            "id": s.id,
            "user_id": s.user_id,
            "startup_name": s.startup_name,
            "founder_name": user.full_name if user else "Founder",
            "email": user.email if user else "",
            "district": user.district if user else "Ranchi",
            "sector": s.sector,
            "stage": s.stage,
            "funding_ask": s.funding_ask,
            "incorporation_year": s.incorporation_year,
            "dpiit_recognition": s.dpiit_recognition_number,
            "patent_status": s.patent_status,
            "pitch_deck_url": s.pitch_deck_url,
            "traction_metrics": json.loads(s.traction_metrics_json or "{}")
        })
    return results

@router.get("/meetings")
def list_investor_meetings(
    user_id: int = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Returns investor pitch & due diligence meetings.
    """
    query = db.query(InvestorMeeting)
    if current_user.role == "investor":
        query = query.filter(InvestorMeeting.investor_id == current_user.id)
    elif current_user.role == "startup":
        query = query.filter(InvestorMeeting.startup_user_id == current_user.id)

    meetings = query.order_by(InvestorMeeting.created_at.desc()).all()
    return [
        {
            "id": m.id,
            "investor_name": m.investor_name,
            "startup_user_id": m.startup_user_id,
            "project_title": m.project_title,
            "stage": m.stage,
            "ticket_size_range": m.ticket_size_range,
            "pitch_deck_url": m.pitch_deck_url,
            "status": m.status,
            "notes": m.notes,
            "meeting_date": m.meeting_date.strftime("%Y-%m-%d %H:%M") if m.meeting_date else "Pending Scheduling",
            "created_at": m.created_at.strftime("%Y-%m-%d")
        }
        for m in meetings
    ]

@router.post("/meetings")
def request_meeting(
    req: InvestorMeetingCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Investor expresses interest and requests a pitch / due diligence meeting.
    """
    meeting = InvestorMeeting(
        investor_id=current_user.id,
        investor_name=current_user.organization_name or current_user.full_name,
        startup_user_id=req.startup_user_id,
        proposal_id=req.proposal_id,
        project_title=req.project_title,
        stage=req.stage,
        ticket_size_range=req.ticket_size_range,
        pitch_deck_url=req.pitch_deck_url,
        status="Meeting Requested",
        notes=req.notes
    )
    db.add(meeting)

    # Notify startup
    notif = Notification(
        user_id=req.startup_user_id,
        title=f"Investor Interest: {current_user.organization_name or current_user.full_name}",
        message=f"{current_user.full_name} has requested a pitch meeting and expressed interest in {req.project_title}.",
        link="/startup"
    )
    db.add(notif)

    # Audit log
    audit = AuditLog(
        actor_id=current_user.id,
        actor_name=current_user.full_name,
        role=current_user.role,
        action="INVESTOR_MEETING_REQUESTED",
        entity_type="InvestorMeeting",
        entity_id=req.startup_user_id,
        new_state="Meeting Requested",
        reason=f"Interest expressed with ticket range {req.ticket_size_range}"
    )
    db.add(audit)
    db.commit()

    return {"message": "Meeting request sent to startup team successfully", "meeting_id": meeting.id}

@router.patch("/meetings/{meeting_id}/status")
def update_meeting_status(
    meeting_id: int,
    status: str,
    notes: str = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    meeting = db.query(InvestorMeeting).filter(InvestorMeeting.id == meeting_id).first()
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")

    meeting.status = status
    if notes:
        meeting.notes = notes
    db.commit()
    return {"message": f"Meeting status updated to {status}"}
