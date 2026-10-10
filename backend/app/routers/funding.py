import json
import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.portal_models import (
    ProjectProposal, ProjectFunding, FundingContribution,
    User, AuditLog, OpportunityListing, Notification
)
from app.schemas.schemas import FundingContributionCreate, FundingRequestCreate
from app.auth import get_current_user

router = APIRouter(prefix="/funding", tags=["Funding Marketplace"])

@router.get("")
def list_project_fundings(
    status: str = "All",
    district: str = "All",
    category: str = "All",
    db: Session = Depends(get_db)
):
    """
    Returns all project funding packages with separate columns for
    Total Budget, Requested Funding, Pledged, Approved, and Disbursed amounts.
    """
    query = db.query(ProjectFunding).join(ProjectProposal)

    fundings = query.all()
    results = []
    for f in fundings:
        prop = f.proposal
        chal = prop.challenge if prop else None

        # Filter check
        if district != "All" and chal and chal.district != district:
            continue
        if category != "All" and chal and chal.category != category:
            continue
        if status != "All" and f.funding_status != status:
            continue

        team_info = None
        if prop and prop.team:
            team_info = {
                "mentor_name": prop.team.mentor_name,
                "department": prop.team.department,
                "student_members": json.loads(prop.team.student_members_json or "[]")
            }

        # Contributions list
        contribs = [
            {
                "id": c.id,
                "funder_name": c.funder_name,
                "funder_type": c.funder_type,
                "pledged_amount": c.pledged_amount,
                "approved_amount": c.approved_amount,
                "disbursed_amount": c.disbursed_amount,
                "status": c.status,
                "notes": c.notes,
                "created_at": c.created_at.strftime("%Y-%m-%d")
            }
            for c in f.contributions
        ]

        results.append({
            "id": f.id,
            "proposal_id": f.proposal_id,
            "title": prop.title if prop else "Project",
            "problem_statement": chal.description if chal else prop.problem_summary,
            "proposed_solution": prop.technical_approach if prop else "",
            "category": chal.category if chal else "Innovation",
            "district": chal.district if chal else "Jharkhand",
            "institution_name": prop.institution.institution_name if prop and prop.institution else "Technical University",
            "team": team_info,
            "total_budget": f.total_budget,
            "requested_funding": f.requested_funding,
            "amount_pledged": f.amount_pledged,
            "amount_approved": f.amount_approved,
            "amount_disbursed": f.amount_disbursed,
            "funding_status": f.funding_status,
            "funding_milestones": json.loads(f.funding_milestones_json or "[]"),
            "expected_impact": json.loads(f.expected_impact_json or "{}"),
            "documents": json.loads(f.documents_json or "[]"),
            "contributions": contribs,
            "created_at": f.created_at.strftime("%Y-%m-%d")
        })

    return results

@router.get("/{proposal_id}")
def get_project_funding_detail(proposal_id: int, db: Session = Depends(get_db)):
    funding = db.query(ProjectFunding).filter(ProjectFunding.proposal_id == proposal_id).first()
    if not funding:
        raise HTTPException(status_code=404, detail="Funding package not found for this proposal")

    prop = funding.proposal
    chal = prop.challenge if prop else None

    team_info = None
    if prop and prop.team:
        team_info = {
            "mentor_name": prop.team.mentor_name,
            "department": prop.team.department,
            "student_members": json.loads(prop.team.student_members_json or "[]")
        }

    return {
        "id": funding.id,
        "proposal_id": funding.proposal_id,
        "title": prop.title if prop else "Project",
        "problem_statement": chal.description if chal else prop.problem_summary,
        "proposed_solution": prop.technical_approach if prop else "",
        "category": chal.category if chal else "Innovation",
        "district": chal.district if chal else "Jharkhand",
        "institution_name": prop.institution.institution_name if prop and prop.institution else "Technical University",
        "team": team_info,
        "total_budget": funding.total_budget,
        "requested_funding": funding.requested_funding,
        "amount_pledged": funding.amount_pledged,
        "amount_approved": funding.amount_approved,
        "amount_disbursed": funding.amount_disbursed,
        "funding_status": funding.funding_status,
        "funding_milestones": json.loads(funding.funding_milestones_json or "[]"),
        "expected_impact": json.loads(funding.expected_impact_json or "{}"),
        "documents": json.loads(funding.documents_json or "[]"),
        "contributions": [
            {
                "id": c.id,
                "funder_name": c.funder_name,
                "funder_type": c.funder_type,
                "pledged_amount": c.pledged_amount,
                "approved_amount": c.approved_amount,
                "disbursed_amount": c.disbursed_amount,
                "status": c.status,
                "notes": c.notes,
                "created_at": c.created_at.strftime("%Y-%m-%d")
            }
            for c in funding.contributions
        ]
    }

