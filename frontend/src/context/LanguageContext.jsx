import React, { createContext, useContext, useState, useEffect } from 'react';

const translations = {
  en: {
    // Header & Gov branding
    govt_title: "Government of Jharkhand",
    govt_subtitle: "झारखंड सरकार",
    portal_badge: "Official State Innovation Portal",
    active_persona: "Active Persona",
    portal_name: "Jharkhand Innovation Portal",
    portal_tagline: "JharInnovate: Community to Impact",

    // Nav links
    nav_home: "Home",
    nav_problems: "View Problems",
    nav_funding: "Funding",
    nav_rewards: "Rewards & Goodies",
    nav_achievements: "Village Impact Stories",
    nav_analytics: "Impact & GIS Map",
    nav_demo: "End-to-End Demo",
    nav_report_issue: "+ Report Issue",
    nav_dashboard: "Dashboard",
    nav_sponsor_benefits: "Sponsor Benefits",
    nav_all_roles: "🎭 All 8 Roles",
    nav_select_persona: "Select Stakeholder Persona",

    // Roles
    role_citizen: "🧑‍🌾 Citizen",
    role_student: "🎒 Student Lead",
    role_university: "🎓 University",
    role_startup: "🚀 Startup",
    role_industry: "🏭 Industry Partner",
    role_csr: "💚 CSR Foundation",
    role_investor: "💼 Angel / VC",
    role_admin: "🏛️ Govt Admin",

    // Voice Reporter (Gram Vaani)
    gv_title: "Gram Vaani (ग्राम वाणी) Rural Voice Problem Reporter",
    gv_subtitle: "Empowering rural citizens across 24 districts to speak in Hindi or regional dialects. Live AI auto-transcribes, extracts GPS, and routes directly to engineering teams.",
    gv_record_btn: "Hold or Tap to Record Problem",
    gv_recording_active: "Listening to your voice... Speak your village issue",
    gv_stop_btn: "Stop Recording & Transcribe",
    gv_sample_title: "Or try a pre-recorded village voice sample:",
    gv_sample_water: "💧 Dormo Village (Khunti) - High Fluoride Handpump Water Crisis",
    gv_sample_mahua: "🌿 Gumla District - Mahua Flower Post-Harvest Spoilage",
    gv_sample_power: "⚡ Saranda Forest (West Singhbhum) - Unreliable Cold Chain for Health Subcenter",
    gv_transcribing: "AI Transcribing Voice Audio via Bhashini / Whisper...",
    gv_transcribed_success: "Voice Transcribed Successfully!",
    gv_auto_fill_btn: "Auto-Fill Form & Run AI Triage",
    gv_listening_status: "Voice input recorded: ",

    // Goodies & Points
    points_title: "Student Impact Points & Goodies Store",
    points_badge: "Verified Community Solver Rewards",
    points_balance: "Your Impact Balance",
    points_earned: "Points Earned",
    points_redeem: "Redeem for Goodies",
    points_history: "Points Ledger & Activity",
    points_shipping: "Direct Delivery to University / Village Address",
    points_voucher_success: "Redemption Successful! Dispatch Code Generated",

    // Achievements
    achievements_badge: "Real-World Ground Truth",
    achievements_title: "Grassroots Village Impact & Student Achievements",
    achievements_subtitle: "Witness how engineering student teams & researchers from Jharkhand universities solved actual rural crises reported by citizens, delivering measurable before-and-after results.",
    achievements_filter_all: "All Districts",
    achievements_solved_by: "Solved by Team",
    achievements_village: "Village & District",
    achievements_problem: "Grassroots Crisis",
    achievements_solution: "Engineered Solution",
    achievements_metrics: "Measurable Impact Results",
    achievements_rewards: "Rewards & Goodies Awarded",
    achievements_before: "Before Intervention",
    achievements_after: "After Solution Implemented",

    // General UI
    view_details: "View Details",
    status_verified: "Govt Verified",
    status_active: "Active Deployment",
    status_resolved: "100% Resolved",
    apply_grant: "Apply for Grant",
    sponsor_project: "Sponsor Project",
    pts: "Pts",
    redeem_btn: "Redeem Now",
    insufficient_pts: "Insufficient Points",
    filter_all: "All Categories",
    search_placeholder: "Search by keyword, district, or domain..."
  },
  hi: {
    // Header & Gov branding
    govt_title: "झारखंड सरकार",
    govt_subtitle: "Government of Jharkhand",
    portal_badge: "आधिकारिक राज्य नवाचार पोर्टल",
    active_persona: "सक्रिय भूमिका",
    portal_name: "झारखंड इनोवेशन पोर्टल",
    portal_tagline: "झार-इनोवेट: समुदाय से प्रभाव तक",

    // Nav links
    nav_home: "होम",
    nav_problems: "समस्याएं देखें",
    nav_funding: "परियोजना फंडिंग",
    nav_rewards: "पुरस्कार एवं उपहार",
    nav_achievements: "ग्रामीण प्रभाव गाथाएं",
    nav_analytics: "प्रभाव एवं जीआईएस मानचित्र",
    nav_demo: "समाधान डेमो",
    nav_report_issue: "+ समस्या दर्ज करें",
    nav_dashboard: "डैशबोर्ड",
    nav_sponsor_benefits: "प्रायोजक लाभ",
    nav_all_roles: "🎭 सभी 8 भूमिकाएं",
    nav_select_persona: "हितधारक भूमिका चुनें",

    // Roles
    role_citizen: "🧑‍🌾 नागरिक",
    role_student: "🎒 छात्र दल",
    role_university: "🎓 विश्वविद्यालय",
    role_startup: "🚀 स्टार्टअप",
    role_industry: "🏭 उद्योग भागीदार",
    role_csr: "💚 सीएसआर फाउंडेशन",
    role_investor: "💼 निवेशक / वीसी",
    role_admin: "🏛️ सरकारी प्रशासन",

    // Voice Reporter (Gram Vaani)
    gv_title: "ग्राम वाणी - ग्रामीण स्वर समस्या रिपोर्टर",
    gv_subtitle: "झारखंड के सभी 24 जिलों के ग्रामीण नागरिकों को हिंदी व क्षेत्रीय बोलियों में अपनी समस्या बोलकर दर्ज करने की सुविधा। एआई स्वतः पाठ में बदलता है, जीपीएस निकालता है और सीधे इंजीनियरिंग टीमों तक पहुँचाता है।",
    gv_record_btn: "समस्या बोलने के लिए दबाएं या टैप करें",
    gv_recording_active: "आपकी आवाज़ सुनी जा रही है... अपनी समस्या बताएं",
    gv_stop_btn: "रिकॉर्डिंग रोकें और पाठ में बदलें",
    gv_sample_title: "या पूर्व-रिकॉर्डेड ग्रामीण आवाज़ का नमूना चुनें:",
    gv_sample_water: "💧 डोरमो गांव (खूंटी) - चापाकल के पानी में फ्लोराइड का संकट",
    gv_sample_mahua: "🌿 गुमला जिला - महुआ फूल की कटाई के बाद खराब होने की समस्या",
    gv_sample_power: "⚡ सारंडा वन (प. सिंहभूम) - स्वास्थ्य उपकेंद्र में कोल्ड चेन की बिजली विफलता",
    gv_transcribing: "भाषिणी / विस्पर एआई द्वारा आवाज़ का विश्लेषण किया जा रहा है...",
    gv_transcribed_success: "आवाज़ सफलतापूर्वक पाठ (Text) में रूपांतरित!",
    gv_auto_fill_btn: "फ़ॉर्म में भरें और एआई जांच चलाएं",
    gv_listening_status: "रिकॉर्ड की गई आवाज़: ",

    // Goodies & Points
    points_title: "छात्र प्रभाव अंक (Impact Points) एवं उपहार स्टोर",
    points_badge: "सत्यापित समाधानकर्ता पुरस्कार प्रणाली",
    points_balance: "आपके उपलब्ध प्रभाव अंक",
    points_earned: "कुल अर्जित अंक",
    points_redeem: "उपहारों के लिए रिडीम करें",
    points_history: "अंक खाता बही एवं इतिहास",
    points_shipping: "विश्वविद्यालय / गांव के पते पर सीधी डिलीवरी",
    points_voucher_success: "रिडेम्पशन सफल! डिस्पैच वाउचर कोड उत्पन्न हुआ",

    // Achievements
    achievements_badge: "जमीनी हकीकत और परिणाम",
    achievements_title: "ग्रामीण समस्याएं, छात्र समाधान और प्रभाव गाथाएं",
    achievements_subtitle: "देखें कैसे झारखंड के इंजीनियरिंग छात्रों और शोधकर्ताओं ने ग्रामीणों द्वारा दर्ज समस्याओं का तकनीकी समाधान किया और पुरस्कार प्राप्त किए।",
    achievements_filter_all: "सभी जिले",
    achievements_solved_by: "समाधानकर्ता टीम",
    achievements_village: "गांव एवं जिला",
    achievements_problem: "जमीनी समस्या",
    achievements_solution: "इंजीनियरिंग समाधान",
    achievements_metrics: "मापने योग्य परिणाम",
    achievements_rewards: "प्राप्त पुरस्कार एवं कॉर्पोरेट उपहार",
    achievements_before: "समाधान से पूर्व स्थिति",
    achievements_after: "समाधान लागू होने के बाद",

    // General UI
    view_details: "विवरण देखें",
    status_verified: "सरकार द्वारा सत्यापित",
    status_active: "सक्रिय रूप से तैनात",
    status_resolved: "100% समाधानित",
    apply_grant: "अनुदान के लिए आवेदन करें",
    sponsor_project: "परियोजना प्रायोजित करें",
    pts: "अंक",
    redeem_btn: "अभी रिडीम करें",
    insufficient_pts: "अंक अपर्याप्त हैं",
    filter_all: "सभी श्रेणियां",
    search_placeholder: "कीवर्ड, जिला या श्रेणी द्वारा खोजें..."
  }
};

const LanguageContext = createContext({
  lang: 'en',
  setLang: () => {},
  toggleLang: () => {},
  t: (key) => key
});

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('jharkhand_portal_lang') || 'en';
  });

  useEffect(() => {
    localStorage.setItem('jharkhand_portal_lang', lang);
  }, [lang]);

  const toggleLang = () => {
    setLang(prev => (prev === 'en' ? 'hi' : 'en'));
  };

  const t = (key, fallback) => {
    if (translations[lang] && translations[lang][key]) {
      return translations[lang][key];
    }
    if (translations.en && translations.en[key]) {
      return translations.en[key];
    }
    return fallback !== undefined ? fallback : key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang, t, isHindi: lang === 'hi' }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
