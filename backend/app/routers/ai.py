import json
from typing import List, Dict, Any, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.portal_models import Challenge, InstitutionalProfile
from app.schemas.schemas import (
    AICategorizeRequest, AIDuplicateCheckRequest, AIPrioritizeRequest,
    AIMatchInstitutionsRequest, AIProposalDraftRequest, SaarthiChatRequest
)
from app.ai_services import (
    categorize_problem, detect_duplicates, calculate_priority_score,
    match_institutions_for_challenge, generate_ai_proposal_draft
)

router = APIRouter(prefix="/ai", tags=["AI Engine"])

@router.post("/categorize")
def api_categorize(req: AICategorizeRequest):
    return categorize_problem(req.text)

@router.post("/duplicates")
def api_duplicates(req: AIDuplicateCheckRequest, db: Session = Depends(get_db)):
    existing = db.query(Challenge).all()
    existing_dicts = [
        {
            "id": c.id,
            "title": c.title,
            "description": c.description,
            "district": c.district,
            "latitude": c.latitude,
            "longitude": c.longitude
        }
        for c in existing
    ]
    matches = detect_duplicates(
        new_title=req.title,
        new_description=req.description,
        new_district=req.district,
        new_lat=req.latitude,
        new_lon=req.longitude,
        existing_challenges=existing_dicts
    )
    return {"matches_count": len(matches), "matches": matches}

@router.post("/prioritize")
def api_prioritize(req: AIPrioritizeRequest):
    return calculate_priority_score(
        severity=req.severity,
        urgency=req.urgency,
        affected_population=req.affected_population,
        description=req.description,
        category=req.category,
        feasibility=req.feasibility or "Medium"
    )

@router.post("/match-institutions")
def api_match_institutions(req: AIMatchInstitutionsRequest, db: Session = Depends(get_db)):
    profiles = db.query(InstitutionalProfile).all()
    if not profiles:
        return {"matched_institutions": []}

    profile_dicts = [
        {
            "id": p.id,
            "institution_name": p.institution_name,
            "institution_type": p.institution_type,
            "domains": p.domains_json,
            "labs": p.labs_json,
            "previous_projects": p.previous_projects_json,
            "faculty_count": p.faculty_count,
            "max_capacity": p.max_capacity,
            "current_active_load": p.current_active_load
        }
        for p in profiles
    ]

    matches = match_institutions_for_challenge(
        challenge_category=req.category,
        challenge_description=req.description,
        challenge_district=req.district,
        institutional_profiles=profile_dicts,
        top_k=3
    )
    return {"matched_institutions": matches}

@router.post("/draft-proposal")
def api_draft_proposal(req: AIProposalDraftRequest, db: Session = Depends(get_db)):
    ch = db.query(Challenge).filter(Challenge.id == req.challenge_id).first()
    if not ch:
        raise HTTPException(status_code=404, detail="Challenge not found")

    inst_name = "University Innovation Team"
    if ch.assigned_institution:
        inst_name = ch.assigned_institution.institution_name

    draft = generate_ai_proposal_draft(
        challenge_title=ch.title,
        challenge_description=ch.description,
        challenge_category=ch.category,
        challenge_district=ch.district,
        institution_name=inst_name
    )
    return draft

