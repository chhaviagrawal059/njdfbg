import json
import datetime
from sqlalchemy.orm import Session
from app.models.portal_models import (
    User, CitizenProfile, InstitutionalProfile, IndustryProfile,
    Challenge, ChallengeMedia, DuplicateMatch, InstitutionAssignment,
    ProjectProposal, ProjectTeam, Milestone, OpportunityListing,
    CommunityFeedback, AuditLog, Notification
)
from app.auth import hash_password

def seed_database(db: Session):
    from app.seeds.seed_upgrades import seed_upgraded_features
    # If base database already seeded, ensure new upgraded features are seeded
    if db.query(User).count() > 0:
        seed_upgraded_features(db)
        return

    print("Seeding Jharkhand Societal Innovation database...")

    # 1. Create Core Users
    admin_user = User(
        email="admin@jharkhand.gov.in",
        hashed_password=hash_password("Admin@123"),
        full_name="Rajesh Kumar Verma, IAS",
        phone="+91-651-2400123",
        role="admin",
        organization_name="Jharkhand State Innovation Council & Dept of Higher Education",
        district="Ranchi"
    )

    citizen_user = User(
        email="citizen@jharkhand.gov.in",
        hashed_password=hash_password("Citizen@123"),
        full_name="Soma Munda",
        phone="+91-9431102948",
        role="citizen",
        organization_name="Gram Vikas Samiti, Torpa",
        district="Khunti"
    )

    bit_user = User(
        email="bit.mesra@jharkhand.ac.in",
        hashed_password=hash_password("Univ@123"),
        full_name="Dr. Ananya Roy (Dean R&D)",
        phone="+91-651-2275444",
        role="university",
        organization_name="Birla Institute of Technology (BIT) Mesra",
        district="Ranchi"
    )

    tata_user = User(
        email="csr@tatasteel.com",
        hashed_password=hash_password("Industry@123"),
        full_name="Sanjay Singhal (Head CSR)",
        phone="+91-657-6644200",
        role="industry",
        organization_name="Tata Steel Foundation & Rural Development Society",
        district="East Singhbhum"
    )

    # Additional Universities
    iit_user = User(
        email="iit.ism@jharkhand.ac.in",
        hashed_password=hash_password("Univ@123"),
        full_name="Prof. Rajiv Shekhar (Director)",
        phone="+91-326-2235001",
        role="university",
        organization_name="IIT (Indian School of Mines) Dhanbad",
        district="Dhanbad"
    )

    nit_user = User(
        email="nit.jsr@jharkhand.ac.in",
        hashed_password=hash_password("Univ@123"),
        full_name="Dr. Karunesh Kumar Shukla (Director)",
        phone="+91-657-2373407",
        role="university",
        organization_name="National Institute of Technology (NIT) Jamshedpur",
        district="East Singhbhum"
    )

    bau_user = User(
        email="bau.kanke@jharkhand.ac.in",
        hashed_password=hash_password("Univ@123"),
        full_name="Dr. Onkar Nath Singh (Vice Chancellor)",
        phone="+91-651-2455011",
        role="university",
        organization_name="Birsa Agricultural University (BAU) Kanke",
        district="Ranchi"
    )

    db.add_all([admin_user, citizen_user, bit_user, tata_user, iit_user, nit_user, bau_user])
    db.commit()

    # 2. Profiles
    cit_prof = CitizenProfile(
        user_id=citizen_user.id,
        village="Dormo",
        panchayat="Torpa East",
        occupation="Agriculture & Community Health Volunteer",
        alternate_phone="+91-9835123490"
    )

    bit_prof = InstitutionalProfile(
        user_id=bit_user.id,
        institution_name="Birla Institute of Technology Mesra, Ranchi",
        institution_type="Deemed Technical University",
        nirf_rank=53,
        domains_json=json.dumps(["Water Resources", "Environment", "Renewable Energy", "Urban Infrastructure"]),
        faculty_count=320,
        student_count=8500,
        labs_json=json.dumps([
            "Advanced Water Quality & Analytical Chemistry Lab",
            "IoT & Embedded Sensor Systems Fabrication Center",
            "Environmental Engineering Pilot Plant",
            "Tribal Area Technological Development Cell"
        ]),
        previous_projects_json=json.dumps([
            "Solar Desalination & Arsenic Abatement Pilot in Khunti (2024)",
            "Low-cost River Silt Monitoring Sensor Network in Subarnarekha (2023)"
        ]),
        max_capacity=12,
        current_active_load=3,
        website="https://www.bitmesra.ac.in"
    )

    iit_prof = InstitutionalProfile(
        user_id=iit_user.id,
        institution_name="Indian Institute of Technology (ISM) Dhanbad",
        institution_type="Institute of National Importance",
        nirf_rank=17,
        domains_json=json.dumps(["Environment", "Water Resources", "Mining & Geo-Resources", "Renewable Energy"]),
        faculty_count=450,
        student_count=9800,
        labs_json=json.dumps([
            "Center of Excellence in Mine Environment & Runoff Management",
            "Geospatial Telemetry and Remote Sensing Lab",
            "Mineral Waste Upcycling & Clean Energy Facility"
        ]),
        previous_projects_json=json.dumps([
            "Overburden Dump Stability AI Prediction System (2024)",
            "Mine Drainage Siltation Trap for Damodar River (2023)"
        ]),
        max_capacity=15,
        current_active_load=2,
        website="https://www.iitism.ac.in"
    )

    nit_prof = InstitutionalProfile(
        user_id=nit_user.id,
        institution_name="National Institute of Technology Jamshedpur",
        institution_type="Institute of National Importance",
        nirf_rank=82,
        domains_json=json.dumps(["Renewable Energy", "Urban Infrastructure", "Healthcare", "Accessibility"]),
        faculty_count=210,
        student_count=5200,
        labs_json=json.dumps([
            "Smart Microgrid & Clean Power Lab",
            "Assistive Technology & Robotics Center",
            "Biomedical Instrumentation Testing Facility"
        ]),
        previous_projects_json=json.dumps([
            "Hybrid Microgrid for Saranda Forest Villages (2024)"
        ]),
        max_capacity=10,
        current_active_load=1,
        website="https://www.nitjsr.ac.in"
    )

    bau_prof = InstitutionalProfile(
        user_id=bau_user.id,
        institution_name="Birsa Agricultural University (BAU) Ranchi",
        institution_type="State Agricultural University",
        nirf_rank=110,
        domains_json=json.dumps(["Agriculture", "Rural Livelihoods", "Water Resources"]),
        faculty_count=180,
        student_count=2400,
        labs_json=json.dumps([
            "Post-Harvest Agro-Processing & Cold Chain Technology Lab",
            "Tribal Forest Produce & Lac Research Center",
            "Soil Health & Micro-Irrigation Research Station"
        ]),
        previous_projects_json=json.dumps([
            "Solar Dryer for Mahua Flowers with 40% shelf life extension (2024)"
        ]),
        max_capacity=8,
        current_active_load=1,
        website="https://www.bauranchi.org"
    )

    tata_prof = IndustryProfile(
        user_id=tata_user.id,
        company_name="Tata Steel Foundation (TSF)",
        sector="Steel, Manufacturing & CSR",
        csr_budget_range="₹2.5 Crore - ₹5.0 Crore",
        mentorship_domains_json=json.dumps(["Water Resources", "Healthcare", "Education", "Rural Livelihoods"]),
        facilities_offered_json=json.dumps([
            "Jamshedpur Metallurgical & Materials Testing Lab",
            "Rural Field Immersion Centers in Kolhan Division",
            "Rapid Prototyping Workshop & 3D Printers"
        ]),
        website="https://www.tatasteel.com/sustainability/csr"
    )

    db.add_all([cit_prof, bit_prof, iit_prof, nit_prof, bau_prof, tata_prof])
    db.commit()

    # 3. Seed Realistic Jharkhand Societal Challenges
    now = datetime.datetime.utcnow()

    # Challenge 1: The flagship demonstration case
    ch1 = Challenge(
        title="High Fluoride and Arsenic Contamination in Borewell Drinking Water",
        description=(
            "Over 18 government handpumps across Dormo and adjoining hamlets in Torpa block are discharging water "
            "with fluoride levels exceeding 3.8 mg/L (safe limit 1.0 mg/L) and arsenic traces. Children and elderly citizens "
            "exhibit early stages of skeletal fluorosis, joint deformation, and dental enamel decay. Urgent low-cost, decentralized "
            "filtration with real-time water quality telemetry is needed for community supply."
        ),
        category="Water Resources",
        district="Khunti",
        village="Dormo, Torpa Block",
        block="Torpa",
        latitude=22.9734,
        longitude=85.2589,
        affected_population=4200,
        urgency="Immediate",
        status="Prototype Testing",
        priority_score=92.0,
        priority_tier="Critical (Safety Override)",
        priority_breakdown_json=json.dumps({
            "severity": {"value": "Critical", "score": 100, "weight": "25%"},
            "urgency": {"value": "Immediate", "score": 100, "weight": "20%"},
            "population": {"affected": 4200, "label": "High", "score": 80, "weight": "20%"},
            "health_and_safety": {"label": "Extreme Hazard (Arsenic & Fluorosis Risk)", "score": 100, "weight": "20%"},
            "feasibility": {"value": "Medium", "score": 60, "weight": "15%"},
            "formula": "Score = (Severity×0.25) + (Urgency×0.20) + (Population×0.20) + (Safety×0.20) + (Feasibility×0.15)"
        }),
        ai_suggested_category="Water Resources",
        ai_category_confidence=0.96,
        is_safety_override=True,
        override_reason="Emergency Safety Rule Triggered: Detected acute chemical contamination (arsenic, fluoride) impacting 4,200 villagers with permanent skeletal fluorosis risk.",
        submitted_by=citizen_user.id,
        assigned_institution_id=bit_prof.id,
        created_at=now - datetime.timedelta(days=45)
    )

    # Challenge 2: Post-harvest tribal produce loss
    ch2 = Challenge(
        title="Severe Spoilage and Distress Sale of Lac and Mahua Harvest",
        description=(
            "Over 3,000 tribal households collect minor forest produce (lac, mahua flowers, chironji). Due to lack of decentralized "
            "solar-powered cool storage and scientific drying, over 40% of produce decays within 72 hours, forcing distress sales to local "
            "middlemen at 1/4th the MSP market rate. An off-grid, humidity-controlled solar micro-storage facility is urgently required."
        ),
        category="Agriculture",
        district="Simdega",
        village="Bano & Kolebira Gram Panchayats",
        block="Bano",
        latitude=22.6145,
        longitude=84.5122,
        affected_population=8500,
        urgency="High",
        status="Assigned to University",
        priority_score=78.5,
        priority_tier="High",
        priority_breakdown_json=json.dumps({
            "severity": {"value": "High", "score": 80, "weight": "25%"},
            "urgency": {"value": "High", "score": 80, "weight": "20%"},
            "population": {"affected": 8500, "label": "High", "score": 80, "weight": "20%"},
            "health_and_safety": {"label": "Livelihood & Nutrition Risk", "score": 65, "weight": "20%"},
            "feasibility": {"value": "High", "score": 90, "weight": "15%"}
        }),
        ai_suggested_category="Agriculture",
        ai_category_confidence=0.94,
        is_safety_override=False,
        submitted_by=citizen_user.id,
        assigned_institution_id=bau_prof.id,
        created_at=now - datetime.timedelta(days=20)
    )

    # Challenge 3: Coal mine overburden runoff
    ch3 = Challenge(
        title="Mine Overburden Siltation and Toxic Heavy Metal Runoff into Damodar Catchment",
        description=(
            "Unstabilized coal mine overburden dumps around Jharia and Katras are experiencing severe gully erosion during monsoon rains. "
            "Heavy toxic silt and coal fines wash directly into local drinking ponds and the Damodar river tributary, turning water pitch black "
            "and silted. AI-driven slope stabilization, bio-turfing, and automated silt runoff barrier technology required."
        ),
        category="Environment",
        district="Dhanbad",
        village="Katras & Loyabad",
        block="Katras",
        latitude=23.7957,
        longitude=86.4304,
        affected_population=16000,
        urgency="Immediate",
        status="Validated",
        priority_score=91.0,
        priority_tier="Critical (Safety Override)",
        priority_breakdown_json=json.dumps({
            "severity": {"value": "Critical", "score": 100, "weight": "25%"},
            "urgency": {"value": "Immediate", "score": 100, "weight": "20%"},
            "population": {"affected": 16000, "label": "Very High", "score": 100, "weight": "20%"},
            "health_and_safety": {"label": "Extreme Environmental Hazard", "score": 100, "weight": "20%"},
            "feasibility": {"value": "Medium", "score": 60, "weight": "15%"}
        }),
        ai_suggested_category="Environment",
        ai_category_confidence=0.95,
        is_safety_override=True,
        override_reason="Severe ecological and toxic drinking source pollution in river basin.",
        submitted_by=citizen_user.id,
        created_at=now - datetime.timedelta(days=12)
    )

    # Challenge 4: Fully completed and verified project
    ch4 = Challenge(
        title="Portable Point-of-Care Tele-Screening for High-Risk Pregnancies in Anganwadis",
        description=(
            "Maternal mortality in deep forested hamlets of Chaibasa was critically high due to undetected gestational hypertension "
            "and severe anemia. A portable diagnostic telemetry kit connecting village Sahiyas directly with district medical specialists was deployed."
        ),
        category="Healthcare",
        district="West Singhbhum",
        village="Chaibasa Rural Block",
        block="Chaibasa",
        latitude=22.5532,
        longitude=85.8093,
        affected_population=6800,
        urgency="High",
        status="Completed",
        priority_score=84.0,
        priority_tier="High",
        priority_breakdown_json=json.dumps({
            "severity": {"value": "High", "score": 80, "weight": "25%"},
            "urgency": {"value": "High", "score": 80, "weight": "20%"},
            "population": {"affected": 6800, "label": "High", "score": 80, "weight": "20%"},
            "health_and_safety": {"label": "Maternal Healthcare", "score": 90, "weight": "20%"},
            "feasibility": {"value": "High", "score": 90, "weight": "15%"}
        }),
        ai_suggested_category="Healthcare",
        ai_category_confidence=0.97,
        is_safety_override=False,
        submitted_by=citizen_user.id,
        assigned_institution_id=nit_prof.id,
        created_at=now - datetime.timedelta(days=90)
    )

    # Challenge 5: Off-grid microgrid
    ch5 = Challenge(
        title="Off-Grid Solar Microgrid Inverter Phase Instability in Netarhat Plateau",
        description=(
            "Tribal forest hamlets near Netarhat suffer continuous power outages because the decentralized 25kW microgrid experiences "
            "frequency drift and phase imbalance during varying seasonal solar irradiation, causing battery bank tripping."
        ),
        category="Renewable Energy",
        district="Latehar",
        village="Netarhat Hill Hamlets",
        block="Mahuadanr",
        latitude=23.4795,
        longitude=84.2682,
        affected_population=1400,
        urgency="Medium",
        status="Under Review",
        priority_score=58.5,
        priority_tier="Medium",
        priority_breakdown_json=json.dumps({
            "severity": {"value": "Medium", "score": 50, "weight": "25%"},
            "urgency": {"value": "Medium", "score": 50, "weight": "20%"},
            "population": {"affected": 1400, "label": "Moderate", "score": 60, "weight": "20%"},
            "health_and_safety": {"label": "Standard Infrastructure", "score": 35, "weight": "20%"},
            "feasibility": {"value": "High", "score": 90, "weight": "15%"}
        }),
        ai_suggested_category="Renewable Energy",
        ai_category_confidence=0.92,
        is_safety_override=False,
        submitted_by=citizen_user.id,
        created_at=now - datetime.timedelta(days=5)
    )

    # Challenge 6: Duplicate detection test case
    ch6 = Challenge(
        title="Drinking water in Torpa handpumps contains heavy fluoride and chemical taste",
        description=(
            "Villagers in Torpa are complaining of bad tasting drinking water from village handpumps. Multiple children show yellow stains "
            "on teeth and stiff knees due to suspected fluoride poison in the ground water."
        ),
        category="Water Resources",
        district="Khunti",
        village="Torpa East Hamlet",
        block="Torpa",
        latitude=22.9780,
        longitude=85.2520,
        affected_population=2100,
        urgency="High",
        status="Submitted",
        priority_score=86.5,
        priority_tier="Critical",
        priority_breakdown_json=json.dumps({
            "severity": {"value": "High", "score": 80, "weight": "25%"},
            "urgency": {"value": "High", "score": 80, "weight": "20%"},
            "population": {"affected": 2100, "label": "Moderate", "score": 60, "weight": "20%"},
            "health_and_safety": {"label": "Elevated Hazard (Fluoride)", "score": 80, "weight": "20%"},
            "feasibility": {"value": "High", "score": 90, "weight": "15%"}
        }),
        ai_suggested_category="Water Resources",
        ai_category_confidence=0.95,
        is_safety_override=False,
        submitted_by=citizen_user.id,
        created_at=now - datetime.timedelta(days=1)
    )

    db.add_all([ch1, ch2, ch3, ch4, ch5, ch6])
    db.commit()

    # 4. Duplicate Match between ch6 and ch1
    dup_match = DuplicateMatch(
        challenge_id=ch6.id,
        matched_challenge_id=ch1.id,
        similarity_score=0.87,
        distance_km=0.88,
        explanation="High semantic similarity (82%) with existing Challenge #1 and located within 0.88 km in Khunti district. Both report severe fluoride contamination in Torpa handpumps.",
        status="Pending Review"
    )
    db.add(dup_match)

    # 5. Assignment for Challenge 1 (BIT Mesra)
    asg1 = InstitutionAssignment(
        challenge_id=ch1.id,
        institution_id=bit_prof.id,
        status="Accepted",
        match_score=94.5,
        match_explanation="BIT Mesra has specialized Water Quality Research Lab, faculty expertise in Environmental Sciences, and previously delivered similar pilot in Khunti with active capacity available.",
        assigned_by=admin_user.id,
        assigned_at=now - datetime.timedelta(days=40),
        responded_at=now - datetime.timedelta(days=38)
    )

    asg2 = InstitutionAssignment(
        challenge_id=ch2.id,
        institution_id=bau_prof.id,
        status="Assigned",
        match_score=91.0,
        match_explanation="Birsa Agricultural University possesses dedicated Tribal Forest Produce & Post-Harvest Agro-Processing facilities matching Simdega tribal requirements.",
        assigned_by=admin_user.id,
        assigned_at=now - datetime.timedelta(days=18)
    )
    db.add_all([asg1, asg2])

    # 6. Proposal for Challenge 1
    prop1 = ProjectProposal(
        challenge_id=ch1.id,
        institution_id=bit_prof.id,
        title="Decentralized Adsorbent Fluoride & Arsenic Remediation Unit with IoT Telemetry",
        problem_summary=(
            "Dormo village groundwater contains 3.8 mg/L fluoride and trace arsenic, creating severe bone deformation risk. "
            "BIT Mesra proposes an engineered community filtration unit combining activated bauxite/alumina with solar IoT monitoring."
        ),
        technical_approach=(
            "1. Multi-stage filtration column: pre-sedimentation, activated alumina adsorption, and coconut shell granular activated carbon. "
            "2. Low-cost IoT sensor module measuring pH, TDS, fluoride ion concentration, and cumulative discharge volume. "
            "3. Solar micro-inverter telemetry transmitting daily water safety logs to the district portal and village digital kiosk."
        ),
        required_expertise_json=json.dumps([
            {"role": "Lead Faculty Mentor", "domain": "Chemical & Environmental Engineering"},
            {"role": "Student Tech Lead", "domain": "Embedded IoT & Telemetry"},
            {"role": "Field Mechanical Engineer", "domain": "Hydraulics & Filter Housing Fabrication"},
            {"role": "Community Liaison", "domain": "Rural Management & Gram Panchayat Training"}
        ]),
        estimated_cost=185000.0,
        proposed_duration_months=6,
        risks_json=json.dumps([
            {"risk": "Rapid saturation of adsorption media during peak monsoon flow", "mitigation": "Dual parallel canister bypass design allowing cartridge changeover without downtime."},
            {"risk": "Dust accumulation on solar panel powering telemetry", "mitigation": "Automated capacitive battery backup with 72-hour reserve."}
        ]),
        evaluation_metrics_json=json.dumps([
            "Drinking water fluoride output consistently under 0.8 mg/L (BIS IS:10500 standard)",
            "Telemetry uptime exceeding 99%",
            "Daily clean drinking water supplied to 4,200 villagers at 35 liters per capita"
        ]),
        status="Approved",
        ai_drafted=True,
        submitted_at=now - datetime.timedelta(days=35),
        approved_at=now - datetime.timedelta(days=30)
    )
    db.add(prop1)
    db.commit()

    # Team for Proposal 1
    team1 = ProjectTeam(
        proposal_id=prop1.id,
        mentor_name="Dr. Ananya Roy",
        mentor_email="ananya.roy@bitmesra.ac.in",
        department="Department of Chemical & Environmental Engineering",
        student_members_json=json.dumps([
            {"name": "Aman Kumar Hansda", "role": "Embedded IoT Developer", "roll": "BTECH/CS/22/014", "branch": "Computer Science"},
            {"name": "Priyanka Mahto", "role": "Water Filtration Lead", "roll": "BTECH/CH/22/032", "branch": "Chemical Engineering"},
            {"name": "Rahul Oraon", "role": "Field Testing & CAD Design", "roll": "BTECH/ME/22/078", "branch": "Mechanical Engineering"},
            {"name": "Sneha Kumari", "role": "Community Engagement", "roll": "IMSC/ENV/23/009", "branch": "Environmental Science"}
        ])
    )
    db.add(team1)

    # Milestones for Proposal 1
    m1 = Milestone(
        proposal_id=prop1.id,
        milestone_number=1,
        title="Field Water Sampling & Baseline Laboratory Characterization",
        description="Collected 24 water samples across Dormo handpumps; completed ICP-MS and spectrophotometry analysis.",
        target_date=now - datetime.timedelta(days=20),
        status="Verified",
        completion_date=now - datetime.timedelta(days=22),
        deliverables_json=json.dumps(["Baseline Water Quality Characterization Report", "Approved Filter Column CAD Schematics"]),
        evidence_url="https://jharkhand-innovation.gov.in/docs/baseline_water_audit_khunti.pdf",
        verified_by=admin_user.id,
        verified_at=now - datetime.timedelta(days=20)
    )

    m2 = Milestone(
        proposal_id=prop1.id,
        milestone_number=2,
        title="Laboratory Scale Prototype Fabrication & Column Breakthrough Testing",
        description="Fabricated bench-scale 500 LPH filtration unit at BIT Mesra; achieved 98.2% fluoride removal across 10,000 liters.",
        target_date=now - datetime.timedelta(days=5),
        status="Completed",
        completion_date=now - datetime.timedelta(days=4),
        deliverables_json=json.dumps(["Lab Test Certificate (NABL Accredited)", "Embedded IoT PCB Assembly"]),
        evidence_url="https://jharkhand-innovation.gov.in/docs/lab_breakthrough_certificate.pdf"
    )

    m3 = Milestone(
        proposal_id=prop1.id,
        milestone_number=3,
        title="Field Pilot Deployment & Community Kiosk Commissioning in Dormo",
        description="Install physical treatment housing on primary borewell #3 in Dormo, connect solar panel, and commence 60-day trial.",
        target_date=now + datetime.timedelta(days=30),
        status="In Progress",
        deliverables_json=json.dumps(["Field Commissioning Checklist", "Real-Time Telemetry Link"])
    )

    m4 = Milestone(
        proposal_id=prop1.id,
        milestone_number=4,
        title="Citizen Handover, Gram Panchayat Training & Final Audit",
        description="Train local Jal Sahiyas in sensor reading and media replacement; submit formal societal impact assessment.",
        target_date=now + datetime.timedelta(days=75),
        status="Pending",
        deliverables_json=json.dumps(["Final Societal Impact Report", "Training Manual in Hindi & Mundari"])
    )

    db.add_all([m1, m2, m3, m4])

    # 7. Completed Proposal Feedback for Challenge 4
    fb4 = CommunityFeedback(
        challenge_id=ch4.id,
        citizen_id=citizen_user.id,
        rating=5,
        feedback_text=(
            "The tele-diagnostic kits have completely transformed our Anganwadi center. Over 280 pregnant mothers were screened "
            "on time, and 14 high-risk anemia cases received emergency medical care at Chaibasa Sadar Hospital before delivery. All mothers and babies are healthy."
        ),
        solution_working=True,
        outcome_metrics_json=json.dumps({
            "mothers_screened": 280,
            "referrals_completed": 14,
            "complication_reduction_percent": "78%"
        }),
        verification_status="Verified"
    )
    db.add(fb4)

    # 8. Innovation Opportunities in Marketplace
    opp1 = OpportunityListing(
        provider_id=tata_user.id,
        provider_name="Tata Steel Foundation (TSF)",
        provider_type="Corporate CSR",
        title="CSR Innovation Grant: Rural Water Remediation & IoT Water Quality Monitoring",
        opportunity_type="Funding Grant",
        description=(
            "Tata Steel Foundation invites university engineering teams and social startups to submit pilot proposals for drinking water "
            "decontamination across Kolhan and South Chotanagpur divisions. Selected teams receive prototype grants, testing equipment, and industrial mentors."
        ),
        eligibility="Accredited Universities, Engineering Colleges & Faculty-led Student Teams in Jharkhand",
        commitments="₹5,00,000 prototype funding + access to Jamshedpur chemical testing facilities + 20 hours technical mentorship",
        funding_amount="₹5,00,000",
        deadline=now + datetime.timedelta(days=45),
        is_demo=False,
        status="Open"
    )

    opp2 = OpportunityListing(
        provider_id=admin_user.id,
        provider_name="Jharkhand State Livelihood Promotion Society (JSLPS)",
        provider_type="Government Department",
        title="Student Innovation Fellowship: Cold Chain Micro-Storage for Tribal Forest Produce",
        opportunity_type="Student Project Opportunities",
        description=(
            "JSLPS offers 6-month paid innovation fellowships for multidisciplinary student teams designing zero-energy cool chambers "
            "and solar dehydrators for forest produce in Simdega and Khunti."
        ),
        eligibility="Undergraduate and Postgraduate students in Agriculture, Mechanical, or Environmental Engineering",
        commitments="Monthly stipend of ₹15,000/student + village pilot deployment site + certificate of appreciation from Dept of Rural Development",
        funding_amount="₹1,80,000",
        deadline=now + datetime.timedelta(days=30),
        is_demo=False,
        status="Open"
    )

    opp3 = OpportunityListing(
        provider_id=tata_user.id,
        provider_name="Tata Steel Technical Services",
        provider_type="Industry Partner",
        title="Equipment & Advanced Materials Access: Metallurgical and Filter Media Testing",
        opportunity_type="Equipment Access",
        description=(
            "Providing free testing hours on automated atomic absorption spectrophotometers, SEM analysis, and structural fabrication "
            "workshops at Jamshedpur for university researchers working on civic infrastructure challenges."
        ),
        eligibility="Faculty members and registered university research teams",
        commitments="40 hours of certified laboratory time + materials testing reports",
        funding_amount="In-Kind Lab Access",
        deadline=now + datetime.timedelta(days=60),
        is_demo=False,
        status="Open"
    )

    db.add_all([opp1, opp2, opp3])

    # 9. Initial Audit Logs
    audit1 = AuditLog(
        actor_id=admin_user.id,
        actor_name=admin_user.full_name,
        role="admin",
        action="SYSTEM_INITIALIZED",
        entity_type="System",
        entity_id=1,
        new_state="Operational",
        reason="Platform initialized with simulated Jharkhand civic innovation dataset"
    )
    db.add(audit1)

    db.commit()
    print("Database seeding completed successfully!")
