import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.portal_models import (
    OpportunityListing, OpportunityApplication, AuditLog, Notification, User
)
from app.schemas.schemas import OpportunityCreate, OpportunityApplicationCreate
from app.auth import get_current_user, require_role

router = APIRouter(prefix="/marketplace", tags=["Innovation Opportunity Marketplace"])

@router.get("/opportunities")
def list_opportunities(
    opp_type: Optional[str] = None,
    provider_type: Optional[str] = None,
    is_demo: Optional[bool] = None,
    db: Session = Depends(get_db)
):
    query = db.query(OpportunityListing)

    if opp_type and opp_type != "All":
        query = query.filter(OpportunityListing.opportunity_type == opp_type)
    if provider_type and provider_type != "All":
        query = query.filter(OpportunityListing.provider_type == provider_type)
    if is_demo is not None:
        query = query.filter(OpportunityListing.is_demo == is_demo)

    opps = query.order_by(OpportunityListing.created_at.desc()).all()
    return [
        {
            "id": o.id,
            "provider_name": o.provider_name,
            "provider_type": o.provider_type,
            "title": o.title,
            "opportunity_type": o.opportunity_type,
            "description": o.description,
            "eligibility": o.eligibility,
            "commitments": o.commitments,
            "funding_amount": o.funding_amount,
            "deadline": o.deadline,
            "is_demo": o.is_demo,
            "status": o.status,
            "applications_count": len(o.applications)
        }
        for o in opps
    ]

@router.post("/opportunities")
def create_opportunity(
    req: OpportunityCreate,
    current_user: User = Depends(require_role(["industry", "admin"])),
    db: Session = Depends(get_db)
):
    deadline = datetime.datetime.utcnow() + datetime.timedelta(days=req.deadline_days)
    new_opp = OpportunityListing(
        provider_id=current_user.id,
        provider_name=current_user.organization_name or current_user.full_name,
        provider_type="Industry Partner" if current_user.role == "industry" else "Government Agency",
        title=req.title,
        opportunity_type=req.opportunity_type,
        description=req.description,
        eligibility=req.eligibility,
        commitments=req.commitments,
        funding_amount=req.funding_amount,
        deadline=deadline,
        is_demo=req.is_demo,
        status="Open"
    )
    db.add(new_opp)
    db.commit()
    db.refresh(new_opp)

    audit = AuditLog(
        actor_id=current_user.id,
        actor_name=current_user.full_name,
        role=current_user.role,
        action="OPPORTUNITY_CREATED",
        entity_type="OpportunityListing",
        entity_id=new_opp.id,
        new_state="Open",
        reason=f"Provider published opportunity: {new_opp.title}"
    )
    db.add(audit)
    db.commit()

    return {"message": "Opportunity listed successfully", "opportunity_id": new_opp.id}

@router.post("/apply")
def apply_opportunity(
    req: OpportunityApplicationCreate,
    current_user: User = Depends(require_role(["university", "citizen"])),
    db: Session = Depends(get_db)
):
    opp = db.query(OpportunityListing).filter(OpportunityListing.id == req.opportunity_id).first()
    if not opp:
        raise HTTPException(status_code=404, detail="Opportunity not found")

    app = OpportunityApplication(
        opportunity_id=opp.id,
        applicant_id=current_user.id,
        proposal_id=req.proposal_id,
        note=req.note,
        status="Submitted"
    )
    db.add(app)

    # Notify provider
    notif = Notification(
        user_id=opp.provider_id,
        title=f"New Application for: {opp.title[:35]}...",
        message=f"{current_user.full_name} ({current_user.organization_name or 'Applicant'}) applied.",
        link="/marketplace"
    )
    db.add(notif)

    db.commit()
    return {"message": "Application submitted successfully"}

@router.get("/my-applications")
def get_my_applications(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    apps = db.query(OpportunityApplication).filter(OpportunityApplication.applicant_id == current_user.id).all()
    return [
        {
            "id": a.id,
            "opportunity_title": a.opportunity.title,
            "provider_name": a.opportunity.provider_name,
            "opportunity_type": a.opportunity.opportunity_type,
            "status": a.status,
            "submitted_at": a.submitted_at
        }
        for a in apps
    ]
