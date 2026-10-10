from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.portal_models import (
    User, CitizenProfile, InstitutionalProfile, IndustryProfile, AuditLog
)
from app.schemas.schemas import UserCreate, UserLogin, UserOut, Token
from app.auth import hash_password, verify_password, create_access_token, get_current_user

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=Token)
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    # Check if email exists
    existing = db.query(User).filter(User.email == user_in.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    new_user = User(
        email=user_in.email,
        hashed_password=hash_password(user_in.password),
        full_name=user_in.full_name,
        phone=user_in.phone,
        role=user_in.role,
        organization_name=user_in.organization_name,
        district=user_in.district
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # Initialize role-specific profile
    if user_in.role == "citizen":
        prof = CitizenProfile(user_id=new_user.id)
        db.add(prof)
    elif user_in.role == "university":
        prof = InstitutionalProfile(
            user_id=new_user.id,
            institution_name=user_in.organization_name or user_in.full_name,
            domains_json='["Water Resources", "Agriculture", "Renewable Energy", "Urban Infrastructure"]'
        )
        db.add(prof)
    elif user_in.role == "industry":
        prof = IndustryProfile(
            user_id=new_user.id,
            company_name=user_in.organization_name or user_in.full_name
        )
        db.add(prof)

    audit = AuditLog(
        actor_id=new_user.id,
        actor_name=new_user.full_name,
        role=new_user.role,
        action="USER_REGISTRATION",
        entity_type="User",
        entity_id=new_user.id,
        new_state=f"Registered as {new_user.role}"
    )
    db.add(audit)
    db.commit()

    token = create_access_token({"sub": new_user.id, "role": new_user.role})
    return {"access_token": token, "token_type": "bearer", "user": new_user}

@router.post("/login", response_model=Token)
def login(login_in: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == login_in.email).first()
    if not user or not verify_password(login_in.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    token = create_access_token({"sub": user.id, "role": user.role})
    return {"access_token": token, "token_type": "bearer", "user": user}

@router.get("/me", response_model=UserOut)
def get_profile(current_user: User = Depends(get_current_user)):
    return current_user

@router.get("/roles")
def list_available_roles(db: Session = Depends(get_db)):
    """
    Returns full metadata for all 8 official Jharkhand Innovation Portal personas.
    """
    roles_meta = [
        {
            "role": "citizen",
            "name": "Soma Munda",
            "email": "citizen@jharkhand.gov.in",
            "title": "Community Organizer",
            "organization": "Gram Vikas Samiti, Torpa Block",
            "district": "Khunti",
            "avatar": "🧑‍🌾",
            "defaultRoute": "/citizen",
            "badgeColor": "emerald",
            "description": "Submit local problems, upload field evidence, track solutions, and submit citizen feedback."
        },
        {
            "role": "student",
            "name": "Amit Soren",
            "email": "student@jharkhand.ac.in",
            "title": "Project Lead (B.Tech IoT)",
            "organization": "BIT Mesra — Rural IoT Innovators Team",
            "district": "Ranchi",
            "avatar": "🎒",
            "defaultRoute": "/student",
            "badgeColor": "amber",
            "description": "Form multidisciplinary student teams, submit technical proposals, apply for grants, track milestones, and earn verifiable certificates."
        },
        {
            "role": "university",
            "name": "Dr. Ananya Roy",
            "email": "bit.mesra@jharkhand.ac.in",
            "title": "Dean of Research & Innovation",
            "organization": "Birla Institute of Technology (BIT) Mesra",
            "district": "Ranchi",
            "avatar": "🎓",
            "defaultRoute": "/university",
            "badgeColor": "blue",
            "description": "Publish research capabilities, list labs & equipment, mentor student teams, apply for research grants, and showcase outcomes."
        },
        {
            "role": "startup",
            "name": "Priya Tirkey",
            "email": "startup@jharinnovate.in",
            "title": "Founder & CEO",
            "organization": "JalDrishti CleanTech Innovations (DPIIT Reg.)",
            "district": "Ranchi",
            "avatar": "🚀",
            "defaultRoute": "/startup",
            "badgeColor": "purple",
            "description": "Submit commercial solutions, seek seed grants and VC funding, request industrial pilot opportunities, and commercialize patents."
        },
        {
            "role": "industry",
            "name": "Sanjay Singhal",
            "email": "csr@tatasteel.com",
            "title": "Head — CSR & Technological Innovations",
            "organization": "Tata Steel Foundation (TSF)",
            "district": "East Singhbhum",
            "avatar": "🏭",
            "defaultRoute": "/industry",
            "badgeColor": "indigo",
            "description": "Publish technical challenges, sponsor projects, provide advanced lab/testing access, offer internships, and mentor teams."
        },
        {
            "role": "csr",
            "name": "Sunita Murmu",
            "email": "csr.foundation@jharkhand.org",
            "title": "Director — Social Impact & Grants",
            "organization": "Jharkhand Tribal Empowerment & Rural CSR Trust",
            "district": "Dumka",
            "avatar": "💚",
            "defaultRoute": "/csr",
            "badgeColor": "teal",
            "description": "Discover eligible Section 135 CSR impact projects, review budgets, pledge/approve grants, and monitor verified grassroots outcomes."
        },
        {
            "role": "investor",
            "name": "Vikramaditya Singh",
            "email": "investor@jharkhandangels.in",
            "title": "Managing Partner",
            "organization": "Chotanagpur Venture Fund & Angel Network",
            "district": "Ranchi",
            "avatar": "💼",
            "defaultRoute": "/investor",
            "badgeColor": "cyan",
            "description": "Discover high-growth startups, review pitch decks & financials, request due diligence meetings, and express investment commitments."
        },
        {
            "role": "admin",
            "name": "Rajesh Kumar Verma, IAS",
            "email": "admin@jharkhand.gov.in",
            "title": "State Innovation Commissioner",
            "organization": "State Innovation Council & Dept of Higher Education",
            "district": "Ranchi",
            "avatar": "🏛️",
            "defaultRoute": "/admin",
            "badgeColor": "rose",
            "description": "Review & validate citizen submissions, approve university matching, allocate state grants, track statewide KPIs, and inspect audit trails."
        }
    ]
    return roles_meta

@router.post("/demo-switch/{role}", response_model=Token)
def switch_demo_role(role: str, db: Session = Depends(get_db)):
    """
    Convenience endpoint to switch between all 8 official portal roles instantly.
    """
    valid_roles = ["citizen", "student", "university", "startup", "industry", "csr", "investor", "admin"]
    if role not in valid_roles:
        raise HTTPException(status_code=400, detail=f"Invalid demo role: {role}")

    user = db.query(User).filter(User.role == role).first()
    if not user:
        raise HTTPException(status_code=404, detail=f"No seed user found for role {role}")

    token = create_access_token({"sub": user.id, "role": user.role})
    return {"access_token": token, "token_type": "bearer", "user": user}
