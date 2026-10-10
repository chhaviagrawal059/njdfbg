import datetime
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field
# --- User & Auth Schemas ---
class UserBase(BaseModel):
    email: str
    full_name: str
    phone: Optional[str] = None
    role: str # citizen, university, industry, admin
    organization_name: Optional[str] = None
    district: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class UserOut(UserBase):
    id: int
    is_active: bool
    created_at: datetime.datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut

# --- Profiles ---
class InstitutionalProfileOut(BaseModel):
    id: int
    user_id: int
    institution_name: str
    institution_type: str
    nirf_rank: Optional[int] = None
    domains_json: str
    faculty_count: int
    student_count: int
    labs_json: str
    previous_projects_json: str
    max_capacity: int
    current_active_load: int
    website: Optional[str] = None

    class Config:
        from_attributes = True

class IndustryProfileOut(BaseModel):
    id: int
    user_id: int
    company_name: str
    sector: str
    csr_budget_range: str
    mentorship_domains_json: str
    facilities_offered_json: str
    website: Optional[str] = None

    class Config:
        from_attributes = True

# --- Challenge Schemas ---
class ChallengeCreate(BaseModel):
    title: str
    description: str
    category: Optional[str] = None  # If null, AI auto-assigns
    district: str
    village: Optional[str] = None
    block: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    affected_population: int = 500
    urgency: str = "Medium" # Low, Medium, High, Immediate
    severity: Optional[str] = "Medium"
    feasibility: Optional[str] = "Medium"
    media_urls: Optional[List[str]] = []

class ChallengeUpdateStatus(BaseModel):
    status: str
    reason: Optional[str] = None
    category: Optional[str] = None
    priority_score: Optional[float] = None
    override_reason: Optional[str] = None

class ChallengeOut(BaseModel):
    id: int
    title: str
    description: str
    category: str
    district: str
    village: Optional[str] = None
    block: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    affected_population: int
    urgency: str
    status: str
    priority_score: float
    priority_tier: str
    priority_breakdown_json: str
    ai_suggested_category: Optional[str] = None
    ai_category_confidence: float
    is_safety_override: bool
    override_reason: Optional[str] = None
    submitted_by: int
    assigned_institution_id: Optional[int] = None
    created_at: datetime.datetime
    updated_at: datetime.datetime

    class Config:
        from_attributes = True

# --- AI Feature Schemas ---
class AICategorizeRequest(BaseModel):
    text: str

class AIDuplicateCheckRequest(BaseModel):
    title: str
    description: str
    district: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None

class AIPrioritizeRequest(BaseModel):
    severity: str
    urgency: str
    affected_population: int
    description: str
    category: str
    feasibility: Optional[str] = "Medium"

class AIMatchInstitutionsRequest(BaseModel):
    challenge_id: Optional[int] = None
    category: str
    description: str
    district: str

class AIProposalDraftRequest(BaseModel):
    challenge_id: int

class SaarthiChatRequest(BaseModel):
    message: str
    language: Optional[str] = "en"
    context: Optional[Dict[str, Any]] = None

# --- Assignment Schemas ---
class AssignInstitutionRequest(BaseModel):
    challenge_id: int
    institution_id: int
    match_score: Optional[float] = 0.0
    match_explanation: Optional[str] = None

class AssignmentResponseRequest(BaseModel):
    assignment_id: int
    status: str # Accepted or Declined
    decline_reason: Optional[str] = None

# --- Proposal & Milestones Schemas ---
class ProposalCreate(BaseModel):
    challenge_id: int
    title: str
    problem_summary: str
    technical_approach: str
    required_expertise: List[Dict[str, Any]]
    estimated_cost: float
    proposed_duration_months: int
    risks: List[Dict[str, Any]]
    evaluation_metrics: List[str]
    mentor_name: str
    mentor_email: str
    department: str
    student_members: List[Dict[str, Any]]
    milestones: List[Dict[str, Any]]

class MilestoneUpdateStatus(BaseModel):
    milestone_id: int
    status: str # Pending, In Progress, Completed, Verified
    evidence_url: Optional[str] = None
    deliverables: Optional[List[str]] = None

# --- Marketplace Schemas ---
class OpportunityCreate(BaseModel):
    title: str
    opportunity_type: str # Research Collaboration, Mentorship, Internship, Funding Grant, Equipment Access, Pilot Testing
    description: str
    eligibility: str
    commitments: str
    funding_amount: Optional[str] = None
    deadline_days: int = 30
    is_demo: bool = False

class OpportunityApplicationCreate(BaseModel):
    opportunity_id: int
    proposal_id: Optional[int] = None
    note: str

# --- Feedback Schemas ---
class FeedbackCreate(BaseModel):
    challenge_id: int
    rating: int = 5
    feedback_text: str
    solution_working: bool = True
    outcome_metrics: Optional[Dict[str, Any]] = None

# --- Project Funding Schemas ---
class FundingContributionCreate(BaseModel):
    proposal_id: int
    funder_type: str = "CSR Foundation" # Government, CSR Foundation, Industry, Angel Investor
    action_type: str = "pledge" # pledge, approve, disburse, revision, reject
    amount: float
    notes: Optional[str] = None

class FundingRequestCreate(BaseModel):
    proposal_id: int
    total_budget: float
    requested_funding: float
    funding_milestones: Optional[List[Dict[str, Any]]] = None
    expected_impact: Optional[Dict[str, Any]] = None
    documents: Optional[List[Dict[str, str]]] = None

# --- Reward & Certificate Schemas ---
class CertificateIssueRequest(BaseModel):
    user_id: int
    challenge_id: Optional[int] = None
    proposal_id: Optional[int] = None
    certificate_type: str = "Project Completion & Social Impact"
    skills: Optional[List[str]] = None

# --- Investor Meeting Schemas ---
class InvestorMeetingCreate(BaseModel):
    startup_user_id: int
    proposal_id: Optional[int] = None
    project_title: str
    stage: str = "Prototype / MVP"
    ticket_size_range: str = "₹10,00,000 - ₹25,00,000"
    pitch_deck_url: Optional[str] = None
    notes: Optional[str] = None
    meeting_date: Optional[str] = None

# --- Goodie Redemption Schemas ---
class GoodieRedeemRequest(BaseModel):
    user_id: int
    goodie_id: str
    shipping_address: Optional[str] = "BIT Mesra Campus, Ranchi, Jharkhand - 835215"


