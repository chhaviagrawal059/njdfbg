import datetime
from sqlalchemy import (
    Column, Integer, String, Text, Float, Boolean, DateTime, ForeignKey, Enum as SQLEnum
)
from sqlalchemy.orm import relationship
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=False)
    phone = Column(String(50), nullable=True)
    role = Column(String(50), nullable=False)  # citizen, university, industry, admin
    organization_name = Column(String(255), nullable=True)
    district = Column(String(100), nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationships
    challenges = relationship("Challenge", back_populates="submitter", foreign_keys="Challenge.submitted_by")
    citizen_profile = relationship("CitizenProfile", back_populates="user", uselist=False)
    institutional_profile = relationship("InstitutionalProfile", back_populates="user", uselist=False)
    industry_profile = relationship("IndustryProfile", back_populates="user", uselist=False)
    student_profile = relationship("StudentProfile", back_populates="user", uselist=False)
    startup_profile = relationship("StartupProfile", back_populates="user", uselist=False)
    csr_profile = relationship("CSRProfile", back_populates="user", uselist=False)
    investor_profile = relationship("InvestorProfile", back_populates="user", uselist=False)
    certificates = relationship("RewardCertificate", back_populates="user")
    notifications = relationship("Notification", back_populates="user")


class CitizenProfile(Base):
    __tablename__ = "citizen_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    village = Column(String(255), nullable=True)
    panchayat = Column(String(255), nullable=True)
    occupation = Column(String(255), nullable=True)
    alternate_phone = Column(String(50), nullable=True)

    user = relationship("User", back_populates="citizen_profile")


class InstitutionalProfile(Base):
    __tablename__ = "institutional_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    institution_name = Column(String(255), nullable=False)
    institution_type = Column(String(100), default="Technical University") # IIT, NIT, State Univ, Research Lab
    nirf_rank = Column(Integer, nullable=True)
    domains_json = Column(Text, default="[]")  # JSON list of research domains
    faculty_count = Column(Integer, default=50)
    student_count = Column(Integer, default=1500)
    labs_json = Column(Text, default="[]")  # JSON list of laboratories/facilities
    previous_projects_json = Column(Text, default="[]")  # Past successful societal innovations
    max_capacity = Column(Integer, default=10)
    current_active_load = Column(Integer, default=0)
    website = Column(String(255), nullable=True)

    user = relationship("User", back_populates="institutional_profile")
    assignments = relationship("InstitutionAssignment", back_populates="institution")
    proposals = relationship("ProjectProposal", back_populates="institution")


class FacultyStudentProfile(Base):
    __tablename__ = "faculty_student_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    institution_id = Column(Integer, ForeignKey("institutional_profiles.id"), nullable=True)
    designation = Column(String(100), default="Student")  # Student, Faculty Mentor, Lab Incharge
    department = Column(String(200), nullable=True)
    skills_json = Column(Text, default="[]")
    portfolio_summary = Column(Text, nullable=True)


class IndustryProfile(Base):
    __tablename__ = "industry_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    company_name = Column(String(255), nullable=False)
    sector = Column(String(100), default="Manufacturing") # Mining, Steel, IT, Agro-Tech, Healthcare
    csr_budget_range = Column(String(100), default="₹10 Lakh - ₹50 Lakh")
    mentorship_domains_json = Column(Text, default="[]")
    facilities_offered_json = Column(Text, default="[]")
    website = Column(String(255), nullable=True)

    user = relationship("User", back_populates="industry_profile")


class Challenge(Base):
    __tablename__ = "challenges"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(300), nullable=False, index=True)
    description = Column(Text, nullable=False)
    category = Column(String(100), nullable=False, index=True)  # Education, Healthcare, Agriculture, etc.
    district = Column(String(100), nullable=False, index=True)  # Ranchi, Dhanbad, Khunti, etc.
    village = Column(String(200), nullable=True)
    block = Column(String(200), nullable=True)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    affected_population = Column(Integer, default=500)
    urgency = Column(String(50), default="Medium")  # Low, Medium, High, Critical
    
    # Workflow Lifecycle Status:
    # Submitted -> Under Review -> Validated -> Assigned to University -> Proposal Submitted -> Proposal Approved -> In Progress -> Prototype Testing -> Pilot/Implementation -> Outcome Verification -> Completed
    # Also: Rejected, Clarification Requested, Declined, Paused
    status = Column(String(50), default="Submitted", index=True)
    
    # AI Enrichment fields
    priority_score = Column(Float, default=50.0)
    priority_tier = Column(String(50), default="Medium")  # Critical, High, Medium, Low
    priority_breakdown_json = Column(Text, default="{}")
    ai_suggested_category = Column(String(100), nullable=True)
    ai_category_confidence = Column(Float, default=0.0)
    is_safety_override = Column(Boolean, default=False)
    override_reason = Column(Text, nullable=True)
    
    submitted_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    assigned_institution_id = Column(Integer, ForeignKey("institutional_profiles.id"), nullable=True)
    
    created_at = Column(DateTime, default=datetime.datetime.utcnow, index=True)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    # Relationships
    submitter = relationship("User", back_populates="challenges", foreign_keys=[submitted_by])
    assigned_institution = relationship("InstitutionalProfile", foreign_keys=[assigned_institution_id])
    media = relationship("ChallengeMedia", back_populates="challenge", cascade="all, delete-orphan")
    duplicate_matches = relationship("DuplicateMatch", back_populates="challenge", foreign_keys="DuplicateMatch.challenge_id", cascade="all, delete-orphan")
    assignments = relationship("InstitutionAssignment", back_populates="challenge", cascade="all, delete-orphan")
    proposals = relationship("ProjectProposal", back_populates="challenge", cascade="all, delete-orphan")
    feedback = relationship("CommunityFeedback", back_populates="challenge", cascade="all, delete-orphan")