@router.post("/saarthi-chat")
def api_saarthi_chat(req: SaarthiChatRequest, db: Session = Depends(get_db)):
    msg = (req.message or "").strip().lower()
    is_hindi = req.language == "hi"

    # 1. Warm Greetings, Welcomes & Saarthi AI Identity
    greetings = [
        "hi", "hello", "hey", "johar", "namaste", "pranam", "नमस्ते", "जोहार", "प्रणाम", "हेल्लो",
        "help", "सहायता", "start", "shuru", "शुरू", "how are you", "kaise ho", "कैसे हो",
        "saarthi", "sarathi", "सारथी", "who are you", "what are you", "what is saarthi", "about you",
        "introduce", "intro", "तुम कौन हो", "आप कौन हैं", "सारथी क्या है"
    ]
    # Check if the message is a greeting or query about Saarthi AI
    words = msg.split()
    if any(g in msg for g in ["saarthi", "sarathi", "सारथी", "who are you", "what are you", "what is saarthi", "about you", "तुम कौन हो", "आप कौन हैं", "सारथी क्या है"]) or any(g == msg or (len(words) <= 3 and g in words) for g in greetings):
        if is_hindi:
            return {
                "response": "🙏 **जोहार! मैं सारथी AI हूँ।**\n\nमैं झारखंड इनोवेशन पोर्टल का आपका द्विभाषी मार्गदर्शक हूँ। आप मुझसे निम्न के बारे में पूछ सकते हैं:\n1. 🎒 छात्र अनुसंधान व नवाचार ग्रांट (₹1.5 लाख)\n2. 💧 24 जिलों की ग्रामीण पेयजल, कृषि व स्वास्थ्य समस्याएं\n3. 📞 ग्राम वाणी वॉयस रिपोर्टिंग (बोलकर समस्या दर्ज करना)\n4. 🎁 कर्मा पॉइंट्स और कॉर्पोरेट उपहार (Goodies)\n5. 🏭 कंपनियों के लिए सीएसआर (CSR) फंड पार्टनरशिप\n\nबताएं, आज मैं आपकी क्या सहायता कर सकता हूँ?",
                "action": {"label": "सभी चुनौतियां देखें", "path": "/challenges"},
                "is_irrelevant": False
            }
        else:
            return {
                "response": "🙏 **Johar & Hello! I am सारथी AI (Saarthi AI).**\n\nI am your civic innovation guide for the Jharkhand Innovation Portal. I can help you with:\n1. 🎒 ₹1.5 Lakh Student Innovation & Prototype Grants\n2. 💧 Grassroots Challenges across Jharkhand's 24 Districts\n3. 📞 Gram Vaani Voice Problem Intake (Voice Recording & IVR)\n4. 🎁 Redeeming Karma Points for Goodies\n5. 🏭 Corporate CSR & Industry Sponsorships\n\nHow can I assist your innovation journey today?",
                "action": {"label": "Explore Challenges", "path": "/challenges"},
                "is_irrelevant": False
            }

    # 2. Grant / Funding / Budget query
    if any(k in msg for k in ["grant", "1.5", "lakh", "fund", "money", "budget", "finance", "seed", "milestone", "pledge", "disburse", "capital", "ग्रांट", "रुपये", "पैसे", "फंड", "बजट", "अनुदान", "धनराशि"]):
        if is_hindi:
            return {
                "response": "### ₹1.5 लाख छात्र अनुसंधान और नवाचार ग्रांट की प्रक्रिया\n\n1. **समस्या का चयन करें**: झारखंड के 24 जिलों में से किसी भी सत्यापित ग्रामीण समस्या को चुनें।\n2. **फैकल्टी मेंटर**: बीआईटी मेसरा, आईआईटी धनबाद, एनआईटी जमशेदपुर या रांची विश्वविद्यालय के प्रोफेसर के साथ टीम बनाएं।\n3. **चरणबद्ध भुगतान (Milestone-based)**:\n   - **पहला चरण (30% - ₹45,000)**: सेंसर और उपकरण खरीद।\n   - **दूसरा चरण (40% - ₹60,000)**: लैब में प्रोटोटाइप तैयार करना।\n   - **तीसरा चरण (30% - ₹45,000)**: गांव में फील्ड टेस्टिंग और डेटा लाइव करना।\n\nटाटा स्टील फाउंडेशन जैसी कंपनियां इसे सीएसआर फंड से सीधे सहायता देती हैं।",
                "action": {"label": "फंडिंग मार्केटप्लेस देखें", "path": "/funding"},
                "is_irrelevant": False
            }
        else:
            return {
                "response": "### ₹1.5 Lakh Student Innovation Grant Process\n\n1. **Select a Grassroots Challenge**: Pick a verified rural problem from any of Jharkhand's 24 districts.\n2. **Faculty Co-Pilot**: Form a team with an approved faculty mentor from BIT Mesra, IIT (ISM) Dhanbad, NIT Jamshedpur, BAU, or Ranchi University.\n3. **Milestone-Based Disbursement**:\n   - **Milestone 1 (30% - ₹45,000)**: Sensor & hardware procurement.\n   - **Milestone 2 (40% - ₹60,000)**: Lab assembly & IoT calibration.\n   - **Milestone 3 (30% - ₹45,000)**: Village field deployment & telemetry validation.\n\nFunds are pledged by CSR sponsors (like Tata Steel Foundation) and disbursed directly upon mentor & district SPOC verification.",
                "action": {"label": "Explore Funding Marketplace", "path": "/funding"},
                "is_irrelevant": False
            }

    # 3. Water / Khunti / Districts / Rural crises query
    if any(k in msg for k in ["water", "khunti", "gumla", "bokaro", "challenge", "district", "problem", "rural", "village", "fluoride", "arsenic", "cold storage", "health", "telemedicine", "crop", "agriculture", "farmer", "solar", "energy", "pollution", "mining", "road", "sanitize", "waste", "dhanbad", "ranchi", "jamshedpur", "chaibasa", "dumka", "deoghar", "जल", "पानी", "खूंटी", "गुमला", "बोकारो", "चुनौती", "समस्या", "गांव", "फ्लोराइड", "आर्सेनिक", "स्वास्थ्य", "किसान", "बिजली", "कचरा", "जिला", "धनबाद", "रांची", "कृषि"]):
        if is_hindi:
            return {
                "response": "### खूंटी जिले में पेयजल एवं स्वास्थ्य संबंधी चुनौतियाँ\n\n- **दोरमो गांव**: बोरवेल में फ्लोराइड की भारी मात्रा थी। बीआईटी मेसरा की छात्र टीम ने आईओटी (IoT) फिल्टर लगाकर 2,400 ग्रामीणों को स्वच्छ पानी उपलब्ध कराया।\n- **मुरहू ब्लॉक**: मौसमी जलधाराओं के पास आर्सेनिक की समस्या। वर्तमान में इसके लिए सस्ते सोखक (adsorbent) फिल्टर की आवश्यकता है।\n- **तोरपा**: सौर ऊर्जा से चलने वाले ऑटोमैटिक टर्बिडिटी सेंसर की मांग।\n\nआप पोर्टल पर जल, कृषि, स्वास्थ्य और ऊर्जा श्रेणियों में सभी जिलों की समस्याएं देख सकते हैं।",
                "action": {"label": "सभी 24 जिलों की चुनौतियां देखें", "path": "/challenges"},
                "is_irrelevant": False
            }
        else:
            return {
                "response": "### Khunti District Water & Health Challenges\n\n- **Dormo Village**: Severe fluoride contamination in borewells causing fluorosis. Successfully solved by BIT Mesra students with continuous telemetry filtration!\n- **Murhu Block**: High arsenic runoff near seasonal stream handpumps. Active open challenge seeking low-cost chemical adsorbent filters.\n- **Torpa Sub-Division**: Lack of automated turbidity sensing for gravity-fed pipeline water.\n\nYou can view all 24 district challenges categorized by Water, Agriculture, Healthcare, and Energy.",
                "action": {"label": "View 24 District Challenges", "path": "/challenges"},
                "is_irrelevant": False
            }

    # 4. Goodies & Rewards & Points query
    if any(k in msg for k in ["goodie", "point", "reward", "redeem", "backpack", "hoodie", "power bank", "headphone", "flask", "gift", "certificate", "karma", "voucher", "store", "उपहार", "पॉइंट", "रिवॉर्ड", "बैकपैक", "टी-शर्ट", "बॉटल", "वाउचर", "प्रमाण पत्र", "स्टोर"]):
        if is_hindi:
            return {
                "response": "### उपहार स्टोर और कर्मा पॉइंट्स (Goodies Store)\n\n- ग्रामीण समस्याओं को हल करने और फील्ड माइलस्टोन पूरा करने पर कर्मा पॉइंट्स मिलते हैं।\n- **उपलब्ध उपहार**:\n  - 🎒 एंटी-थेफ्ट वाटर-रेसिस्टेंट लैपटॉप बैकपैक (850 पॉइंट्स)\n  - ⚡ 20,000mAh सोलर पावर बैंक (1,200 पॉइंट्स)\n  - 🎧 नॉइज़-कैंसलिंग हेडफ़ोन (1,500 पॉइंट्स)\n  - 👕 ऑर्गेनिक कॉटन टेक हुडी (650 पॉइंट्स)\n  - 🏷️ इंसुलेटेड स्टेनलेस स्टील बॉटल (450 पॉइंट्स)\n- **डिलीवरी**: आपके विश्वविद्यालय कैंपस (बीआईटी मेसरा, धनबाद, एनआईटी) या घर के पते पर सीधे कूरियर वाउचर के साथ भेजा जाता है।",
                "action": {"label": "उपहार स्टोर (Goodies) खोलें", "path": "/rewards"},
                "is_irrelevant": False
            }
        else:
            return {
                "response": "### Goodies Store & Karma Rewards\n\n- Earn Karma Points by submitting verified rural solutions, achieving field milestones, and community ratings.\n- **Available Goodies**:\n  - 🎒 Anti-Theft Water-Resistant Laptop Backpack (850 pts)\n  - ⚡ 20,000mAh Solar Power Bank (1,200 pts)\n  - 🎧 ANC Field Noise-Cancelling Headphones (1,500 pts)\n  - 👕 Organic Cotton Tech Hoodie (650 pts)\n  - 🏷️ Stainless Steel Insulated Flask (450 pts)\n- **Pickup Options**: Free dispatch to your university campus (BIT Mesra, IIT ISM, NIT) or direct courier to your residence with tracking voucher.",
                "action": {"label": "Open Goodies Store", "path": "/rewards"},
                "is_irrelevant": False
            }

    # 5. Voice Problem Intake / Gram Vaani query
    if any(k in msg for k in ["voice", "gram vaani", "speak", "audio", "ivr", "phone", "call", "toll", "record", "bhashini", "whisper", "dial", "आवाज़", "वाणी", "बोलकर", "कॉल", "टोल", "रिकॉर्ड", "भाषा"]):
        if is_hindi:
            return {
                "response": "### ग्राम वाणी वॉयस प्रॉब्लम रिपोर्टिंग (वॉयस इनटेक)\n\n- दूर-दराज के ग्रामीण बिना टाइप किए केवल अपनी आवाज़ में समस्या रिकॉर्ड कर सकते हैं। टोल-फ्री नंबर `1800-890-JHAR` पर कॉल करके भी समस्या दर्ज की जा सकती है।\n- भाषाएं: हिन्दी, नागपुरी, संथाली, मुंडारी, हो, कुडुख।\n- हमारा एआई सिस्टम आवाज़ को टेक्स्ट में बदलकर, स्थान (GPS) पहचानता है और उपयुक्त विश्वविद्यालय इंजीनियरिंग टीम को असाइन करता है।",
                "action": {"label": "वॉयस रिपोर्टिंग आजमाएं", "path": "/submit"},
                "is_irrelevant": False
            }
        else:
            return {
                "response": "### Gram Vaani Voice Problem Intake (IVR & Web Voice)\n\n- Villagers in remote areas without smartphones or typing skills can report local issues by speaking directly into the portal or calling the toll-free IVR number `1800-890-JHAR`.\n- Supported languages: Hindi, Nagpuri, Santhali, Mundari, Ho, Kurukh.\n- Our automated AI voice engine transcribes spoken audio, extracts GPS coordinates, detects duplicates, assigns priority, and routes the ticket to the nearest university innovation lab.",
                "action": {"label": "Try Voice Problem Intake", "path": "/submit"},
                "is_irrelevant": False
            }

    # 6. CSR / Industry / Startups / Institutions query
    if any(k in msg for k in ["csr", "industry", "company", "sponsor", "tata", "cmpdi", "sail", "investor", "startup", "pitch", "mentor", "bit mesra", "iit", "nit", "bau", "ranchi univ", "partner", "सीएसआर", "कंपनी", "उद्योग", "निवेशक", "स्टार्टअप", "मेसरा", "धनबाद", "पार्टनर"]):
        if is_hindi:
            return {
                "response": "### कॉर्पोरेट सीएसआर (CSR) और उद्योग साझेदारी\n\n- उद्योग (टाटा स्टील फाउंडेशन, सीएमपीडीआई, सेल) छात्र प्रोटोटाइप के लिए कंपनी एक्ट सेक्शन 135 के तहत सीएसआर अनुदान दे सकते हैं।\n- लाभ:\n  - आयकर छूट (Section 80G / CSR).\n  - सीधा रियल-टाइम आईओटी डेटा (जैसे कितने लीटर शुद्ध जल दिया गया, कितने किसानों की फसल बची).\n  - लगाए गए उपकरणों और ग्राम केंद्रों पर कंपनी की ब्रांडिंग।",
                "action": {"label": "सीएसआर डैशबोर्ड देखें", "path": "/csr"},
                "is_irrelevant": False
            }
        else:
            return {
                "response": "### Corporate CSR & Industry Co-Pilot\n\n- Corporate entities (Tata Steel Foundation, CMPDI, SAIL, Jindal) can pledge CSR Section 135 capital towards high-impact student prototypes.\n- Direct benefits:\n  - 100% Tax exemption under Section 80G/CSR norms.\n  - Real-time IoT telemetric impact dashboard (e.g., liters of clean water provided, kilograms of tribal crops saved).\n  - Co-branding on deployed hardware and village demonstration centers.",
                "action": {"label": "View CSR Dashboard & Guidelines", "path": "/csr"},
                "is_irrelevant": False
            }

    # 7. Portal Usage / Authentication / Roles / UI Features
    if any(k in msg for k in ["login", "register", "signup", "signin", "account", "dashboard", "dark", "light", "theme", "language", "citizen", "student", "admin", "portal", "jharinnovate", "password", "लॉगइन", "साइनअप", "खाता", "रजिस्टर", "थीम", "पोर्टल", "डैशबोर्ड"]):
        if is_hindi:
            return {
                "response": "### पोर्टल सुविधाएं एवं नेविगेशन\n\n- **लॉगिन/रजिस्ट्रेशन**: टॉप नेविगेशन बार में 'Login' बटन पर क्लिक करके अपने रोल (नागरिक, छात्र, विश्वविद्यालय, सीएसआर आदि) के अनुसार लॉगिन करें।\n- **थीम (Light/Dark)**: टॉप बार में ☀️/🌙 बटन से लाइट और डार्क मोड बदलें।\n- **भाषा**: 'हिन्दी | EN' बटन से किसी भी समय भाषा बदल सकते हैं।",
                "action": {"label": "लॉगिन पेज पर जाएं", "path": "/login"},
                "is_irrelevant": False
            }
        else:
            return {
                "response": "### Portal Features & Navigation\n\n- **Login / Register**: Click the 'Login' button in the top navbar to sign in as Citizen, Student Lead, University Faculty, CSR Foundation, or Admin.\n- **Light / Dark Mode**: Toggle using the ☀️/🌙 button in the header.\n- **Language Switcher**: Seamlessly switch between English and हिन्दी anytime.",
                "action": {"label": "Go to Login Page", "path": "/login"},
                "is_irrelevant": False
            }

    # 8. EXPLICITLY IRRELEVANT QUERY HANDLER
    # If the user asks about cricket, movies, jokes, external homework, coding puzzles, random chit-chat, gossip, etc.
    if is_hindi:
        return {
            "response": "⚠️ **यह प्रश्न इस पोर्टल के लिए असंगत (Irrelevant) है।**\n\nमैं **सारथी AI** हूँ — केवल **झारखंड इनोवेशन पोर्टल (JharInnovate)** के लिए समर्पित सहायक।\n\nमैं सामान्य बातचीत, मनोरंजन, खेल, बाहरी कोडिंग या व्यक्तिगत विषयों पर चर्चा नहीं करता। मैं आपकी केवल इन विषयों में सहायता कर सकता हूँ:\n- 🎒 छात्र अनुसंधान व प्रोटोटाइप ग्रांट्स (₹1.5 लाख)\n- 💧 24 जिलों की ग्रामीण समस्याएं (पेयजल, कृषि, स्वास्थ्य, ऊर्जा)\n- 📞 ग्राम वाणी वॉयस से समस्या दर्ज करना\n- 🎁 कर्मा पॉइंट्स और गुड्डीज (Goodies Store)\n- 🏭 कंपनियों के सीएसआर (CSR) फंड्स\n\n👉 *कृपया झारखंड की जमीनी समस्याओं या पोर्टल से संबंधित प्रश्न पूछें।*",
            "action": {"label": "24 जिलों की चुनौतियां देखें", "path": "/challenges"},
            "is_irrelevant": True
        }
    else:
        return {
            "response": "⚠️ **This query is irrelevant to the Jharkhand Societal Innovation Portal.**\n\nI am **सारथी AI**, dedicated exclusively to civic innovation, student research grants, and rural problem-solving across Jharkhand.\n\nI do not provide assistance on general entertainment, sports, external coding puzzles, homework, or unrelated chatter. I can assist you with:\n- 🎒 ₹1.5 Lakh Student Innovation & Prototype Grants\n- 💧 Grassroots Challenges across Jharkhand's 24 Districts\n- 📞 Gram Vaani Voice Problem Intake (Voice Recording & IVR)\n- 🎁 Karma Points & Goodies Store Redemption\n- 🏭 Corporate CSR Funding & University Mentorship\n\n👉 *Please ask a question related to Jharkhand's civic challenges or portal features.*",
            "action": {"label": "Explore 24 District Challenges", "path": "/challenges"},
            "is_irrelevant": True
        }


