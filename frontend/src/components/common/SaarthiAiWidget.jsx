import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bot,
  Sparkles,
  X,
  Send,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  RotateCcw,
  ExternalLink,
  ChevronDown,
  Layers,
  HelpCircle,
  Award,
  DollarSign,
  MapPin,
  Flame,
  CheckCircle2
} from 'lucide-react';
import { api } from '../../services/api';

const QUICK_PROMPTS = [
  {
    en: "How do I get a ₹1.5L student innovation grant?",
    hi: "मुझे ₹1.5 लाख का इनोवेशन ग्रांट कैसे मिलेगा?",
    category: "funding"
  },
  {
    en: "Show water challenges in Khunti district",
    hi: "खूंटी जिले में पेयजल की समस्याएं दिखाएं",
    category: "challenges"
  },
  {
    en: "How to redeem Karma points for goodies?",
    hi: "कर्मा पॉइंट्स से उपहार (Goodies) कैसे रिडीम करें?",
    category: "rewards"
  },
  {
    en: "How does Gram Vaani voice problem intake work?",
    hi: "ग्राम वाणी वॉयस से समस्या कैसे दर्ज करें?",
    category: "voice"
  },
  {
    en: "How can CSR partners fund university prototypes?",
    hi: "कंपनियां सीएसआर (CSR) फंड कैसे प्रदान कर सकती हैं?",
    category: "csr"
  }
];