class ChallengeMedia(Base):
    __tablename__ = "challenge_media"

    id = Column(Integer, primary_key=True, index=True)
    challenge_id = Column(Integer, ForeignKey("challenges.id"), nullable=False)
    media_type = Column(String(50), default="image") # image, video, document
    file_name = Column(String(255), nullable=False)
    file_url = Column(String(500), nullable=False)
    description = Column(String(255), nullable=True)
    uploaded_at = Column(DateTime, default=datetime.datetime.utcnow)

    challenge = relationship("Challenge", back_populates="media")


class DuplicateMatch(Base):
    __tablename__ = "duplicate_matches"

    id = Column(Integer, primary_key=True, index=True)
    challenge_id = Column(Integer, ForeignKey("challenges.id"), nullable=False)
    matched_challenge_id = Column(Integer, ForeignKey("challenges.id"), nullable=False)
    similarity_score = Column(Float, nullable=False) # e.g. 0.85
    distance_km = Column(Float, nullable=True)
    explanation = Column(Text, nullable=False)
    status = Column(String(50), default="Pending Review") # Pending Review, Confirmed Duplicate, Marked Distinct
    reviewed_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    reviewed_at = Column(DateTime, nullable=True)

    challenge = relationship("Challenge", foreign_keys=[challenge_id], back_populates="duplicate_matches")
    matched_challenge = relationship("Challenge", foreign_keys=[matched_challenge_id])


class InstitutionAssignment(Base):
    __tablename__ = "institution_assignments"

    id = Column(Integer, primary_key=True, index=True)
    challenge_id = Column(Integer, ForeignKey("challenges.id"), nullable=False)
    institution_id = Column(Integer, ForeignKey("institutional_profiles.id"), nullable=False)
    status = Column(String(50), default="Assigned") # Recommended, Assigned, Accepted, Declined
    match_score = Column(Float, default=0.0)
    match_explanation = Column(Text, nullable=True)
    assigned_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    assigned_at = Column(DateTime, default=datetime.datetime.utcnow)
    responded_at = Column(DateTime, nullable=True)
    decline_reason = Column(Text, nullable=True)

    challenge = relationship("Challenge", back_populates="assignments")
    institution = relationship("InstitutionalProfile", back_populates="assignments")


