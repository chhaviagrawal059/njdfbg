import json
import hashlib
import datetime
from sqlalchemy.orm import Session
from app.models.portal_models import (
    User, CitizenProfile, InstitutionalProfile, IndustryProfile,
    StudentProfile, StartupProfile, CSRProfile, InvestorProfile,
    Challenge, ProjectProposal, ProjectTeam, Milestone,
    ProjectFunding, FundingContribution, RewardCertificate,
    InvestorMeeting, OpportunityListing, AuditLog, Notification
)
from app.auth import hash_password

def seed_upgraded_features(db: Session):
    print("Checking and seeding upgraded roles, funding marketplace, rewards & impact...")
    now = datetime.datetime.utcnow()

    # 1. Ensure Challenge 1 has the exact title required
    ch1 = db.query(Challenge).filter(Challenge.district == "Khunti").first()
    if ch1:
        ch1.title = "Affordable Drinking-Water Quality Monitoring for Rural Communities in Jharkhand"
        db.commit()

    # 2. Add New Demo Users for Expanded Roles
    # Student User
    student_user = db.query(User).filter(User.email == "student@jharkhand.ac.in").first()
    if not student_user:
        student_user = User(
            email="student@jharkhand.ac.in",
            hashed_password=hash_password("Student@123"),
            full_name="Amit Soren",
            phone="+91-9431109922",
            role="student",
            organization_name="BIT Mesra — Rural IoT Innovators Team",
            district="Ranchi"
        )
        db.add(student_user)
        db.commit()
        db.refresh(student_user)

    # Student Profile
    student_prof = db.query(StudentProfile).filter(StudentProfile.user_id == student_user.id).first()
    if not student_prof:
        student_prof = StudentProfile(
            user_id=student_user.id,
            institution_name="Birla Institute of Technology (BIT) Mesra",
            degree="B.Tech Computer Science & IoT",
            year_of_study="4th Year",
            department="Department of Computer Science & Engineering",
            skills_json=json.dumps([
                "IoT Water Sensors", "Embedded C", "Telemetry & LoRaWAN",
                "Edge Computing", "Water Fluoride Electrochemistry", "Rapid Prototyping"
            ]),
            portfolio_summary="Lead hardware & telemetry architect on the Dormo Village Rural Drinking-Water Telemetry project. Experienced in low-power microcontroller design for remote tribal settlements.",
            github_or_portfolio="https://github.com/amitsoren-bit/jharkhand-iot-water",
            badges_json=json.dumps([
                {"badge": "Rural Impact Champion", "level": "Gold", "date": "2026"},
                {"badge": "State Innovation Fellow", "level": "Platinum", "date": "2026"},
                {"badge": "Hardware Prototyper", "level": "Silver", "date": "2025"}
            ]),
            completed_projects_count=2
        )
        db.add(student_prof)

    # Startup User
    startup_user = db.query(User).filter(User.email == "startup@jharinnovate.in").first()
    if not startup_user:
        startup_user = User(
            email="startup@jharinnovate.in",
            hashed_password=hash_password("Startup@123"),
            full_name="Priya Tirkey",
            phone="+91-9835012389",
            role="startup",
            organization_name="JalDrishti CleanTech Innovations Pvt Ltd",
            district="Ranchi"
        )
        db.add(startup_user)
        db.commit()
        db.refresh(startup_user)

    # Startup Profile
    startup_prof = db.query(StartupProfile).filter(StartupProfile.user_id == startup_user.id).first()
    if not startup_prof:
        startup_prof = StartupProfile(
            user_id=startup_user.id,
            startup_name="JalDrishti CleanTech Innovations",
            incorporation_year=2024,
            dpiit_recognition_number="DPIIT-JH-2024-8849",
            sector="CleanTech & Rural Water Telemetry",
            stage="Prototype / Field Pilot",
            funding_ask="₹15,00,000",
            pitch_deck_url="/docs/jaldrishti_seed_pitchdeck.pdf",
            traction_metrics_json=json.dumps({
                "sensors_deployed": 14,
                "households_protected": 4200,
                "monthly_active_telemetry_reads": 45000,
                "hardware_unit_cost": "₹3,200 (vs ₹85,000 imported)"
            }),
            patent_status="Provisional Patent Filed (CBR No. 89412/2025)"
        )
        db.add(startup_prof)

    # CSR Foundation User
    csr_user = db.query(User).filter(User.email == "csr.foundation@jharkhand.org").first()
    if not csr_user:
        csr_user = User(
            email="csr.foundation@jharkhand.org",
            hashed_password=hash_password("CSR@123"),
            full_name="Sunita Murmu",
            phone="+91-651-2488100",
            role="csr",
            organization_name="Jharkhand Tribal Empowerment & Rural CSR Trust",
            district="Dumka"
        )
        db.add(csr_user)
        db.commit()
        db.refresh(csr_user)

    # CSR Profile
    csr_prof = db.query(CSRProfile).filter(CSRProfile.user_id == csr_user.id).first()
    if not csr_prof:
        csr_prof = CSRProfile(
            user_id=csr_user.id,
            foundation_name="Jharkhand Tribal Empowerment & Rural CSR Trust",
            parent_company="Chotanagpur Industrial & Philanthropic Consortium",
            csr_registration_number="CSR00048192 (MCA Registered)",
            annual_budget="₹4.5 Crore",
            focus_areas_json=json.dumps([
                "Safe Drinking Water", "Tribal Child Nutrition", "Solar Microgrids", "Non-Timber Forest Produce"
            ]),
            districts_served_json=json.dumps(["Khunti", "Simdega", "Gumla", "Dumka", "West Singhbhum"])
        )
        db.add(csr_prof)

    # Angel Investor User
    investor_user = db.query(User).filter(User.email == "investor@jharkhandangels.in").first()
    if not investor_user:
        investor_user = User(
            email="investor@jharkhandangels.in",
            hashed_password=hash_password("Investor@123"),
            full_name="Vikramaditya Singh",
            phone="+91-9431782299",
            role="investor",
            organization_name="Chotanagpur Venture Fund & Angel Network",
            district="Ranchi"
        )
        db.add(investor_user)
        db.commit()
        db.refresh(investor_user)

    # Investor Profile
    investor_prof = db.query(InvestorProfile).filter(InvestorProfile.user_id == investor_user.id).first()
    if not investor_prof:
        investor_prof = InvestorProfile(
            user_id=investor_user.id,
            firm_name="Chotanagpur Venture Fund & Angel Network",
            investor_type="Venture Capital / Impact Angel Network",
            ticket_size_min="₹5,00,000",
            ticket_size_max="₹50,00,000",
            sectors_of_interest_json=json.dumps([
                "CleanTech", "AgroTech", "Renewable Energy", "IoT & Rural Telemetry"
            ]),
            aum="₹25 Crore"
        )
        db.add(investor_prof)

    db.commit()

    # 3. Seed Project Funding for Proposals
    # Proposal 1: Affordable Drinking-Water Quality Monitoring (BIT Mesra / Khunti)
    prop1 = db.query(ProjectProposal).first()
    if prop1:
        funding1 = db.query(ProjectFunding).filter(ProjectFunding.proposal_id == prop1.id).first()
        if not funding1:
            funding1 = ProjectFunding(
                proposal_id=prop1.id,
                total_budget=180000.0,
                requested_funding=180000.0,
                amount_pledged=180000.0,
                amount_approved=180000.0,
                amount_disbursed=90000.0,
                funding_status="Disbursing",
                funding_milestones_json=json.dumps([
                    {
                        "milestone_num": 1,
                        "title": "Electrochemical Sensor Calibration & IoT Telemetry Architecture",
                        "tranche_amount": 50000.0,
                        "deliverable": "Lab-verified fluoride probe calibration report & LoRaWAN telemetry board",
                        "status": "Disbursed"
                    },
                    {
                        "milestone_num": 2,
                        "title": "Field Pilot Housing & Solar-Powered Telemetry Enclosure",
                        "tranche_amount": 40000.0,
                        "deliverable": "Ruggedized weatherproof solar telemetry units deployed at 3 borewells",
                        "status": "Disbursed"
                    },
                    {
                        "milestone_num": 3,
                        "title": "Community Handpump Installation & Village Telemetry Warning Siren",
                        "tranche_amount": 50000.0,
                        "deliverable": "Installation in Dormo village + Panchayat live warning LED siren",
                        "status": "Approved (Pending Release)"
                    },
                    {
                        "milestone_num": 4,
                        "title": "Final Outcome Verification & Youth Maintenance Handover",
                        "tranche_amount": 40000.0,
                        "deliverable": "Community water test report + certification from Gram Sabha",
                        "status": "Pending Deliverable"
                    }
                ]),
                expected_impact_json=json.dumps({
                    "community": "Safe fluoride-monitored drinking water for 4,200 villagers in Dormo & adjoining tribal hamlets.",
                    "environmental": "Prevents toxic groundwater over-extraction; real-time telemetry maps aquifer fluoride plumes.",
                    "economic": "Reduces chronic healthcare expenditure by ₹18,000/family annually due to averted fluorosis treatments.",
                    "technological": "Indigenous ultra-low-cost probe (₹3,200 per unit vs imported lab analyzers at ₹85,000)."
                }),
                documents_json=json.dumps([
                    {"name": "BIT_Mesra_Water_Proposal_Full.pdf", "type": "Technical Proposal", "url": "/docs/bit_water_proposal.pdf"},
                    {"name": "Itemized_Budget_Breakdown_₹1.80L.xlsx", "type": "Budget Sheet", "url": "/docs/budget_breakdown.xlsx"},
                    {"name": "Dormo_Field_Water_Purity_Baseline.pdf", "type": "Baseline Survey", "url": "/docs/water_baseline.pdf"}
                ])
            )
            db.add(funding1)
            db.commit()
            db.refresh(funding1)

            # Contributions for Project 1
            tata_user = db.query(User).filter(User.email == "csr@tatasteel.com").first()
            admin_user = db.query(User).filter(User.email == "admin@jharkhand.gov.in").first()

            c1 = FundingContribution(
                funding_id=funding1.id,
                funder_id=tata_user.id if tata_user else 1,
                funder_name="Tata Steel Foundation (TSF) CSR",
                funder_type="CSR Foundation",
                pledged_amount=100000.0,
                approved_amount=100000.0,
                disbursed_amount=50000.0,
                status="Disbursed",
                notes="Tranche 1 disbursed following successful lab prototype demonstration at BIT Mesra."
            )
            c2 = FundingContribution(
                funding_id=funding1.id,
                funder_id=admin_user.id if admin_user else 1,
                funder_name="Jharkhand State Innovation Council Grant",
                funder_type="Government Department",
                pledged_amount=80000.0,
                approved_amount=80000.0,
                disbursed_amount=40000.0,
                status="Disbursed",
                notes="State R&D matching grant released for hardware parts procurement and village immersion."
            )
            db.add_all([c1, c2])
            db.commit()

    # Ensure Proposals 2, 3, and 4 exist and have Funding records
    bau_inst = db.query(InstitutionalProfile).filter(InstitutionalProfile.institution_name.like("%Birsa Agricultural%")).first()
    nit_inst = db.query(InstitutionalProfile).filter(InstitutionalProfile.institution_name.like("%National Institute of Technology%")).first()
    iit_inst = db.query(InstitutionalProfile).filter(InstitutionalProfile.institution_name.like("%IIT%")).first()

    ch_list = db.query(Challenge).all()
    ch2 = ch_list[1] if len(ch_list) > 1 else None
    ch3 = ch_list[2] if len(ch_list) > 2 else None

    # Proposal 2: Solar Dryer for Mahua (BAU)
    prop2 = db.query(ProjectProposal).filter(ProjectProposal.title.like("%Solar Dryer%")).first()
    if not prop2 and ch2 and bau_inst:
        prop2 = ProjectProposal(
            challenge_id=ch2.id,
            institution_id=bau_inst.id,
            title="Hybrid Solar Greenhouse Dehydrator & Cold Storage for Minor Forest Produce",
            problem_summary=ch2.description[:250],
            technical_approach="Solar thermal airflow tunnel with phase-change thermal storage for continuous night-time dehydrating of Mahua flowers and Lac seed.",
            required_expertise_json=json.dumps(["Agro-Processing", "Solar Thermal Engineering", "Tribal SHG Mobilization"]),
            estimated_cost=120000.0,
            proposed_duration_months=5,
            status="Approved"
        )
        db.add(prop2)
        db.commit()
        db.refresh(prop2)

    if prop2:
        funding2 = db.query(ProjectFunding).filter(ProjectFunding.proposal_id == prop2.id).first()
        if not funding2:
            funding2 = ProjectFunding(
                proposal_id=prop2.id,
                total_budget=120000.0,
                requested_funding=120000.0,
                amount_pledged=120000.0,
                amount_approved=120000.0,
                amount_disbursed=60000.0,
                funding_status="Disbursing",
                funding_milestones_json=json.dumps([
                    {"milestone_num": 1, "title": "Hybrid Solar Concentrator Fabrication", "tranche_amount": 40000.0, "deliverable": "Working collector chamber", "status": "Disbursed"},
                    {"milestone_num": 2, "title": "Gumla Tribal SHG Field Deployment", "tranche_amount": 40000.0, "deliverable": "100kg batch pilot in 2 tribal villages", "status": "Approved"},
                    {"milestone_num": 3, "title": "Shelf-Life & Moisture Testing", "tranche_amount": 40000.0, "deliverable": "Quality verification certification from BAU lab", "status": "Pending"}
                ]),
                expected_impact_json=json.dumps({
                    "community": "Boosts income of 250 tribal lac & mahua collector families by 35%.",
                    "environmental": "Solar drying replaces firewood kilns, reducing local carbon emissions.",
                    "economic": "Prevents distress selling of raw produce during peak monsoon.",
                    "technological": "Low-cost hybrid solar thermal airflow design with local bamboo framing."
                }),
                documents_json=json.dumps([
                    {"name": "BAU_Solar_Dryer_Technical_Doc.pdf", "type": "Technical Proposal", "url": "/docs/bau_solar_dryer.pdf"}
                ])
            )
            db.add(funding2)
            db.commit()
            db.refresh(funding2)

            c3 = FundingContribution(
                funding_id=funding2.id,
                funder_id=csr_user.id,
                funder_name="Jharkhand Tribal Empowerment & Rural CSR Trust",
                funder_type="CSR Foundation",
                pledged_amount=120000.0,
                approved_amount=120000.0,
                disbursed_amount=60000.0,
                status="Disbursed",
                notes="Supported under Tribal Livelihoods Empowerment Program 2026."
            )
            db.add(c3)
            db.commit()

    # Proposal 3: Saranda Forest Clean Microgrid (NIT Jsr)
    prop3 = db.query(ProjectProposal).filter(ProjectProposal.title.like("%Microgrid%")).first()
    if not prop3 and ch3 and nit_inst:
        prop3 = ProjectProposal(
            challenge_id=ch3.id,
            institution_id=nit_inst.id,
            title="Decentralized DC Microgrid & Solar Water Pump with Remote Battery Telemetry",
            problem_summary=ch3.description[:250],
            technical_approach="Ruggedized 5kW DC microgrid cluster with LFP battery management and satellite-cellular hybrid telemetry.",
            required_expertise_json=json.dumps(["Renewable Power", "Battery Management", "Remote Telemetry"]),
            estimated_cost=350000.0,
            proposed_duration_months=8,
            status="Submitted"
        )
        db.add(prop3)
        db.commit()
        db.refresh(prop3)

    if prop3:
        funding3 = db.query(ProjectFunding).filter(ProjectFunding.proposal_id == prop3.id).first()
        if not funding3:
            funding3 = ProjectFunding(
                proposal_id=prop3.id,
                total_budget=350000.0,
                requested_funding=350000.0,
                amount_pledged=200000.0,
                amount_approved=0.0,
                amount_disbursed=0.0,
                funding_status="Partially Pledged",
                funding_milestones_json=json.dumps([
                    {"milestone_num": 1, "title": "Microgrid Sizing & Solar Array Procurement", "tranche_amount": 120000.0, "deliverable": "Procurement & inverter simulation", "status": "Pending"},
                    {"milestone_num": 2, "title": "Saranda Forest Village Cluster Wiring", "tranche_amount": 130000.0, "deliverable": "35 tribal homes connected to microgrid", "status": "Pending"},
                    {"milestone_num": 3, "title": "Remote Health Telemetry & Handover", "tranche_amount": 100000.0, "deliverable": "Village energy cooperative training", "status": "Pending"}
                ]),
                expected_impact_json=json.dumps({
                    "community": "24x7 electricity for 35 off-grid tribal homes and forest dispensary.",
                    "environmental": "Zero diesel generator emissions; saves 3,800 liters of diesel annually.",
                    "economic": "Enables children evening study and village smartphone charging hub.",
                    "technological": "Cloud-monitored LiFePO4 battery pack with temperature-compensated charging."
                }),
                documents_json=json.dumps([
                    {"name": "NIT_Jamshedpur_Microgrid_Proposal.pdf", "type": "Technical Proposal", "url": "/docs/nit_microgrid_proposal.pdf"}
                ])
            )
            db.add(funding3)
            db.commit()
            db.refresh(funding3)

            tata_user = db.query(User).filter(User.email == "csr@tatasteel.com").first()
            c4 = FundingContribution(
                funding_id=funding3.id,
                funder_id=tata_user.id if tata_user else 1,
                funder_name="Tata Steel Technical CSR",
                funder_type="Industry Partner",
                pledged_amount=200000.0,
                approved_amount=0.0,
                disbursed_amount=0.0,
                status="Pledged",
                notes="Pledged ₹2,00,000 pending matching state clean-energy grant co-approval."
            )
            db.add(c4)
            db.commit()

    # 4. Seed Verifiable Digital Certificates
    cert1 = db.query(RewardCertificate).filter(RewardCertificate.certificate_id == "JH-INNOV-2026-WTR-8821").first()
    if not cert1:
        cert1 = RewardCertificate(
            certificate_id="JH-INNOV-2026-WTR-8821",
            user_id=student_user.id,
            recipient_name="Amit Soren",
            recipient_role="Student Innovator (Lead Hardware & Telemetry)",
            challenge_id=ch1.id if ch1 else 1,
            proposal_id=prop1.id if prop1 else 1,
            project_title="Affordable Drinking-Water Quality Monitoring for Rural Communities in Jharkhand",
            certificate_type="Project Completion & Social Impact",
            issuing_authority="Government of Jharkhand — State Innovation Council & Dept of Higher Education",
            skills_json=json.dumps([
                "Electrochemical Sensor Calibration",
                "LoRaWAN & IoT Telemetry",
                "Embedded Systems Design",
                "Community Rural Field Testing",
                "Societal Innovation Leadership"
            ]),
            criteria_met=True,
            verification_hash="A7E9B41C2D8F90E1",
            issued_at=now - datetime.timedelta(days=5)
        )
        db.add(cert1)

    cert2 = db.query(RewardCertificate).filter(RewardCertificate.certificate_id == "JH-INNOV-2026-MNT-9104").first()
    if not cert2:
        bit_user = db.query(User).filter(User.email == "bit.mesra@jharkhand.ac.in").first()
        cert2 = RewardCertificate(
            certificate_id="JH-INNOV-2026-MNT-9104",
            user_id=bit_user.id if bit_user else 3,
            recipient_name="Dr. Ananya Roy",
            recipient_role="Faculty Mentor & Principal Investigator",
            challenge_id=ch1.id if ch1 else 1,
            proposal_id=prop1.id if prop1 else 1,
            project_title="Affordable Drinking-Water Quality Monitoring for Rural Communities in Jharkhand",
            certificate_type="Industry & Faculty Mentor Excellence",
            issuing_authority="Government of Jharkhand — State Innovation Council & Dept of Higher Education",
            skills_json=json.dumps([
                "Academic R&D Direction", "Tribal Field Immersion", "Grant Administration", "Patent Drafting"
            ]),
            criteria_met=True,
            verification_hash="C3F2D90A1E78B4A6",
            issued_at=now - datetime.timedelta(days=4)
        )
        db.add(cert2)

    db.commit()

    # 5. Seed Investor Meeting Request
    meeting1 = db.query(InvestorMeeting).first()
    if not meeting1:
        meeting1 = InvestorMeeting(
            investor_id=investor_user.id,
            investor_name="Chotanagpur Venture Fund & Angel Network",
            startup_user_id=startup_user.id,
            proposal_id=prop1.id if prop1 else 1,
            project_title="JalDrishti — Indigenous Decentralized Fluoride Water Telemetry Units",
            stage="Prototype / Field Pilot",
            ticket_size_range="₹15,00,000 - ₹25,00,000",
            pitch_deck_url="/docs/jaldrishti_seed_pitchdeck.pdf",
            status="Due Diligence",
            notes="Impacting 4,200 villagers in Khunti with strong hardware unit economics (₹3,200 unit cost). Scheduled physical meeting at Ranchi Incubation Center.",
            meeting_date=now + datetime.timedelta(days=3)
        )
        db.add(meeting1)
        db.commit()

    print("Upgraded roles, funding packages, verifiable certificates, and investor meetings seeded successfully!")