@router.post("/contribute")
def record_funder_contribution(
    req: FundingContributionCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Funder (Govt / CSR / Industry / Investor) records an explicit funding decision:
    pledge, approve, or disburse funds.
    """
    funding = db.query(ProjectFunding).filter(ProjectFunding.proposal_id == req.proposal_id).first()
    if not funding:
        raise HTTPException(status_code=404, detail="Project funding not found")

    action = req.action_type.lower()
    amount = float(req.amount)

    pledged = 0.0
    approved = 0.0
    disbursed = 0.0
    status_str = "Pledged"

    if action == "pledge":
        funding.amount_pledged += amount
        pledged = amount
        status_str = "Pledged"
        if funding.funding_status == "Open for Funding":
            funding.funding_status = "Partially Pledged"
    elif action == "approve":
        funding.amount_approved += amount
        # Ensure pledged is at least approved
        if funding.amount_pledged < funding.amount_approved:
            funding.amount_pledged = funding.amount_approved
        approved = amount
        pledged = amount
        status_str = "Approved"
        funding.funding_status = "Approved"
    elif action == "disburse":
        funding.amount_disbursed += amount
        # Ensure approved is at least disbursed
        if funding.amount_approved < funding.amount_disbursed:
            funding.amount_approved = funding.amount_disbursed
        if funding.amount_pledged < funding.amount_approved:
            funding.amount_pledged = funding.amount_approved
        disbursed = amount
        approved = amount
        pledged = amount
        status_str = "Disbursed"
        if funding.amount_disbursed >= funding.requested_funding:
            funding.funding_status = "Fully Funded"
        else:
            funding.funding_status = "Disbursing"
    elif action == "revision":
        status_str = "Revision Requested"
        funding.funding_status = "Revision Requested"
    elif action == "reject":
        status_str = "Rejected"
    else:
        raise HTTPException(status_code=400, detail="Invalid action_type")

    # Record contribution row
    contrib = FundingContribution(
        funding_id=funding.id,
        funder_id=current_user.id,
        funder_name=current_user.organization_name or current_user.full_name,
        funder_type=req.funder_type,
        pledged_amount=pledged,
        approved_amount=approved,
        disbursed_amount=disbursed,
        status=status_str,
        notes=req.notes
    )
    db.add(contrib)

    # Audit Log
    audit = AuditLog(
        actor_id=current_user.id,
        actor_name=current_user.full_name,
        role=current_user.role,
        action=f"FUNDING_{action.upper()}",
        entity_type="ProjectFunding",
        entity_id=funding.id,
        new_state=f"{status_str}: ₹{amount:,.2f}",
        reason=req.notes
    )
    db.add(audit)

    # Notify team
    prop = funding.proposal
    if prop and prop.institution and prop.institution.user_id:
        notif = Notification(
            user_id=prop.institution.user_id,
            title=f"Funding Update: {status_str} for {prop.title[:40]}...",
            message=f"{current_user.full_name} ({req.funder_type}) recorded a {action} of ₹{amount:,.2f}.",
            link=f"/funding"
        )
        db.add(notif)

    db.commit()

    return {
        "message": f"Funding {action} recorded successfully",
        "funding_id": funding.id,
        "amount_pledged": funding.amount_pledged,
        "amount_approved": funding.amount_approved,
        "amount_disbursed": funding.amount_disbursed,
        "funding_status": funding.funding_status
    }

@router.post("/request")
def create_funding_request(
    req: FundingRequestCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Project team creates or updates a funding package for their proposal.
    """
    prop = db.query(ProjectProposal).filter(ProjectProposal.id == req.proposal_id).first()
    if not prop:
        raise HTTPException(status_code=404, detail="Proposal not found")

    existing = db.query(ProjectFunding).filter(ProjectFunding.proposal_id == req.proposal_id).first()
    if existing:
        existing.total_budget = req.total_budget
        existing.requested_funding = req.requested_funding
        if req.funding_milestones:
            existing.funding_milestones_json = json.dumps(req.funding_milestones)
        if req.expected_impact:
            existing.expected_impact_json = json.dumps(req.expected_impact)
        if req.documents:
            existing.documents_json = json.dumps(req.documents)
        db.commit()
        return {"message": "Funding request updated successfully", "funding_id": existing.id}

    funding = ProjectFunding(
        proposal_id=req.proposal_id,
        total_budget=req.total_budget,
        requested_funding=req.requested_funding,
        amount_pledged=0.0,
        amount_approved=0.0,
        amount_disbursed=0.0,
        funding_status="Open for Funding",
        funding_milestones_json=json.dumps(req.funding_milestones or []),
        expected_impact_json=json.dumps(req.expected_impact or {}),
        documents_json=json.dumps(req.documents or [])
    )
    db.add(funding)
    db.commit()
    return {"message": "Funding request published to marketplace", "funding_id": funding.id}