class ProjectProposal(Base):
    __tablename__ = "project_proposals"

    id = Column(Integer, primary_key=True, index=True)
    challenge_id = Column(Integer, ForeignKey("challenges.id"), nullable=False)
    institution_id = Column(Integer, ForeignKey("institutional_profiles.id"), nullable=False)
    title = Column(String(300), nullable=False)
    problem_summary = Column(Text, nullable=False)
    technical_approach = Column(Text, nullable=False)
    required_expertise_json = Column(Text, default="[]")
    estimated_cost = Column(Float, default=50000.0)
    proposed_duration_months = Column(Integer, default=6)
    risks_json = Column(Text, default="[]")
    evaluation_metrics_json = Column(Text, default="[]")
    status = Column(String(50), default="Draft") # Draft, Submitted, Approved, Revision Requested, Rejected
    ai_drafted = Column(Boolean, default=False)
    submitted_at = Column(DateTime, default=datetime.datetime.utcnow)
    approved_at = Column(DateTime, nullable=True)
    rejection_reason = Column(Text, nullable=True)

    challenge = relationship("Challenge", back_populates="proposals")
    institution = relationship("InstitutionalProfile", back_populates="proposals")
    team = relationship("ProjectTeam", back_populates="proposal", uselist=False, cascade="all, delete-orphan")
    milestones = relationship("Milestone", back_populates="proposal", cascade="all, delete-orphan")
    collaborations = relationship("CollaborationAgreement", back_populates="proposal", cascade="all, delete-orphan")
    funding = relationship("ProjectFunding", back_populates="proposal", uselist=False, cascade="all, delete-orphan")


class ProjectTeam(Base):
    __tablename__ = "project_teams"

    id = Column(Integer, primary_key=True, index=True)
    proposal_id = Column(Integer, ForeignKey("project_proposals.id"), unique=True, nullable=False)
    mentor_name = Column(String(255), nullable=False)
    mentor_email = Column(String(255), nullable=False)
    department = Column(String(255), nullable=False)
    student_members_json = Column(Text, default="[]") # List of {name, role, roll, branch}

    proposal = relationship("ProjectProposal", back_populates="team")


class Milestone(Base):
    __tablename__ = "milestones"

    id = Column(Integer, primary_key=True, index=True)
    proposal_id = Column(Integer, ForeignKey("project_proposals.id"), nullable=False)
    milestone_number = Column(Integer, nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    target_date = Column(DateTime, nullable=False)
    status = Column(String(50), default="Pending") # Pending, In Progress, Completed, Verified
    completion_date = Column(DateTime, nullable=True)
    deliverables_json = Column(Text, default="[]")
    evidence_url = Column(String(500), nullable=True)
    verified_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    verified_at = Column(DateTime, nullable=True)

    proposal = relationship("ProjectProposal", back_populates="milestones")


class OpportunityListing(Base):
    __tablename__ = "opportunity_listings"

    id = Column(Integer, primary_key=True, index=True)
    provider_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    provider_name = Column(String(255), nullable=False)
    provider_type = Column(String(100), default="Industry") # Industry, Startup, MSME, CSR, Govt Dept, Research Lab
    title = Column(String(255), nullable=False)
    opportunity_type = Column(String(100), nullable=False) # Research Collaboration, Mentorship, Internship, Sponsored Research, Equipment Access, Pilot Testing, Funding Grant, Incubation
    description = Column(Text, nullable=False)
    eligibility = Column(Text, nullable=False)
    commitments = Column(Text, nullable=False)
    funding_amount = Column(String(100), nullable=True) # e.g. "₹2,50,000"
    deadline = Column(DateTime, nullable=False)
    is_demo = Column(Boolean, default=False)
    status = Column(String(50), default="Open") # Open, Closed, Fulfilled
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    applications = relationship("OpportunityApplication", back_populates="opportunity", cascade="all, delete-orphan")


class OpportunityApplication(Base):
    __tablename__ = "opportunity_applications"

    id = Column(Integer, primary_key=True, index=True)
    opportunity_id = Column(Integer, ForeignKey("opportunity_listings.id"), nullable=False)
    applicant_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    proposal_id = Column(Integer, ForeignKey("project_proposals.id"), nullable=True)
    note = Column(Text, nullable=False)
    status = Column(String(50), default="Submitted") # Submitted, Under Review, Accepted, Declined
    submitted_at = Column(DateTime, default=datetime.datetime.utcnow)
    reviewed_at = Column(DateTime, nullable=True)

    opportunity = relationship("OpportunityListing", back_populates="applications")
    applicant = relationship("User", foreign_keys=[applicant_id])


class CollaborationAgreement(Base):
    __tablename__ = "collaboration_agreements"

    id = Column(Integer, primary_key=True, index=True)
    challenge_id = Column(Integer, ForeignKey("challenges.id"), nullable=False)
    proposal_id = Column(Integer, ForeignKey("project_proposals.id"), nullable=False)
    industry_id = Column(Integer, ForeignKey("industry_profiles.id"), nullable=False)
    agreement_title = Column(String(255), nullable=False)
    ip_terms = Column(Text, nullable=False) # e.g., Open civic IP, Shared academic-industry patent
    funding_committed = Column(Float, default=0.0)
    equipment_provided = Column(Text, nullable=True)
    mentorship_hours = Column(Integer, default=20)
    status = Column(String(50), default="Drafted") # Drafted, Active, Fulfilled, Terminated
    signed_at = Column(DateTime, default=datetime.datetime.utcnow)

    proposal = relationship("ProjectProposal", back_populates="collaborations")
    industry = relationship("IndustryProfile", foreign_keys=[industry_id])


class CommunityFeedback(Base):
    __tablename__ = "community_feedbacks"

    id = Column(Integer, primary_key=True, index=True)
    challenge_id = Column(Integer, ForeignKey("challenges.id"), nullable=False)
    citizen_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    rating = Column(Integer, default=5) # 1 to 5 stars
    feedback_text = Column(Text, nullable=False)
    solution_working = Column(Boolean, default=True)
    outcome_metrics_json = Column(Text, default="{}") # e.g. {"water_purity_improved": "94%", "taps_installed": 12}
    verification_status = Column(String(50), default="Verified") # Pending, Verified, Disputed
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    challenge = relationship("Challenge", back_populates="feedback")
    citizen = relationship("User", foreign_keys=[citizen_id])


class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String(255), nullable=False)
    message = Column(Text, nullable=False)
    link = Column(String(255), nullable=True)
    read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="notifications")


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    actor_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    actor_name = Column(String(255), nullable=False)
    role = Column(String(50), nullable=False)
    action = Column(String(100), nullable=False)
    entity_type = Column(String(100), nullable=False) # Challenge, Proposal, Assignment, Milestone
    entity_id = Column(Integer, nullable=False)
    previous_state = Column(String(100), nullable=True)
    new_state = Column(String(100), nullable=False)
    reason = Column(Text, nullable=True)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow, index=True)