// Offline comprehensive fallback knowledge base in Hindi and English
const SMART_RESPONSES = {
  funding: {
    en: {
      text: "### ₹1.5 Lakh Student Innovation Grant Process\n\n1. **Select a Grassroots Challenge**: Pick a verified rural problem from any of Jharkhand's 24 districts.\n2. **Faculty Co-Pilot**: Form a team with an approved faculty mentor from BIT Mesra, IIT (ISM) Dhanbad, NIT Jamshedpur, BAU, or Ranchi University.\n3. **Milestone-Based Disbursement**:\n   - **Milestone 1 (30% - ₹45,000)**: Sensor & hardware procurement.\n   - **Milestone 2 (40% - ₹60,000)**: Lab assembly & IoT calibration.\n   - **Milestone 3 (30% - ₹45,000)**: Village field deployment & telemetry validation.\n\nFunds are pledged by CSR sponsors (like Tata Steel Foundation) and disbursed directly upon mentor & district SPOC verification.",
      action: { label: "Explore Funding Marketplace", path: "/funding" }
    },
    hi: {
      text: "### ₹1.5 लाख छात्र अनुसंधान और नवाचार ग्रांट की प्रक्रिया\n\n1. **समस्या का चयन करें**: झारखंड के 24 जिलों में से किसी भी सत्यापित ग्रामीण समस्या को चुनें।\n2. **फैकल्टी मेंटर**: बीआईटी मेसरा, आईआईटी धनबाद, एनआईटी जमशेदपुर या रांची विश्वविद्यालय के प्रोफेसर के साथ टीम बनाएं।\n3. **चरणबद्ध भुगतान (Milestone-based)**:\n   - **पहला चरण (30% - ₹45,000)**: सेंसर और उपकरण खरीद।\n   - **दूसरा चरण (40% - ₹60,000)**: लैब में प्रोटोटाइप तैयार करना।\n   - **तीसरा चरण (30% - ₹45,000)**: गांव में फील्ड टेस्टिंग और डेटा लाइव करना।\n\nटाटा स्टील फाउंडेशन जैसी कंपनियां इसे सीएसआर फंड से सीधे सहायता देती हैं।",
      action: { label: "फंडिंग मार्केटप्लेस देखें", path: "/funding" }
    }
  },
  challenges: {
    en: {
      text: "### Khunti District Water & Health Challenges\n\n- **Dormo Village**: Severe fluoride contamination in borewells causing fluorosis. Successfully solved by BIT Mesra students with continuous telemetry filtration!\n- **Murhu Block**: High arsenic runoff near seasonal stream handpumps. Active open challenge seeking low-cost chemical adsorbent filters.\n- **Torpa Sub-Division**: Lack of automated turbidity sensing for gravity-fed pipeline water.\n\nYou can view all 24 district challenges categorized by Water, Agriculture, Healthcare, and Energy.",
      action: { label: "View 24 District Challenges", path: "/challenges" }
    },
    hi: {
      text: "### खूंटी जिले में पेयजल एवं स्वास्थ्य संबंधी चुनौतियाँ\n\n- **दोरमो गांव**: बोरवेल में फ्लोराइड की भारी मात्रा थी। बीआईटी मेसरा की छात्र टीम ने आईओटी (IoT) फिल्टर लगाकर 2,400 ग्रामीणों को स्वच्छ पानी उपलब्ध कराया।\n- **मुरहू ब्लॉक**: मौसमी जलधाराओं के पास आर्सेनिक की समस्या। वर्तमान में इसके लिए सस्ते सोखक (adsorbent) फिल्टर की आवश्यकता है।\n- **तोरपा**: सौर ऊर्जा से चलने वाले ऑटोमैटिक टर्बिडिटी सेंसर की मांग।\n\nआप पोर्टल पर जल, कृषि, स्वास्थ्य और ऊर्जा श्रेणियों में सभी जिलों की समस्याएं देख सकते हैं।",
      action: { label: "सभी 24 जिलों की चुनौतियां देखें", path: "/challenges" }
    }
  },
  rewards: {
    en: {
      text: "### Goodies Store & Karma Rewards\n\n- Earn Karma Points by submitting verified rural solutions, achieving field milestones, and community ratings.\n- **Available Goodies**:\n  - 🎒 Anti-Theft Water-Resistant Laptop Backpack (850 pts)\n  - ⚡ 20,000mAh Solar Power Bank (1,200 pts)\n  - 🎧 ANC Field Noise-Cancelling Headphones (1,500 pts)\n  - 👕 Organic Cotton Tech Hoodie (650 pts)\n  - 🏷️ Stainless Steel Insulated Flask (450 pts)\n- **Pickup Options**: Free dispatch to your university campus (BIT Mesra, IIT ISM, NIT) or direct courier to your residence with tracking voucher.",
      action: { label: "Open Goodies Store", path: "/rewards" }
    },
    hi: {
      text: "### उपहार स्टोर और कर्मा पॉइंट्स (Goodies Store)\n\n- ग्रामीण समस्याओं को हल करने और फील्ड माइलस्टोन पूरा करने पर कर्मा पॉइंट्स मिलते हैं।\n- **उपलब्ध उपहार**:\n  - 🎒 एंटी-थेफ्ट वाटर-रेसिस्टेंट लैपटॉप बैकपैक (850 पॉइंट्स)\n  - ⚡ 20,000mAh सोलर पावर बैंक (1,200 पॉइंट्स)\n  - 🎧 नॉइज़-कैंसलिंग हेडफ़ोन (1,500 पॉइंट्स)\n  - 👕 ऑर्गेनिक कॉटन टेक हुडी (650 पॉइंट्स)\n  - 🏷️ इंसुलेटेड स्टेनलेस स्टील बॉटल (450 पॉइंट्स)\n- **डिलीवरी**: आपके विश्वविद्यालय कैंपस (बीआईटी मेसरा, धनबाद, एनआईटी) या घर के पते पर सीधे कूरियर वाउचर के साथ भेजा जाता है।",
      action: { label: "उपहार स्टोर (Goodies) खोलें", path: "/rewards" }
    }
  },
  voice: {
    en: {
      text: "### Gram Vaani Voice Problem Intake (IVR & Web Voice)\n\n- Villagers in remote areas without smartphones or typing skills can report local issues by speaking directly into the portal or calling the toll-free IVR number `1800-890-JHAR`.\n- Supported languages: Hindi, Nagpuri, Santhali, Mundari, Ho, Kurukh.\n- Our automated AI voice engine transcribes spoken audio, extracts GPS coordinates, detects duplicates, assigns priority, and routes the ticket to the nearest university innovation lab.",
      action: { label: "Try Voice Problem Intake", path: "/submit" }
    },
    hi: {
      text: "### ग्राम वाणी वॉयस प्रॉब्लम रिपोर्टिंग (वॉयस इनटेक)\n\n- दूर-दराज के ग्रामीण बिना टाइप किए केवल अपनी आवाज़ में समस्या रिकॉर्ड कर सकते हैं। टोल-फ्री नंबर `1800-890-JHAR` पर कॉल करके भी समस्या दर्ज की जा सकती है।\n- भाषाएं: हिन्दी, नागपुरी, संथाली, मुंडारी, हो, कुडुख।\n- हमारा एआई सिस्टम आवाज़ को टेक्स्ट में बदलकर, स्थान (GPS) पहचानता है और उपयुक्त विश्वविद्यालय इंजीनियरिंग टीम को असाइन करता है।",
      action: { label: "वॉयस रिपोर्टिंग आजमाएं", path: "/submit" }
    }
  },
  csr: {
    en: {
      text: "### Corporate CSR & Industry Co-Pilot\n\n- Corporate entities (Tata Steel Foundation, CMPDI, SAIL, Jindal) can pledge CSR Section 135 capital towards high-impact student prototypes.\n- Direct benefits:\n  - 100% Tax exemption under Section 80G/CSR norms.\n  - Real-time IoT telemetric impact dashboard (e.g., liters of clean water provided, kilograms of tribal crops saved).\n  - Co-branding on deployed hardware and village demonstration centers.",
      action: { label: "View CSR Dashboard & Guidelines", path: "/csr" }
    },
    hi: {
      text: "### कॉर्पोरेट सीएसआर (CSR) और उद्योग साझेदारी\n\n- उद्योग (टाटा स्टील फाउंडेशन, सीएमपीडीआई, सेल) छात्र प्रोटोटाइप के लिए कंपनी एक्ट सेक्शन 135 के तहत सीएसआर अनुदान दे सकते हैं।\n- लाभ:\n  - आयकर छूट (Section 80G / CSR).\n  - सीधा रियल-टाइम आईओटी डेटा (जैसे कितने लीटर शुद्ध जल दिया गया, कितने किसानों की फसल बची).\n  - लगाए गए उपकरणों और ग्राम केंद्रों पर कंपनी की ब्रांडिंग।",
      action: { label: "सीएसआर डैशबोर्ड देखें", path: "/csr" }
    }
  }
};

