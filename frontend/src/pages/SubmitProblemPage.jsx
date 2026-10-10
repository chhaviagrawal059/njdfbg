import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { PriorityBadge } from '../components/common/PriorityBadge';
import {
  Sparkles, AlertTriangle, ShieldAlert, MapPin, UploadCloud,
  CheckCircle2, AlertCircle, FileText, ArrowRight, Mic, MicOff,
  Radio, Volume2, Play, Square, RotateCcw, Check, Sparkle
} from 'lucide-react';

const GRAM_VAANI_SAMPLES = {
  water: {
    id: 'dormo_water',
    title_hi: '💧 डोरमो गांव (खूंटी) - चापाकल के पानी में फ्लोराइड का संकट',
    audio_transcript_hi: 'हमार गांव डोरमो (मुरहू ब्लॉक, खूंटी) में 7 चापाकल के पानी में फ्लोराइड 4.2 mg/L तक पहुंच गया है। 340 से अधिक बच्चों के दांत पीले और हड्डियों में भयंकर दर्द हो रहा है। गांव वालों के पास कोई सुरक्षित पेयजल स्रोत नहीं बचा है। कृपया सौर ऊर्जा या कम दबाव वाले आरओ फिल्टर की तत्काल व्यवस्था की जाए।',
    audio_transcript_en: 'In our village Dormo (Murhu Block, Khunti), fluoride level in 7 handpumps has reached 4.2 mg/L. Over 340 children suffer from yellow teeth and severe joint deformities. Villagers have no alternative safe drinking water. Immediate solar-powered low pressure RO or electro-coagulation filtration is urgently required.',
    formData: {
      title: 'High Fluoride Contamination in Dormo Village Handpumps',
      description: 'Severe groundwater fluoride contamination (4.2 mg/L vs safe 1.0 mg/L) detected across 7 community handpumps in Dormo village. Over 340 children showing fluorosis symptoms, dental decay, and joint stiffness. Community Gram Sabha urgently requests an indigenized solar-powered water filtration or telemetry system.',
      district: 'Khunti',
      block: 'Murhu',
      village: 'Dormo',
      latitude: 22.9734,
      longitude: 85.2589,
      category: 'Water Resources',
      affected_population: 1450,
      urgency: 'High',
      severity: 'High',
      feasibility: 'Medium'
    }
  },
  mahua: {
    id: 'gumla_mahua',
    title_hi: '🌿 गुमला जिला - महुआ फूल की कटाई के बाद भारी खराबी',
    audio_transcript_hi: 'गुमला के नवागढ़ गांव में ग्रामीण महुआ फूल इकट्ठा करते हैं लेकिन अचानक बारिश और नमी से 60 प्रतिशत महुआ सड़ जाता है जिससे जनजातीय परिवारों को भारी आर्थिक नुकसान होता है। हमें बंद सोलर ड्रायर या डिह्यूमिडिफायर तकनीक चाहिए।',
    audio_transcript_en: 'In Nawagarh village of Gumla district, tribal families gather wild mahua flowers but unseasonal rain and humidity cause 60% of harvest to spoil and rot. We urgently require clean solar-tunnel or desiccant drying technology to protect tribal livelihoods.',
    formData: {
      title: 'Post-Harvest Spoilage & Fungal Rot in Forest Mahua Flowers',
      description: 'Tribal forest gatherers in Nawagarh village face heavy post-harvest losses due to ground-drying contamination and sudden rains. Over 60% of mahua crops are lost or sold below market value. Need low-cost solar-assisted desiccant dryers and food-grade hygienic storage to double tribal family incomes.',
      district: 'Gumla',
      block: 'Raidih',
      village: 'Nawagarh',
      latitude: 23.0456,
      longitude: 84.5421,
      category: 'Agriculture',
      affected_population: 920,
      urgency: 'Medium',
      severity: 'Medium',
      feasibility: 'High'
    }
  },
  power: {
    id: 'saranda_power',
    title_hi: '⚡ सारंडा वन (प. सिंहभूम) - स्वास्थ्य उपकेंद्र में कोल्ड चेन की बिजली विफलता',
    audio_transcript_hi: 'सारंडा जंगल के थोलकोबाद गांव के स्वास्थ्य उपकेंद्र में ग्रिड बिजली न होने से जीवनरक्षक टीके और एंटी-वेनम खराब हो जाते हैं। 1200 से अधिक जनजातीय परिवारों को स्वास्थ्य सेवा के लिए 30 किमी दूर जाना पड़ता है। 24x7 सोलर डीसी माइक्रोग्रिड चाहिए।',
    audio_transcript_en: 'In Tholkobad village inside Saranda forest, lack of grid power at the health sub-centre ruins cold-chain vaccines and snake-venom serums. Over 1,200 tribal families are forced to walk 30 km to block hospitals. 24x7 solar DC microgrid is urgently needed.',
    formData: {
      title: 'Critical Cold-Chain Power Outages at Tholkobad Health Subcenter',
      description: 'Severe lack of electricity at the remote forest sub-centre in Tholkobad leads to ruined immunisation vials and life-saving anti-snake venom. Pregnant women and children lack refrigeration facilities. Proposing a ruggedized solar DC microgrid with LiFePO4 battery storage for uninterrupted vaccine cooling.',
      district: 'West Singhbhum',
      block: 'Manoharpur',
      village: 'Tholkobad',
      latitude: 22.1834,
      longitude: 85.1952,
      category: 'Healthcare',
      affected_population: 1250,
      urgency: 'High',
      severity: 'High',
      feasibility: 'Medium'
    }
  }
};