class StudentProfile(Base):
    __tablename__ = "student_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    institution_name = Column(String(255), nullable=False)
    degree = Column(String(100), default="B.Tech")
    year_of_study = Column(String(50), default="3rd Year")
    department = Column(String(200), default="Computer Science & Engineering")
    skills_json = Column(Text, default="[]")
    portfolio_summary = Column(Text, nullable=True)
    github_or_portfolio = Column(String(255), nullable=True)
    badges_json = Column(Text, default="[]")
    completed_projects_count = Column(Integer, default=0)

    user = relationship("User", back_populates="student_profile")


class StartupProfile(Base):
    __tablename__ = "startup_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    startup_name = Column(String(255), nullable=False)
    incorporation_year = Column(Integer, default=2024)
    dpiit_recognition_number = Column(String(100), nullable=True)
    sector = Column(String(100), default="CleanTech & Rural Innovation")
    stage = Column(String(50), default="Prototype / MVP") # Ideation, MVP, Early Traction, Scaling
    funding_ask = Column(String(100), default="₹15,00,000")
    pitch_deck_url = Column(String(500), nullable=True)
    traction_metrics_json = Column(Text, default="{}")
    patent_status = Column(String(100), default="Provisional Patent Filed")

    user = relationship("User", back_populates="startup_profile")


class CSRProfile(Base):
    __tablename__ = "csr_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    foundation_name = Column(String(255), nullable=False)
    parent_company = Column(String(255), nullable=True)
    csr_registration_number = Column(String(100), nullable=True) # CSR-1 Registration
    annual_budget = Column(String(100), default="₹3.5 Crore")
    focus_areas_json = Column(Text, default="[]")
    districts_served_json = Column(Text, default="[]")

    user = relationship("User", back_populates="csr_profile")


class InvestorProfile(Base):
    __tablename__ = "investor_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    firm_name = Column(String(255), nullable=False)
    investor_type = Column(String(100), default="Venture Capital / Angel Network") # Angel Network, VC, Impact Fund
    ticket_size_min = Column(String(50), default="₹5,00,000")
    ticket_size_max = Column(String(50), default="₹50,00,000")
    sectors_of_interest_json = Column(Text, default="[]")
    aum = Column(String(100), default="₹25 Crore")

    user = relationship("User", back_populates="investor_profile")


