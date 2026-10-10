import datetime
from typing import Dict, Any, List

def generate_ai_proposal_draft(
    challenge_title: str,
    challenge_description: str,
    challenge_category: str,
    challenge_district: str,
    institution_name: str
) -> Dict[str, Any]:
    """
    Generates a structured, engineering-grade research & project proposal draft
    tailored to the challenge specifics and university capabilities.
    Prominently flagged as an AI assistant draft requiring human faculty review.
    """
    now = datetime.datetime.utcnow()

    # Domain specific heuristics for technical approaches
    domain_strategies = {
        "Water Resources": {
            "approach": (
                "Deploy a community-scale decentralized purification system utilizing local adsorbent media "
                "(activated alumina/bio-sand filter for fluoride and arsenic abatement) combined with solar-powered "
                "continuous IoT water quality sensors (pH, TDS, turbidity, heavy metals) transmitting telemetry to the district portal."
            ),
            "expertise": [
                {"role": "Lead Faculty Mentor", "domain": "Environmental Engineering / Chemical Sciences"},
                {"role": "Student Tech Lead", "domain": "Embedded IoT & Microcontrollers"},
                {"role": "Field Engineer", "domain": "Civil / Water Resource Engineering"},
                {"role": "Community Liaison", "domain": "Rural Management / Social Work"}
            ],
            "cost": 175000.0,
            "duration_months": 6,
            "risks": [
                {"risk": "Seasonal groundwater table fluctuation", "mitigation": "Install dual deep/shallow aquifer probes"},
                {"risk": "Community filter maintenance neglect", "mitigation": "Form village Jal Samiti with simplified colorimetric test kits"}
            ],
            "metrics": [
                "100% compliance with WHO/BIS IS:10500 drinking water parameters",
                "Continuous telemetry uptime > 98%",
                "Daily clean water availability of at least 40 LPCD for 1,200+ villagers"
            ]
        },
        "Agriculture": {
            "approach": (
                "Design a solar-powered evaporative micro-cold storage module (Zero Energy Cool Chamber hybrid) "
                "integrated with smart temperature/humidity monitoring and local mandi SMS price forecasting for tribal produce."
            ),
            "expertise": [
                {"role": "Faculty Advisor", "domain": "Agronomy / Agricultural Engineering"},
                {"role": "Hardware Lead", "domain": "Solar Thermal & Refrigeration"},
                {"role": "Software Developer", "domain": "Mobile Web & Agro-Advisory Algorithms"}
            ],
            "cost": 220000.0,
            "duration_months": 7,
            "risks": [
                {"risk": "Power intermittency during monsoon", "mitigation": "Equip with hybrid thermal storage and battery backup"},
                {"risk": "Farmer adoption hesitation", "mitigation": "Conduct live demonstration plots with local Gram Panchayat"}
            ],
            "metrics": [
                "Reduction in post-harvest spoilage by > 45%",
                "Minimum 20% increase in realized farmer gate price"
            ]
        },
        "Healthcare": {
            "approach": (
                "Implement a low-bandwidth portable telemedicine diagnostic kit with point-of-care vital sensors, "
                "offline-first electronic health record syncing, and automated triage alerts to PHC medical officers."
            ),
            "expertise": [
                {"role": "Medical / Bio-Medical Mentor", "domain": "Community Medicine & Bio-Instrumentation"},
                {"role": "Full Stack Dev", "domain": "Offline-first Mobile Apps & HL7/FHIR Protocols"}
            ],
            "cost": 190000.0,
            "duration_months": 6,
            "risks": [
                {"risk": "Cellular network blackouts in hilly terrain", "mitigation": "Store-and-forward asynchronous data sync over SMS/packet radio"}
            ],
            "metrics": [
                "Screening coverage > 85% of target village population",
                "Average referral confirmation time reduced from 14 days to under 48 hours"
            ]
        }
    }

    strategy = domain_strategies.get(challenge_category, {
        "approach": (
            f"Develop a modular, scalable technological solution addressing the root causes identified in {challenge_district}, "
            "incorporating field telemetry, robust local materials, and participatory community training."
        ),
        "expertise": [
            {"role": "Faculty Principal Investigator", "domain": f"{challenge_category} Engineering"},
            {"role": "Student Team Lead", "domain": "Systems Prototyping & Field Testing"}
        ],
        "cost": 150000.0,
        "duration_months": 6,
        "risks": [
            {"risk": "Field deployment delays due to local logistics", "mitigation": "Partner with Block Development Officer and local youth volunteers"}
        ],
        "metrics": [
            "Measurable 50% improvement in service reliability",
            "Validated community feedback score > 4.2 / 5.0"
        ]
    })

    # Generate 4-phase milestones
    milestones = [
        {
            "milestone_number": 1,
            "title": "Site Inspection & Requirements Baseline",
            "description": f"Conduct field audit in {challenge_district}, collect baseline soil/water/infrastructure metrics, and finalize hardware specifications.",
            "target_days": 30,
            "deliverables": ["Baseline Audit Report", "System Architecture & Bill of Materials"]
        },
        {
            "milestone_number": 2,
            "title": "Laboratory Prototype Development & Calibration",
            "description": f"Fabricate prototype in {institution_name} laboratories, run stress testing and bench calibration against national standards.",
            "target_days": 90,
            "deliverables": ["Functional Lab Prototype", "Lab Calibration & Safety Test Certificate"]
        },
        {
            "milestone_number": 3,
            "title": "District Field Pilot Deployment",
            "description": f"Deploy the unit at the target site in {challenge_district}, commission IoT telemetry, and initiate 60-day live field trials.",
            "target_days": 150,
            "deliverables": ["Field Commissioning Report", "Real-Time Telemetry Dashboard Link"]
        },
        {
            "milestone_number": 4,
            "title": "Community Handover & Impact Verification",
            "description": "Train local operators, collect citizen satisfaction surveys, submit formal audit documentation to district administration.",
            "target_days": 180,
            "deliverables": ["Verified Impact Report", "Standard Operating Procedure & Training Manual"]
        }
    ]

    return {
        "title": f"Technological Intervention for {challenge_title} ({challenge_district})",
        "problem_summary": (
            f"The community in {challenge_district} faces critical challenges regarding '{challenge_title}'. "
            f"Specifically: {challenge_description[:250]}... "
            f"This proposal by {institution_name} establishes a sustainable engineering and societal framework to resolve this issue."
        ),
        "technical_approach": strategy["approach"],
        "required_expertise": strategy["expertise"],
        "estimated_cost": strategy["cost"],
        "proposed_duration_months": strategy["duration_months"],
        "proposed_milestones": milestones,
        "risks": strategy["risks"],
        "evaluation_metrics": strategy["metrics"],
        "ai_generated_note": (
            "DRAFT CREATED BY AI PROPOSAL ASSISTANT. "
            "This structured blueprint must be reviewed, adjusted, and officially submitted by the designated Faculty Mentor."
        )
    }