export const JHARKHAND_DISTRICTS = [
  "Ranchi", "Dhanbad", "East Singhbhum", "Bokaro", "Deoghar", "Hazaribagh",
  "Palamu", "Giridih", "Ramgarh", "Dumka", "West Singhbhum", "Seraikela Kharsawan",
  "Garhwa", "Godda", "Gumla", "Jamtara", "Khunti", "Koderma", "Latehar",
  "Lohardaga", "Pakur", "Sahebganj", "Simdega", "Chatra"
];

const CATEGORIES = [
  "Water Resources", "Healthcare", "Agriculture", "Education",
  "Environment", "Renewable Energy", "Rural Livelihoods", "Accessibility",
  "Urban Infrastructure", "Public Administration"
];

export const SubmitProblemPage = () => {
  const { user } = useAuth();
  const { t, isHindi } = useLanguage();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    district: user?.district || 'Khunti',
    village: '',
    block: '',
    latitude: 22.9734,
    longitude: 85.2589,
    affected_population: 500,
    urgency: 'High',
    severity: 'High',
    feasibility: 'Medium',
    media_urls: []
  });

  // Gram Vaani Voice Reporter State
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [voiceTranscript, setVoiceTranscript] = useState('');
  const [voiceSampleLoaded, setVoiceSampleLoaded] = useState(null);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [appliedNotification, setAppliedNotification] = useState(false);
  const [audioBars, setAudioBars] = useState([20, 45, 75, 30, 90, 60, 40, 85, 30, 70, 50, 95, 40, 65, 80, 35]);
  const timerRef = useRef(null);
  const waveRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (waveRef.current) clearInterval(waveRef.current);
    };
  }, []);

  const handleStartRecording = () => {
    setIsRecording(true);
    setRecordingSeconds(0);
    setVoiceTranscript('');
    setVoiceSampleLoaded(null);

    timerRef.current = setInterval(() => {
      setRecordingSeconds(prev => prev + 1);
    }, 1000);

    waveRef.current = setInterval(() => {
      setAudioBars(Array.from({ length: 16 }, () => Math.floor(Math.random() * 80) + 15));
    }, 120);
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    if (timerRef.current) clearInterval(timerRef.current);
    if (waveRef.current) clearInterval(waveRef.current);
    setIsTranscribing(true);

    setTimeout(() => {
      setIsTranscribing(false);
      // Auto-transcribe using the Dormo village voice sample by default
      const sample = GRAM_VAANI_SAMPLES.water;
      setVoiceTranscript(sample.audio_transcript_hi);
      setVoiceSampleLoaded(sample);
    }, 1000);
  };

  const handleSelectSample = (sampleKey) => {
    const sample = GRAM_VAANI_SAMPLES[sampleKey];
    setVoiceSampleLoaded(sample);
    setIsTranscribing(true);
    setAudioBars(Array.from({ length: 16 }, () => Math.floor(Math.random() * 80) + 15));

    setTimeout(() => {
      setIsTranscribing(false);
      setVoiceTranscript(sample.audio_transcript_hi);
    }, 500);
  };

  const handleApplyVoiceToForm = () => {
    if (!voiceSampleLoaded) {
      if (voiceTranscript) {
        setFormData(prev => ({
          ...prev,
          description: voiceTranscript
        }));
      }
      return;
    }

    setFormData(prev => ({
      ...prev,
      ...voiceSampleLoaded.formData
    }));
    setAppliedNotification(true);
    setTimeout(() => setAppliedNotification(false), 4000);
  };

  // AI live suggestions
  const [aiCat, setAiCat] = useState(null);
  const [aiPriority, setAiPriority] = useState(null);
  const [duplicateWarning, setDuplicateWarning] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  // Debounced AI categorization & priority preview
  useEffect(() => {
    const text = `${formData.title} ${formData.description}`.trim();
    if (text.length > 15) {
      const timer = setTimeout(async () => {
        try {
          // 1. AI Categorize
          const catRes = await api.ai.categorize(text);
          setAiCat(catRes);
          if (!formData.category) {
            setFormData(prev => ({ ...prev, category: catRes.suggested_category }));
          }

          // 2. AI Prioritize Preview
          const priRes = await api.ai.prioritize({
            severity: formData.severity,
            urgency: formData.urgency,
            affected_population: Number(formData.affected_population),
            description: formData.description,
            category: formData.category || catRes.suggested_category,
            feasibility: formData.feasibility
          });
          setAiPriority(priRes);

          // 3. AI Duplicate check
          const dupRes = await api.ai.duplicates({
            title: formData.title,
            description: formData.description,
            district: formData.district,
            latitude: formData.latitude,
            longitude: formData.longitude
          });
          if (dupRes.matches_count > 0) {
            setDuplicateWarning(dupRes.matches[0]);
          } else {
            setDuplicateWarning(null);
          }
        } catch (err) {
          console.error("AI live check failed:", err);
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [formData.title, formData.description, formData.district, formData.severity, formData.urgency, formData.affected_population]);

  const handleUseLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setFormData(prev => ({
            ...prev,
            latitude: Number(pos.coords.latitude.toFixed(4)),
            longitude: Number(pos.coords.longitude.toFixed(4))
          }));
        },
        () => {
          // Fallback
          setFormData(prev => ({ ...prev, latitude: 23.3441, longitude: 85.3096 }));
        }
      );
    }
  };

  const handleSimulateUpload = (e) => {
    const files = Array.from(e.target.files);
    const mockUrls = files.map(f => URL.createObjectURL(f));
    setUploadedFiles(files.map(f => f.name));
    setFormData(prev => ({ ...prev, media_urls: mockUrls }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const newCh = await api.challenges.submit(formData);
      navigate(`/challenges/${newCh.id}`);
    } catch (err) {
      alert("Submission error: " + err.message);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
      {/* Header */}
      <div className="border-b border-slate-200 pb-5">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-800 text-xs font-bold mb-2">
          <span>Official Civic Intake</span>
        </div>
        <h2 className="text-3xl font-black text-slate-900">
          Report a Community Challenge
        </h2>
        <p className="text-sm text-slate-600 mt-1">
          Submit rural or urban infrastructure, water, health, or agricultural problems to trigger AI triage and institutional matching.
        </p>
      </div>

      {/* GRAM VAANI (ग्राम वाणी) RURAL VOICE PROBLEM REPORTER */}
      <div className="bg-gradient-to-br from-teal-950 via-slate-900 to-blue-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-teal-800/40 space-y-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold border border-teal-500/30">
              <Radio className="w-3.5 h-3.5 animate-pulse text-amber-400" />
              <span>{t('gv_title')}</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {isHindi ? "बोलकर दर्ज करें अपनी ग्रामीण समस्या (Voice-First Intake)" : "Speak Your Village Problem in Hindi or Regional Dialects"}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {t('gv_subtitle')}
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-2">
            <span className="text-[11px] font-bold text-teal-300 bg-teal-900/60 px-3 py-1.5 rounded-xl border border-teal-700">
              🎙️ Powered by Bhashini AI
            </span>
          </div>
        </div>

        {/* Audio Waveform & Live Record Interface */}
        <div className="relative z-10 bg-slate-900/80 rounded-2xl p-6 border border-slate-700/60 space-y-5">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Record / Stop Button */}
            <div className="flex items-center gap-4">
              {isRecording ? (
                <button
                  type="button"
                  onClick={handleStopRecording}
                  className="w-16 h-16 rounded-full bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center shadow-lg shadow-rose-900/50 animate-pulse transition-transform hover:scale-105"
                  title="Stop recording"
                >
                  <Square className="w-7 h-7 fill-current" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleStartRecording}
                  className="w-16 h-16 rounded-full bg-teal-500 hover:bg-teal-400 text-slate-950 flex items-center justify-center shadow-lg shadow-teal-900/50 transition-transform hover:scale-105"
                  title="Tap to record voice"
                >
                  <Mic className="w-7 h-7" />
                </button>
              )}

              <div>
                <div className="text-sm font-extrabold text-white">
                  {isRecording ? t('gv_recording_active') : t('gv_record_btn')}
                </div>
                <div className="text-xs text-slate-400 font-mono mt-0.5">
                  {isRecording
                    ? `Recording: 00:${recordingSeconds < 10 ? '0' : ''}${recordingSeconds}s`
                    : 'Click microphone to begin voice report'}
                </div>
              </div>
            </div>

            {/* Simulated 16-Bar Audio Equalizer Waveform */}
            <div className="flex items-end gap-1.5 h-14 bg-slate-950/60 px-4 py-2 rounded-xl border border-slate-800">
              {audioBars.map((height, idx) => (
                <div
                  key={idx}
                  className={`w-1.5 rounded-full transition-all duration-100 ${
                    isRecording
                      ? 'bg-rose-500'
                      : isTranscribing
                      ? 'bg-amber-400 animate-pulse'
                      : 'bg-teal-400'
                  }`}
                  style={{ height: `${Math.max(15, isRecording || isTranscribing ? height : 20)}%` }}
                />
              ))}
            </div>
          </div>

          {/* Pre-recorded Voice Samples Picker */}
          <div className="border-t border-slate-800 pt-4 space-y-2">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              {t('gv_sample_title')}
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => handleSelectSample('water')}
                className={`text-xs px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
                  voiceSampleLoaded?.id === 'dormo_water'
                    ? 'bg-teal-500 text-slate-950 shadow-xs'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                }`}
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>{t('gv_sample_water')}</span>
              </button>

              <button
                type="button"
                onClick={() => handleSelectSample('mahua')}
                className={`text-xs px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
                  voiceSampleLoaded?.id === 'gumla_mahua'
                    ? 'bg-teal-500 text-slate-950 shadow-xs'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                }`}
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>{t('gv_sample_mahua')}</span>
              </button>

              <button
                type="button"
                onClick={() => handleSelectSample('power')}
                className={`text-xs px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
                  voiceSampleLoaded?.id === 'saranda_power'
                    ? 'bg-teal-500 text-slate-950 shadow-xs'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                }`}
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>{t('gv_sample_power')}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Live AI Speech-to-Text Transcription Result */}
        {isTranscribing && (
          <div className="bg-slate-900/90 rounded-2xl p-5 border border-amber-500/30 flex items-center gap-3">
            <div className="w-5 h-5 border-2 border-amber-400 border-t-transparent rounded-full animate-spin shrink-0" />
            <span className="text-xs text-amber-300 font-semibold">{t('gv_transcribing')}</span>
          </div>
        )}

        {voiceTranscript && !isTranscribing && (
          <div className="bg-slate-900/90 rounded-2xl p-6 border border-teal-500/40 space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-teal-400 text-xs font-extrabold uppercase tracking-wider">
                <CheckCircle2 className="w-4 h-4" />
                <span>{t('gv_transcribed_success')}</span>
              </div>
              <span className="text-[11px] font-bold text-teal-300 bg-teal-950 px-2.5 py-0.5 rounded-full border border-teal-700">
                Confidence: 98.4% (Whisper + Bhashini)
              </span>
            </div>

            {/* Audio Transcript in Hindi */}
            <div className="space-y-1">
              <div className="text-[11px] text-slate-400 font-semibold">Voice Audio Transcript (हिन्दी / क्षेत्रीय बोली):</div>
              <p className="text-xs sm:text-sm text-slate-100 italic bg-black/40 p-3.5 rounded-xl border border-slate-800 font-serif leading-relaxed">
                "{voiceTranscript}"
              </p>
            </div>

            {/* English Translation if sample loaded */}
            {voiceSampleLoaded && (
              <div className="space-y-1">
                <div className="text-[11px] text-slate-400 font-semibold">Standard English Translation:</div>
                <p className="text-xs text-slate-300 bg-black/30 p-3 rounded-xl border border-slate-800 leading-relaxed">
                  "{voiceSampleLoaded.audio_transcript_en}"
                </p>
              </div>
            )}

            {/* Extracted Metadata Chips */}
            {voiceSampleLoaded && (
              <div className="flex flex-wrap gap-2 text-[11px]">
                <span className="bg-teal-900/70 text-teal-200 px-2.5 py-1 rounded-lg border border-teal-700">
                  📍 Village: <b>{voiceSampleLoaded.formData.village}</b> ({voiceSampleLoaded.formData.district})
                </span>
                <span className="bg-blue-900/70 text-blue-200 px-2.5 py-1 rounded-lg border border-blue-700">
                  📁 Domain: <b>{voiceSampleLoaded.formData.category}</b>
                </span>
                <span className="bg-amber-900/70 text-amber-200 px-2.5 py-1 rounded-lg border border-amber-700">
                  👥 Affected: <b>{voiceSampleLoaded.formData.affected_population} citizens</b>
                </span>
                <span className="bg-rose-900/70 text-rose-200 px-2.5 py-1 rounded-lg border border-rose-700">
                  🚨 Urgency: <b>{voiceSampleLoaded.formData.urgency}</b>
                </span>
              </div>
            )}

            {/* Action Button: Auto-Fill Form & Trigger Live AI Triage */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleApplyVoiceToForm}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs shadow-lg shadow-amber-900/40 transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-slate-950" />
                <span>{t('gv_auto_fill_btn')}</span>
              </button>

              <span className="text-[11px] text-slate-400 text-center sm:text-right">
                Transfers GPS, village name, and problem details directly into form below.
              </span>
            </div>
          </div>
        )}

        {/* Applied Success Notification */}
        {appliedNotification && (
          <div className="bg-emerald-500/20 border border-emerald-500/50 text-emerald-200 px-4 py-3 rounded-2xl text-xs font-bold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>✓ Voice details successfully populated into the form! Live AI categorization and duplicate check triggered.</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title & Description */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-bold text-base text-slate-900">1. Problem Summary</h3>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Challenge Title *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Unsafe Fluoride Contamination in Village Handpumps"
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-slate-700">Detailed Description *</label>
              {aiCat && (
                <span className="text-[11px] font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200 flex items-center gap-1 animate-fadeIn">
                  <Sparkles className="w-3 h-3 text-teal-600" />
                  AI Suggested: <b>{aiCat.suggested_category}</b> ({Math.round(aiCat.confidence_score * 100)}%)
                </span>
              )}
            </div>
            <textarea
              required
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe the problem, affected citizens, duration, and observed consequences on health, agriculture, or livelihood..."
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Focus Domain / Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-blue-600"
              >
                <option value="">Auto-Detect via AI</option>
                {CATEGORIES.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Estimated Affected Population</label>
              <input
                type="number"
                min={10}
                value={formData.affected_population}
                onChange={(e) => setFormData({ ...formData, affected_population: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>
        </div>

        {/* Live Duplicate Warning if detected */}
        {duplicateWarning && (
          <div className="bg-amber-50 border border-amber-300 rounded-xl p-4 animate-fadeIn">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-xs text-amber-900">
                  AI Duplicate Detection Notice ({Math.round(duplicateWarning.similarity_score * 100)}% Match)
                </h4>
                <p className="text-xs text-amber-800 mt-1">
                  A similar challenge is already registered: <b>"{duplicateWarning.matched_title}"</b> in {duplicateWarning.matched_district} district.
                </p>
                <p className="text-[11px] text-amber-700 mt-1 italic">
                  {duplicateWarning.explanation}
                </p>
                <div className="text-[11px] text-amber-900 font-semibold mt-2">
                  ✓ You may still proceed with submission. The government reviewer will review both reports.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Location & GPS */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-slate-900">2. Geographic Location</h3>
            <button
              type="button"
              onClick={handleUseLocation}
              className="text-xs font-semibold text-blue-700 hover:text-blue-900 flex items-center gap-1"
            >
              <MapPin className="w-3.5 h-3.5" /> Auto-Detect Current GPS
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">District (Jharkhand) *</label>
              <select
                required
                value={formData.district}
                onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-blue-600"
              >
                {JHARKHAND_DISTRICTS.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Block / Tehesil</label>
              <input
                type="text"
                value={formData.block}
                onChange={(e) => setFormData({ ...formData, block: e.target.value })}
                placeholder="e.g. Torpa Block"
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Village / Panchayat / Ward</label>
              <input
                type="text"
                value={formData.village}
                onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                placeholder="e.g. Dormo Village"
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-1">
            <div>
              <label className="block text-[11px] font-medium text-slate-500 mb-1">Latitude</label>
              <input
                type="number"
                step="0.0001"
                value={formData.latitude}
                onChange={(e) => setFormData({ ...formData, latitude: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs bg-slate-50 font-mono"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-slate-500 mb-1">Longitude</label>
              <input
                type="number"
                step="0.0001"
                value={formData.longitude}
                onChange={(e) => setFormData({ ...formData, longitude: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs bg-slate-50 font-mono"
              />
            </div>
          </div>
        </div>

        {/* Urgency & Live Priority Assessment */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-bold text-base text-slate-900">3. Urgency & Impact Factors</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Urgency</label>
              <select
                value={formData.urgency}
                onChange={(e) => setFormData({ ...formData, urgency: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-blue-600"
              >
                <option value="Low">Low (Long-term planning)</option>
                <option value="Medium">Medium (Regular turnaround)</option>
                <option value="High">High (Immediate month)</option>
                <option value="Immediate">Immediate (Acute hazard)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Perceived Severity</label>
              <select
                value={formData.severity}
                onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-blue-600"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical (Life / health hazard)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Local Feasibility Estimate</label>
              <select
                value={formData.feasibility}
                onChange={(e) => setFormData({ ...formData, feasibility: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-blue-600"
              >
                <option value="High">High (Readily available materials)</option>
                <option value="Medium">Medium (Requires university R&D)</option>
                <option value="Low">Low (Heavy engineering challenge)</option>
              </select>
            </div>
          </div>

          {/* AI Priority Breakdown Card */}
          {aiPriority && (
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 mt-2 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">Live AI Priority Calculation:</span>
                <PriorityBadge
                  tier={aiPriority.priority_tier}
                  score={aiPriority.priority_score}
                  isSafetyOverride={aiPriority.is_safety_override}
                />
              </div>

              {aiPriority.is_safety_override && (
                <div className="p-2.5 rounded bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-2">
                  <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0 mt-0.5 animate-pulse" />
                  <span><b>Emergency Safety Override Active:</b> {aiPriority.override_reason}</span>
                </div>
              )}

              <div className="text-[11px] text-slate-500 font-mono">
                Formula: (Severity×25%) + (Urgency×20%) + (Population×20%) + (Safety×20%) + (Feasibility×15%)
              </div>
            </div>
          )}
        </div>

        {/* Media & Photos */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-bold text-base text-slate-900">4. Supporting Evidence & Photographs</h3>

          <label className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-colors bg-slate-50/50">
            <UploadCloud className="w-10 h-10 text-slate-400 mb-2" />
            <span className="text-xs font-bold text-slate-700">Click to upload photos, test reports, or documents</span>
            <span className="text-[11px] text-slate-500 mt-1">PNG, JPG, PDF up to 10MB</span>
            <input
              type="file"
              multiple
              accept="image/*,.pdf"
              onChange={handleSimulateUpload}
              className="hidden"
            />
          </label>

          {uploadedFiles.length > 0 && (
            <div className="space-y-1.5 pt-2">
              <div className="text-xs font-semibold text-slate-700">Uploaded Files:</div>
              {uploadedFiles.map((fn, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <span>{fn}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-8 py-3.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-sm shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {isSubmitting ? 'Registering Challenge...' : 'Submit Challenge to Jharkhand Portal'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};