export const SaarthiAiWidget = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [lang, setLang] = useState('en'); // 'en' or 'hi'
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'saarthi',
      text: "🙏 **नमस्कार! I am सारथी AI (Saarthi AI)**, your bilingual civic innovation guide for Jharkhand.\n\nI can help you apply for student research grants (₹1.5L), discover district challenges, understand Gram Vaani voice intake, or redeem goodies. How can I help you today?",
      textHi: "🙏 **जोहार! मैं सारथी AI हूँ**, झारखंड इनोवेशन पोर्टल का आपका मार्गदर्शक।\n\nमैं आपको ₹1.5 लाख का स्टूडेंट इनोवेशन ग्रांट पाने, 24 जिलों की समस्याएं खोजने, ग्राम वाणी वॉयस से समस्या दर्ज करने या उपहार (Goodies) रिडीम करने में सहायता कर सकता हूँ। बताएं, मैं आपकी क्या सहायता करूँ?",
      action: null,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  // Text-To-Speech handler
  const handleSpeak = (text) => {
    if (!('speechSynthesis' in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    // Clean markdown hashes and asterisks for speaking
    const cleanText = text.replace(/[#*`_\[\]()]/g, ' ');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = lang === 'hi' ? 'hi-IN' : 'en-IN';
    utterance.rate = 1.0;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  // Voice Recognition handler (Web Speech API)
  const handleToggleVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice input is supported in Chrome, Edge, and modern browsers.");
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = lang === 'hi' ? 'hi-IN' : 'en-IN';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputMessage(transcript);
        setIsListening(false);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  // Find best match response
  const generateResponse = async (userQuery) => {
    const qLower = userQuery.toLowerCase();

    // First try backend API endpoint
    try {
      const res = await api.ai.saarthiChat({
        message: userQuery,
        language: lang
      });
      if (res && res.response) {
        return {
          text: res.response,
          action: res.action || null
        };
      }
    } catch {
      // Fallback seamlessly to local intelligent engine
    }

    // 1. Check for standard greetings
    const greetings = ["hi", "hello", "hey", "johar", "namaste", "pranam", "नमस्ते", "जोहार", "प्रणाम", "हेल्लो", "help", "सहायता", "start", "shuru", "शुरू", "how are you", "kaise ho", "कैसे हो"];
    const words = qLower.split(/\s+/);
    if (greetings.some(g => g === qLower || (words.length <= 3 && words.includes(g)))) {
      if (lang === 'hi') {
        return {
          text: "🙏 **जोहार! मैं सारथी AI हूँ।**\n\nमैं झारखंड इनोवेशन पोर्टल का आपका मार्गदर्शक हूँ। आप मुझसे ₹1.5 लाख के ग्रांट्स, 24 जिलों की ग्रामीण समस्याओं, ग्राम वाणी वॉयस इनटेक या उपहार स्टोर (Goodies) के बारे में पूछ सकते हैं।",
          action: { label: "सभी 24 जिले देखें", path: "/challenges" }
        };
      } else {
        return {
          text: "🙏 **Johar & Hello! I am सारथी AI (Saarthi AI).**\n\nI am your civic innovation guide for the Jharkhand Innovation Portal. I can help with ₹1.5L student prototype grants, 24 district challenges, Gram Vaani voice intake, and Goodies store redemptions.",
          action: { label: "Explore Challenges", path: "/challenges" }
        };
      }
    }

    // 2. Match relevant portal domains
    if (qLower.includes('grant') || qLower.includes('1.5') || qLower.includes('lakh') || qLower.includes('fund') || qLower.includes('money') || qLower.includes('budget') || qLower.includes('seed') || qLower.includes('ग्रांट') || qLower.includes('रुपये') || qLower.includes('पैसे') || qLower.includes('फंड') || qLower.includes('बजट') || qLower.includes('अनुदान')) {
      return SMART_RESPONSES.funding[lang];
    }
    if (qLower.includes('water') || qLower.includes('khunti') || qLower.includes('gumla') || qLower.includes('bokaro') || qLower.includes('district') || qLower.includes('problem') || qLower.includes('challenge') || qLower.includes('fluoride') || qLower.includes('arsenic') || qLower.includes('पानी') || qLower.includes('खूंटी') || qLower.includes('गुमला') || qLower.includes('बोकारो') || qLower.includes('चुनौती') || qLower.includes('समस्या') || qLower.includes('गांव') || qLower.includes('जिला')) {
      return SMART_RESPONSES.challenges[lang];
    }
    if (qLower.includes('goodie') || qLower.includes('point') || qLower.includes('reward') || qLower.includes('redeem') || qLower.includes('backpack') || qLower.includes('hoodie') || qLower.includes('power bank') || qLower.includes('headphone') || qLower.includes('gift') || qLower.includes('voucher') || qLower.includes('उपहार') || qLower.includes('पॉइंट') || qLower.includes('रिवॉर्ड') || qLower.includes('बैकपैक') || qLower.includes('वाउचर')) {
      return SMART_RESPONSES.rewards[lang];
    }
    if (qLower.includes('voice') || qLower.includes('gram vaani') || qLower.includes('speak') || qLower.includes('audio') || qLower.includes('ivr') || qLower.includes('phone') || qLower.includes('toll') || qLower.includes('record') || qLower.includes('आवाज़') || qLower.includes('वाणी') || qLower.includes('बोलकर') || qLower.includes('कॉल') || qLower.includes('रिकॉर्ड')) {
      return SMART_RESPONSES.voice[lang];
    }
    if (qLower.includes('csr') || qLower.includes('company') || qLower.includes('industry') || qLower.includes('tata') || qLower.includes('cmpdi') || qLower.includes('sail') || qLower.includes('sponsor') || qLower.includes('investor') || qLower.includes('mentor') || qLower.includes('सीएसआर') || qLower.includes('कंपनी') || qLower.includes('उद्योग') || qLower.includes('निवेशक')) {
      return SMART_RESPONSES.csr[lang];
    }
    if (qLower.includes('login') || qLower.includes('register') || qLower.includes('sign') || qLower.includes('account') || qLower.includes('dark') || qLower.includes('light') || qLower.includes('theme') || qLower.includes('portal') || qLower.includes('लॉगइन') || qLower.includes('साइनअप') || qLower.includes('खाता') || qLower.includes('थीम') || qLower.includes('पोर्टल')) {
      return {
        text: lang === 'hi'
          ? "### पोर्टल सुविधाएं\n\nआप टॉप नेविगेशन बार में 'Login' बटन से लॉगिन कर सकते हैं और ☀️/🌙 बटन से लाइट/डार्क मोड बदल सकते हैं।"
          : "### Portal Navigation\n\nYou can sign in using the top 'Login' button and toggle Light/Dark mode via the header theme button.",
        action: { label: "Go to Login", path: "/login" }
      };
    }

    // 3. Explicit Irrelevant Query Notice
    if (lang === 'hi') {
      return {
        text: "⚠️ **यह प्रश्न इस पोर्टल के लिए असंगत (Irrelevant) है।**\n\nमैं **सारथी AI** हूँ — केवल **झारखंड इनोवेशन पोर्टल (JharInnovate)** के लिए समर्पित सहायक।\n\nमैं सामान्य मनोरंजन, खेल, बाहरी कोडिंग या व्यक्तिगत विषयों पर चर्चा नहीं करता। मैं आपकी केवल इन विषयों में सहायता कर सकता हूँ:\n- 🎒 छात्र अनुसंधान व प्रोटोटाइप ग्रांट्स (₹1.5 लाख)\n- 💧 24 जिलों की ग्रामीण समस्याएं (पेयजल, कृषि, स्वास्थ्य, ऊर्जा)\n- 📞 ग्राम वाणी वॉयस से समस्या दर्ज करना\n- 🎁 कर्मा पॉइंट्स और गुड्डीज (Goodies Store)\n- 🏭 कंपनियों के सीएसआर (CSR) फंड्स\n\n👉 *कृपया झारखंड की सामाजिक समस्याओं या पोर्टल से संबंधित प्रश्न पूछें।*",
        action: { label: "24 जिलों की समस्याएं देखें", path: "/challenges" }
      };
    } else {
      return {
        text: "⚠️ **This query is irrelevant to the Jharkhand Societal Innovation Portal.**\n\nI am **सारथी AI**, dedicated exclusively to civic innovation, student research grants, and rural problem-solving across Jharkhand.\n\nI do not provide assistance on general entertainment, sports, external coding puzzles, homework, or unrelated chatter. I can assist you with:\n- 🎒 ₹1.5 Lakh Student Innovation & Prototype Grants\n- 💧 Grassroots Challenges across Jharkhand's 24 Districts\n- 📞 Gram Vaani Voice Problem Intake (Voice Recording & IVR)\n- 🎁 Karma Points & Goodies Store Redemption\n- 🏭 Corporate CSR Funding & University Mentorship\n\n👉 *Please ask a question related to Jharkhand's civic challenges or portal features.*",
        action: { label: "Explore 24 District Challenges", path: "/challenges" }
      };
    }
  };

  const handleSend = async (textToSend = null) => {
    const text = (textToSend || inputMessage).trim();
    if (!text) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsTyping(true);

    // Realistic assistant thinking pause
    setTimeout(async () => {
      const resp = await generateResponse(text);
      const botMsg = {
        id: Date.now() + 1,
        sender: 'saarthi',
        text: resp.text,
        action: resp.action,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 600);
  };

  const handleClearChat = () => {
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setMessages([
      {
        id: Date.now(),
        sender: 'saarthi',
        text: lang === 'hi' 
          ? "🙏 **नमस्ते!** चैट रीसेट हो गई है। आप कोई नया सवाल पूछ सकते हैं।"
          : "🙏 **Hello!** Chat history refreshed. How can I assist you?",
        action: null,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans print:hidden">
      {/* 1. FLOATING ACTIVATION BUTTON */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-3 bg-gradient-to-r from-blue-900 via-blue-800 to-teal-700 hover:from-blue-800 hover:to-teal-600 text-white pl-4 pr-5 py-3.5 rounded-full shadow-2xl hover:shadow-blue-500/30 transition-all duration-300 hover:scale-105 active:scale-95 border border-white/20 cursor-pointer"
          aria-label="Open Saarthi AI Assistant"
        >
          {/* Animated Glow Halo */}
          <span className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-teal-400 to-amber-400 opacity-30 group-hover:opacity-75 blur-sm transition duration-300 animate-pulse pointer-events-none" />

          {/* AI Avatar */}
          <div className="relative w-9 h-9 rounded-full bg-white/10 flex items-center justify-center border border-white/30 backdrop-blur-md">
            <Bot className="w-5 h-5 text-teal-300" />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-blue-900" />
          </div>

          <div className="text-left relative z-10">
            <div className="flex items-center gap-1.5">
              <span className="font-black text-sm tracking-wide text-white">सारथी AI</span>
              <span className="text-[10px] bg-teal-400/20 text-teal-200 px-1.5 py-0.2 rounded font-bold uppercase tracking-wider">Guide</span>
            </div>
            <div className="text-[11px] text-teal-200/90 font-medium leading-none">
              Ask Grants & Problems
            </div>
          </div>
        </button>
      )}

      {/* 2. CHAT WINDOW MODAL */}
      {isOpen && (
        <div className="w-[92vw] sm:w-[410px] h-[580px] max-h-[85vh] bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-blue-900 text-white p-4 flex items-center justify-between border-b border-white/10 shrink-0">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-2xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center backdrop-blur-md text-teal-300">
                <Bot className="w-6 h-6" />
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-slate-950" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-black text-sm tracking-wide text-white">सारथी AI</h3>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-bold">Online</span>
                </div>
                <p className="text-[11px] text-slate-300">Jharkhand Innovation & Grants Guide</p>
              </div>
            </div>

            {/* Header Controls: Lang toggle, Reset, Close */}
            <div className="flex items-center gap-1.5">
              {/* Language Switcher */}
              <button
                onClick={() => setLang(lang === 'en' ? 'hi' : 'en')}
                className="px-2.5 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-white text-[11px] font-black border border-white/15 transition-colors cursor-pointer"
                title="Switch Language (English / हिन्दी)"
              >
                {lang === 'en' ? '🇮🇳 हिन्दी' : '🇬🇧 EN'}
              </button>

              {/* Reset Chat */}
              <button
                onClick={handleClearChat}
                className="p-1.5 rounded-xl hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
                title="Restart Chat"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              {/* Minimize/Close */}
              <button
                onClick={() => {
                  if (window.speechSynthesis) window.speechSynthesis.cancel();
                  setIsSpeaking(false);
                  setIsOpen(false);
                }}
                className="p-1.5 rounded-xl hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick Prompt Chips (Carousel) */}
          <div className="bg-slate-100/80 dark:bg-slate-800/80 px-3 py-2 border-b border-slate-200 dark:border-slate-700 overflow-x-auto flex gap-2 no-scrollbar shrink-0">
            {QUICK_PROMPTS.map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleSend(lang === 'hi' ? prompt.hi : prompt.en)}
                className="shrink-0 px-3 py-1.5 rounded-full bg-white dark:bg-slate-900 hover:bg-blue-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 hover:text-blue-900 dark:hover:text-blue-300 text-[11px] font-semibold border border-slate-200 dark:border-slate-700 hover:border-blue-300 transition-all shadow-2xs cursor-pointer flex items-center gap-1.5"
              >
                <Sparkles className="w-3 h-3 text-amber-500" />
                <span>{lang === 'hi' ? prompt.hi : prompt.en}</span>
              </button>
            ))}
          </div>

          {/* Chat Message Scroll Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50 dark:bg-slate-950/50">
            {messages.map((msg) => {
              const isSaarthi = msg.sender === 'saarthi';
              const displayText = isSaarthi && lang === 'hi' && msg.textHi ? msg.textHi : msg.text;

              return (
                <div
                  key={msg.id}
                  className={`flex gap-2.5 ${isSaarthi ? 'justify-start' : 'justify-end'}`}
                >
                  {isSaarthi && (
                    <div className="w-8 h-8 rounded-xl bg-blue-900 text-teal-300 flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] rounded-2xl p-3.5 shadow-2xs space-y-2 ${
                      isSaarthi
                        ? 'bg-white dark:bg-slate-850 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700/80'
                        : 'bg-blue-700 text-white'
                    }`}
                  >
                    {/* Message Body with simple markdown line handling */}
                    <div className="text-xs leading-relaxed whitespace-pre-wrap font-normal">
                      {displayText.split('\n').map((line, lIdx) => {
                        if (line.startsWith('### ')) {
                          return (
                            <div key={lIdx} className="font-black text-slate-900 dark:text-white text-sm mt-1 mb-1">
                              {line.replace('### ', '')}
                            </div>
                          );
                        }
                        if (line.startsWith('- ') || line.startsWith('1. ') || line.startsWith('2. ') || line.startsWith('3. ')) {
                          return (
                            <div key={lIdx} className="pl-1 text-slate-700 dark:text-slate-300 my-0.5">
                              {line}
                            </div>
                          );
                        }
                        return (
                          <div key={lIdx} className={line.trim() === '' ? 'h-1.5' : ''}>
                            {line}
                          </div>
                        );
                      })}
                    </div>

                    {/* Action Chip Button (if any) */}
                    {isSaarthi && msg.action && (
                      <div className="pt-1.5 border-t border-slate-100 dark:border-slate-700/60">
                        <button
                          onClick={() => {
                            setIsOpen(false);
                            navigate(msg.action.path);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/70 hover:bg-blue-100 dark:hover:bg-blue-900 text-blue-900 dark:text-blue-200 font-bold text-[11px] flex items-center gap-1.5 border border-blue-200 dark:border-blue-800 transition-colors cursor-pointer w-full justify-center"
                        >
                          <span>{msg.action.label}</span>
                          <ExternalLink className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                        </button>
                      </div>
                    )}

                    {/* Footer: timestamp + TTS button for Saarthi */}
                    <div
                      className={`flex items-center justify-between text-[10px] pt-1 ${
                        isSaarthi ? 'text-slate-400 dark:text-slate-400' : 'text-blue-200'
                      }`}
                    >
                      <span>{msg.timestamp}</span>
                      {isSaarthi && (
                        <button
                          onClick={() => handleSpeak(displayText)}
                          className="p-1 hover:text-slate-700 dark:hover:text-slate-200 transition-colors cursor-pointer rounded flex items-center gap-1"
                          title="Listen in speech"
                        >
                          {isSpeaking ? (
                            <VolumeX className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
                          ) : (
                            <Volume2 className="w-3.5 h-3.5" />
                          )}
                          <span className="text-[9px]">Listen</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex gap-2.5 justify-start">
                <div className="w-8 h-8 rounded-xl bg-blue-900 text-teal-300 flex items-center justify-center shrink-0 shadow-xs">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-white dark:bg-slate-800 rounded-2xl px-4 py-3 border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 text-slate-400">
                  <span className="w-2 h-2 rounded-full bg-blue-600 animate-bounce" />
                  <span className="w-2 h-2 rounded-full bg-teal-500 animate-bounce [animation-delay:0.2s]" />
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-bounce [animation-delay:0.4s]" />
                  <span className="text-[11px] font-medium ml-1 text-slate-500 dark:text-slate-400">
                    {lang === 'hi' ? 'सारथी सोच रहा है...' : 'Saarthi is typing...'}
                  </span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Bottom Chat Input Form */}
          <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 shrink-0 space-y-2">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              {/* Mic Speech Button */}
              <button
                type="button"
                onClick={handleToggleVoiceInput}
                className={`p-2.5 rounded-2xl border transition-all cursor-pointer ${
                  isListening
                    ? 'bg-red-500 text-white border-red-600 animate-pulse'
                    : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                }`}
                title="Speak question (Microphone)"
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>

              {/* Text Input */}
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder={
                  lang === 'hi'
                    ? "सारथी से कोई भी सवाल पूछें..."
                    : "Ask about grants, challenges, goodies..."
                }
                className="flex-1 px-4 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white dark:focus:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500"
              />

              {/* Send Button */}
              <button
                type="submit"
                disabled={!inputMessage.trim() || isTyping}
                className="p-2.5 rounded-2xl bg-blue-900 hover:bg-blue-800 disabled:opacity-40 text-white transition-all cursor-pointer shadow-md disabled:cursor-not-allowed"
                title="Send"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

            <div className="flex items-center justify-between text-[10px] text-slate-400 dark:text-slate-500 px-1">
              <span>सारथी AI • Bilingual Civic Assistant</span>
              <span className="font-semibold text-teal-600 dark:text-teal-400">Jharkhand Innovation Portal</span>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};