class ProjectFunding(Base):
    __tablename__ = "project_fundings"

    id = Column(Integer, primary_key=True, index=True)
    proposal_id = Column(Integer, ForeignKey("project_proposals.id"), unique=True, nullable=False)
    total_budget = Column(Float, default=180000.0)
    requested_funding = Column(Float, default=180000.0)
    amount_pledged = Column(Float, default=0.0)
    amount_approved = Column(Float, default=0.0)
    amount_disbursed = Column(Float, default=0.0)
    funding_status = Column(String(50), default="Open for Funding") # Open for Funding, Partially Pledged, Approved, Disbursing, Fully Funded
    funding_milestones_json = Column(Text, default="[]") # List of {milestone_num, title, tranche_amount, deliverable, status}
    expected_impact_json = Column(Text, default="{}") # {community, environmental, economic, technological}
    documents_json = Column(Text, default="[]") # [{name, url, type}]
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    proposal = relationship("ProjectProposal", back_populates="funding")
    contributions = relationship("FundingContribution", back_populates="funding", cascade="all, delete-orphan")


class FundingContribution(Base):
    __tablename__ = "funding_contributions"

    id = Column(Integer, primary_key=True, index=True)
    funding_id = Column(Integer, ForeignKey("project_fundings.id"), nullable=False)
    funder_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    funder_name = Column(String(255), nullable=False)
    funder_type = Column(String(100), default="CSR Foundation") # Government, CSR Foundation, Industry, Angel Investor
    pledged_amount = Column(Float, default=0.0)
    approved_amount = Column(Float, default=0.0)
    disbursed_amount = Column(Float, default=0.0)
    status = Column(String(50), default="Pledged") # Pledged, Approved, Disbursed, Revision Requested, Rejected
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    funding = relationship("ProjectFunding", back_populates="contributions")
    funder = relationship("User", foreign_keys=[funder_id])


class RewardCertificate(Base):
    __tablename__ = "reward_certificates"

    id = Column(Integer, primary_key=True, index=True)
    certificate_id = Column(String(100), unique=True, index=True, nullable=False) # e.g. JH-INNOV-2026-WTR-8821
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    recipient_name = Column(String(255), nullable=False)
    recipient_role = Column(String(100), default="Student Innovator")
    challenge_id = Column(Integer, ForeignKey("challenges.id"), nullable=True)
    proposal_id = Column(Integer, ForeignKey("project_proposals.id"), nullable=True)
    project_title = Column(String(300), nullable=False)
    certificate_type = Column(String(100), default="Project Completion & Social Impact") # Completion, Merit Award, Mentor Excellence
    issuing_authority = Column(String(255), default="Government of Jharkhand — State Innovation Council")
    skills_json = Column(Text, default="[]")
    criteria_met = Column(Boolean, default=True)
    verification_hash = Column(String(255), nullable=False)
    issued_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="certificates")
    challenge = relationship("Challenge", foreign_keys=[challenge_id])
    proposal = relationship("ProjectProposal", foreign_keys=[proposal_id])


class InvestorMeeting(Base):
    __tablename__ = "investor_meetings"

    id = Column(Integer, primary_key=True, index=True)
    investor_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    investor_name = Column(String(255), nullable=False)
    startup_user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    proposal_id = Column(Integer, ForeignKey("project_proposals.id"), nullable=True)
    project_title = Column(String(300), nullable=False)
    stage = Column(String(50), default="Prototype / MVP")
    ticket_size_range = Column(String(100), default="₹10,00,000 - ₹25,00,000")
    pitch_deck_url = Column(String(500), nullable=True)
    status = Column(String(50), default="Meeting Requested") # Meeting Requested, Meeting Scheduled, Due Diligence, Investment Interest Expressed, Declined
    notes = Column(Text, nullable=True)
    meeting_date = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    investor = relationship("User", foreign_keys=[investor_id])
    startup_user = relationship("User", foreign_keys=[startup_user_id])


class GoodieRedemption(Base):
    __tablename__ = "goodie_redemptions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    goodie_id = Column(String(100), nullable=False)
    goodie_name = Column(String(255), nullable=False)
    points_spent = Column(Integer, nullable=False)
    voucher_code = Column(String(100), unique=True, index=True, nullable=False)
    sponsor_name = Column(String(255), nullable=False)
    shipping_address = Column(String(500), nullable=True)
    status = Column(String(50), default="Dispatched") # Processing, Dispatched, Delivered
    redeemed_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User")

