import { useState, useEffect, useRef, useCallback, useMemo, memo, ReactNode } from "react";
import krishiMitraLogo from "../imports/ChatGPT_Image_Jul_16__2026__02_44_08_PM-2.png";
import {
  Home, Leaf, ScanLine, MessageCircle, User,
  ChevronRight, ChevronLeft, ChevronDown,
  Bell, Search, Cloud, Droplets, Wind, Sun,
  TrendingUp, TrendingDown, Camera, Zap, Image,
  X, Check, Plus, ArrowRight,
  MapPin, Phone, Settings, Globe, Shield, Info,
  Calendar, FileText, Users, Heart, Star,
  ThumbsUp, MessageSquare, Share2, Filter,
  AlertTriangle, CheckCircle, Clock, BarChart2,
  Mic, Send, Award, Activity, RotateCcw, Edit2, LogOut,
  DollarSign, Wallet, BookOpen, Bookmark,
  RefreshCw, Eye, Lock, Volume2, CreditCard,
  Tag, Package, Wifi, Square,
  ShoppingCart, Trash2, Minus, Sprout, Truck, ClipboardList,
  Ruler, Beaker, Bug, Sparkles, Navigation, Loader2, ShoppingBag
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer
} from "recharts";
import { LangProvider, useLang, LANGUAGES, Lang } from "./i18n";
import { UserProvider, useUser } from "./user";
import { StoreProvider, useStore } from "./store";
import { STATES, DISTRICTS, normalizeState, normalizeDistrict } from "./geo";
import { CropIllustration, CropBadge } from "./components/crop-illustrations";
import { CropGuidanceScreen, CropTaskScreen, CropArticleScreen, CropBookmarksScreen } from "./components/crop-guidance";

// ─── Types ────────────────────────────────────────────────────────────────────
type Screen =
  | "splash" | "language" | "login" | "otp" | "farmSetup"
  | "dashboard" | "crops" | "cropAdvisor" | "cropCalendar"
  | "market" | "scan" | "analyzing" | "scanResult" | "scanResultUniversal" | "chat"
  | "profile" | "myFarms" | "expenses" | "schemes" | "forum" | "settings" | "help"
  | "weather" | "calculators" | "fertCalc" | "pestCalc" | "farmCalc" | "askCommunity"
  | "cropDetail" | "cart" | "checkout" | "orderSuccess" | "orders" | "cultivation"
  | "cropGuidance" | "cropTask" | "cropArticle" | "cropBookmarks";

// ─── Design tokens (mirror theme.css for inline use) ─────────────────────────
const C = {
  primary: "#6A994E",
  dark: "#606C38",
  success: "#A7C957",
  accent: "#DDA15E",
  highlight: "#F6BD60",
  bg: "#F8F9F3",
  card: "#FFFFFF",
  fg: "#1C2310",
  muted: "#5A6545",
  border: "rgba(106,153,78,0.18)",
  secondary: "#EEF4E8",
  destructive: "#C44B4B",
};

// ─── Crop database ────────────────────────────────────────────────────────────
type CropDef = { key: string; emoji: string; cat: string };
const CROPS: CropDef[] = [
  { key: "rice", emoji: "🌾", cat: "cat_cereals" },
  { key: "wheat", emoji: "🌾", cat: "cat_cereals" },
  { key: "maize", emoji: "🌽", cat: "cat_cereals" },
  { key: "millets", emoji: "🌾", cat: "cat_cereals" },
  { key: "ragi", emoji: "🌾", cat: "cat_cereals" },
  { key: "jowar", emoji: "🌾", cat: "cat_cereals" },
  { key: "bajra", emoji: "🌾", cat: "cat_cereals" },
  { key: "cotton", emoji: "🧺", cat: "cat_cash" },
  { key: "sugarcane", emoji: "🎋", cat: "cat_cash" },
  { key: "groundnut", emoji: "🥜", cat: "cat_cash" },
  { key: "soybean", emoji: "🫘", cat: "cat_cash" },
  { key: "mustard", emoji: "🌼", cat: "cat_cash" },
  { key: "sunflower", emoji: "🌻", cat: "cat_cash" },
  { key: "sesame", emoji: "🌱", cat: "cat_cash" },
  { key: "turmeric", emoji: "🫚", cat: "cat_spices" },
  { key: "ginger", emoji: "🫚", cat: "cat_spices" },
  { key: "blackpepper", emoji: "⚫", cat: "cat_spices" },
  { key: "cardamom", emoji: "🌿", cat: "cat_spices" },
  { key: "chilli", emoji: "🌶️", cat: "cat_spices" },
  { key: "garlic", emoji: "🧄", cat: "cat_spices" },
  { key: "onion", emoji: "🧅", cat: "cat_vegetables" },
  { key: "tomato", emoji: "🍅", cat: "cat_vegetables" },
  { key: "potato", emoji: "🥔", cat: "cat_vegetables" },
  { key: "brinjal", emoji: "🍆", cat: "cat_vegetables" },
  { key: "okra", emoji: "🌿", cat: "cat_vegetables" },
  { key: "carrot", emoji: "🥕", cat: "cat_vegetables" },
  { key: "beans", emoji: "🫛", cat: "cat_vegetables" },
  { key: "peas", emoji: "🟢", cat: "cat_vegetables" },
  { key: "cabbage", emoji: "🥬", cat: "cat_vegetables" },
  { key: "cauliflower", emoji: "🥦", cat: "cat_vegetables" },
  { key: "spinach", emoji: "🥬", cat: "cat_vegetables" },
  { key: "banana", emoji: "🍌", cat: "cat_fruits" },
  { key: "mango", emoji: "🥭", cat: "cat_fruits" },
  { key: "papaya", emoji: "🫒", cat: "cat_fruits" },
  { key: "guava", emoji: "🍈", cat: "cat_fruits" },
  { key: "pomegranate", emoji: "🍎", cat: "cat_fruits" },
  { key: "coconut", emoji: "🥥", cat: "cat_fruits" },
  { key: "tea", emoji: "🍵", cat: "cat_plantation" },
  { key: "coffee", emoji: "☕", cat: "cat_plantation" },
  { key: "rubber", emoji: "🌳", cat: "cat_plantation" },
  { key: "cashew", emoji: "🌰", cat: "cat_plantation" },
  { key: "arecanut", emoji: "🌴", cat: "cat_plantation" },
];
const CROP_CATEGORIES = ["cat_cereals", "cat_cash", "cat_spices", "cat_vegetables", "cat_fruits", "cat_plantation"];
const cropEmoji = (key: string) => CROPS.find((c) => c.key === key)?.emoji ?? "🌱";

// Build a readable location string from the user's profile (most specific first).
function locationLabel(u: { village: string; district: string; state: string }): string {
  return [u.village, u.district, u.state].filter(Boolean).join(", ");
}

// A small pool of field photos to give user-selected crops rich cards.
const CROP_PHOTOS = [
  "1625246333195-78d9c38ad449", "1574323347407-f5e1ad6d020b",
  "1523741543316-beb7fc7023d8", "1500382017468-9049fed747ef",
];
type CropCard = { crop: string; areaVal: string; health: string; daysLeft: number; color: string; img: string };
// Turn the user's chosen crop keys into display cards with sample agronomy data.
function buildUserCrops(cropKeys: string[], farmSize: string): CropCard[] {
  const total = Number(farmSize) || 0;
  const per = cropKeys.length ? total / cropKeys.length : 0;
  return cropKeys.map((crop, i) => ({
    crop,
    areaVal: per > 0 ? per.toFixed(1) : "0.5",
    health: i % 3 === 1 ? "at_risk" : "healthy",
    daysLeft: 30 + ((i * 17) % 70),
    color: i % 3 === 1 ? "#F6BD60" : "#A7C957",
    img: CROP_PHOTOS[i % CROP_PHOTOS.length],
  }));
}

// ─── Mock data ────────────────────────────────────────────────────────────────
const expenseData = [
  { month: "Feb", income: 8200, expense: 3100 },
  { month: "Mar", income: 11500, expense: 4200 },
  { month: "Apr", income: 9800, expense: 3900 },
  { month: "May", income: 14200, expense: 5500 },
  { month: "Jun", income: 12600, expense: 4800 },
  { month: "Jul", income: 16400, expense: 6200 },
];

// crop = i18n key suffix (crop_<crop>), health = i18n key suffix (health_<health>)
const marketPrices = [
  { crop: "wheat", price: 2150, change: +2.4 },
  { crop: "rice", price: 1960, change: -1.2 },
  { crop: "cotton", price: 6420, change: +3.8 },
  { crop: "onion", price: 880, change: -5.1 },
  { crop: "potato", price: 740, change: +1.7 },
  { crop: "tomato", price: 1320, change: +8.9 },
  { crop: "soybean", price: 4280, change: -0.8 },
  { crop: "maize", price: 1850, change: +1.1 },
];

const mycrops = [
  { crop: "wheat", areaVal: "1.2", health: "healthy", daysLeft: 42, color: "#A7C957", img: "1625246333195-78d9c38ad449" },
  { crop: "rice", areaVal: "0.8", health: "at_risk", daysLeft: 68, color: "#F6BD60", img: "1574323347407-f5e1ad6d020b" },
  { crop: "mustard", areaVal: "0.5", health: "healthy", daysLeft: 22, color: "#A7C957", img: "1523741543316-beb7fc7023d8" },
];

// name/amount/deadline are proper nouns / values kept verbatim; desc is localized via descKey
const schemesList = [
  { name: "PM-KISAN", descKey: "sch_pmkisan_desc", eligible: true, amount: "₹6,000/yr", deadline: "31 Jul 2024" },
  { name: "PM Fasal Bima Yojana", descKey: "sch_bima_desc", eligible: true, amount: "Up to ₹2L", deadline: "15 Aug 2024" },
  { name: "Soil Health Card", descKey: "sch_soil_desc", eligible: true, amount: "Free", deadline: "Ongoing" },
  { name: "Kisan Credit Card", descKey: "sch_kcc_desc", eligible: false, amount: "₹1.6L limit", deadline: "Ongoing" },
  { name: "PMKSY (Irrigation)", descKey: "sch_pmksy_desc", eligible: false, amount: "55% subsidy", deadline: "30 Sep 2024" },
];

// Community forum — authored in each member's own language for an authentic multilingual feel
const forumPosts = [
  { id: 1, title: "मिट्टी का pH कैसे सुधारें?", author: "Ramesh Kumar", district: "Lucknow, UP", answers: 24, views: 312, votes: 47, time: "2h", tag: "crop" },
  { id: 2, title: "ਕਣਕ ਵਿੱਚ ਪੀਲਾ ਰੋਗ ਦਾ ਇਲਾਜ ਕੀ ਹੈ?", author: "Gurpreet Kaur", district: "Sangrur, PB", answers: 18, views: 245, votes: 39, time: "5h", tag: "crop" },
  { id: 3, title: "PM-KISAN అర్హత ఎలా తనిఖీ చేయాలి?", author: "Anjaneyulu R", district: "Guntur, AP", answers: 31, views: 467, votes: 28, time: "1d", tag: "schemes" },
  { id: 4, title: "சொட்டு நீர்ப்பாசன செலவு எவ்வளவு?", author: "Murugan S", district: "Erode, TN", answers: 9, views: 134, votes: 21, time: "2d", tag: "irrigation" },
  { id: 5, title: "টমেটোর আজকের বাজার দর কত?", author: "Sukanta Das", district: "Nadia, WB", answers: 14, views: 198, votes: 17, time: "3d", tag: "market" },
  { id: 6, title: "ಕಬ್ಬಿಗೆ ಯಾವ ಗೊಬ್ಬರ ಉತ್ತಮ?", author: "Manjula H", district: "Mandya, KA", answers: 22, views: 276, votes: 33, time: "4d", tag: "crop" },
];

// ─── Shared Components ────────────────────────────────────────────────────────
function StatusBar({ dark = false }: { dark?: boolean }) {
  const tc = dark ? "text-white" : "text-foreground";
  const bc = dark ? "bg-white" : "bg-foreground";
  return (
    <div className={`flex items-center justify-between px-5 pt-3 pb-1 text-[11px] font-semibold ${tc}`}>
      <span>9:41</span>
      <div className="flex items-center gap-2">
        <div className="flex items-end gap-[2px] h-3">
          {[30, 50, 70, 100].map((h, i) => (
            <div key={i} className={`w-[3px] rounded-[1px] ${bc}`} style={{ height: `${h}%`, opacity: h === 100 ? 1 : h / 100 + 0.2 }} />
          ))}
        </div>
        <Wifi size={11} />
        <div className={`w-5 h-2.5 rounded-[3px] border ${dark ? "border-white" : "border-foreground"} relative`}>
          <div className={`absolute inset-[2px] rounded-[1px] ${bc}`} style={{ width: "75%" }} />
          <div className={`absolute -right-[3px] top-1/2 -translate-y-1/2 w-[3px] h-[6px] rounded-r-[1px] ${bc} opacity-60`} />
        </div>
      </div>
    </div>
  );
}

function BottomNav({ screen, navigate }: { screen: Screen; navigate: (s: Screen) => void }) {
  const { t } = useLang();
  const items: { id: Screen; icon: typeof Home; label: string }[] = [
    { id: "dashboard", icon: Home, label: t("nav_home") },
    { id: "crops", icon: Leaf, label: t("nav_crops") },
    { id: "scan", icon: ScanLine, label: t("nav_scan") },
    { id: "chat", icon: MessageCircle, label: t("nav_chat") },
    { id: "profile", icon: User, label: t("nav_profile") },
  ];
  const active = (s: Screen) =>
    s === screen ||
    (s === "dashboard" && ["myFarms", "expenses", "schemes", "forum", "settings"].includes(screen)) ||
    (s === "crops" && ["cropAdvisor", "cropCalendar", "market"].includes(screen)) ||
    (s === "scan" && screen === "scanResult");

  return (
    <div
      className="absolute bottom-0 left-0 right-0 bg-card flex items-end justify-around px-2 pb-4 pt-2"
      style={{ borderTop: `1px solid ${C.border}`, boxShadow: "0 -4px 20px rgba(0,0,0,0.06)" }}
    >
      {items.map((item) => {
        const isCenter = item.id === "scan";
        const isActive = active(item.id);
        return isCenter ? (
          <button
            key={item.id}
            onClick={() => navigate("scan")}
            className="relative flex flex-col items-center -mt-7"
          >
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg"
              style={{ background: isActive ? C.dark : C.primary }}
            >
              <ScanLine size={26} className="text-white" />
            </div>
            <span className="text-[10px] mt-1 font-semibold" style={{ color: isActive ? C.primary : C.muted }}>
              {item.label}
            </span>
          </button>
        ) : (
          <button
            key={item.id}
            onClick={() => navigate(item.id)}
            className="flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-colors"
          >
            <item.icon size={22} color={isActive ? C.primary : C.muted} strokeWidth={isActive ? 2.2 : 1.7} />
            <span className="text-[10px] font-semibold" style={{ color: isActive ? C.primary : C.muted }}>
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function PageHeader({
  title,
  goBack,
  action,
  dark = false,
}: {
  title: string;
  goBack: () => void;
  action?: React.ReactNode;
  dark?: boolean;
}) {
  return (
    <div className={`flex items-center justify-between px-4 py-3 ${dark ? "text-white" : "text-foreground"}`}>
      <button onClick={goBack} className="w-10 h-10 flex items-center justify-center rounded-full" style={{ background: dark ? "rgba(255,255,255,0.15)" : C.secondary }}>
        <ChevronLeft size={22} color={dark ? "#fff" : C.fg} />
      </button>
      <h1 className="text-lg font-bold">{title}</h1>
      <div className="w-10 h-10 flex items-center justify-center">{action}</div>
    </div>
  );
}

function Badge({ label, color = C.primary }: { label: string; color?: string }) {
  return (
    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full text-white" style={{ background: color }}>
      {label}
    </span>
  );
}

// Map the app language to a BCP-47 tag for the browser speech engine.
const TTS_LANG: Record<string, string> = {
  en: "en-IN", hi: "hi-IN", ta: "ta-IN", te: "te-IN", kn: "kn-IN",
  ml: "ml-IN", bn: "bn-IN", mr: "mr-IN", gu: "gu-IN", pa: "pa-IN", or: "or-IN",
};

// ─── Screen context map (backend-integration-ready) ──────────────────────────
// Each screen exposes its context key and allowed actions.
// A backend LLM reads these to understand what the user can ask on this page.
type VoicePhase = "idle" | "entry" | "listening" | "thinking" | "speaking" | "typing";

const SCREEN_CONTEXT: Record<string, {
  context: string;
  allowedActions: { label: string; icon: string; screen?: Screen }[];
}> = {
  dashboard: {
    context: "dashboard",
    allowedActions: [
      { label: "Check weather", icon: "☀️", screen: "weather" },
      { label: "Scan crop disease", icon: "🦠", screen: "scan" },
      { label: "View market prices", icon: "📊", screen: "market" },
      { label: "My crops", icon: "🌾", screen: "crops" },
      { label: "Gov schemes", icon: "📄", screen: "schemes" },
      { label: "Ask AI", icon: "💬", screen: "chat" },
    ],
  },
  weather: {
    context: "weather",
    allowedActions: [
      { label: "Explain forecast", icon: "🌤️" },
      { label: "Explain rain probability", icon: "🌧️" },
      { label: "Explain spraying window", icon: "💨" },
      { label: "Go to dashboard", icon: "🏠", screen: "dashboard" },
    ],
  },
  market: {
    context: "marketplace",
    allowedActions: [
      { label: "Search products", icon: "🔍" },
      { label: "Compare products", icon: "⚖️" },
      { label: "Read product details", icon: "📋" },
      { label: "Go to dashboard", icon: "🏠", screen: "dashboard" },
    ],
  },
  crops: {
    context: "crop_details",
    allowedActions: [
      { label: "Crop advisor", icon: "🤖", screen: "cropAdvisor" },
      { label: "Crop calendar", icon: "📅", screen: "cropCalendar" },
      { label: "Scan disease", icon: "🦠", screen: "scan" },
    ],
  },
  scan: {
    context: "scan_result",
    allowedActions: [
      { label: "Explain disease", icon: "🔬" },
      { label: "Read medicine dosage", icon: "💊" },
      { label: "Ask AI", icon: "💬", screen: "chat" },
    ],
  },
  forum: {
    context: "community",
    allowedActions: [
      { label: "Ask community", icon: "❓", screen: "askCommunity" },
      { label: "Read posts", icon: "📖" },
      { label: "Go to dashboard", icon: "🏠", screen: "dashboard" },
    ],
  },
  settings: {
    context: "settings",
    allowedActions: [
      { label: "Explain settings", icon: "ℹ️" },
      { label: "Change language", icon: "🌐" },
      { label: "Toggle touch sounds", icon: "🔔" },
    ],
  },
};

// Pipeline stages shown while AI is "thinking" (backend placeholder)
const PIPELINE_STAGES = ["Listening…", "Detecting language…", "Understanding context…", "Thinking…", "Generating response…"];

function VoiceAssistant({ navigate, readText, isLoggedIn = false, screen = "dashboard" as Screen }: {
  navigate: (s: Screen) => void; readText?: string; isLoggedIn?: boolean; screen?: Screen;
}) {
  const { t, lang } = useLang();
  const [open, setOpen] = useState(false);
  const [phase, setPhase] = useState<VoicePhase>("idle");
  const [pipelineStep, setPipelineStep] = useState(0);
  const [typeInput, setTypeInput] = useState("");
  const [response, setResponse] = useState("");

  // Web Speech TTS
  const speak = (text: string) => {
    if (!("speechSynthesis" in window) || !text) return;
    try {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = TTS_LANG[lang] || "en-IN";
      u.rate = 0.92;
      u.onend = () => setPhase("idle");
      setPhase("speaking");
      window.speechSynthesis.speak(u);
    } catch { /* TTS unavailable */ }
  };
  const stopAll = () => {
    try { window.speechSynthesis?.cancel(); } catch { /* noop */ }
    setPhase("idle");
    setResponse("");
    setPipelineStep(0);
  };
  useEffect(() => () => { try { window.speechSynthesis?.cancel(); } catch { /* noop */ } }, []);

  // Close sheet cleanly
  const close = () => { stopAll(); setOpen(false); setTypeInput(""); };

  // Simulate backend pipeline (placeholder — replace with real STT→LLM→TTS)
  const simulatePipeline = (input: string) => {
    setPhase("thinking");
    setPipelineStep(0);
    let step = 0;
    const tick = setInterval(() => {
      step++;
      setPipelineStep(step);
      if (step >= PIPELINE_STAGES.length - 1) {
        clearInterval(tick);
        // Backend response placeholder — replace with actual LLM call
        const placeholder = `[Backend response for: "${input}" on screen "${SCREEN_CONTEXT[screen]?.context ?? screen}"]`;
        setResponse(placeholder);
        speak(placeholder);
      }
    }, 520);
  };

  // Navigate action (only post-login)
  const runAction = (action: { label: string; icon: string; screen?: Screen }) => {
    if (action.screen) {
      setPhase("thinking");
      setTimeout(() => {
        close();
        navigate(action.screen!);
      }, 600);
    } else {
      simulatePipeline(action.label);
    }
  };

  // Draggable FAB
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const drag = useRef<{ sx: number; sy: number; ox: number; oy: number; moved: boolean } | null>(null);
  const onPointerDown = (e: React.PointerEvent) => {
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    drag.current = { sx: e.clientX, sy: e.clientY, ox: pos.x, oy: pos.y, moved: false };
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag.current) return;
    const dx = e.clientX - drag.current.sx; const dy = e.clientY - drag.current.sy;
    if (Math.abs(dx) > 4 || Math.abs(dy) > 4) drag.current.moved = true;
    setPos({ x: Math.min(0, Math.max(-314, drag.current.ox + dx)), y: Math.min(0, Math.max(-660, drag.current.oy + dy)) });
  };
  const onPointerUp = () => { const m = drag.current?.moved; drag.current = null; if (!m) { setPhase("entry"); setOpen(true); } };

  const ctx = SCREEN_CONTEXT[screen];
  const actions = isLoggedIn ? (ctx?.allowedActions ?? SCREEN_CONTEXT.dashboard.allowedActions) : [];

  return (
    <>
      {/* Floating draggable FAB */}
      <button
        onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp}
        className="absolute right-4 z-40 flex items-center justify-center rounded-full shadow-xl active:scale-90 transition-transform touch-none"
        style={{ bottom: 96, width: 60, height: 60, transform: `translate(${pos.x}px,${pos.y}px)`, background: `linear-gradient(135deg,${C.accent},${C.highlight})` }}
        aria-label="Voice assistant"
      >
        <Mic size={26} className="text-white" />
        <span className="absolute inset-0 rounded-full" style={{ animation: "voicePulse 2s infinite" }} />
      </button>

      {open && (
        <div className="absolute inset-0 z-50 flex flex-col justify-end" style={{ background: "rgba(28,35,16,0.6)" }} onClick={close}>
          <div className="bg-card rounded-t-3xl pb-8" onClick={e => e.stopPropagation()} style={{ boxShadow: "0 -8px 40px rgba(0,0,0,0.3)" }}>
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-1"><div className="w-10 h-1 rounded-full" style={{ background: C.border }}/></div>

            {/* Avatar + state */}
            <div className="flex flex-col items-center py-4 px-5">
              {/* Logo avatar with ring animations */}
              <div className="relative flex items-center justify-center mb-3" style={{ width: 88, height: 88 }}>
                {(phase === "listening" || phase === "speaking") && [0,1,2].map(i => (
                  <span key={i} className="absolute rounded-full" style={{
                    width: 88, height: 88,
                    border: `2px solid ${phase === "speaking" ? C.accent : C.primary}`,
                    animation: `voiceRing 1.4s ${i * 0.45}s infinite`,
                  }}/>
                ))}
                <div className="rounded-full flex items-center justify-center overflow-hidden"
                  style={{ width: 72, height: 72, background: "#fff", border: `3px solid ${phase === "listening" ? C.primary : phase === "speaking" ? C.accent : C.border}` }}>
                  <img src={krishiMitraLogo} alt="KrishiMitra AI" style={{ width: 52, height: 52, objectFit:"contain" }}/>
                </div>
              </div>

              <p className="font-bold text-foreground text-base">KrishiMitra AI</p>

              {/* Waveform bars — shown while listening or speaking */}
              {(phase === "listening" || phase === "speaking") && (
                <div className="flex items-end gap-1 my-2" style={{ height: 28 }}>
                  {[0,1,2,3,4,5,6].map(i => (
                    <span key={i} className="w-1.5 rounded-full" style={{
                      background: phase === "listening" ? C.primary : C.accent,
                      height: 8,
                      animation: `soundBar ${0.5 + i * 0.07}s ${i * 0.1}s ease-in-out infinite`,
                    }}/>
                  ))}
                </div>
              )}

              {/* Pipeline indicator while thinking */}
              {phase === "thinking" && (
                <div className="w-full mt-2 mb-1">
                  <div className="flex items-center justify-center gap-1.5 mb-2">
                    {[0,1,2].map(i => <span key={i} className="w-2 h-2 rounded-full" style={{ background: C.primary, animation: `soundBar 0.7s ${i*0.2}s ease-in-out infinite`}}/>)}
                  </div>
                  <p className="text-xs text-center text-muted-foreground font-medium">{PIPELINE_STAGES[pipelineStep]}</p>
                  <div className="mt-2 h-1 rounded-full overflow-hidden" style={{ background: C.border }}>
                    <div className="h-full rounded-full transition-all duration-500" style={{
                      background: `linear-gradient(90deg,${C.primary},${C.accent})`,
                      width: `${((pipelineStep + 1) / PIPELINE_STAGES.length) * 100}%`,
                    }}/>
                  </div>
                </div>
              )}

              {/* Response text */}
              {phase === "speaking" && response && (
                <p className="text-xs text-muted-foreground text-center mt-1 px-2 leading-relaxed">{response}</p>
              )}

              {/* State label */}
              {phase === "entry" && <p className="text-sm text-muted-foreground mt-1">{t("voice_prompt")}</p>}
              {phase === "listening" && <p className="text-sm font-semibold mt-1" style={{ color: C.primary }}>{t("voice_listening")}</p>}
              {phase === "speaking" && !response && <p className="text-sm font-semibold mt-1" style={{ color: C.accent }}>{t("voice_speaking")}</p>}
            </div>

            {/* Typing input */}
            {phase === "typing" && (
              <div className="px-5 mb-3">
                <div className="flex gap-2">
                  <input
                    autoFocus
                    value={typeInput}
                    onChange={e => setTypeInput(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && typeInput.trim() && simulatePipeline(typeInput.trim())}
                    placeholder={t("voice_type_placeholder")}
                    className="flex-1 px-4 py-3 rounded-2xl text-sm outline-none"
                    style={{ border: `1.5px solid ${C.primary}`, background: C.bg, color: C.fg }}
                  />
                  <button onClick={() => typeInput.trim() && simulatePipeline(typeInput.trim())}
                    className="w-12 h-12 rounded-2xl flex items-center justify-center"
                    style={{ background: typeInput.trim() ? C.primary : C.border }}>
                    <Send size={18} color="#fff"/>
                  </button>
                </div>
              </div>
            )}

            {/* Entry options — shown before any action */}
            {phase === "entry" && (
              <div className="px-5 space-y-2 mb-2">
                <button onClick={() => setPhase("listening")}
                  className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl active:scale-95 transition-transform"
                  style={{ background: `linear-gradient(135deg,${C.primary},${C.dark})` }}>
                  <Mic size={20} color="#fff"/>
                  <span className="font-bold text-white text-sm">🎤 {t("voice_speak_btn")}</span>
                </button>
                <button onClick={() => setPhase("typing")}
                  className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl active:scale-95 transition-transform"
                  style={{ background: C.secondary, border: `1.5px solid ${C.border}` }}>
                  <Edit2 size={18} color={C.fg}/>
                  <span className="font-bold text-sm text-foreground">⌨️ {t("voice_type_btn")}</span>
                </button>
                {readText && (
                  <button onClick={() => speak(readText)}
                    className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl active:scale-95 transition-transform"
                    style={{ background: C.secondary, border: `1.5px solid ${C.border}` }}>
                    <Volume2 size={18} color={C.primary}/>
                    <span className="font-bold text-sm text-foreground">🔊 {t("voice_read_page")}</span>
                  </button>
                )}
                <button onClick={close}
                  className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl active:scale-95 transition-transform"
                  style={{ background: "#FFF0F0", border: `1.5px solid ${C.border}` }}>
                  <X size={18} color={C.destructive}/>
                  <span className="font-bold text-sm" style={{ color: C.destructive }}>❌ {t("voice_cancel_btn")}</span>
                </button>
              </div>
            )}

            {/* Stop button while speaking */}
            {phase === "speaking" && (
              <div className="px-5 mb-2">
                <button onClick={stopAll}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl font-bold text-sm"
                  style={{ background: C.secondary, border: `1.5px solid ${C.border}`, color: C.fg }}>
                  <Square size={14}/> {t("voice_stop")}
                </button>
              </div>
            )}

            {/* Auth guard notice */}
            {!isLoggedIn && phase === "entry" && (
              <div className="mx-5 mb-3 p-3 rounded-2xl text-center" style={{ background: "#FFFBEB", border: `1px solid ${C.border}` }}>
                <Lock size={16} color={C.accent} className="mx-auto mb-1"/>
                <p className="text-xs font-semibold text-foreground">{t("voice_login_required")}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{t("voice_login_hint")}</p>
              </div>
            )}

            {/* Context-aware action tiles (post-login only) */}
            {isLoggedIn && (phase === "entry" || phase === "listening") && actions.length > 0 && (
              <div className="px-5 mb-2">
                <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wide mb-2">
                  {t("voice_context_label")}
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {actions.map(a => (
                    <button key={a.label} onClick={() => runAction(a)}
                      className="flex items-center gap-2 px-3 py-2.5 rounded-2xl text-left active:scale-95 transition-transform"
                      style={{ background: C.secondary, border: `1.5px solid ${C.border}` }}>
                      <span className="text-lg">{a.icon}</span>
                      <span className="text-xs font-semibold text-foreground leading-tight">{a.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

// ─── Screens ──────────────────────────────────────────────────────────────────

function SplashScreen() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ background: C.bg }}>
      <StatusBar />
      <div className="flex-1 flex flex-col items-center justify-center gap-8">
        <div className="w-32 h-32 flex items-center justify-center" style={{ animation: "splashScale 0.5s ease-out" }}>
          <img src={krishiMitraLogo} alt="KrishiMitra" className="w-full h-full object-contain" />
        </div>
        {/* Spinner */}
        <svg width="40" height="40" viewBox="0 0 40 40" style={{ opacity: 0.7 }}>
          <circle cx="20" cy="20" r="16" fill="none" stroke={C.border} strokeWidth="3"/>
          <circle cx="20" cy="20" r="16" fill="none" stroke={C.primary} strokeWidth="3"
            strokeLinecap="round" strokeDasharray="60 44"
            style={{ transformOrigin:"20px 20px", animation:"spin 1s linear infinite" }}/>
        </svg>
      </div>
    </div>
  );
}

function LanguageScreen({ navigate }: { navigate: (s: Screen) => void }) {
  const { lang, setLang, t } = useLang();
  // Tapping a language sets it as the global language immediately, so every heading
  // and subtitle on this page live-previews in the chosen language.
  const confirm = () => {
    navigate("login");
  };
  return (
    <div className="absolute inset-0 bg-background flex flex-col">
      <StatusBar />
      <div className="flex-1 px-5 pt-6 pb-4 overflow-y-auto">
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: C.secondary }}>
            <Globe size={30} color={C.primary} />
          </div>
          <h1 className="text-2xl font-bold text-foreground">{t("choose_language")}</h1>
        </div>
        <div className="grid grid-cols-2 gap-3 mb-6">
          {LANGUAGES.map((l) => {
            const isSel = lang === l.code;
            return (
              <button
                key={l.code}
                onClick={() => setLang(l.code)}
                className="relative p-4 rounded-2xl text-left transition-all active:scale-95"
                style={{
                  background: isSel ? C.secondary : C.card,
                  border: `2px solid ${isSel ? C.primary : C.border}`,
                  boxShadow: isSel ? `0 0 0 3px ${C.primary}25` : "0 1px 6px rgba(0,0,0,0.06)",
                }}
              >
                <div className="text-2xl mb-1">{l.flag}</div>
                <div className="font-bold text-foreground text-base">{l.name}</div>
                <div className="text-xs text-muted-foreground">{l.en}</div>
                {isSel && (
                  <div className="absolute top-3 right-3">
                    <CheckCircle size={18} color={C.primary} fill={C.secondary} />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
      {/* Sticky Continue button */}
      <div className="px-5 pb-8 pt-3" style={{ background: C.bg, borderTop: `1px solid ${C.border}` }}>
        <button
          onClick={confirm}
          className="w-full py-4 rounded-2xl text-white font-bold text-lg shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-transform"
          style={{ background: `linear-gradient(135deg, ${C.primary}, ${C.dark})` }}
        >
          <Check size={20} />
          {t("continue_btn")}
        </button>
      </div>
    </div>
  );
}

function LoginScreen({ navigate }: { navigate: (s: Screen) => void }) {
  const { t } = useLang();
  const [phone, setPhone] = useState("");
  return (
    <div className="absolute inset-0 bg-background flex flex-col">
      <StatusBar />
      <div className="flex-1 px-6 pt-8 pb-8 flex flex-col">
        <div className="text-center mb-10">
          <div className="w-20 h-20 flex items-center justify-center mx-auto mb-5">
            <img src={krishiMitraLogo} alt="KrishiMitra" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-2xl font-extrabold text-foreground">{t("login_welcome")}</h1>
          <p className="text-muted-foreground mt-1">{t("login_enter_mobile")}</p>
        </div>
        <div className="flex-1">
          <label className="text-sm font-semibold text-foreground mb-2 block">{t("mobile_number")}</label>
          <div className="flex gap-3 mb-6">
            <div
              className="flex items-center gap-2 px-3 rounded-2xl font-semibold text-foreground"
              style={{ background: C.card, border: `1.5px solid ${C.border}`, minWidth: 72 }}
            >
              <span className="text-lg">🇮🇳</span>
              <span>+91</span>
            </div>
            <input
              type="tel"
              maxLength={10}
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
              placeholder="98765 43210"
              className="flex-1 px-4 py-4 rounded-2xl text-lg font-medium outline-none"
              style={{ background: C.card, border: `1.5px solid ${C.border}` }}
            />
          </div>
          <button
            onClick={() => navigate("otp")}
            disabled={phone.length !== 10}
            className="w-full py-4 rounded-2xl text-white font-bold text-lg shadow-lg transition-all active:scale-95"
            style={{
              background: phone.length === 10 ? `linear-gradient(135deg, ${C.primary}, ${C.dark})` : "#ccc",
            }}
          >
            {t("send_otp")}
          </button>
          <div
            className="mt-6 p-4 rounded-2xl flex items-start gap-3"
            style={{ background: C.secondary }}
          >
            <Shield size={18} color={C.primary} className="mt-0.5 shrink-0" />
            <p className="text-xs text-muted-foreground leading-relaxed">
              {t("data_safe")}
            </p>
          </div>
        </div>
        <p className="text-center text-xs text-muted-foreground mt-4">
          {t("terms_agree")}
        </p>
      </div>
    </div>
  );
}

function OTPScreen({ navigate }: { navigate: (s: Screen) => void }) {
  const { t } = useLang();
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [timer, setTimer] = useState(30);
  const [error, setError] = useState(false);
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  useEffect(() => {
    const iv = setInterval(() => setTimer((v) => Math.max(0, v - 1)), 1000);
    return () => clearInterval(iv);
  }, []);
  const handleInput = (i: number, v: string) => {
    if (!/^\d?$/.test(v)) return;
    const next = [...otp];
    next[i] = v;
    setOtp(next);
    setError(false);
    if (v && i < 3) refs.current[i + 1]?.focus();
  };
  const handleKey = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[i] && i > 0) refs.current[i - 1]?.focus();
  };
  const complete = otp.every((d) => d !== "");
  const verify = () => {
    if (!complete) { setError(true); return; }
    navigate("farmSetup");
  };
  return (
    <div className="absolute inset-0 bg-background flex flex-col">
      <StatusBar />
      <div className="px-6 pt-4 pb-8 flex flex-col h-full">
        <button onClick={() => navigate("login")} className="w-10 h-10 rounded-full flex items-center justify-center mb-6" style={{ background: C.secondary }}>
          <ChevronLeft size={22} color={C.fg} />
        </button>
        <div className="mb-8">
          <h1 className="text-2xl font-extrabold text-foreground">{t("enter_otp")}</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            {t("otp_sent_to")}
          </p>
        </div>
        <div className="flex gap-3 mb-3">
          {otp.map((d, i) => (
            <input
              key={i}
              ref={(el) => { refs.current[i] = el; }}
              type="tel"
              inputMode="numeric"
              maxLength={1}
              value={d}
              onChange={(e) => handleInput(i, e.target.value)}
              onKeyDown={(e) => handleKey(i, e)}
              className="w-16 h-16 text-center text-2xl font-bold rounded-2xl outline-none transition-all"
              style={{
                border: `2px solid ${error ? C.destructive : d ? C.primary : C.border}`,
                background: d ? C.secondary : C.card,
                color: C.fg,
              }}
            />
          ))}
        </div>
        {error && (
          <p className="text-sm font-semibold mb-3" style={{ color: C.destructive }}>{t("otp_incomplete")}</p>
        )}
        <button
          onClick={verify}
          disabled={!complete}
          className="w-full py-4 rounded-2xl text-white font-bold text-lg shadow-lg mb-4 mt-4 active:scale-95 transition-transform"
          style={{ background: complete ? `linear-gradient(135deg, ${C.primary}, ${C.dark})` : "#ccc" }}
        >
          {t("otp_verify")}
        </button>
        <div className="text-center">
          {timer > 0 ? (
            <p className="text-muted-foreground text-sm">
              {t("otp_resend_in")}{" "}
              <span style={{ color: C.primary }} className="font-semibold">
                0:{String(timer).padStart(2, "0")}
              </span>
            </p>
          ) : (
            <button style={{ color: C.primary }} className="font-semibold text-sm" onClick={() => setTimer(30)}>
              {t("resend_otp")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// A lightweight searchable dropdown (used for State & District selection).
function SearchableSelect({ value, options, placeholder, disabled, onChange }: {
  value: string; options: string[]; placeholder: string; disabled?: boolean; onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const boxRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => { if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);
  const filtered = q ? options.filter((o) => o.toLowerCase().includes(q.toLowerCase())) : options;
  return (
    <div ref={boxRef} className="relative mb-4">
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((o) => !o)}
        className="w-full px-4 py-4 rounded-2xl text-base outline-none flex items-center justify-between text-left"
        style={{ border: `1.5px solid ${C.border}`, background: disabled ? "#f0f0ec" : C.card, color: value ? C.fg : C.muted, opacity: disabled ? 0.6 : 1 }}
      >
        <span className="truncate">{value || placeholder}</span>
        <ChevronDown size={18} color={C.muted} className="shrink-0" />
      </button>
      {open && !disabled && (
        <div className="absolute z-30 mt-1 w-full rounded-2xl overflow-hidden" style={{ background: C.card, border: `1.5px solid ${C.border}`, boxShadow: "0 12px 30px rgba(0,0,0,0.15)" }}>
          <div className="p-2 sticky top-0" style={{ background: C.card }}>
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ background: C.secondary }}>
              <Search size={15} color={C.muted} />
              <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search…" className="flex-1 bg-transparent outline-none text-sm" />
            </div>
          </div>
          <div className="max-h-56 overflow-y-auto pb-1">
            {filtered.length === 0 && <p className="px-4 py-3 text-sm text-muted-foreground">No matches</p>}
            {filtered.map((o) => (
              <button key={o} type="button" onClick={() => { onChange(o); setOpen(false); setQ(""); }}
                className="w-full text-left px-4 py-2.5 text-sm active:opacity-70"
                style={{ background: o === value ? C.secondary : "transparent", color: o === value ? C.primary : C.fg, fontWeight: o === value ? 700 : 500 }}>
                {o}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Letters, spaces and common name punctuation only — blocks digits/symbols.
const lettersOnly = (s: string) => s.replace(/[^a-zA-Zऀ-෿\s.'-]/g, "");

function FarmSetupScreen({ navigate }: { navigate: (s: Screen) => void }) {
  const { t } = useLang();
  const { setUser } = useUser();
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [village, setVillage] = useState("");
  const [district, setDistrict] = useState("");
  const [state, setState] = useState("");
  const [area, setArea] = useState("");
  const [unit, setUnit] = useState("acres");
  const [landType, setLandType] = useState("");
  const [cropCounts, setCropCounts] = useState<Record<string, number>>({});
  const [cropSearch, setCropSearch] = useState("");
  const [detecting, setDetecting] = useState(false);
  const [detectMsg, setDetectMsg] = useState("");
  const districtOptions = state && DISTRICTS[state] ? DISTRICTS[state] : [];

  // Auto-detect location via the browser Geolocation API + free reverse geocoder.
  const detectLocation = () => {
    if (!("geolocation" in navigator)) { setDetectMsg(t("loc_unsupported")); return; }
    setDetecting(true); setDetectMsg("");
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const res = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`);
          const data = await res.json();
          const st = normalizeState(data.principalSubdivision || "");
          if (st) {
            setState(st);
            const dist = normalizeDistrict(st, data.city || data.locality || "");
            setDistrict(dist);
          }
          if (data.locality) setVillage(data.locality);
          setDetectMsg(st ? t("loc_detected") : t("loc_failed"));
        } catch {
          setDetectMsg(t("loc_failed"));
        } finally { setDetecting(false); }
      },
      () => { setDetecting(false); setDetectMsg(t("loc_denied")); },
      { timeout: 10000 }
    );
  };

  const units = ["acres", "hectares", "bigha"];
  const landTypeKeys = ["land_irrigated", "land_rainfed", "land_mixed", "land_horticultural"];
  const selectedCropKeys = Object.keys(cropCounts);
  const addCrop = (key: string) => setCropCounts(p => ({ ...p, [key]: (p[key] || 0) + 1 }));
  const decCrop = (key: string) => setCropCounts(p => {
    const n = { ...p };
    if ((n[key] || 0) > 1) n[key]--;
    else delete n[key];
    return n;
  });
  const removeCrop = (key: string) => setCropCounts(p => { const n = { ...p }; delete n[key]; return n; });
  const toggleCrop = (key: string) => cropCounts[key] ? removeCrop(key) : addCrop(key);
  const q = cropSearch.trim().toLowerCase();
  const cropMatches = (c: CropDef) => !q || t(`crop_${c.key}`).toLowerCase().includes(q) || c.key.includes(q);
  const canProceed = step === 0 ? name.trim() !== "" && state !== "" && district !== "" && village.trim() !== ""
    : step === 1 ? Number(area) > 0 && landType !== ""
    : selectedCropKeys.length >= 1;
  const finish = () => {
    setUser({
      name: name.trim(), village: village.trim(), district: district.trim(), state,
      farmSize: area, unit, landType, crops: selectedCropKeys, onboarded: true,
    });
    navigate("dashboard");
  };

  return (
    <div className="absolute inset-0 bg-background flex flex-col">
      <StatusBar />
      <div className="px-5 pt-4 flex-1 overflow-y-auto pb-8">
        {/* Progress */}
        <div className="flex items-center gap-2 mb-6">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: C.border }}>
              <div className="h-full rounded-full transition-all" style={{ background: C.primary, width: step >= i ? "100%" : "0%" }} />
            </div>
          ))}
        </div>
        {step === 0 && (
          <div>
            <p className="text-xs font-semibold mb-1" style={{ color: C.primary }}>{t("setup_step")} 1 {t("setup_of")} 3</p>
            <h2 className="text-2xl font-extrabold text-foreground mb-4">{t("setup_about_you")}</h2>

            {/* Auto-detect location */}
            <button
              type="button"
              onClick={detectLocation}
              disabled={detecting}
              className="w-full mb-5 py-3 rounded-2xl flex items-center justify-center gap-2 font-semibold text-sm active:scale-95 transition-transform"
              style={{ background: C.secondary, color: C.primary, border: `1.5px solid ${C.primary}` }}
            >
              {detecting ? <Loader2 size={16} className="animate-spin" /> : <Navigation size={16} />}
              {detecting ? t("loc_detecting") : t("loc_autodetect")}
            </button>
            {detectMsg && <p className="text-xs mb-4 -mt-2 text-center" style={{ color: C.muted }}>{detectMsg}</p>}

            <label className="block text-sm font-semibold text-foreground mb-2">{t("setup_your_name")}</label>
            <input
              value={name}
              onChange={(e) => setName(lettersOnly(e.target.value))}
              placeholder={t("name_placeholder")}
              className="w-full px-4 py-4 rounded-2xl text-base outline-none mb-4"
              style={{ border: `1.5px solid ${C.border}`, background: C.card }}
            />

            <label className="block text-sm font-semibold text-foreground mb-2">{t("setup_choose_state")}</label>
            <SearchableSelect
              value={state}
              options={STATES}
              placeholder={t("setup_choose_state_placeholder")}
              onChange={(v) => { setState(v); setDistrict(""); }}
            />

            <label className="block text-sm font-semibold text-foreground mb-2">{t("setup_district")}</label>
            <SearchableSelect
              value={district}
              options={districtOptions}
              placeholder={state ? t("district_placeholder") : t("district_pick_state_first")}
              disabled={!state}
              onChange={setDistrict}
            />

            <label className="block text-sm font-semibold text-foreground mb-2">{t("setup_village")}</label>
            <input
              value={village}
              onChange={(e) => setVillage(lettersOnly(e.target.value))}
              placeholder={t("village_placeholder")}
              className="w-full px-4 py-4 rounded-2xl text-base outline-none mb-4"
              style={{ border: `1.5px solid ${C.border}`, background: C.card }}
            />
          </div>
        )}
        {step === 1 && (
          <div>
            <p className="text-xs font-semibold mb-1" style={{ color: C.primary }}>{t("setup_step")} 2 {t("setup_of")} 3</p>
            <h2 className="text-2xl font-extrabold text-foreground mb-6">{t("setup_land_q")}</h2>
            <label className="block text-sm font-semibold text-foreground mb-2">{t("setup_total_area")}</label>
            <div className="flex gap-3 mb-4">
              <input
                type="text"
                inputMode="decimal"
                value={area}
                onChange={(e) => setArea(e.target.value.replace(/[^0-9.]/g, ""))}
                placeholder={t("area_placeholder")}
                className="flex-1 px-4 py-4 rounded-2xl text-base outline-none"
                style={{ border: `1.5px solid ${C.border}`, background: C.card }}
              />
              <div className="relative flex-shrink-0">
                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="h-full px-3 py-4 rounded-2xl outline-none appearance-none pr-8 text-sm font-semibold"
                  style={{ border: `1.5px solid ${C.border}`, background: C.card, minWidth: 100 }}
                >
                  {units.map((u) => <option key={u} value={u}>{t(`unit_${u}_opt`)}</option>)}
                </select>
                <ChevronDown size={14} color={C.muted} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
            <label className="block text-sm font-semibold text-foreground mb-3">{t("setup_land_type")}</label>
            <div className="grid grid-cols-2 gap-3">
              {landTypeKeys.map((lt) => (
                <button
                  key={lt}
                  onClick={() => setLandType(lt)}
                  className="p-3 rounded-2xl text-left text-sm font-medium transition-all active:scale-95"
                  style={{
                    border: `2px solid ${landType === lt ? C.primary : C.border}`,
                    background: landType === lt ? C.secondary : C.card,
                    color: landType === lt ? C.primary : C.fg,
                    fontWeight: landType === lt ? 700 : 500,
                  }}
                >
                  {t(lt)}
                </button>
              ))}
            </div>
          </div>
        )}
        {step === 2 && (
          <div>
            <p className="text-xs font-semibold mb-1" style={{ color: C.primary }}>{t("setup_step")} 3 {t("setup_of")} 3</p>
            <h2 className="text-2xl font-extrabold text-foreground mb-2">{t("setup_crops_q")}</h2>
            <p className="text-sm text-muted-foreground mb-4">{t("setup_select_crops_hint")}</p>
            <div className="relative mb-3">
              <Search size={18} style={{ color: C.muted }} className="absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                value={cropSearch}
                onChange={(e) => setCropSearch(e.target.value)}
                placeholder={t("search_crop")}
                className="w-full pl-10 pr-3 py-3 rounded-2xl text-sm outline-none"
                style={{ background: C.card, border: `1.5px solid ${C.border}`, color: C.fg }}
              />
            </div>
            {/* Selected crops with quantity steppers */}
            {selectedCropKeys.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {selectedCropKeys.map(k => (
                  <div key={k}
                    className="flex items-center gap-1 pl-1.5 pr-1.5 py-1 rounded-full"
                    style={{ background: C.secondary, border: `1.5px solid ${C.primary}` }}>
                    <CropIllustration crop={k} size={20} />
                    <span className="text-[11px] font-bold mx-1" style={{ color: C.fg }}>{t(`crop_${k}`)}</span>
                    <button onClick={() => decCrop(k)}
                      className="w-5 h-5 rounded-full flex items-center justify-center"
                      style={{ background: C.border }}>
                      <span className="text-xs font-bold leading-none" style={{ color: C.fg }}>−</span>
                    </button>
                    <span className="text-xs font-extrabold min-w-[16px] text-center" style={{ color: C.primary }}>{cropCounts[k]}</span>
                    <button onClick={() => addCrop(k)}
                      className="w-5 h-5 rounded-full flex items-center justify-center"
                      style={{ background: C.primary }}>
                      <span className="text-xs font-bold leading-none text-white">+</span>
                    </button>
                    <button onClick={() => removeCrop(k)} className="ml-0.5">
                      <X size={12} color={C.muted} />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <p className="text-xs font-semibold mb-4" style={{ color: selectedCropKeys.length >= 1 ? C.primary : C.accent }}>
              {selectedCropKeys.length >= 1
                ? `${selectedCropKeys.length} ${t("crops_selected_count")}`
                : t("crops_need_one")}
            </p>
            <div className="space-y-5 mb-4">
              {CROP_CATEGORIES.map((cat) => {
                const list = CROPS.filter((c) => c.cat === cat && cropMatches(c));
                if (list.length === 0) return null;
                return (
                  <div key={cat}>
                    <p className="text-xs font-bold uppercase tracking-wide mb-2.5" style={{ color: C.muted }}>{t(cat)}</p>
                    <div className="grid grid-cols-4 gap-2">
                      {list.map((c) => {
                        const count = cropCounts[c.key] || 0;
                        const sel = count > 0;
                        return (
                          <button
                            key={c.key}
                            onClick={() => toggleCrop(c.key)}
                            className="relative flex flex-col items-center gap-1 py-2 px-1 rounded-2xl transition-all active:scale-95"
                            style={{
                              background: sel ? C.secondary : C.card,
                              border: `2px solid ${sel ? C.primary : C.border}`,
                            }}
                          >
                            {sel && (
                              <span className="absolute top-1 right-1 flex items-center justify-center rounded-full z-10 text-white"
                                style={{ minWidth: 16, height: 16, background: C.primary, fontSize: 9, fontWeight: 800, padding: "0 3px" }}>
                                {count > 1 ? count : <Check size={9} strokeWidth={3} />}
                              </span>
                            )}
                            <CropBadge crop={c.key} size={44} bg={sel ? C.secondary : "#EEF4E8"} />
                            <span className="text-[9px] font-semibold text-center leading-tight w-full truncate px-0.5"
                              style={{ color: sel ? C.primary : C.fg }}>
                              {t(`crop_${c.key}`)}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
      {/* Sticky footer — always spaced away from the content above */}
      <div className="px-5 pt-3 pb-6 shrink-0" style={{ background: C.bg, borderTop: `1px solid ${C.border}` }}>
        <div className="flex gap-3">
          {step > 0 && (
            <button
              onClick={() => setStep(step - 1)}
              className="px-6 py-4 rounded-2xl font-bold text-base active:scale-95 transition-transform"
              style={{ background: C.secondary, color: C.primary }}
            >
              {t("back")}
            </button>
          )}
          <button
            onClick={() => {
              if (!canProceed) return;
              step < 2 ? setStep(step + 1) : finish();
            }}
            disabled={!canProceed}
            className="flex-1 py-4 rounded-2xl text-white font-bold text-lg shadow-lg active:scale-95 transition-transform"
            style={{
              background: !canProceed ? "#ccc" : `linear-gradient(135deg, ${C.primary}, ${C.dark})`,
            }}
          >
            {step < 2 ? t("next") : t("start")}
          </button>
        </div>
      </div>
    </div>
  );
}

function NotificationsPanel({ onClose }: { onClose: () => void }) {
  const { t } = useLang();
  const [items, setItems] = useState(
    [1, 2, 3, 4].map((n) => ({
      id: n,
      title: t(`notif_${n}_title`),
      body: t(`notif_${n}_body`),
      time: t(`notif_${n}_time`),
      read: false,
    }))
  );
  const icons: Record<number, { icon: typeof Bell; color: string }> = {
    1: { icon: AlertTriangle, color: C.accent },
    2: { icon: TrendingUp, color: C.primary },
    3: { icon: Droplets, color: "#4A9FD4" },
    4: { icon: FileText, color: "#9B6DC5" },
  };
  return (
    <div className="absolute inset-0 z-50 flex flex-col justify-end" style={{ background: "rgba(28,35,16,0.55)" }} onClick={onClose}>
      <div className="bg-card rounded-t-3xl pb-8 max-h-[75%] flex flex-col" onClick={(e) => e.stopPropagation()} style={{ boxShadow: "0 -8px 40px rgba(0,0,0,0.25)" }}>
        <div className="w-10 h-1 rounded-full mx-auto mt-3 mb-3" style={{ background: C.border }} />
        <div className="flex items-center justify-between px-5 pb-3">
          <p className="font-bold text-foreground text-lg">{t("notif_title")}</p>
          <button onClick={() => setItems((it) => it.map((i) => ({ ...i, read: true })))} className="text-sm font-semibold" style={{ color: C.primary }}>
            {t("notif_mark_read")}
          </button>
        </div>
        <div className="overflow-y-auto px-4">
          {items.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground py-10">{t("notif_empty")}</p>
          ) : (
            items.map((n) => {
              const ic = icons[n.id];
              return (
                <div key={n.id} className="flex gap-3 p-3 mb-2 rounded-2xl" style={{ background: n.read ? C.card : C.secondary, border: `1px solid ${C.border}` }}>
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: ic.color + "18" }}>
                    <ic.icon size={18} color={ic.color} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-sm text-foreground">{n.title}</p>
                      {!n.read && <div className="w-2 h-2 rounded-full shrink-0" style={{ background: C.accent }} />}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{n.body}</p>
                    <p className="text-[10px] mt-1" style={{ color: C.muted }}>{n.time}</p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

function DashboardScreen({ navigate }: { navigate: (s: Screen) => void }) {
  const { t } = useLang();
  const { user } = useUser();
  const { setSelectedCrop } = useStore();
  const [notifOpen, setNotifOpen] = useState(false);
  const loc = locationLabel(user);
  const displayCrops = user.crops.length > 0 ? buildUserCrops(user.crops, user.farmSize) : mycrops;
  const unitLabel = t(`unit_${user.unit || "acres"}`);
  const openCrop = (crop: string) => { setSelectedCrop(crop); navigate("cropDetail"); };
  const quickActions = [
    { icon: BarChart2, label: t("market_prices"), color: C.accent, screen: "market" as Screen },
    { icon: BookOpen, label: t("quick_cultivation"), color: C.primary, screen: "cultivation" as Screen },
    { icon: FileText, label: t("gov_schemes"), color: "#5B7FC4", screen: "schemes" as Screen },
    { icon: Users, label: t("community"), color: "#C27BB0", screen: "forum" as Screen },
  ];
  return (
    <div className="absolute inset-0 bg-background flex flex-col overflow-hidden">
      <div style={{ background: `linear-gradient(160deg, ${C.primary} 0%, ${C.dark} 100%)` }}>
        <StatusBar dark />
        <div className="px-5 pb-5 pt-1">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-white/70 text-sm font-medium">{t("greeting")}</p>
              <h1 className="text-2xl font-extrabold text-white">{user.name || t("greeting")}</h1>
              {loc && (
                <div className="flex items-center gap-1.5 mt-1">
                  <MapPin size={13} className="text-white/70" />
                  <span className="text-white/70 text-xs">{loc}</span>
                </div>
              )}
            </div>
            <button onClick={() => setNotifOpen(true)} className="w-11 h-11 rounded-full flex items-center justify-center relative" style={{ background: "rgba(255,255,255,0.18)" }}>
              <Bell size={20} className="text-white" />
              <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#F6BD60] border border-white" />
            </button>
          </div>
          {/* Weather card */}
          <button onClick={() => navigate("weather")} className="w-full rounded-2xl p-4 flex items-center justify-between active:scale-[0.98] transition-transform" style={{ background: "rgba(255,255,255,0.15)" }}>
            <div className="flex items-center gap-3">
              <Sun size={30} className="text-[#F6BD60]" />
              <div>
                <p className="text-white font-bold text-lg">{t("weather_temp")}</p>
                <p className="text-white/70 text-xs">{t("weather_condition")}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1.5 justify-end">
                <Droplets size={14} className="text-blue-200" />
                <span className="text-white text-xs">{t("weather_rain")}</span>
              </div>
              <div className="flex items-center gap-1.5 justify-end mt-1">
                <Wind size={14} className="text-white/60" />
                <span className="text-white/70 text-xs">{t("weather_wind")}</span>
              </div>
            </div>
          </button>
        </div>
      </div>
      {notifOpen && <NotificationsPanel onClose={() => setNotifOpen(false)} />}

      <div className="flex-1 overflow-y-auto pb-24 px-4 pt-4">
        {/* Alert */}
        <div className="rounded-2xl p-3.5 mb-4 flex items-start gap-3" style={{ background: "#FFF8EC", border: `1px solid ${C.highlight}` }}>
          <AlertTriangle size={18} color={C.accent} className="shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold" style={{ color: C.dark }}>⚠️ {t("pest_alert_title")}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{t("pest_alert_body")}</p>
          </div>
        </div>

        {/* Quick Actions */}
        <h2 className="text-base font-bold text-foreground mb-3">{t("quick_actions")}</h2>
        <div className="grid grid-cols-2 gap-3 mb-5">
          {quickActions.map((a) => (
            <button
              key={a.label}
              onClick={() => navigate(a.screen)}
              className="bg-card rounded-2xl p-4 flex items-center gap-3 text-left active:scale-95 transition-transform"
              style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.06)", border: `1px solid ${C.border}` }}
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: a.color + "18" }}>
                <a.icon size={20} color={a.color} />
              </div>
              <span className="font-semibold text-sm text-foreground leading-tight">{a.label}</span>
            </button>
          ))}
        </div>

        {/* My Crops */}
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-bold text-foreground">{t("my_crops")}</h2>
          <button onClick={() => navigate("crops")} style={{ color: C.primary }} className="text-sm font-semibold">{t("see_all")}</button>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 mb-5" style={{ scrollbarWidth: "none" }}>
          {displayCrops.map((c) => (
            <div
              key={c.crop}
              className="bg-card rounded-2xl shrink-0 overflow-hidden cursor-pointer"
              style={{ width: 150, boxShadow: "0 2px 12px rgba(0,0,0,0.07)", border: `1px solid ${C.border}` }}
              onClick={() => openCrop(c.crop)}
            >
              <div className="h-24 relative flex items-center justify-center" style={{ background: c.color + "30" }}>
                <CropBadge crop={c.crop} size={60} bg="transparent" />
                <div className="absolute top-2 right-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white" style={{ background: c.health === "healthy" ? C.primary : C.accent }}>
                    {t(`health_${c.health}`)}
                  </span>
                </div>
              </div>
              <div className="p-3">
                <p className="font-bold text-sm text-foreground">{t(`crop_${c.crop}`)}</p>
                <p className="text-xs text-muted-foreground">{c.areaVal} {unitLabel}</p>
                <p className="text-xs font-semibold mt-1" style={{ color: C.primary }}>{c.daysLeft} {t("days_to_harvest")}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Market Prices */}
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-bold text-foreground">{t("todays_prices")}</h2>
          <button onClick={() => navigate("market")} style={{ color: C.primary }} className="text-sm font-semibold">{t("view_all")}</button>
        </div>
        <div className="bg-card rounded-2xl overflow-hidden mb-5" style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.06)", border: `1px solid ${C.border}` }}>
          {marketPrices.slice(0, 4).map((p, i) => (
            <div key={p.crop} className={`flex items-center justify-between px-4 py-3.5 ${i < 3 ? "border-b" : ""}`} style={{ borderColor: C.border }}>
              <span className="text-sm font-semibold text-foreground">{t(`crop_${p.crop}`)}</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-foreground">₹{p.price.toLocaleString()}</span>
                <div className="flex items-center gap-0.5" style={{ color: p.change > 0 ? C.primary : C.destructive }}>
                  {p.change > 0 ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
                  <span className="text-xs font-semibold">{Math.abs(p.change)}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tips */}
        <h2 className="text-base font-bold text-foreground mb-3">{t("farming_tips")}</h2>
        <div className="rounded-2xl overflow-hidden relative h-36" style={{ background: `linear-gradient(135deg, ${C.dark}, ${C.primary})` }}>
          <img src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&h=180&fit=crop&auto=format" alt="farm" className="absolute inset-0 w-full h-full object-cover opacity-30" />
          <div className="relative p-4">
            <Badge label={t("tip_badge")} color={C.highlight} />
            <p className="text-white font-bold mt-2 text-sm leading-snug">{t("tip_text")}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function CropsScreen({ navigate, goBack }: { navigate: (s: Screen) => void; goBack: () => void }) {
  const { t } = useLang();
  const { user, setUser } = useUser();
  const { setSelectedCrop } = useStore();
  const openCrop = (crop: string) => { setSelectedCrop(crop); navigate("cropDetail"); };
  const healthColor = (h: string) => h === "healthy" ? C.primary : h === "at_risk" ? C.accent : C.destructive;
  const [addingCrop, setAddingCrop] = useState(false);
  const [cropSearch, setCropSearch] = useState("");
  const crops = user.crops.length > 0 ? buildUserCrops(user.crops, user.farmSize) : mycrops;
  const unitLabel = t(`unit_${user.unit || "acres"}`);
  const q = cropSearch.trim().toLowerCase();
  const addable = CROPS.filter((c) => !user.crops.includes(c.key) && (!q || t(`crop_${c.key}`).toLowerCase().includes(q) || c.key.includes(q)));
  const addCrop = (crop: string) => {
    if (!user.crops.includes(crop)) setUser({ crops: [...user.crops, crop] });
    setCropSearch("");
    setAddingCrop(false);
  };
  return (
    <div className="absolute inset-0 bg-background flex flex-col">
      <StatusBar />
      <PageHeader title={t("page_crops")} goBack={goBack} action={
        <button onClick={() => setAddingCrop(!addingCrop)} className="w-10 h-10 flex items-center justify-center rounded-full" style={{ background: addingCrop ? C.primary : C.secondary }}>
          <Plus size={20} color={addingCrop ? "#fff" : C.primary} />
        </button>
      } />
      {addingCrop && (
        <div className="mx-4 mb-3 p-4 rounded-2xl" style={{ background: C.secondary, border: `1.5px solid ${C.primary}` }}>
          <p className="text-sm font-bold text-foreground mb-3">{t("new_crop_prompt")}</p>
          <div className="relative mb-3">
            <Search size={18} style={{ color: C.muted }} className="absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              value={cropSearch}
              onChange={(e) => setCropSearch(e.target.value)}
              placeholder={t("search_crop")}
              className="w-full pl-10 pr-3 py-2.5 rounded-xl text-sm outline-none"
              style={{ background: C.card, border: `1.5px solid ${C.border}`, color: C.fg }}
            />
          </div>
          <div className="grid grid-cols-4 gap-2 max-h-52 overflow-y-auto">
            {addable.map((c) => (
              <button
                key={c.key}
                onClick={() => addCrop(c.key)}
                className="flex flex-col items-center gap-1 py-2.5 px-1 rounded-xl bg-card active:scale-95"
                style={{ border: `1.5px solid ${C.border}` }}
              >
                <span className="text-2xl leading-none">{c.emoji}</span>
                <span className="text-[10px] font-semibold text-center leading-tight" style={{ color: C.fg }}>{t(`crop_${c.key}`)}</span>
              </button>
            ))}
          </div>
        </div>
      )}
      <div className="flex-1 overflow-y-auto px-4 pb-24">
        {crops.map((c) => (
          <button
            key={c.crop}
            onClick={() => openCrop(c.crop)}
            className="w-full bg-card rounded-2xl mb-4 overflow-hidden text-left active:scale-[0.98] transition-transform"
            style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.08)", border: `1px solid ${C.border}` }}
          >
            <div className="flex">
              <div className="w-28 h-28 shrink-0 relative flex items-center justify-center" style={{ background: c.color + "30" }}>
                <CropBadge crop={c.crop} size={72} bg="transparent" />
              </div>
              <div className="flex-1 p-4">
                <div className="flex items-start justify-between mb-1">
                  <div>
                    <h3 className="font-bold text-foreground">{t(`crop_${c.crop}`)}</h3>
                  </div>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full text-white" style={{ background: healthColor(c.health) }}>
                    {t(`health_${c.health}`)}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 mb-1">
                  <MapPin size={12} color={C.muted} />
                  <span className="text-xs text-muted-foreground">{c.areaVal} {unitLabel}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock size={12} color={C.muted} />
                  <span className="text-xs text-muted-foreground">{c.daysLeft} {t("days_to_harvest_full")}</span>
                </div>
                <div className="mt-2 w-full h-1.5 rounded-full overflow-hidden" style={{ background: C.secondary }}>
                  <div className="h-full rounded-full" style={{ background: healthColor(c.health), width: `${100 - (c.daysLeft / 120) * 100}%` }} />
                </div>
              </div>
            </div>
          </button>
        ))}
        <button onClick={() => setAddingCrop(true)} className="w-full py-4 rounded-2xl font-bold text-base border-2 border-dashed transition-all flex items-center justify-center gap-2 active:scale-95" style={{ borderColor: C.primary, color: C.primary }}>
          <Plus size={20} />
          {t("add_new_crop")}
        </button>
      </div>
    </div>
  );
}

function CropAdvisorScreen({ goBack }: { navigate: (s: Screen) => void; goBack: () => void }) {
  const { t } = useLang();
  const [activeTab, setActiveTab] = useState(0);
  const tabs = [t("tab_summary"), t("tab_irrigation"), t("tab_pest")];
  return (
    <div className="absolute inset-0 bg-background flex flex-col">
      <div style={{ background: `linear-gradient(160deg, ${C.primary}, ${C.dark})` }}>
        <StatusBar dark />
        <PageHeader title={t("page_crop_advisor")} goBack={goBack} dark />
        <div className="px-5 pb-5 pt-2">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-white/30">
              <img src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=100&h=100&fit=crop&auto=format" alt="wheat" className="w-full h-full object-cover" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-white">{t("crop_wheat")}</h2>
              <p className="text-white/70 text-sm">1.2 {t("unit_acres")} · {t("adv_sown")}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full text-white bg-[#A7C957]">{t("health_healthy")}</span>
                <span className="text-white/70 text-xs">42 {t("days_to_harvest_full")}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex border-b px-4" style={{ borderColor: C.border, background: C.card }}>
        {tabs.map((t, i) => (
          <button
            key={t}
            onClick={() => setActiveTab(i)}
            className="flex-1 py-3 text-sm font-semibold transition-colors"
            style={{ color: activeTab === i ? C.primary : C.muted, borderBottom: activeTab === i ? `2px solid ${C.primary}` : "2px solid transparent" }}
          >
            {t}
          </button>
        ))}
      </div>
      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-24">
        {activeTab === 0 && (
          <div className="space-y-3">
            {[
              { icon: CheckCircle, color: C.primary, title: t("adv_stage_title"), desc: t("adv_stage_desc") },
              { icon: Droplets, color: "#4A9FD4", title: t("adv_irrigation_title"), desc: t("adv_irrigation_desc") },
              { icon: Zap, color: C.accent, title: t("adv_fertilizer_title"), desc: t("adv_fertilizer_desc") },
              { icon: AlertTriangle, color: C.highlight, title: t("adv_aphid_title"), desc: t("adv_aphid_desc") },
            ].map((item) => (
              <div key={item.title} className="bg-card rounded-2xl p-4 flex gap-3" style={{ boxShadow: "0 2px 10px rgba(0,0,0,0.06)", border: `1px solid ${C.border}` }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: item.color + "18" }}>
                  <item.icon size={20} color={item.color} />
                </div>
                <div>
                  <p className="font-bold text-sm text-foreground">{item.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        )}
        {activeTab === 1 && (
          <div className="space-y-3">
            {[
              { week: t("adv_this_week"), status: t("adv_completed"), date: "15 Jan", amount: "45mm", done: true },
              { week: t("adv_next_week"), status: t("adv_scheduled"), date: "22 Jan", amount: "40mm", done: false },
              { week: t("adv_week3"), status: t("adv_planned"), date: "29 Jan", amount: "35mm", done: false },
            ].map((ir) => (
              <div key={ir.week} className="bg-card rounded-2xl p-4" style={{ boxShadow: "0 2px 10px rgba(0,0,0,0.06)", border: `1px solid ${C.border}` }}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-sm text-foreground">{ir.week}</span>
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full" style={{ background: ir.done ? C.secondary : "#E0E0E0", color: ir.done ? C.primary : C.muted }}>
                    {ir.status}
                  </span>
                </div>
                <div className="flex gap-4">
                  <div className="flex items-center gap-1.5"><Calendar size={13} color={C.muted} /><span className="text-xs text-muted-foreground">{ir.date}</span></div>
                  <div className="flex items-center gap-1.5"><Droplets size={13} color="#4A9FD4" /><span className="text-xs text-muted-foreground">{ir.amount}</span></div>
                </div>
              </div>
            ))}
          </div>
        )}
        {activeTab === 2 && (
          <div className="space-y-3">
            <div className="bg-card rounded-2xl p-4" style={{ boxShadow: "0 2px 10px rgba(0,0,0,0.06)", border: `1.5px solid ${C.accent}` }}>
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle size={16} color={C.accent} />
                <span className="font-bold text-sm" style={{ color: C.accent }}>{t("adv_active_risk")}</span>
              </div>
              <p className="text-xs text-muted-foreground mb-3">{t("adv_aphid_note")}</p>
              <div className="bg-[#FFF8EC] rounded-xl p-3">
                <p className="text-xs font-bold text-foreground mb-1">{t("adv_treatment_label")}</p>
                <p className="text-xs text-muted-foreground">{t("adv_treatment_text")}</p>
              </div>
            </div>
            <div className="bg-card rounded-2xl p-4" style={{ boxShadow: "0 2px 10px rgba(0,0,0,0.06)", border: `1px solid ${C.border}` }}>
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle size={16} color={C.primary} />
                <span className="font-bold text-sm text-foreground">{t("adv_no_disease")}</span>
              </div>
              <p className="text-xs text-muted-foreground">{t("adv_no_disease_desc")}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function CropCalendarScreen({ goBack }: { navigate: (s: Screen) => void; goBack: () => void }) {
  const { t } = useLang();
  const [month, setMonth] = useState(0);
  const months = Array.from({ length: 12 }, (_, i) => t(`month_${i + 1}`));
  const days = Array.from({ length: 7 }, (_, i) => t(`day_${i + 1}`));
  const events: Record<number, { emoji: string; label: string; color: string }> = {
    3: { emoji: "💧", label: t("cal_irrigate"), color: "#4A9FD4" },
    8: { emoji: "🌱", label: t("cal_fertilize"), color: C.success },
    15: { emoji: "🔍", label: t("cal_inspect"), color: C.accent },
    22: { emoji: "💧", label: t("cal_irrigate"), color: "#4A9FD4" },
    28: { emoji: "🌾", label: t("cal_harvest"), color: C.highlight },
  };
  return (
    <div className="absolute inset-0 bg-background flex flex-col">
      <StatusBar />
      <PageHeader title={t("page_crop_calendar")} goBack={goBack} />
      <div className="flex-1 overflow-y-auto px-4 pb-24">
        {/* Month nav */}
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => setMonth((m) => (m - 1 + 12) % 12)} className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: C.secondary }}>
            <ChevronLeft size={20} color={C.fg} />
          </button>
          <h2 className="font-bold text-lg text-foreground">{months[month]} 2024</h2>
          <button onClick={() => setMonth((m) => (m + 1) % 12)} className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: C.secondary }}>
            <ChevronRight size={20} color={C.fg} />
          </button>
        </div>
        {/* Day headers */}
        <div className="grid grid-cols-7 mb-2">
          {days.map((d) => (
            <div key={d} className="text-center text-xs font-bold py-1" style={{ color: C.muted }}>{d}</div>
          ))}
        </div>
        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1 mb-5">
          {Array.from({ length: 35 }, (_, i) => {
            const day = i - 2;
            const valid = day >= 1 && day <= 31;
            const event = valid ? events[day] : null;
            const today = day === 15;
            return (
              <div key={i} className="aspect-square flex flex-col items-center justify-center rounded-xl text-sm relative" style={{ background: today ? C.primary : event ? event.color + "22" : "transparent" }}>
                {valid && (
                  <>
                    <span className={`text-sm font-semibold ${today ? "text-white" : "text-foreground"}`}>{day}</span>
                    {event && <div className="w-1.5 h-1.5 rounded-full mt-0.5" style={{ background: event.color }} />}
                  </>
                )}
              </div>
            );
          })}
        </div>
        {/* Legend */}
        <div className="bg-card rounded-2xl p-4 mb-4" style={{ boxShadow: "0 2px 10px rgba(0,0,0,0.06)", border: `1px solid ${C.border}` }}>
          <p className="font-bold text-sm text-foreground mb-3">{t("calendar_legend")}</p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { color: "#4A9FD4", label: t("legend_irrigation") },
              { color: C.success, label: t("legend_fertilizer") },
              { color: C.accent, label: t("legend_inspection") },
              { color: C.highlight, label: t("legend_harvest") },
            ].map((l) => (
              <div key={l.label} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ background: l.color }} />
                <span className="text-xs text-muted-foreground">{l.label}</span>
              </div>
            ))}
          </div>
        </div>
        {/* Upcoming tasks */}
        <h3 className="font-bold text-base text-foreground mb-3">{t("upcoming_tasks")}</h3>
        {Object.entries(events).map(([d, ev]) => (
          <div key={d} className="bg-card rounded-2xl p-4 mb-2.5 flex items-center gap-3" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.05)", border: `1px solid ${C.border}` }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg" style={{ background: ev.color + "22" }}>{ev.emoji}</div>
            <div>
              <p className="font-semibold text-sm text-foreground">{ev.label}</p>
              <p className="text-xs text-muted-foreground">{months[month]} {d} · {t("cal_field")}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const shopItems = [
  { id:1, cat:"fertilizer", name:"Agriventure Humic Acid", brand:"RK Chemicals", price:352, oldPrice:990, discount:64, rating:4.6, reviews:418, verified:true, stock:"In stock", delivery:"2-3 days", recommended:false, crop:"wheat" },
  { id:2, cat:"fertilizer", name:"Multiplex Dhanvarsha", brand:"Multiplex", price:218, oldPrice:350, discount:38, rating:4.3, reviews:291, verified:true, stock:"In stock", delivery:"1-2 days", recommended:true, crop:"rice" },
  { id:3, cat:"fertilizer", name:"NPK 19:19:19 Powder", brand:"Aries Agro", price:410, oldPrice:560, discount:27, rating:4.5, reviews:632, verified:true, stock:"In stock", delivery:"3-4 days", recommended:false, crop:"tomato" },
  { id:4, cat:"pesticide", name:"Confidor 200 SL Insecticide", brand:"Bayer", price:385, oldPrice:520, discount:26, rating:4.7, reviews:875, verified:true, stock:"In stock", delivery:"2-3 days", recommended:true, crop:"cotton" },
  { id:5, cat:"pesticide", name:"Tata Rallis Contaf Plus", brand:"Tata Rallis", price:270, oldPrice:390, discount:31, rating:4.2, reviews:156, verified:true, stock:"Low stock", delivery:"3-5 days", recommended:false, crop:"onion" },
  { id:6, cat:"pesticide", name:"Ridomil Gold MZ 68 WG", brand:"Syngenta", price:490, oldPrice:640, discount:23, rating:4.6, reviews:340, verified:true, stock:"In stock", delivery:"2-3 days", recommended:false, crop:"potato" },
  { id:7, cat:"seeds", name:"Kaveri 4747 Hybrid Maize", brand:"Kaveri Seeds", price:620, oldPrice:780, discount:21, rating:4.8, reviews:1024, verified:true, stock:"In stock", delivery:"1-2 days", recommended:true, crop:"maize" },
  { id:8, cat:"seeds", name:"Mahyco MRC 7351 Cotton", brand:"Mahyco", price:930, oldPrice:1100, discount:15, rating:4.5, reviews:572, verified:true, stock:"In stock", delivery:"2-3 days", recommended:false, crop:"cotton" },
  { id:9, cat:"seeds", name:"Seminis Abhilash Tomato", brand:"Seminis", price:195, oldPrice:250, discount:22, rating:4.4, reviews:208, verified:true, stock:"In stock", delivery:"1-2 days", recommended:true, crop:"tomato" },
  { id:10, cat:"seeds", name:"Nuziveedu NS 324 Paddy", brand:"Nuziveedu Seeds", price:280, oldPrice:340, discount:18, rating:4.3, reviews:439, verified:true, stock:"In stock", delivery:"3-4 days", recommended:false, crop:"rice" },
];

const ShopProductCard = memo(function ShopProductCard({ item, onWishlist, wishlisted, onAdd, qty }: { item: typeof shopItems[0]; onWishlist: () => void; wishlisted: boolean; onAdd: () => void; qty: number }) {
  const { t } = useLang();
  return (
    <div className="bg-card rounded-2xl overflow-hidden relative" style={{ boxShadow:"0 2px 12px rgba(0,0,0,0.07)", border:`1px solid ${C.border}` }}>
      {item.recommended && (
        <div className="absolute top-0 left-0 right-0 flex justify-center">
          <span className="text-[10px] font-bold text-white px-3 py-0.5 rounded-b-full" style={{ background:C.accent }}>{t("mk_recommended")}</span>
        </div>
      )}
      <div className="pt-5 pb-2 px-2 flex items-center justify-center" style={{ background:C.secondary, minHeight:90 }}>
        <CropBadge crop={item.crop} size={64} bg="transparent"/>
      </div>
      <button onClick={onWishlist} className="absolute top-6 right-2 w-7 h-7 flex items-center justify-center rounded-full" style={{ background:"rgba(255,255,255,0.8)" }}>
        <Heart size={14} fill={wishlisted?C.destructive:"none"} color={wishlisted?C.destructive:C.muted}/>
      </button>
      <div className="p-2.5">
        {item.verified && (
          <div className="flex items-center gap-1 mb-1">
            <CheckCircle size={11} color={C.primary} fill={C.primary}/>
            <span className="text-[10px] font-bold" style={{ color:C.primary }}>{t("mk_verified")}</span>
          </div>
        )}
        <p className="text-xs font-bold text-foreground leading-tight mb-0.5 line-clamp-2">{item.name}</p>
        <p className="text-[10px] text-muted-foreground mb-1">{item.brand}</p>
        <div className="flex items-center gap-1 mb-1">
          <Star size={10} fill={C.highlight} color={C.highlight}/>
          <span className="text-[10px] font-bold text-foreground">{item.rating}</span>
          <span className="text-[10px] text-muted-foreground">({item.reviews})</span>
        </div>
        <div className="flex items-baseline gap-1 flex-wrap">
          <span className="font-extrabold text-sm text-foreground">₹{item.price}</span>
          <span className="text-[10px] text-muted-foreground line-through">₹{item.oldPrice}</span>
          <span className="text-[10px] font-bold" style={{ color:C.primary }}>{item.discount}% {t("mk_off")}</span>
        </div>
        <p className="text-[10px] text-muted-foreground mt-0.5">{item.stock} · {item.delivery}</p>
        <button onClick={onAdd} className="w-full mt-2 py-1.5 rounded-xl text-white text-xs font-bold flex items-center justify-center gap-1 active:scale-95 transition-transform" style={{ background:`linear-gradient(135deg,${C.primary},${C.dark})` }}>
          {qty > 0 ? <><Check size={12}/> {t("mk_in_cart")} ({qty})</> : <><Plus size={12}/> {t("mk_add_to_cart")}</>}
        </button>
      </div>
    </div>
  );
});

function MarketScreen({ navigate, goBack }: { navigate: (s: Screen) => void; goBack: () => void }) {
  const { t } = useLang();
  const { cart, cartCount, addToCart, wishlist, toggleWishlist } = useStore();
  const [tab, setTab] = useState<"prices"|"pesticide"|"fertilizer"|"seeds">("prices");
  const [search, setSearch] = useState("");
  const filtered = marketPrices.filter((p) => t(`crop_${p.crop}`).toLowerCase().includes(search.toLowerCase()));
  const shopFiltered = shopItems.filter(item =>
    tab === "prices" ? false :
    item.cat === (tab === "pesticide" ? "pesticide" : tab === "fertilizer" ? "fertilizer" : "seeds")
  );
  const qtyOf = (id: number) => cart.find((c) => c.id === id)?.qty ?? 0;
  const tabs: { key: typeof tab; label: string }[] = [
    { key:"prices", label:"Prices" },
    { key:"pesticide", label:"Pesticides" },
    { key:"fertilizer", label:"Fertilizers" },
    { key:"seeds", label:"Seeds" },
  ];
  return (
    <div className="absolute inset-0 bg-background flex flex-col">
      <StatusBar />
      <PageHeader title={t("page_market")} goBack={goBack} action={
        <button onClick={() => navigate("cart")} className="relative w-10 h-10 flex items-center justify-center rounded-full" style={{ background: C.secondary }}>
          <ShoppingCart size={20} color={C.primary} />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full text-white text-[10px] font-bold" style={{ background: C.destructive }}>{cartCount}</span>
          )}
        </button>
      } />
      {/* Tab bar */}
      <div className="flex gap-1 px-4 pb-3 overflow-x-auto" style={{ scrollbarWidth:"none" }}>
        {tabs.map(tb => (
          <button key={tb.key} onClick={() => setTab(tb.key)}
            className="px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap shrink-0 transition-all"
            style={{ background: tab===tb.key ? C.primary : C.card, color: tab===tb.key ? "#fff" : C.fg, border: `1.5px solid ${tab===tb.key ? C.primary : C.border}` }}>
            {tb.label}
          </button>
        ))}
      </div>
      {tab === "prices" ? (
        <>
          <div className="px-4 pb-3">
            <div className="flex items-center gap-3 px-4 py-3 rounded-2xl mb-2" style={{ background: C.card, border: `1.5px solid ${C.border}` }}>
              <Search size={18} color={C.muted} />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t("search_crop")} className="flex-1 outline-none text-sm bg-transparent"/>
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
              <span className="flex items-center gap-1"><MapPin size={11} /> {t("market_location")}</span>
              <span className="flex items-center gap-1"><RefreshCw size={11} /> {t("market_updated")}</span>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto px-4 pb-24">
            <div className="bg-card rounded-2xl overflow-hidden" style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.07)", border: `1px solid ${C.border}` }}>
              {filtered.map((p, i) => (
                <div key={p.crop} className={`flex items-center gap-3 px-4 py-4 ${i < filtered.length - 1 ? "border-b" : ""}`} style={{ borderColor: C.border }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: C.secondary }}>
                    <CropBadge crop={p.crop} size={36} bg="transparent"/>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm text-foreground leading-tight">{t(`crop_${p.crop}`)}</p>
                    <p className="text-xs text-muted-foreground">{t("per_quintal")}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-base text-foreground">₹{p.price.toLocaleString()}</p>
                    <div className="flex items-center gap-0.5 justify-end" style={{ color: p.change > 0 ? C.primary : C.destructive }}>
                      {p.change > 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                      <span className="text-xs font-bold">{Math.abs(p.change)}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="flex-1 overflow-y-auto px-4 pb-24">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-muted-foreground">{shopFiltered.length} {t("mk_products")}</p>
            <button className="flex items-center gap-1 text-sm font-semibold" style={{ color:C.primary }}><Filter size={14}/> {t("mk_filter")}</button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {shopFiltered.map(item => (
              <ShopProductCard
                key={item.id}
                item={item}
                onWishlist={() => toggleWishlist(item.id)}
                wishlisted={wishlist.includes(item.id)}
                qty={qtyOf(item.id)}
                onAdd={() => addToCart({ id: item.id, name: item.name, brand: item.brand, price: item.price, crop: item.crop })}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ScanScreen({ navigate, setScanMode }: { navigate: (s: Screen) => void; goBack: () => void; setScanMode: (m: "disease" | "anything") => void }) {
  const { t } = useLang();
  const [mode, setMode] = useState<"disease" | "anything">("disease");
  const [flash, setFlash] = useState(false);
  const [capturing, setCapturing] = useState(false);
  const handleCapture = () => {
    setCapturing(true);
    setScanMode(mode);
    setTimeout(() => { setCapturing(false); navigate("analyzing"); }, 500);
  };
  return (
    <div className="absolute inset-0 flex flex-col" style={{ background: "#0a0a0a" }}>
      <StatusBar dark />
      {/* Top bar: back + mode toggle */}
      <div className="flex items-center pt-2 pb-3 px-4 gap-3">
        <button
          onClick={() => navigate("dashboard")}
          className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ background: "rgba(255,255,255,0.15)" }}
        >
          <ChevronLeft size={22} color="#fff" />
        </button>
        <div className="flex flex-1 justify-center">
          <div className="flex rounded-full p-1" style={{ background: "rgba(255,255,255,0.15)" }}>
            {(["disease", "anything"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className="px-5 py-2 rounded-full text-sm font-semibold transition-all"
                style={{ background: mode === m ? C.primary : "transparent", color: mode === m ? "#fff" : "rgba(255,255,255,0.7)" }}
              >
                {m === "disease" ? t("scan_disease_mode") : t("scan_anything_mode")}
              </button>
            ))}
          </div>
        </div>
        <div className="w-10 flex-shrink-0" /> {/* spacer to keep toggle centered */}
      </div>
      {/* Camera viewfinder */}
      <div className="flex-1 relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400&h=600&fit=crop&auto=format"
          alt="camera"
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        {/* Scan overlay */}
        <div className="absolute inset-8 border-2 rounded-2xl" style={{ borderColor: "rgba(255,255,255,0.3)" }}>
          {/* Corners */}
          {[
            "top-0 left-0 border-t-4 border-l-4 rounded-tl-xl",
            "top-0 right-0 border-t-4 border-r-4 rounded-tr-xl",
            "bottom-0 left-0 border-b-4 border-l-4 rounded-bl-xl",
            "bottom-0 right-0 border-b-4 border-r-4 rounded-br-xl",
          ].map((cls) => (
            <div key={cls} className={`absolute w-7 h-7 ${cls}`} style={{ borderColor: C.primary }} />
          ))}
          {/* Scan line animation */}
          <div className="absolute left-2 right-2 h-0.5 rounded-full" style={{ background: `linear-gradient(90deg, transparent, ${C.primary}, transparent)`, top: "40%", animation: "scanLine 2s ease-in-out infinite" }} />
        </div>
        {/* Tip */}
        <div className="absolute bottom-4 left-6 right-6">
          <div className="rounded-2xl px-4 py-2.5 text-center" style={{ background: "rgba(0,0,0,0.6)" }}>
            <p className="text-white text-sm font-medium">
              {mode === "disease" ? t("scan_tip_disease") : t("scan_tip_anything")}
            </p>
          </div>
        </div>
        {capturing && (
          <div className="absolute inset-0 bg-white" style={{ animation: "flash 0.3s ease-out" }} />
        )}
      </div>
      {/* Controls */}
      <div className="px-6 py-5 flex items-center justify-between" style={{ background: "rgba(0,0,0,0.85)" }}>
        <button
          onClick={() => {}}
          className="w-14 h-14 rounded-2xl flex items-center justify-center"
          style={{ background: "rgba(255,255,255,0.15)" }}
        >
          <Image size={24} className="text-white" />
        </button>
        {/* Capture button */}
        <button
          onClick={handleCapture}
          className="w-20 h-20 rounded-full flex items-center justify-center transition-transform active:scale-90"
          style={{ background: "white", border: `4px solid ${C.primary}` }}
        >
          <div className="w-14 h-14 rounded-full" style={{ background: capturing ? C.primary : C.card }} />
        </button>
        <button
          onClick={() => setFlash(!flash)}
          className="w-14 h-14 rounded-2xl flex items-center justify-center"
          style={{ background: flash ? C.highlight : "rgba(255,255,255,0.15)" }}
        >
          <Zap size={24} color={flash ? C.dark : "#fff"} />
        </button>
      </div>
    </div>
  );
}

function AnalyzingScreen({ navigate, scanMode }: { navigate: (s: Screen) => void; scanMode: "disease" | "anything" }) {
  const { t } = useLang();
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate(scanMode === "disease" ? "scanResult" : "scanResultUniversal");
    }, 2200);
    return () => clearTimeout(timer);
  }, [scanMode]);
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ background: `linear-gradient(160deg, ${C.primary} 0%, ${C.dark} 100%)` }}>
      <StatusBar dark />
      <div className="flex-1 flex flex-col items-center justify-center gap-6 px-8">
        <div className="relative flex items-center justify-center" style={{ width: 120, height: 120 }}>
          {[0, 1, 2].map((i) => (
            <span key={i} className="absolute rounded-full" style={{ width: 120, height: 120, border: "2px solid rgba(255,255,255,0.5)", animation: `voiceRing 1.6s ${i * 0.5}s infinite` }} />
          ))}
          <div className="rounded-full flex items-center justify-center" style={{ width: 84, height: 84, background: "rgba(255,255,255,0.2)" }}>
            <ScanLine size={40} className="text-white" style={{ animation: "pulse 1.2s infinite" }} />
          </div>
        </div>
        <div className="text-center">
          <p className="text-white font-extrabold text-xl">{t("scan_analyzing")}</p>
          <p className="text-white/70 text-sm mt-2 leading-relaxed">{t("scan_analyzing_sub")}</p>
        </div>
      </div>
    </div>
  );
}

function UniversalResultScreen({ navigate, goBack }: { navigate: (s: Screen) => void; goBack: () => void }) {
  const { t } = useLang();
  const details = [t("ur_d1"), t("ur_d2"), t("ur_d3")];
  return (
    <div className="absolute inset-0 bg-background flex flex-col">
      <StatusBar />
      <PageHeader title={t("ur_title")} goBack={goBack} action={
        <button className="w-10 h-10 flex items-center justify-center rounded-full" style={{ background: C.secondary }}>
          <Share2 size={18} color={C.primary} />
        </button>
      } />
      <div className="flex-1 overflow-y-auto px-4 pb-28">
        <div className="bg-card rounded-2xl overflow-hidden mb-4" style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.1)", border: `1px solid ${C.border}` }}>
          <div className="h-44 relative">
            <img src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400&h=200&fit=crop&auto=format" alt={t("ur_object")} className="w-full h-full object-cover" />
            <div className="absolute top-3 right-3 px-3 py-1.5 rounded-full flex items-center gap-1.5" style={{ background: C.dark }}>
              <div className="w-2 h-2 rounded-full bg-[#A7C957]" />
              <span className="text-white text-xs font-bold">98% {t("sr_confident")}</span>
            </div>
          </div>
          <div className="p-4">
            <h2 className="text-xl font-extrabold text-foreground">{t("ur_object")}</h2>
            <p className="text-sm text-muted-foreground italic mb-3">{t("ur_object_local")}</p>
            <p className="text-sm text-muted-foreground leading-relaxed">{t("ur_desc")}</p>
          </div>
        </div>
        <h3 className="font-bold text-base text-foreground mb-3">{t("ur_detail_label")}</h3>
        <div className="bg-card rounded-2xl overflow-hidden mb-4" style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.06)", border: `1px solid ${C.border}` }}>
          {details.map((d, i) => (
            <div key={i} className={`flex items-start gap-3 px-4 py-3.5 ${i < details.length - 1 ? "border-b" : ""}`} style={{ borderColor: C.border }}>
              <CheckCircle size={18} color={C.primary} className="shrink-0 mt-0.5" />
              <p className="text-sm text-foreground leading-relaxed">{d}</p>
            </div>
          ))}
        </div>
        <div className="flex gap-3">
          <button onClick={() => navigate("scan")} className="flex-1 py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-2 active:scale-95 transition-transform" style={{ background: C.secondary, color: C.primary }}>
            <RotateCcw size={18} />{t("ur_scan_again")}
          </button>
          <button onClick={() => navigate("chat")} className="flex-1 py-4 rounded-2xl text-white font-bold text-base flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-transform" style={{ background: `linear-gradient(135deg, ${C.primary}, ${C.dark})` }}>
            <MessageCircle size={18} />{t("ask_krishibot")}
          </button>
        </div>
      </div>
    </div>
  );
}

function ScanResultScreen({ navigate, goBack }: { navigate: (s: Screen) => void; goBack: () => void }) {
  const { t } = useLang();
  const { user } = useUser();
  const [expanded, setExpanded] = useState<number | null>(0);
  const [saved, setSaved] = useState(false);
  const treatments = [
    { title: t("treat1_title"), desc: t("treat1_desc") },
    { title: t("treat2_title"), desc: t("treat2_desc") },
    { title: t("treat3_title"), desc: t("treat3_desc") },
  ];
  const symptoms = [t("sr_symptom_1"), t("sr_symptom_2"), t("sr_symptom_3")];
  const causes = [t("sr_cause_1"), t("sr_cause_2"), t("sr_cause_3")];
  const prevention = [t("sr_prevent_1"), t("sr_prevent_2"), t("sr_prevent_3")];
  const handleSave = () => setSaved(true);
  const handleShare = async () => {
    try {
      if (navigator.share) await navigator.share({ title: t("sr_disease_name"), text: `${t("sr_disease_name")} — ${t("sr_desc")}` });
    } catch { /* user cancelled */ }
  };
  return (
    <div className="absolute inset-0 bg-background flex flex-col">
      <StatusBar />
      <PageHeader title={t("page_scan_result")} goBack={goBack} action={
        <button onClick={handleShare} className="w-10 h-10 flex items-center justify-center rounded-full" style={{ background: C.secondary }}>
          <Share2 size={18} color={C.primary} />
        </button>
      } />
      <div className="flex-1 overflow-y-auto px-4 pb-28">
        {/* Image + confidence */}
        <div className="bg-card rounded-2xl overflow-hidden mb-4" style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.1)", border: `1px solid ${C.border}` }}>
          <div className="h-44 relative">
            <img src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400&h=200&fit=crop&auto=format" alt="scan" className="w-full h-full object-cover" />
            <div className="absolute top-3 right-3 px-3 py-1.5 rounded-full flex items-center gap-1.5" style={{ background: C.dark }}>
              <div className="w-2 h-2 rounded-full bg-[#A7C957]" />
              <span className="text-white text-xs font-bold">94% {t("sr_confident")}</span>
            </div>
          </div>
          <div className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h2 className="text-xl font-extrabold text-foreground">{t("sr_disease_name")}</h2>
                <p className="text-sm text-muted-foreground">{t("sr_disease_local")}</p>
              </div>
              <span className="text-[11px] font-bold px-3 py-1 rounded-full text-white" style={{ background: C.accent }}>{t("sr_risk_medium")}</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">{t("sr_desc")}</p>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          {[
            { label: t("sr_spread"), value: t("sr_spread_val"), icon: Activity, color: C.accent },
            { label: t("sr_stage"), value: t("sr_stage_early"), icon: Leaf, color: C.primary },
            { label: t("sr_urgency"), value: t("sr_urgency_val"), icon: Clock, color: C.destructive },
          ].map((s) => (
            <div key={s.label} className="bg-card rounded-2xl p-3 text-center" style={{ boxShadow: "0 2px 10px rgba(0,0,0,0.06)", border: `1px solid ${C.border}` }}>
              <div className="w-8 h-8 rounded-xl flex items-center justify-center mx-auto mb-1" style={{ background: s.color + "18" }}>
                <s.icon size={16} color={s.color} />
              </div>
              <p className="font-extrabold text-base text-foreground">{s.value}</p>
              <p className="text-[10px] text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Symptoms */}
        <h3 className="font-bold text-base text-foreground mb-3">{t("sr_symptoms_title")}</h3>
        <div className="bg-card rounded-2xl overflow-hidden mb-4" style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.06)", border: `1px solid ${C.border}` }}>
          {symptoms.map((s, i) => (
            <div key={i} className={`flex items-start gap-3 px-4 py-3.5 ${i < symptoms.length - 1 ? "border-b" : ""}`} style={{ borderColor: C.border }}>
              <AlertTriangle size={17} color={C.accent} className="shrink-0 mt-0.5" />
              <p className="text-sm text-foreground leading-relaxed">{s}</p>
            </div>
          ))}
        </div>

        {/* Possible causes */}
        <h3 className="font-bold text-base text-foreground mb-3">{t("sr_causes_title")}</h3>
        <div className="bg-card rounded-2xl overflow-hidden mb-4" style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.06)", border: `1px solid ${C.border}` }}>
          {causes.map((c, i) => (
            <div key={i} className={`flex items-start gap-3 px-4 py-3.5 ${i < causes.length - 1 ? "border-b" : ""}`} style={{ borderColor: C.border }}>
              <Info size={17} color={C.muted} className="shrink-0 mt-0.5" />
              <p className="text-sm text-foreground leading-relaxed">{c}</p>
            </div>
          ))}
        </div>

        {/* Treatment accordion */}
        <h3 className="font-bold text-base text-foreground mb-3">{t("scan_treatment")}</h3>
        <div className="space-y-2 mb-4">
          {treatments.map((tr, i) => (
            <div key={i} className="bg-card rounded-2xl overflow-hidden" style={{ boxShadow: "0 2px 10px rgba(0,0,0,0.05)", border: `1px solid ${C.border}` }}>
              <button
                onClick={() => setExpanded(expanded === i ? null : i)}
                className="w-full flex items-center justify-between p-4 text-left"
              >
                <span className="font-semibold text-sm text-foreground pr-4">{tr.title}</span>
                <ChevronDown size={18} color={C.muted} style={{ transform: expanded === i ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
              </button>
              {expanded === i && (
                <div className="px-4 pb-4">
                  <div className="h-px mb-3" style={{ background: C.border }} />
                  <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">{tr.desc}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Preventive measures */}
        <h3 className="font-bold text-base text-foreground mb-3">{t("sr_prevention_title")}</h3>
        <div className="bg-card rounded-2xl overflow-hidden mb-4" style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.06)", border: `1px solid ${C.border}` }}>
          {prevention.map((p, i) => (
            <div key={i} className={`flex items-start gap-3 px-4 py-3.5 ${i < prevention.length - 1 ? "border-b" : ""}`} style={{ borderColor: C.border }}>
              <CheckCircle size={17} color={C.primary} className="shrink-0 mt-0.5" />
              <p className="text-sm text-foreground leading-relaxed">{p}</p>
            </div>
          ))}
        </div>

        {/* Recovery time */}
        <div className="rounded-2xl p-4 mb-4 flex items-center gap-3" style={{ background: C.secondary, border: `1px solid ${C.border}` }}>
          <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ background: C.primary + "22" }}>
            <Clock size={22} color={C.primary} />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">{t("sr_recovery_title")}</p>
            <p className="font-extrabold text-base text-foreground">{t("sr_recovery_val")}</p>
          </div>
        </div>

        {/* Nearby agriculture support */}
        <h3 className="font-bold text-base text-foreground mb-3">{t("sr_support_title")}</h3>
        <div className="bg-card rounded-2xl p-4 mb-5 flex items-start gap-3" style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.06)", border: `1px solid ${C.border}` }}>
          <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ background: C.accent + "22" }}>
            <MapPin size={22} color={C.accent} />
          </div>
          <div className="flex-1">
            <p className="font-bold text-sm text-foreground">{t("sr_support_name")}</p>
            <p className="text-xs text-muted-foreground mb-1">{t("sr_support_addr")}</p>
            <p className="text-xs font-semibold" style={{ color: C.primary }}>{locationLabel(user) || t("sr_support_cta")}</p>
          </div>
        </div>

        {/* Actions */}
        <button
          onClick={() => navigate("chat")}
          className="w-full py-4 rounded-2xl text-white font-bold text-base flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-transform mb-3"
          style={{ background: `linear-gradient(135deg, ${C.primary}, ${C.dark})` }}
        >
          <MessageCircle size={20} />
          {t("ask_krishibot")}
        </button>
        <div className="grid grid-cols-3 gap-3">
          <button onClick={handleSave} className="py-3.5 rounded-2xl font-semibold text-xs flex flex-col items-center gap-1.5 active:scale-95 transition-transform" style={{ background: saved ? C.primary : C.secondary, color: saved ? "#fff" : C.primary }}>
            <Bookmark size={18} fill={saved ? "#fff" : "none"} />
            {saved ? t("sr_saved") : t("sr_save")}
          </button>
          <button onClick={handleShare} className="py-3.5 rounded-2xl font-semibold text-xs flex flex-col items-center gap-1.5 active:scale-95 transition-transform" style={{ background: C.secondary, color: C.primary }}>
            <Share2 size={18} />
            {t("sr_share")}
          </button>
          <button onClick={() => navigate("scan")} className="py-3.5 rounded-2xl font-semibold text-xs flex flex-col items-center gap-1.5 active:scale-95 transition-transform" style={{ background: C.secondary, color: C.primary }}>
            <RotateCcw size={18} />
            {t("sr_scan_again")}
          </button>
        </div>
      </div>
    </div>
  );
}

function ChatScreen({ goBack }: { navigate: (s: Screen) => void; goBack: () => void }) {
  const { t } = useLang();
  const [messages, setMessages] = useState(() => [
    { id: 1, from: "bot" as const, text: t("chat_welcome"), time: "9:30 AM" },
  ]);
  const [input, setInput] = useState("");
  const [infoOpen, setInfoOpen] = useState(false);
  const chips = [t("chip_pest"), t("chip_weather"), t("chip_market"), t("chip_schemes")];
  const send = () => {
    if (!input.trim()) return;
    const userMsg = { id: messages.length + 1, from: "user" as const, text: input, time: "Now" };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setTimeout(() => {
      setMessages((m) => [...m, { id: m.length + 1, from: "bot" as const, text: t("chat_reply"), time: "Now" }]);
    }, 1000);
  };
  return (
    <div className="absolute inset-0 bg-background flex flex-col">
      <div style={{ background: `linear-gradient(135deg, ${C.primary}, ${C.dark})` }}>
        <StatusBar dark />
        <div className="flex items-center gap-3 px-4 pb-4 pt-1">
          <button onClick={goBack} className="w-9 h-9 flex items-center justify-center rounded-full" style={{ background: "rgba(255,255,255,0.15)" }}>
            <ChevronLeft size={20} className="text-white" />
          </button>
          <div className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden" style={{ background: "rgba(255,255,255,0.95)" }}>
            <img src={krishiMitraLogo} alt="KrishiMitra AI" className="w-8 h-8 object-contain" />
          </div>
          <div className="flex-1">
            <p className="font-bold text-white">{t("chat_name")}</p>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-[#A7C957]" />
              <span className="text-white/70 text-xs">{t("chatbot_online")}</span>
            </div>
          </div>
          <button onClick={() => setInfoOpen(true)} className="w-9 h-9 flex items-center justify-center rounded-full" style={{ background: "rgba(255,255,255,0.15)" }}>
            <Info size={20} className="text-white/90" />
          </button>
        </div>
      </div>
      {infoOpen && (
        <div className="absolute inset-0 z-50 flex flex-col justify-end" style={{ background: "rgba(28,35,16,0.55)" }} onClick={() => setInfoOpen(false)}>
          <div className="bg-card rounded-t-3xl p-5 pb-8" onClick={(e) => e.stopPropagation()} style={{ boxShadow: "0 -8px 40px rgba(0,0,0,0.25)" }}>
            <div className="w-10 h-1 rounded-full mx-auto mb-4" style={{ background: C.border }} />
            <div className="flex flex-col items-center mb-4">
              <div className="w-16 h-16 flex items-center justify-center mb-3">
                <img src={krishiMitraLogo} alt="KrishiMitra AI" className="w-full h-full object-contain" />
              </div>
              <p className="font-bold text-foreground text-lg">{t("chat_info_title")}</p>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-5 text-center">{t("chat_info_body")}</p>
            <button onClick={() => setInfoOpen(false)} className="w-full py-3.5 rounded-2xl text-white font-bold active:scale-95 transition-transform" style={{ background: `linear-gradient(135deg, ${C.primary}, ${C.dark})` }}>
              {t("got_it")}
            </button>
          </div>
        </div>
      )}
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.from === "user" ? "justify-end" : "justify-start"} gap-2`}>
            {m.from === "bot" && (
              <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1 overflow-hidden" style={{ background: "#fff", border: `1px solid ${C.border}` }}>
                <img src={krishiMitraLogo} alt="AI" className="w-6 h-6 object-contain" />
              </div>
            )}
            <div className="max-w-[78%]">
              <div
                className="rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-line"
                style={{
                  background: m.from === "user" ? C.primary : C.card,
                  color: m.from === "user" ? "#fff" : C.fg,
                  borderRadius: m.from === "user" ? "18px 4px 18px 18px" : "4px 18px 18px 18px",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
                }}
              >
                {m.text}
              </div>
              <p className="text-[10px] mt-1 px-1" style={{ color: C.muted }}>{m.time}</p>
            </div>
          </div>
        ))}
      </div>
      {/* Quick chips */}
      <div className="flex gap-2 px-4 overflow-x-auto pb-2" style={{ scrollbarWidth: "none" }}>
        {chips.map((c) => (
          <button
            key={c}
            onClick={() => setInput(c)}
            className="shrink-0 px-3.5 py-2 rounded-full text-xs font-semibold border transition-colors"
            style={{ border: `1.5px solid ${C.border}`, background: C.card, color: C.primary }}
          >
            {c}
          </button>
        ))}
      </div>
      {/* Input — extra bottom padding so it clears the bottom nav */}
      <div className="flex items-center gap-3 px-4 py-3 pb-28" style={{ background: C.card, borderTop: `1px solid ${C.border}` }}>
        <div className="flex-1 flex items-center gap-2 px-4 py-3 rounded-full" style={{ background: C.secondary }}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder={t("ask_anything")}
            className="flex-1 bg-transparent outline-none text-sm"
          />
          <Mic size={18} color={C.muted} />
        </div>
        <button
          onClick={send}
          className="w-12 h-12 rounded-full flex items-center justify-center shadow-md"
          style={{ background: input ? C.primary : C.muted }}
        >
          <Send size={18} className="text-white" />
        </button>
      </div>
    </div>
  );
}

function ProfileScreen({ navigate, goBack }: { navigate: (s: Screen) => void; goBack: () => void }) {
  const { t } = useLang();
  const { user } = useUser();
  const loc = locationLabel(user);
  const menuItems = [
    { icon: Sprout, label: t("my_farms"), sub: t("profile_farms_sub"), screen: "myFarms" as Screen, color: C.primary },
    { icon: ShoppingBag, label: t("mk_my_orders"), sub: t("mk_no_orders_sub"), screen: "orders" as Screen, color: C.accent },
    { icon: Wallet, label: t("expenses_profit"), sub: t("profile_profit_sub"), screen: "expenses" as Screen, color: "#4A9FD4" },
    { icon: FileText, label: t("gov_schemes"), sub: t("profile_schemes_sub"), screen: "schemes" as Screen, color: "#9B6DC5" },
    { icon: Users, label: t("community"), sub: t("profile_community_sub"), screen: "forum" as Screen, color: "#C27BB0" },
    { icon: Settings, label: t("settings"), sub: t("profile_settings_sub"), screen: "settings" as Screen, color: C.muted },
    { icon: BookOpen, label: t("help_support"), sub: t("profile_help_sub"), screen: "help" as Screen, color: "#4A9FD4" },
  ];
  return (
    <div className="absolute inset-0 bg-background flex flex-col overflow-hidden">
      <div className="relative h-44 shrink-0" style={{ background: `linear-gradient(160deg, ${C.primary}, ${C.dark})` }}>
        <StatusBar dark />
        <img src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&h=200&fit=crop&auto=format" alt="farm" className="absolute inset-0 w-full h-full object-cover opacity-20" />
        <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between px-5 pb-5">
          <div className="flex items-end gap-4">
            <div className="relative">
              <div className="w-20 h-20 rounded-full border-4 border-white overflow-hidden" style={{ background: C.secondary }}>
                <img src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=100&h=100&fit=crop&auto=format" alt="farmer" className="w-full h-full object-cover" />
              </div>
              <button className="absolute bottom-0 right-0 w-6 h-6 rounded-full flex items-center justify-center" style={{ background: C.accent }}>
                <Edit2 size={12} className="text-white" />
              </button>
            </div>
            <div className="pb-1">
              <h2 className="text-xl font-extrabold text-white">{user.name || t("greeting")}</h2>
              {loc && <p className="text-white/70 text-xs flex items-center gap-1"><MapPin size={11} /> {loc}</p>}
            </div>
          </div>
        </div>
      </div>
      {/* Stats */}
      <div className="flex mx-4 -mt-4 relative z-10 mb-5">
        <div className="flex-1 bg-card rounded-2xl p-4 flex items-center justify-around" style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.1)", border: `1px solid ${C.border}` }}>
          {[
            { val: "1", label: t("farms_label") },
            { val: String(user.crops.length || 0), label: t("crops_label") },
            { val: "47", label: t("days_active") },
          ].map((s, i) => (
            <div key={s.label} className={`flex-1 text-center ${i < 2 ? "border-r" : ""}`} style={{ borderColor: C.border }}>
              <p className="text-2xl font-extrabold" style={{ color: C.primary }}>{s.val}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
      {/* Menu */}
      <div className="flex-1 overflow-y-auto px-4 pb-28">
        <div className="bg-card rounded-2xl overflow-hidden mb-4" style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.07)", border: `1px solid ${C.border}` }}>
          {menuItems.map((item, i) => (
            <button
              key={item.label}
              onClick={() => navigate(item.screen)}
              className={`w-full flex items-center gap-4 px-4 py-4 text-left transition-colors active:bg-secondary ${i < menuItems.length - 1 ? "border-b" : ""}`}
              style={{ borderColor: C.border }}
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: item.color + "18" }}>
                <item.icon size={20} color={item.color} />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-sm text-foreground">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.sub}</p>
              </div>
              <ChevronRight size={18} color={C.muted} />
            </button>
          ))}
        </div>
        <button
          onClick={() => navigate("login")}
          className="w-full py-4 rounded-2xl flex items-center justify-center gap-2 font-semibold text-sm active:scale-95 transition-transform"
          style={{ background: "#FEE8E8", color: C.destructive }}
        >
          <LogOut size={18} />
          {t("logout")}
        </button>
      </div>
    </div>
  );
}

function MyFarmsScreen({ navigate, goBack }: { navigate: (s: Screen) => void; goBack: () => void }) {
  const { t } = useLang();
  const { user } = useUser();
  const { setSelectedCrop } = useStore();
  const [expanded, setExpanded] = useState(true);
  const location = locationLabel(user);
  const unitLabel = t(`unit_${user.unit || "acres"}`);
  const cropNames = user.crops.length ? user.crops.map((c) => t(`crop_${c}`)).join(", ") : t("mf_no_crops");
  const farmName = user.village ? `${user.village} ${t("mf_your_farm")}` : t("mf_your_farm");
  const openCrop = (crop: string) => { setSelectedCrop(crop); navigate("cropDetail"); };

  return (
    <div className="absolute inset-0 bg-background flex flex-col">
      <StatusBar />
      <PageHeader title={t("page_my_farms")} goBack={goBack} action={
        <button onClick={() => navigate("farmSetup")} className="w-10 h-10 flex items-center justify-center rounded-full" style={{ background: C.secondary }}>
          <Edit2 size={18} color={C.primary} />
        </button>
      } />
      <div className="flex-1 overflow-y-auto px-4 pb-28">
        <div className="bg-card rounded-2xl overflow-hidden mb-4" style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.08)", border: `1px solid ${C.border}` }}>
          <div className="h-36 relative flex items-end" style={{ background: `linear-gradient(135deg, ${C.primary}, ${C.dark})` }}>
            <div className="absolute inset-0 opacity-25 flex items-center justify-end pr-4"><Sprout size={110} color="#fff" /></div>
            <div className="relative p-4 text-white">
              <p className="font-bold text-lg">{farmName}</p>
              <p className="text-xs opacity-90 flex items-center gap-1"><MapPin size={11} />{location || "—"}</p>
            </div>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-3 gap-2 mb-3">
              <div className="rounded-xl p-2.5 text-center" style={{ background: C.secondary }}>
                <Ruler size={16} color={C.primary} className="mx-auto mb-1" />
                <p className="text-sm font-bold text-foreground">{user.farmSize || "0"}</p>
                <p className="text-[10px] text-muted-foreground">{unitLabel}</p>
              </div>
              <div className="rounded-xl p-2.5 text-center" style={{ background: C.secondary }}>
                <Sprout size={16} color={C.primary} className="mx-auto mb-1" />
                <p className="text-sm font-bold text-foreground">{user.crops.length}</p>
                <p className="text-[10px] text-muted-foreground">{t("crops_word")}</p>
              </div>
              <div className="rounded-xl p-2.5 text-center" style={{ background: C.secondary }}>
                <Droplets size={16} color={C.primary} className="mx-auto mb-1" />
                <p className="text-[11px] font-bold text-foreground leading-tight">{user.landType ? t(user.landType) : "—"}</p>
                <p className="text-[10px] text-muted-foreground">{t("mf_land_type")}</p>
              </div>
            </div>
            <button
              onClick={() => setExpanded(!expanded)}
              className="w-full py-3 rounded-xl font-semibold text-sm transition-colors active:scale-95"
              style={{ background: expanded ? C.primary : C.secondary, color: expanded ? "#fff" : C.primary }}
            >
              {expanded ? t("hide_details") : t("view_details")}
            </button>
            {expanded && (
              <div className="mt-3 space-y-2 text-sm">
                {[
                  { label: t("mf_farmer"), val: user.name || "—" },
                  { label: t("mf_land_type"), val: user.landType ? t(user.landType) : "—" },
                  { label: t("mf_location"), val: location || "—" },
                ].map((d) => (
                  <div key={d.label} className="flex justify-between py-1.5 border-b" style={{ borderColor: C.border }}>
                    <span className="text-muted-foreground">{d.label}</span>
                    <span className="font-semibold text-foreground text-right">{d.val}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Real crops from onboarding — tappable */}
        <p className="text-xs font-bold uppercase tracking-wide mb-2.5 px-1" style={{ color: C.muted }}>{t("mf_current_crops")}</p>
        {user.crops.length === 0 ? (
          <div className="bg-card rounded-2xl p-6 text-center mb-4" style={{ border: `1px dashed ${C.border}` }}>
            <p className="text-sm text-muted-foreground mb-3">{t("mf_no_crops")}</p>
            <button onClick={() => navigate("crops")} className="px-5 py-2.5 rounded-xl text-white font-bold text-sm" style={{ background: C.primary }}>{t("add_new_crop")}</button>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2.5 mb-4">
            {user.crops.map((c) => (
              <button key={c} onClick={() => openCrop(c)} className="bg-card rounded-2xl p-3 flex flex-col items-center gap-1.5 active:scale-95 transition-transform" style={{ border: `1px solid ${C.border}` }}>
                <CropBadge crop={c} size={48} bg={C.secondary} />
                <span className="text-[11px] font-semibold text-center leading-tight" style={{ color: C.fg }}>{t(`crop_${c}`)}</span>
              </button>
            ))}
          </div>
        )}
        <button onClick={() => navigate("crops")} className="w-full py-4 rounded-2xl font-bold text-base border-2 border-dashed flex items-center justify-center gap-2 active:scale-95" style={{ borderColor: C.primary, color: C.primary }}>
          <Plus size={20} />
          {t("add_new_crop")}
        </button>
      </div>
    </div>
  );
}

function ExpensesScreen({ goBack }: { navigate: (s: Screen) => void; goBack: () => void }) {
  const { t } = useLang();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newDesc, setNewDesc] = useState("");
  const [newAmt, setNewAmt] = useState("");
  const [newType, setNewType] = useState<"income" | "expense">("expense");
  const [transactions, setTransactions] = useState([
    { name: t("txn_urea"), type: "expense" as const, amount: 3200, date: "15 Jan", cat: t("cat_input") },
    { name: t("txn_wheat_sale"), type: "income" as const, amount: 14500, date: "12 Jan", cat: t("cat_sale") },
    { name: t("txn_irrigation"), type: "expense" as const, amount: 800, date: "10 Jan", cat: t("cat_water") },
    { name: t("txn_labor"), type: "expense" as const, amount: 2400, date: "5 Jan", cat: t("cat_labor") },
    { name: t("txn_subsidy"), type: "income" as const, amount: 2000, date: "1 Jan", cat: t("cat_scheme") },
  ]);
  const addEntry = () => {
    if (!newDesc.trim() || !newAmt) return;
    setTransactions((tx) => [{ name: newDesc, type: newType, amount: Number(newAmt), date: t("txn_today"), cat: newType === "income" ? t("cat_sale") : t("cat_input") }, ...tx]);
    setNewDesc(""); setNewAmt(""); setShowAddForm(false);
  };
  return (
    <div className="absolute inset-0 bg-background flex flex-col">
      <StatusBar />
      <PageHeader title={t("page_expenses")} goBack={goBack} />
      <div className="flex-1 overflow-y-auto px-4 pb-24">
        {/* Summary cards */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          {[
            { label: t("income_label"), val: "₹42,500", color: C.primary, bg: C.secondary },
            { label: t("expense_label"), val: "₹18,200", color: C.destructive, bg: "#FEE8E8" },
            { label: t("profit_label"), val: "₹24,300", color: C.dark, bg: C.highlight + "40" },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl p-3 text-center" style={{ background: s.bg, border: `1px solid ${s.color}20` }}>
              <p className="text-[11px] font-semibold mb-1" style={{ color: s.color }}>{s.label}</p>
              <p className="text-sm font-extrabold" style={{ color: s.color }}>{s.val}</p>
            </div>
          ))}
        </div>
        {/* Bar chart */}
        <div className="bg-card rounded-2xl p-4 mb-5" style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.07)", border: `1px solid ${C.border}` }}>
          <p className="font-bold text-sm text-foreground mb-3">{t("monthly_overview")}</p>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={expenseData} barGap={4}>
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: C.muted }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip
                contentStyle={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, fontSize: 11 }}
                formatter={(v: number) => [`₹${v.toLocaleString()}`, ""]}
              />
              <Bar key="income" name="Income" dataKey="income" fill={C.primary} radius={4} />
              <Bar key="expense" name="Expense" dataKey="expense" fill={C.accent + "80"} radius={4} />
            </BarChart>
          </ResponsiveContainer>
          <div className="flex gap-4 justify-center mt-1">
            <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-sm" style={{ background: C.primary }} /><span className="text-xs text-muted-foreground">{t("income_label")}</span></div>
            <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-sm" style={{ background: C.accent + "80" }} /><span className="text-xs text-muted-foreground">{t("expense_label")}</span></div>
          </div>
        </div>
        {/* Transactions */}
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-base text-foreground">{t("recent_transactions")}</h3>
          <button onClick={() => setShowAddForm(!showAddForm)} className="flex items-center gap-1 text-sm font-semibold" style={{ color: C.primary }}>
            <Plus size={16} />{showAddForm ? t("cancel") : t("add")}
          </button>
        </div>
        {showAddForm && (
          <div className="bg-card rounded-2xl p-4 mb-4" style={{ border: `1.5px solid ${C.primary}`, boxShadow: "0 2px 16px rgba(0,0,0,0.07)" }}>
            <div className="flex gap-2 mb-3">
              {(["expense", "income"] as const).map((typ) => (
                <button key={typ} onClick={() => setNewType(typ)} className="flex-1 py-2 rounded-xl text-sm font-bold transition-all"
                  style={{ background: newType === typ ? (typ === "income" ? C.primary : C.destructive) : C.secondary, color: newType === typ ? "#fff" : C.muted }}>
                  {typ === "income" ? `➕ ${t("income_label")}` : `➖ ${t("expense_label")}`}
                </button>
              ))}
            </div>
            <input value={newDesc} onChange={(e) => setNewDesc(e.target.value)} placeholder={t("exp_desc_placeholder")}
              className="w-full px-3 py-3 rounded-xl text-sm outline-none mb-2"
              style={{ background: C.secondary, border: `1px solid ${C.border}` }} />
            <div className="flex gap-2">
              <input value={newAmt} onChange={(e) => setNewAmt(e.target.value.replace(/\D/g, ""))} placeholder={t("exp_amt_placeholder")}
                type="tel" className="flex-1 px-3 py-3 rounded-xl text-sm outline-none"
                style={{ background: C.secondary, border: `1px solid ${C.border}` }} />
              <button onClick={addEntry} className="px-5 py-3 rounded-xl text-sm font-bold text-white"
                style={{ background: C.primary }}>{t("save")}</button>
            </div>
          </div>
        )}
        <div className="bg-card rounded-2xl overflow-hidden" style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.07)", border: `1px solid ${C.border}` }}>
          {transactions.map((t, i) => (
            <div key={i} className={`flex items-center gap-3 px-4 py-3.5 ${i < transactions.length - 1 ? "border-b" : ""}`} style={{ borderColor: C.border }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: t.type === "income" ? C.secondary : "#FEE8E8" }}>
                {t.type === "income" ? <TrendingUp size={18} color={C.primary} /> : <TrendingDown size={18} color={C.destructive} />}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-sm text-foreground">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.date} · {t.cat}</p>
              </div>
              <p className="font-bold text-sm" style={{ color: t.type === "income" ? C.primary : C.destructive }}>
                {t.type === "income" ? "+" : "-"}₹{t.amount.toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SchemesScreen({ goBack }: { navigate: (s: Screen) => void; goBack: () => void }) {
  const { t } = useLang();
  const [tab, setTab] = useState(0);
  const tabs = [t("tab_all"), t("tab_eligible"), t("tab_applied")];
  const filtered = tab === 1 ? schemesList.filter((s) => s.eligible) : schemesList;
  // Localize the couple of English literal values used in mock data
  const loc = (v: string) => (v === "Free" ? t("amount_free") : v === "Ongoing" ? t("deadline_ongoing") : v);
  return (
    <div className="absolute inset-0 bg-background flex flex-col">
      <div style={{ background: `linear-gradient(135deg, ${C.primary}, ${C.dark})` }}>
        <StatusBar dark />
        <PageHeader title={t("page_schemes")} goBack={goBack} dark />
        <div className="flex gap-2 px-4 pb-4">
          {tabs.map((t, i) => (
            <button
              key={t}
              onClick={() => setTab(i)}
              className="px-4 py-2 rounded-full text-sm font-semibold transition-all"
              style={{ background: tab === i ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.2)", color: tab === i ? C.dark : "#fff" }}
            >
              {t}
            </button>
          ))}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-24 space-y-3">
        {filtered.map((s) => (
          <div key={s.name} className="bg-card rounded-2xl p-4" style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.07)", border: `1px solid ${C.border}` }}>
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-bold text-base text-foreground pr-4">{s.name}</h3>
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-full shrink-0" style={{ background: s.eligible ? C.secondary : "#FEE8E8", color: s.eligible ? C.primary : C.destructive }}>
                {s.eligible ? t("eligible") : t("check_again")}
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-3">{t(s.descKey)}</p>
            <div className="flex items-center justify-between">
              <div className="flex gap-3">
                <div className="flex items-center gap-1.5">
                  <DollarSign size={14} color={C.primary} />
                  <span className="text-xs font-semibold" style={{ color: C.primary }}>{loc(s.amount)}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock size={14} color={C.muted} />
                  <span className="text-xs text-muted-foreground">{t("deadline_label")}: {loc(s.deadline)}</span>
                </div>
              </div>
              <button className="px-4 py-2 rounded-xl text-xs font-bold text-white" style={{ background: s.eligible ? C.primary : C.muted }}>
                {s.eligible ? t("apply_now") : t("details_btn")}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ForumScreen({ navigate, goBack }: { navigate: (s: Screen) => void; goBack: () => void }) {
  const { t } = useLang();
  const tagKeys = ["all", "crop", "market", "schemes", "irrigation"];
  const [activeTag, setActiveTag] = useState("all");
  const [voted, setVoted] = useState<Record<number, boolean>>({});
  const [voteCounts, setVoteCounts] = useState<Record<number, number>>(
    Object.fromEntries(forumPosts.map((p) => [p.id, p.votes]))
  );
  const toggleVote = (id: number) => {
    const alreadyVoted = voted[id];
    setVoted((v) => ({ ...v, [id]: !alreadyVoted }));
    setVoteCounts((c) => ({ ...c, [id]: c[id] + (alreadyVoted ? -1 : 1) }));
  };
  const tagColor = (tag: string) => {
    const m: Record<string, string> = { crop: C.primary, market: C.accent, schemes: "#9B6DC5", irrigation: "#4A9FD4", soil: C.dark, disease: C.destructive };
    return m[tag] || C.muted;
  };
  const visiblePosts = activeTag === "all" ? forumPosts : forumPosts.filter((p) => p.tag === activeTag);
  return (
    <div className="absolute inset-0 bg-background flex flex-col">
      <StatusBar />
      <PageHeader title={t("page_forum")} goBack={goBack} action={
        <button onClick={() => navigate("askCommunity")} className="w-10 h-10 flex items-center justify-center rounded-full" style={{ background: C.secondary }}>
          <Edit2 size={18} color={C.primary} />
        </button>
      } />
      {/* Tag filters */}
      <div className="flex gap-2 px-4 pb-3 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
        {tagKeys.map((tk) => (
          <button key={tk} onClick={() => setActiveTag(tk)}
            className="shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all"
            style={{ background: activeTag === tk ? C.primary : C.card, color: activeTag === tk ? "#fff" : C.muted, border: `1.5px solid ${activeTag === tk ? C.primary : C.border}` }}>
            {t(`forum_tag_${tk}`)}
          </button>
        ))}
      </div>
      <div className="flex-1 overflow-y-auto px-4 pb-24 space-y-3">
        {/* Nearby Farmers */}
        <div className="bg-card rounded-2xl p-4" style={{ boxShadow:"0 2px 12px rgba(0,0,0,0.06)", border:`1px solid ${C.border}` }}>
          <div className="flex items-center gap-2 mb-3">
            <MapPin size={15} color={C.accent}/><p className="font-bold text-sm text-foreground">Nearby Farmers</p>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {["Ramesh K.","Sunita P.","Vikram S.","Meena D.","Arjun R."].map((name,i) => (
              <div key={name} className="flex flex-col items-center gap-1.5 shrink-0">
                <div className="w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold text-white" style={{ background:[C.primary,C.accent,C.dark,C.success,"#9B6DC5"][i%5] }}>{name[0]}</div>
                <p className="text-[10px] text-muted-foreground text-center leading-tight">{name.split(" ")[0]}<br/>{["2 km","5 km","1 km","8 km","3 km"][i]}</p>
              </div>
            ))}
          </div>
        </div>
        {/* AI Suggested Answer */}
        <div className="bg-card rounded-2xl p-4" style={{ boxShadow:"0 2px 12px rgba(0,0,0,0.06)", border:`1px solid ${C.border}`, borderLeft:`3px solid ${C.accent}` }}>
          <div className="flex items-center gap-2 mb-2">
            <Zap size={15} color={C.accent} fill={C.accent}/><p className="font-bold text-sm text-foreground">AI Suggested Answer</p>
            <span className="ml-auto text-[10px] text-muted-foreground">Based on recent questions</span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">For yellow leaves on wheat, the most common cause is nitrogen deficiency. Apply urea (25–30 kg/acre) immediately. If leaves show spots, it could be rust disease — apply Propiconazole fungicide.</p>
          <button className="mt-2 text-xs font-semibold" style={{ color:C.primary }}>See full answer →</button>
        </div>
        {visiblePosts.map((p) => (
          <div key={p.id} className="bg-card rounded-2xl p-4" style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.06)", border: `1px solid ${C.border}` }}>
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className="font-bold text-sm text-foreground leading-snug">{p.title}</h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 text-white" style={{ background: tagColor(p.tag) }}>
                {t(`forum_tag_${p.tag}`)}
              </span>
            </div>
            <div className="flex items-center gap-1.5 mb-2">
              <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: C.primary }}>{p.author[0]}</div>
              <span className="text-xs font-medium text-foreground">{p.author}</span>
              <span className="text-xs text-muted-foreground">· {p.district}</span>
              <span className="text-xs text-muted-foreground ml-auto">{p.time} {t("ago")}</span>
            </div>
            {/* Expert verified badge (on select posts) */}
            {p.id % 2 === 0 && (
              <div className="flex items-center gap-1.5 mb-2 px-2 py-1 rounded-xl" style={{ background:`${C.primary}10` }}>
                <Award size={12} color={C.primary}/>
                <span className="text-[10px] font-bold" style={{ color:C.primary }}>Expert Verified Answer</span>
                <span className="text-[10px] text-muted-foreground ml-auto">Dr. Sharma, KVK</span>
              </div>
            )}
            {/* Most helpful reply preview */}
            {p.answers > 3 && (
              <div className="mb-2 pl-3 py-1.5 rounded-xl" style={{ background:C.secondary, borderLeft:`2px solid ${C.primary}` }}>
                <p className="text-[10px] font-bold" style={{ color:C.primary }}>Most Helpful Reply</p>
                <p className="text-[10px] text-muted-foreground leading-relaxed">Apply neem-based spray in early morning for best results. Repeat every 7 days.</p>
              </div>
            )}
            <div className="flex items-center gap-4">
              <button onClick={() => toggleVote(p.id)}
                className="flex items-center gap-1.5 text-xs font-semibold transition-colors"
                style={{ color: voted[p.id] ? C.primary : C.muted }}>
                <ThumbsUp size={14} fill={voted[p.id] ? C.primary : "none"} color={voted[p.id] ? C.primary : C.muted} />
                <span>{voteCounts[p.id]}</span>
              </button>
              <button className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <MessageSquare size={14} color={C.muted} /><span>{p.answers} {t("answers_label")}</span>
              </button>
              <span className="ml-auto text-xs text-muted-foreground">{p.views} {t("views_word")}</span>
            </div>
          </div>
        ))}
        {/* Ask question CTA */}
        <button onClick={() => navigate("askCommunity")}
          className="w-full py-4 rounded-2xl text-white font-bold active:scale-95 transition-transform"
          style={{ background:`linear-gradient(135deg,${C.primary},${C.dark})` }}>
          + Ask the Community
        </button>
      </div>
    </div>
  );
}

function HelpScreen({ goBack }: { navigate: (s: Screen) => void; goBack: () => void }) {
  const { t } = useLang();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const faqs = [
    { q: t("help_faq_1_q"), a: t("help_faq_1_a") },
    { q: t("help_faq_2_q"), a: t("help_faq_2_a") },
    { q: t("help_faq_3_q"), a: t("help_faq_3_a") },
    { q: t("help_faq_4_q"), a: t("help_faq_4_a") },
  ];
  const tips = [t("help_tip_1"), t("help_tip_2"), t("help_tip_3")];
  return (
    <div className="absolute inset-0 bg-background flex flex-col">
      <StatusBar />
      <PageHeader title={t("page_help")} goBack={goBack} />
      <div className="flex-1 overflow-y-auto px-4 pb-24 pt-2 space-y-4">
        {/* Call card */}
        <div className="rounded-2xl p-5 flex items-center gap-4" style={{ background: `linear-gradient(135deg, ${C.primary}, ${C.dark})` }}>
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0" style={{ background: "rgba(255,255,255,0.18)" }}>
            <Phone size={28} className="text-white" />
          </div>
          <div className="flex-1">
            <p className="font-bold text-white text-base">{t("help_call")}</p>
            <p className="text-white/80 text-sm font-semibold">{t("help_call_sub")}</p>
            <p className="text-white/60 text-xs mt-0.5">{t("help_call_hours")}</p>
          </div>
          <button
            className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
            style={{ background: "rgba(255,255,255,0.25)" }}
          >
            <Phone size={20} className="text-white" />
          </button>
        </div>

        {/* FAQ */}
        <div>
          <p className="text-xs font-bold uppercase tracking-wide mb-2 px-1" style={{ color: C.muted }}>{t("help_faq")}</p>
          <div className="bg-card rounded-2xl overflow-hidden" style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.06)", border: `1px solid ${C.border}` }}>
            {faqs.map((faq, i) => (
              <div key={i}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className={`w-full flex items-center justify-between px-4 py-4 text-left ${i < faqs.length - 1 && openFaq !== i ? "border-b" : ""}`}
                  style={{ borderColor: C.border }}
                >
                  <span className="font-semibold text-sm text-foreground pr-3 leading-snug">{faq.q}</span>
                  <ChevronDown size={18} color={C.muted} style={{ transform: openFaq === i ? "rotate(180deg)" : "none", transition: "transform 0.2s", shrink: 0 }} />
                </button>
                {openFaq === i && (
                  <div className="px-4 pb-4 border-b" style={{ borderColor: C.border }}>
                    <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Tips */}
        <div>
          <p className="text-xs font-bold uppercase tracking-wide mb-2 px-1" style={{ color: C.muted }}>{t("help_tips")}</p>
          <div className="space-y-2.5">
            {tips.map((tip, i) => (
              <div key={i} className="bg-card rounded-2xl px-4 py-3.5" style={{ boxShadow: "0 2px 10px rgba(0,0,0,0.05)", border: `1px solid ${C.border}` }}>
                <p className="text-sm text-foreground leading-relaxed">{tip}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function SettingsScreen({ goBack }: { navigate: (s: Screen) => void; goBack: () => void }) {
  const { lang, setLang, t } = useLang();
  const [notif, setNotif] = useState(true);
  const [touchSounds, setTouchSounds] = useState(true);
  const [offline, setOffline] = useState(false);
  const [appLock, setAppLock] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const currentLang = LANGUAGES.find((l) => l.code === lang);
  const Toggle = ({ on, onToggle }: { on: boolean; onToggle: () => void }) => (
    <button
      onClick={onToggle}
      className="w-12 h-6 rounded-full relative transition-colors"
      style={{ background: on ? C.primary : "#D1D5DB" }}
    >
      <div className="absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all" style={{ left: on ? "calc(100% - 20px)" : 4 }} />
    </button>
  );
  const sections = [
    {
      title: t("pref_section"),
      items: [
        { icon: Globe, label: t("language"), sub: `${currentLang?.name} (${currentLang?.en})`, action: <ChevronRight size={18} color={C.muted} />, onClick: () => setLangOpen(true) },
        { icon: Bell, label: t("notifications_label"), sub: t("notif_sub"), action: <Toggle on={notif} onToggle={() => setNotif(!notif)} /> },
        { icon: Volume2, label: "Touch Sounds", sub: touchSounds ? "Tap sounds are ON" : "Tap sounds are OFF", action: <Toggle on={touchSounds} onToggle={() => setTouchSounds(!touchSounds)} /> },
        { icon: Wifi, label: t("offline_mode"), sub: t("offline_sub"), action: <Toggle on={offline} onToggle={() => setOffline(!offline)} /> },
      ],
    },
    {
      title: t("security_section"),
      items: [
        { icon: Lock, label: t("app_lock"), sub: t("lock_sub"), action: <Toggle on={appLock} onToggle={() => setAppLock(!appLock)} /> },
        { icon: Shield, label: t("privacy_policy"), sub: "", action: <ChevronRight size={18} color={C.muted} /> },
      ],
    },
    {
      title: t("support_section"),
      items: [
        { icon: Volume2, label: t("help_support"), sub: t("helpline_sub"), action: <ChevronRight size={18} color={C.muted} /> },
        { icon: Star, label: t("rate_app"), sub: "", action: <ChevronRight size={18} color={C.muted} /> },
        { icon: Info, label: t("about_label"), sub: t("about_sub"), action: <ChevronRight size={18} color={C.muted} /> },
      ],
    },
  ];
  return (
    <div className="absolute inset-0 bg-background flex flex-col">
      <StatusBar />
      <PageHeader title={t("settings")} goBack={goBack} />
      <div className="flex-1 overflow-y-auto px-4 pb-24 space-y-4">
        {sections.map((sec) => (
          <div key={sec.title}>
            <p className="text-xs font-bold uppercase tracking-wide mb-2 px-1" style={{ color: C.muted }}>{sec.title}</p>
            <div className="bg-card rounded-2xl overflow-hidden" style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.06)", border: `1px solid ${C.border}` }}>
              {sec.items.map((item, i) => {
                const onClick = (item as { onClick?: () => void }).onClick;
                const Row = (
                  <>
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: C.secondary }}>
                      <item.icon size={18} color={C.primary} />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-semibold text-sm text-foreground">{item.label}</p>
                      {item.sub && <p className="text-xs text-muted-foreground">{item.sub}</p>}
                    </div>
                    {item.action}
                  </>
                );
                const cls = `flex items-center gap-4 px-4 py-4 w-full ${i < sec.items.length - 1 ? "border-b" : ""}`;
                return onClick ? (
                  <button key={item.label} onClick={onClick} className={`${cls} active:bg-secondary transition-colors`} style={{ borderColor: C.border }}>{Row}</button>
                ) : (
                  <div key={item.label} className={cls} style={{ borderColor: C.border }}>{Row}</div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Language picker sheet */}
      {langOpen && (
        <div className="absolute inset-0 z-50 flex flex-col justify-end" style={{ background: "rgba(28,35,16,0.55)" }} onClick={() => setLangOpen(false)}>
          <div className="bg-card rounded-t-3xl p-5 pb-8 max-h-[70%] overflow-y-auto" onClick={(e) => e.stopPropagation()} style={{ boxShadow: "0 -8px 40px rgba(0,0,0,0.25)" }}>
            <div className="w-10 h-1 rounded-full mx-auto mb-4" style={{ background: C.border }} />
            <p className="font-bold text-foreground text-lg mb-4 text-center">{t("choose_language")}</p>
            <div className="grid grid-cols-2 gap-3">
              {LANGUAGES.map((l) => {
                const isSel = l.code === lang;
                return (
                  <button
                    key={l.code}
                    onClick={() => { setLang(l.code); setLangOpen(false); }}
                    className="relative p-4 rounded-2xl text-left active:scale-95 transition-transform"
                    style={{
                      background: isSel ? C.secondary : C.card,
                      border: `2px solid ${isSel ? C.primary : C.border}`,
                    }}
                  >
                    <div className="text-2xl mb-1">{l.flag}</div>
                    <div className="font-bold text-foreground text-base">{l.name}</div>
                    <div className="text-xs text-muted-foreground">{l.en}</div>
                    {isSel && <div className="absolute top-3 right-3"><CheckCircle size={16} color={C.primary} /></div>}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── New screens ──────────────────────────────────────────────────────────────
function WeatherScreen({ goBack }: { navigate: (s: Screen) => void; goBack: () => void }) {
  const { user } = useUser();
  const days = [
    { day:"Sat", icon:"⛅", high:34, low:28 }, { day:"Sun", icon:"⛅", high:36, low:29 },
    { day:"Mon", icon:"🌤️", high:36, low:30 }, { day:"Tue", icon:"☁️", high:37, low:30 },
    { day:"Wed", icon:"☁️", high:37, low:31 }, { day:"Thu", icon:"🌦️", high:33, low:27 },
  ];
  const slots = [
    { time:"Now", s:"unfav" }, { time:"2 pm", s:"unfav" }, { time:"3 pm", s:"unfav" },
    { time:"4 pm", s:"unfav" }, { time:"6 pm", s:"mod" }, { time:"8 pm", s:"opt" },
    { time:"6 am", s:"opt" }, { time:"8 am", s:"mod" },
  ];
  const slotBg = (s:string) => s==="opt"?C.primary:s==="mod"?C.accent:"#D1D5DB";
  const slotIcon = (s:string) => s==="opt"?"✓":s==="mod"?"~":"✗";
  const [aiExpanded, setAiExpanded] = useState(true);
  const [notif, setNotif] = useState(false);
  return (
    <div className="absolute inset-0 flex flex-col" style={{ background:"#EAF6FF" }}>
      <StatusBar />
      <div className="flex items-center px-4 pt-2 pb-1">
        <button onClick={goBack} className="w-10 h-10 flex items-center justify-center rounded-full mr-2" style={{ background:"rgba(255,255,255,0.7)" }}>
          <ChevronLeft size={22} color={C.fg}/>
        </button>
        <div>
          <p className="font-bold text-sm text-foreground">{user.district || "Your Location"}, {new Date().toLocaleDateString("en-IN",{day:"numeric",month:"short"})}</p>
          <p className="text-xs text-muted-foreground">Partly cloudy</p>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-4 pb-24">
        {/* Hero temp */}
        <div className="flex items-start justify-between mb-4 mt-2">
          <div>
            <p style={{ fontSize:56, fontWeight:900, color:C.fg, lineHeight:1 }}>36°C</p>
            <p className="text-sm text-muted-foreground mt-1">36°C / 29°C · Sunset 6:40 pm</p>
            <p className="text-sm flex items-center gap-1.5 mt-0.5" style={{ color:"#4A9FD4" }}><Droplets size={14}/> 22%</p>
          </div>
          <span style={{ fontSize:68, lineHeight:1, marginTop:4 }}>⛅</span>
        </div>
        {/* Key metrics */}
        <div className="grid grid-cols-4 gap-2 mb-4">
          {[
            { Icon:Wind, label:"Wind", val:"12 km/h" },
            { Icon:Droplets, label:"Humidity", val:"22%" },
            { Icon:Sun, label:"UV Index", val:"8 High" },
            { Icon:Cloud, label:"Rain", val:"15%" },
          ].map(m => (
            <div key={m.label} className="bg-card rounded-2xl p-2.5 flex flex-col items-center gap-1" style={{ boxShadow:"0 1px 6px rgba(0,0,0,0.06)", border:`1px solid ${C.border}` }}>
              <m.Icon size={18} color={C.primary}/>
              <p className="text-[10px] text-muted-foreground">{m.label}</p>
              <p className="text-[11px] font-bold text-foreground text-center">{m.val}</p>
            </div>
          ))}
        </div>
        {/* AI Summary */}
        <div className="bg-card rounded-2xl p-4 mb-4" style={{ boxShadow:"0 2px 12px rgba(0,0,0,0.06)", border:`1px solid ${C.border}` }}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Zap size={16} color={C.accent} fill={C.accent}/>
              <span className="font-bold text-sm text-foreground">AI Summary</span>
              <Info size={14} color={C.muted}/>
            </div>
            <button className="flex items-center gap-1.5 px-3 py-1 rounded-full" style={{ background:`${C.primary}15` }}>
              <Volume2 size={13} color={C.primary}/><span className="text-xs font-bold" style={{ color:C.primary }}>Listen</span>
            </button>
          </div>
          {aiExpanded && (
            <>
              <p className="text-sm text-muted-foreground leading-relaxed">Today morning is dry and mostly cloudy with temperatures around 29–36°C. This afternoon stays mostly cloudy with highs about 31–36°C and no meaningful precipitation.</p>
              <p className="text-sm text-muted-foreground leading-relaxed mt-2">Over the next days, it stays hot (about 28–37°C) with occasional light rain, with the highest chance of rain around the weekend.</p>
            </>
          )}
          <button onClick={() => setAiExpanded(e=>!e)} className="text-xs font-bold mt-2" style={{ color:C.primary }}>{aiExpanded?"Show less":"Read more"}</button>
          <div className="flex items-center justify-between mt-3 pt-3" style={{ borderTop:`1px solid ${C.border}` }}>
            <p className="text-xs text-muted-foreground">Get this as a daily notification</p>
            <button onClick={() => setNotif(n=>!n)} className="w-11 h-6 rounded-full relative transition-colors" style={{ background: notif ? C.primary : "#D1D5DB" }}>
              <div className="absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all" style={{ left: notif ? 24 : 4 }}/>
            </button>
          </div>
        </div>
        {/* 6-day forecast */}
        <div className="bg-card rounded-2xl p-4 mb-4" style={{ boxShadow:"0 2px 12px rgba(0,0,0,0.06)", border:`1px solid ${C.border}` }}>
          <p className="font-bold text-sm text-foreground mb-3">Next {days.length} days</p>
          <div className="flex justify-between">
            {days.map(d => (
              <div key={d.day} className="flex flex-col items-center gap-1">
                <span className="text-xs text-muted-foreground">{d.day}</span>
                <span className="text-xl">{d.icon}</span>
                <span className="text-xs font-bold text-foreground">{d.high}°</span>
                <span className="text-[10px] text-muted-foreground">{d.low}°</span>
              </div>
            ))}
          </div>
        </div>
        {/* Spraying Window */}
        <div className="bg-card rounded-2xl p-4 mb-4" style={{ boxShadow:"0 2px 12px rgba(0,0,0,0.06)", border:`1px solid ${C.border}` }}>
          <p className="font-bold text-sm text-foreground">Spraying Window</p>
          <p className="text-xs text-muted-foreground mb-3">Best time to spray crops based on current weather</p>
          <div className="p-3 rounded-xl mb-3 text-center" style={{ background:"#FFF3F3" }}>
            <p className="text-xs font-bold" style={{ color:C.destructive }}>⚠ Unfavourable spraying conditions right now</p>
          </div>
          <div className="flex gap-2 flex-wrap mb-3">
            {slots.map((sl,i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ background:slotBg(sl.s) }}>{slotIcon(sl.s)}</div>
                <span className="text-[10px] text-muted-foreground">{sl.time}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-4">
            {[{c:C.primary,l:"Optimal"},{c:C.accent,l:"Moderate"},{c:"#D1D5DB",l:"Unfavourable"}].map(k=>(
              <div key={k.l} className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full" style={{ background:k.c }}/>
                <span className="text-[10px] text-muted-foreground">{k.l}</span>
              </div>
            ))}
          </div>
          <button className="mt-2 text-xs font-semibold" style={{ color:C.primary }}>How is it calculated? →</button>
        </div>
        {/* Irrigation Suggestion */}
        <div className="bg-card rounded-2xl p-4 mb-4 flex items-start gap-3" style={{ boxShadow:"0 2px 12px rgba(0,0,0,0.06)", border:`1px solid ${C.border}` }}>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background:`${C.primary}18` }}>
            <Droplets size={20} color={C.primary}/>
          </div>
          <div>
            <p className="font-bold text-sm text-foreground">Irrigation Suggestion</p>
            <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">No rain expected in next 3 days. Irrigate wheat and onion fields tomorrow morning (40–45 mm). Skip cotton — soil moisture is adequate.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function CalculatorsScreen({ navigate, goBack }: { navigate: (s: Screen) => void; goBack: () => void }) {
  const calcs = [
    { key:"fertCalc" as Screen, icon:"🧪", title:"Fertilizer Calculator", desc:"Calculate NPK doses for your field size and crop" },
    { key:"pestCalc" as Screen, icon:"🪣", title:"Pesticide Calculator", desc:"Calculate dosage based on area planted or water volume" },
    { key:"farmCalc" as Screen, icon:"📊", title:"Farming Calculator", desc:"Estimate profit, yield and no-loss selling price" },
  ];
  return (
    <div className="absolute inset-0 bg-background flex flex-col">
      <StatusBar />
      <PageHeader title="Calculators" goBack={goBack}/>
      <div className="flex-1 overflow-y-auto px-4 pt-2 pb-24">
        <p className="text-sm text-muted-foreground mb-4">Tools to help plan your farm inputs and finances</p>
        {calcs.map(c => (
          <button key={c.key} onClick={() => navigate(c.key)}
            className="w-full bg-card rounded-2xl p-4 mb-3 flex items-center gap-4 text-left active:scale-[0.98] transition-transform"
            style={{ boxShadow:"0 2px 14px rgba(0,0,0,0.07)", border:`1px solid ${C.border}` }}>
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shrink-0" style={{ background:C.secondary }}>{c.icon}</div>
            <div className="flex-1">
              <p className="font-bold text-base text-foreground">{c.title}</p>
              <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{c.desc}</p>
            </div>
            <ChevronRight size={20} color={C.muted} className="shrink-0"/>
          </button>
        ))}
      </div>
    </div>
  );
}

function RatingRow({ rating, setRating }: { rating: number|null; setRating: (v:number) => void }) {
  return (
    <div className="bg-card rounded-2xl p-4 text-center mt-4" style={{ border:`1px solid ${C.border}` }}>
      <p className="font-bold text-sm text-foreground mb-3">How useful did you find this tool?</p>
      <div className="flex justify-center gap-4">
        {[{ v:1,e:"😞" },{ v:2,e:"😐" },{ v:3,e:"😊" }].map(r => (
          <button key={r.v} onClick={() => setRating(r.v)}
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl transition-all active:scale-90"
            style={{ background:rating===r.v?C.secondary:C.card, border:`2px solid ${rating===r.v?C.primary:C.border}` }}>
            {r.e}
          </button>
        ))}
      </div>
      {rating && <p className="text-xs text-muted-foreground mt-2">Thank you for your feedback!</p>}
    </div>
  );
}

function FertilizerCalcScreen({ goBack }: { navigate: (s: Screen) => void; goBack: () => void }) {
  const [fieldSize, setFieldSize] = useState(1.5);
  const [unit, setUnit] = useState("Acre");
  const [results, setResults] = useState<null|number>(null);
  const [rating, setRating] = useState<number|null>(null);
  const combos = [
    { name:"MOP / TSP / Urea", items:[{name:"MOP",qty:"25 kg",bags:"½ Bag"},{name:"TSP",qty:"59 kg",bags:"1¼ Bag"},{name:"Urea",qty:"26 kg",bags:"½ Bag"}] },
    { name:"10-26-26 / TSP / Urea", items:[{name:"10-26-26",qty:"58 kg",bags:"1¼ Bag"},{name:"TSP",qty:"26 kg",bags:"½ Bag"},{name:"Urea",qty:"14 kg",bags:"¼ Bag"}] },
    { name:"DAP / MOP / Urea", items:[{name:"DAP",qty:"59 kg",bags:"1¼ Bag"},{name:"MOP",qty:"25 kg",bags:"½ Bag"},{name:"Urea",qty:"3.2 kg",bags:""}] },
  ];
  return (
    <div className="absolute inset-0 bg-background flex flex-col">
      <StatusBar />
      <div className="px-4 pt-3 pb-2 flex items-center gap-3" style={{ borderBottom:`1px solid ${C.border}` }}>
        <button onClick={goBack} className="w-10 h-10 flex items-center justify-center rounded-full" style={{ background:C.secondary }}><ChevronLeft size={22} color={C.fg}/></button>
        <h1 className="font-extrabold text-xl text-foreground">Fertilizer Calculator</h1>
      </div>
      <div className="flex-1 overflow-y-auto px-4 pb-24 pt-3">
        {/* NPK display */}
        <div className="bg-card rounded-2xl p-4 mb-3" style={{ boxShadow:"0 2px 10px rgba(0,0,0,0.06)", border:`1px solid ${C.border}` }}>
          <div className="flex items-center justify-between mb-3">
            <p className="font-bold text-sm text-foreground">Nutrient quantities (kg/acre)</p>
            <button className="text-xs font-bold" style={{ color:C.primary }}>Edit</button>
          </div>
          <div className="flex gap-2">
            {[["N","20"],["P","45"],["K","25"]].map(([l,v]) => (
              <div key={l} className="flex-1 py-2 rounded-xl text-center" style={{ background:C.secondary }}>
                <span className="text-xs font-bold text-muted-foreground">{l} </span>
                <span className="text-xs font-bold text-foreground">{v}</span>
              </div>
            ))}
          </div>
        </div>
        {/* Field size stepper */}
        <p className="font-bold text-sm text-foreground mb-2">Field size</p>
        <div className="bg-card rounded-2xl p-4 mb-3 flex items-center gap-4" style={{ boxShadow:"0 2px 10px rgba(0,0,0,0.06)", border:`1px solid ${C.border}` }}>
          <button onClick={() => setFieldSize(s => Math.max(0.25,+(s-0.25).toFixed(2)))}
            className="w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold" style={{ background:C.secondary, color:C.primary }}>−</button>
          <div className="flex-1 text-center">
            <p className="font-extrabold text-foreground" style={{ fontSize:40, lineHeight:1 }}>{fieldSize}</p>
            <p className="text-xs text-muted-foreground">{unit}</p>
          </div>
          <button onClick={() => setFieldSize(s => +(s+0.25).toFixed(2))}
            className="w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold" style={{ background:C.secondary, color:C.primary }}>+</button>
        </div>
        <button className="flex items-center gap-2 mb-3 px-3 py-2 rounded-full" style={{ background:C.secondary }}>
          <MapPin size={14} color={C.primary}/><span className="text-xs font-bold" style={{ color:C.primary }}>Measure field size</span>
        </button>
        {/* Unit */}
        <p className="text-sm font-semibold text-foreground mb-2">Unit</p>
        <div className="flex gap-5 mb-4">
          {["Acre","Hectare","Gunta"].map(u => (
            <label key={u} className="flex items-center gap-2 cursor-pointer" onClick={() => setUnit(u)}>
              <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center" style={{ borderColor:unit===u?C.primary:C.muted }}>
                {unit===u && <div className="w-2.5 h-2.5 rounded-full" style={{ background:C.primary }}/>}
              </div>
              <span className="text-sm text-foreground">{u}</span>
            </label>
          ))}
        </div>
        <button onClick={() => setResults(1)}
          className="w-full py-4 rounded-2xl text-white font-bold text-base mb-4 active:scale-95 transition-transform"
          style={{ background:`linear-gradient(135deg,${C.primary},${C.dark})` }}>
          Calculate
        </button>
        {results && (
          <>
            <p className="text-sm font-semibold text-foreground mb-3">Choose your preferred fertilizer combination (recommended amount for one season):</p>
            {combos.map(combo => (
              <div key={combo.name} className="bg-card rounded-2xl p-4 mb-3" style={{ boxShadow:"0 2px 10px rgba(0,0,0,0.05)", border:`1px solid ${C.border}` }}>
                <p className="font-bold text-sm text-foreground mb-3">{combo.name}</p>
                <div className="flex gap-5 mb-3 flex-wrap">
                  {combo.items.map(it => (
                    <div key={it.name}>
                      <p className="text-xs text-muted-foreground">{it.name}</p>
                      <p className="font-extrabold text-base text-foreground">{it.qty}</p>
                      <p className="text-xs text-muted-foreground">{it.bags}</p>
                    </div>
                  ))}
                </div>
                <button className="px-4 py-2 rounded-xl text-sm font-bold text-white" style={{ background:C.primary }}>View Details</button>
              </div>
            ))}
          </>
        )}
        <RatingRow rating={rating} setRating={setRating}/>
      </div>
    </div>
  );
}

function PesticideCalcScreen({ goBack }: { navigate: (s: Screen) => void; goBack: () => void }) {
  const [cropType, setCropType] = useState<"field"|"tree"|null>(null);
  const [rating, setRating] = useState<number|null>(null);
  const recent = [
    { label:"0.80 ml/L", sub:"Neem oil — Aphids" },
    { label:"2 g/L", sub:"Mancozeb — Blast" },
    { label:"1.5 ml/L", sub:"Chlorpyrifos — Borers" },
  ];
  return (
    <div className="absolute inset-0 bg-background flex flex-col">
      <StatusBar />
      <div className="px-4 pt-3 pb-2 flex items-center gap-3" style={{ borderBottom:`1px solid ${C.border}` }}>
        <button onClick={goBack} className="w-10 h-10 flex items-center justify-center rounded-full" style={{ background:C.secondary }}><ChevronLeft size={22} color={C.fg}/></button>
        <h1 className="font-extrabold text-xl text-foreground">Pesticide Calculator</h1>
      </div>
      <div className="flex-1 overflow-y-auto px-4 pb-24 pt-3">
        <p className="font-bold text-base text-foreground mb-4">What type of crop do you want to calculate pesticide dosage for?</p>
        <div className="grid grid-cols-2 gap-3 mb-6">
          {[
            { key:"field" as const, icon:"🌾", title:"Field crops", desc:"Calculate dosage based on area planted" },
            { key:"tree" as const, icon:"🌳", title:"Trees", desc:"Calculate dosage based on amount of water for trees" },
          ].map(opt => (
            <button key={opt.key} onClick={() => setCropType(opt.key)}
              className="p-4 rounded-2xl text-left transition-all active:scale-95"
              style={{ background:C.card, border:`2px solid ${cropType===opt.key?C.primary:C.border}`, boxShadow:"0 2px 12px rgba(0,0,0,0.06)" }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-2xl mb-3" style={{ background:C.secondary }}>{opt.icon}</div>
              <p className="font-bold text-sm text-foreground">{opt.title}</p>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{opt.desc}</p>
            </button>
          ))}
        </div>
        <div className="flex items-center justify-center py-6 rounded-2xl mb-4 gap-4" style={{ background:C.secondary }}>
          <span style={{ fontSize:56 }}>🪣</span><span style={{ fontSize:40 }}>💧</span>
        </div>
        {cropType && (
          <button className="w-full py-4 rounded-2xl text-white font-bold text-base mb-4 active:scale-95 transition-transform"
            style={{ background:`linear-gradient(135deg,${C.primary},${C.dark})` }}>
            Continue with {cropType === "field" ? "Field Crops" : "Trees"}
          </button>
        )}
        <p className="font-bold text-base text-foreground mb-3">Recent calculations</p>
        {recent.map(r => (
          <div key={r.label} className="flex items-center gap-3 py-3 border-b" style={{ borderColor:C.border }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background:C.secondary }}>
              <BarChart2 size={18} color={C.primary}/>
            </div>
            <div>
              <p className="font-bold text-sm text-foreground">{r.label}</p>
              <p className="text-xs text-muted-foreground">{r.sub}</p>
            </div>
          </div>
        ))}
        <RatingRow rating={rating} setRating={setRating}/>
      </div>
    </div>
  );
}

function FarmingCalcScreen({ goBack }: { navigate: (s: Screen) => void; goBack: () => void }) {
  const [calcType, setCalcType] = useState<string|null>(null);
  const [rating, setRating] = useState<number|null>(null);
  const calcs = [
    { key:"yield", icon:"⚖️", title:"Required yield", desc:"How much you need to harvest to cover expenses" },
    { key:"budget", icon:"₹", title:"Max input budget", desc:"How much you can spend on inputs" },
    { key:"profit", icon:"📈", title:"Estimated profit", desc:"Profit after covering all expenses" },
    { key:"noloss", icon:"🏪", title:"No-loss price", desc:"Lowest price to sell at without making a loss" },
  ];
  const recent = [
    { label:"₹0.80/kg", sub:"No loss price" },
    { label:"₹376", sub:"Maximum input budget" },
    { label:"1 kg", sub:"Required yield" },
  ];
  return (
    <div className="absolute inset-0 bg-background flex flex-col">
      <StatusBar />
      <div className="px-4 pt-3 pb-2 flex items-center gap-3" style={{ borderBottom:`1px solid ${C.border}` }}>
        <button onClick={goBack} className="w-10 h-10 flex items-center justify-center rounded-full" style={{ background:C.secondary }}><ChevronLeft size={22} color={C.fg}/></button>
        <h1 className="font-extrabold text-xl text-foreground">Farming Calculator</h1>
      </div>
      <div className="flex-1 overflow-y-auto px-4 pb-24 pt-3">
        <p className="font-bold text-base text-foreground mb-4">What do you want to calculate?</p>
        <div className="grid grid-cols-2 gap-3 mb-5">
          {calcs.map(c => (
            <button key={c.key} onClick={() => setCalcType(c.key)}
              className="p-4 rounded-2xl text-left transition-all active:scale-95"
              style={{ background:C.card, border:`2px solid ${calcType===c.key?C.primary:C.border}`, boxShadow:"0 2px 12px rgba(0,0,0,0.06)" }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-2xl mb-3" style={{ background:C.secondary }}>{c.icon}</div>
              <p className="font-bold text-sm text-foreground">{c.title}</p>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{c.desc}</p>
            </button>
          ))}
        </div>
        {calcType && (
          <button className="w-full py-4 rounded-2xl text-white font-bold text-base mb-5 active:scale-95 transition-transform"
            style={{ background:`linear-gradient(135deg,${C.primary},${C.dark})` }}>
            Calculate {calcs.find(c=>c.key===calcType)?.title}
          </button>
        )}
        <p className="font-bold text-base text-foreground mb-3">Recent calculations</p>
        {recent.map(r => (
          <div key={r.label} className="flex items-center gap-3 py-3 border-b" style={{ borderColor:C.border }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background:C.secondary }}>
              <BarChart2 size={18} color={C.primary}/>
            </div>
            <div>
              <p className="font-bold text-sm text-foreground">{r.label}</p>
              <p className="text-xs text-muted-foreground">{r.sub}</p>
            </div>
          </div>
        ))}
        <RatingRow rating={rating} setRating={setRating}/>
      </div>
    </div>
  );
}

function AskCommunityScreen({ goBack }: { navigate: (s: Screen) => void; goBack: () => void }) {
  const [question, setQuestion] = useState("");
  const [desc, setDesc] = useState("");
  const [crop, setCrop] = useState("");
  const [sent, setSent] = useState(false);
  if (sent) {
    return (
      <div className="absolute inset-0 bg-background flex flex-col items-center justify-center gap-5 px-8">
        <StatusBar/>
        <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ background:`${C.primary}20` }}>
          <CheckCircle size={40} color={C.primary}/>
        </div>
        <h2 className="font-extrabold text-xl text-foreground text-center">Question sent!</h2>
        <p className="text-sm text-muted-foreground text-center">Farmers and experts in your area will answer soon. You'll get a notification when someone replies.</p>
        <button onClick={goBack} className="w-full py-4 rounded-2xl text-white font-bold" style={{ background:`linear-gradient(135deg,${C.primary},${C.dark})` }}>Back to Community</button>
      </div>
    );
  }
  return (
    <div className="absolute inset-0 bg-background flex flex-col">
      <StatusBar />
      <div className="px-4 pt-3 pb-3 flex items-center gap-3" style={{ borderBottom:`1px solid ${C.border}` }}>
        <button onClick={goBack} className="w-10 h-10 flex items-center justify-center rounded-full" style={{ background:C.secondary }}><ChevronLeft size={22} color={C.fg}/></button>
        <h1 className="font-extrabold text-xl text-foreground">Ask Community</h1>
      </div>
      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-8">
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-full border mb-2 active:scale-95 transition-transform" style={{ borderColor:C.border }}>
          <Image size={16} color={C.fg}/><span className="text-sm font-medium text-foreground">Add image</span>
        </button>
        <p className="text-xs text-muted-foreground mb-4">Improve the probability of receiving the right answer</p>
        <div className="flex gap-2 flex-wrap mb-4">
          {crop ? (
            <button onClick={() => setCrop("")} className="flex items-center gap-1.5 pl-1.5 pr-2.5 py-1.5 rounded-full active:scale-95" style={{ background:C.primary }}>
              <CropIllustration crop={crop} size={20}/>
              <span className="text-xs font-bold text-white">{crop}</span>
              <X size={11} color="rgba(255,255,255,0.8)"/>
            </button>
          ) : (
            <button onClick={() => setCrop("wheat")} className="flex items-center gap-2 px-4 py-2 rounded-full border active:scale-95" style={{ borderColor:C.border }}>
              <Plus size={14} color={C.fg}/><span className="text-sm text-foreground">Add crop</span>
            </button>
          )}
        </div>
        <p className="font-bold text-base text-foreground mb-2">Your question to the community</p>
        <div className="relative mb-4">
          <textarea value={question} onChange={e => setQuestion(e.target.value.slice(0,200))} rows={3}
            placeholder="Add a question indicating what's wrong with your crop"
            className="w-full px-4 py-3 rounded-2xl text-sm outline-none resize-none"
            style={{ border:`1.5px solid ${question.length>0?C.primary:C.border}`, background:C.card, color:C.fg }}/>
          <span className="absolute bottom-3 right-3 text-xs text-muted-foreground">{question.length}/200</span>
        </div>
        <p className="font-bold text-base text-foreground mb-2">Description of your problem</p>
        <div className="relative mb-6">
          <textarea value={desc} onChange={e => setDesc(e.target.value.slice(0,2500))} rows={5}
            placeholder="Describe specialities such as change of leaves, root colour, bugs, tears..."
            className="w-full px-4 py-3 rounded-2xl text-sm outline-none resize-none"
            style={{ border:`1.5px solid ${desc.length>0?C.primary:C.border}`, background:C.card, color:C.fg }}/>
          <span className="absolute bottom-3 right-3 text-xs text-muted-foreground">{desc.length}/2500</span>
        </div>
      </div>
      <div className="px-4 pb-8 pt-3" style={{ borderTop:`1px solid ${C.border}` }}>
        <button onClick={() => { if(question.trim()) setSent(true); }} disabled={!question.trim()}
          className="w-full py-4 rounded-2xl font-bold text-lg active:scale-95 transition-transform"
          style={{ background:question.trim()?`linear-gradient(135deg,${C.primary},${C.dark})`:"#ccc", color:"white" }}>
          Send
        </button>
      </div>
    </div>
  );
}

// ─── Per-crop agronomy (deterministic from crop key) ──────────────────────────
const cropHash = (crop: string) => crop.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
const GROWTH_STAGES = ["Germination", "Vegetative", "Flowering", "Fruiting", "Maturity"];

function cropInfo(crop: string) {
  const h = cropHash(crop);
  const stage = h % GROWTH_STAGES.length;
  const health = h % 3 === 1 ? "at_risk" : "healthy";
  const daysLeft = 20 + (h % 90);
  const nextWater = 1 + (h % 4);
  const priceRow = marketPrices.find((p) => p.crop === crop);
  const price = priceRow ? priceRow.price : 1500 + (h % 40) * 100;
  const change = priceRow ? priceRow.change : ((h % 11) - 5);
  const diseaseRisk = h % 3 === 0 ? "High" : h % 3 === 1 ? "Medium" : "Low";
  return { stage, health, daysLeft, nextWater, price, change, diseaseRisk };
}

// A structured cultivation guide, lightly varied by crop category.
function cultivationGuide(crop: string, t: (k: string) => string) {
  const def = CROPS.find((c) => c.key === crop);
  const cat = def?.cat ?? "cat_cereals";
  const seasonMap: Record<string, string> = {
    cat_cereals: "Kharif & Rabi (Jun–Nov / Nov–Apr)",
    cat_cash: "Kharif (Jun–Oct)",
    cat_spices: "Post-monsoon (Aug–Feb)",
    cat_vegetables: "Year-round (staggered sowing)",
    cat_fruits: "Perennial / seasonal",
    cat_plantation: "Perennial",
  };
  return [
    { icon: Sun, key: "ct_season", text: seasonMap[cat] },
    { icon: Ruler, key: "ct_land_prep", text: "Plough 2–3 times, level the field and add well-rotted farmyard manure (5–10 t/acre) before sowing." },
    { icon: Sprout, key: "ct_sowing", text: "Use certified seed. Maintain recommended spacing and sowing depth for even germination." },
    { icon: Droplets, key: "ct_watering", text: "Irrigate at critical stages — germination, flowering and grain/fruit filling. Avoid water-logging." },
    { icon: Beaker, key: "ct_fertilizer", text: "Apply NPK per soil-test. Split nitrogen into 2–3 doses through the crop cycle." },
    { icon: Bug, key: "ct_pest", text: "Scout weekly. Prefer IPM — pheromone traps, neem-based sprays; use chemicals only at threshold." },
    { icon: Shield, key: "ct_disease", text: "Use resistant varieties, treat seed, rotate crops and ensure good drainage to prevent disease." },
    { icon: Award, key: "ct_harvest", text: "Harvest at physiological maturity for best quality and market price." },
    { icon: Package, key: "ct_storage", text: "Dry to safe moisture, clean and store in aerated, pest-free godowns or bags." },
    { icon: FileText, key: "ct_gov_advice", text: "Check eligibility for input subsidies and crop insurance (PMFBY) via your local Krishi Vigyan Kendra." },
  ];
}

// ─── Crop detail (individual per-crop page) ───────────────────────────────────
function CropDetailScreen({ navigate, goBack }: { navigate: (s: Screen) => void; goBack: () => void }) {
  const { t } = useLang();
  const { user } = useUser();
  const { selectedCrop } = useStore();
  const crop = selectedCrop || user.crops[0] || "wheat";
  const info = cropInfo(crop);
  const unitLabel = t(`unit_${user.unit || "acres"}`);
  const per = user.crops.length ? (Number(user.farmSize) || 0) / user.crops.length : 0;
  const healthColor = info.health === "healthy" ? C.primary : C.accent;
  const riskColor = info.diseaseRisk === "High" ? C.destructive : info.diseaseRisk === "Medium" ? C.accent : C.primary;

  const Card = ({ icon: Icon, color, title, children }: { icon: typeof Sun; color: string; title: string; children: ReactNode }) => (
    <div className="bg-card rounded-2xl p-4 mb-3" style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.06)", border: `1px solid ${C.border}` }}>
      <div className="flex items-center gap-2 mb-2">
        <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: color + "22" }}><Icon size={16} color={color} /></div>
        <p className="font-bold text-sm text-foreground">{title}</p>
      </div>
      {children}
    </div>
  );

  return (
    <div className="absolute inset-0 bg-background flex flex-col">
      <StatusBar />
      <PageHeader title={t(`crop_${crop}`)} goBack={goBack} />
      <div className="flex-1 overflow-y-auto px-4 pb-28">
        {/* Hero */}
        <div className="rounded-2xl p-4 mb-3 flex items-center gap-4" style={{ background: `linear-gradient(135deg, ${C.primary}, ${C.dark})` }}>
          <div className="w-20 h-20 rounded-2xl bg-white/15 flex items-center justify-center shrink-0"><CropBadge crop={crop} size={56} bg="transparent" /></div>
          <div className="text-white">
            <p className="font-bold text-lg leading-tight">{t(`crop_${crop}`)}</p>
            <p className="text-xs opacity-90 flex items-center gap-1 mt-0.5"><MapPin size={11} />{per > 0 ? per.toFixed(1) : "0.5"} {unitLabel}</p>
            <span className="inline-block mt-1.5 text-[11px] font-bold px-2 py-0.5 rounded-full bg-white/20">{GROWTH_STAGES[info.stage]}</span>
          </div>
        </div>

        <Card icon={Activity} color={C.primary} title={t("cd_growth_stage")}>
          <div className="flex items-center justify-between mb-1.5 text-xs text-muted-foreground">
            <span>{GROWTH_STAGES[info.stage]}</span><span>{info.stage + 1} {t("cd_stage_of")} {GROWTH_STAGES.length}</span>
          </div>
          <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: C.secondary }}>
            <div className="h-full rounded-full" style={{ background: C.primary, width: `${((info.stage + 1) / GROWTH_STAGES.length) * 100}%` }} />
          </div>
        </Card>

        <div className="grid grid-cols-2 gap-3 mb-3">
          <div className="bg-card rounded-2xl p-4" style={{ border: `1px solid ${C.border}` }}>
            <Heart size={16} color={healthColor} className="mb-1.5" />
            <p className="text-xs text-muted-foreground">{t("cd_crop_health")}</p>
            <p className="font-bold text-sm" style={{ color: healthColor }}>{t(`health_${info.health}`)}</p>
          </div>
          <div className="bg-card rounded-2xl p-4" style={{ border: `1px solid ${C.border}` }}>
            <AlertTriangle size={16} color={riskColor} className="mb-1.5" />
            <p className="text-xs text-muted-foreground">{t("cd_diseases")}</p>
            <p className="font-bold text-sm" style={{ color: riskColor }}>{info.diseaseRisk}</p>
          </div>
        </div>

        <Card icon={Droplets} color="#4A9FD4" title={t("cd_water")}>
          <p className="text-sm text-foreground">{t("cd_next_water")}: <span className="font-bold">{info.nextWater} {t("days_word")}</span></p>
        </Card>

        <Card icon={Beaker} color={C.accent} title={t("cd_fertilizer")}>
          <p className="text-sm text-muted-foreground">NPK split dose recommended this stage. <button onClick={() => navigate("fertCalc")} className="font-bold" style={{ color: C.primary }}>Open calculator →</button></p>
        </Card>

        <Card icon={BarChart2} color={C.primary} title={t("cd_market_price")}>
          <div className="flex items-baseline justify-between">
            <p className="font-extrabold text-lg text-foreground">₹{info.price.toLocaleString()} <span className="text-xs font-normal text-muted-foreground">/ {t("cd_per_quintal")}</span></p>
            <span className="flex items-center gap-0.5 text-sm font-bold" style={{ color: info.change >= 0 ? C.primary : C.destructive }}>
              {info.change >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}{Math.abs(info.change)}%
            </span>
          </div>
        </Card>

        <Card icon={Clock} color={C.highlight} title={t("cd_harvest")}>
          <p className="text-sm text-foreground"><span className="font-bold">{info.daysLeft}</span> {t("cd_days_left")}</p>
        </Card>

        <Card icon={Sparkles} color="#9B6DC5" title={t("cd_ai_reco")}>
          <p className="text-sm text-muted-foreground">Based on the current stage and weather, ensure timely irrigation and monitor for {info.diseaseRisk.toLowerCase()} disease pressure this week.</p>
        </Card>

        <Card icon={Cloud} color="#4A9FD4" title={t("cd_weather_impact")}>
          <p className="text-sm text-muted-foreground">Mild conditions expected — favourable for {GROWTH_STAGES[info.stage].toLowerCase()} stage. <button onClick={() => navigate("weather")} className="font-bold" style={{ color: C.primary }}>See forecast →</button></p>
        </Card>

        <button onClick={() => navigate("cultivation")} className="w-full py-4 rounded-2xl text-white font-bold flex items-center justify-center gap-2 active:scale-95 transition-transform" style={{ background: `linear-gradient(135deg, ${C.primary}, ${C.dark})` }}>
          <BookOpen size={18} /> {t("cd_view_cultivation")}
        </button>
      </div>
    </div>
  );
}

// ─── Cultivation tips ─────────────────────────────────────────────────────────
function CultivationScreen({ goBack }: { navigate: (s: Screen) => void; goBack: () => void }) {
  const { t } = useLang();
  const { user } = useUser();
  const { selectedCrop, setSelectedCrop } = useStore();
  const cropList = user.crops.length ? user.crops : CROPS.slice(0, 8).map((c) => c.key);
  const crop = selectedCrop && cropList.includes(selectedCrop) ? selectedCrop : cropList[0];
  const guide = cultivationGuide(crop, t);
  return (
    <div className="absolute inset-0 bg-background flex flex-col">
      <StatusBar />
      <PageHeader title={t("ct_title")} goBack={goBack} />
      {/* Crop chooser */}
      <div className="flex gap-2 px-4 pb-3 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
        {cropList.map((c) => (
          <button key={c} onClick={() => setSelectedCrop(c)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-full whitespace-nowrap shrink-0 text-sm font-bold transition-all"
            style={{ background: c === crop ? C.primary : C.card, color: c === crop ? "#fff" : C.fg, border: `1.5px solid ${c === crop ? C.primary : C.border}` }}>
            <CropBadge crop={c} size={20} bg="transparent" /> {t(`crop_${c}`)}
          </button>
        ))}
      </div>
      <div className="flex-1 overflow-y-auto px-4 pb-28">
        {guide.map((g) => (
          <div key={g.key} className="bg-card rounded-2xl p-4 mb-3" style={{ boxShadow: "0 2px 10px rgba(0,0,0,0.05)", border: `1px solid ${C.border}` }}>
            <div className="flex items-center gap-2 mb-1.5">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: C.secondary }}><g.icon size={16} color={C.primary} /></div>
              <p className="font-bold text-sm text-foreground">{t(g.key)}</p>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">{g.text}</p>
          </div>
        ))}
        {/* Placeholders */}
        <div className="bg-card rounded-2xl p-4 mb-3 flex items-center gap-3" style={{ border: `1px dashed ${C.border}` }}>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: C.secondary }}><Eye size={18} color={C.muted} /></div>
          <div><p className="font-bold text-sm text-foreground">{t("ct_videos")}</p><p className="text-xs text-muted-foreground">{t("ct_videos_soon")}</p></div>
        </div>
        <div className="bg-card rounded-2xl p-4 flex items-center gap-3" style={{ border: `1px dashed ${C.border}` }}>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: C.secondary }}><Users size={18} color={C.muted} /></div>
          <div><p className="font-bold text-sm text-foreground">{t("ct_expert")}</p><p className="text-xs text-muted-foreground">{t("ct_expert_soon")}</p></div>
        </div>
      </div>
    </div>
  );
}

// ─── Cart ─────────────────────────────────────────────────────────────────────
function CartScreen({ navigate, goBack }: { navigate: (s: Screen) => void; goBack: () => void }) {
  const { t } = useLang();
  const { cart, setQty, removeFromCart, cartTotal } = useStore();
  const delivery = cart.length ? (cartTotal > 999 ? 0 : 49) : 0;
  return (
    <div className="absolute inset-0 bg-background flex flex-col">
      <StatusBar />
      <PageHeader title={t("mk_your_cart")} goBack={goBack} />
      {cart.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mb-4" style={{ background: C.secondary }}><ShoppingCart size={36} color={C.primary} /></div>
          <p className="font-bold text-foreground mb-1">{t("mk_cart_empty")}</p>
          <p className="text-sm text-muted-foreground mb-5">{t("mk_cart_empty_sub")}</p>
          <button onClick={() => navigate("market")} className="px-6 py-3 rounded-2xl text-white font-bold" style={{ background: C.primary }}>{t("mk_browse")}</button>
        </div>
      ) : (
        <>
          <div className="flex-1 overflow-y-auto px-4 pb-4">
            {cart.map((c) => (
              <div key={c.id} className="bg-card rounded-2xl p-3 mb-3 flex gap-3 items-center" style={{ border: `1px solid ${C.border}` }}>
                <div className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0" style={{ background: C.secondary }}><CropBadge crop={c.crop} size={40} bg="transparent" /></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-foreground leading-tight line-clamp-2">{c.name}</p>
                  <p className="text-[11px] text-muted-foreground mb-1">{c.brand}</p>
                  <p className="font-extrabold text-sm text-foreground">₹{(c.price * c.qty).toLocaleString()}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <button onClick={() => removeFromCart(c.id)}><Trash2 size={16} color={C.destructive} /></button>
                  <div className="flex items-center gap-2">
                    <button onClick={() => setQty(c.id, c.qty - 1)} className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: C.secondary }}><Minus size={13} color={C.primary} /></button>
                    <span className="text-sm font-extrabold min-w-[16px] text-center">{c.qty}</span>
                    <button onClick={() => setQty(c.id, c.qty + 1)} className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: C.primary }}><Plus size={13} color="#fff" /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="px-4 pt-3 pb-6 shrink-0" style={{ background: C.bg, borderTop: `1px solid ${C.border}` }}>
            <div className="flex justify-between text-sm mb-1"><span className="text-muted-foreground">{t("mk_subtotal")}</span><span className="font-semibold">₹{cartTotal.toLocaleString()}</span></div>
            <div className="flex justify-between text-sm mb-2"><span className="text-muted-foreground">{t("mk_delivery")}</span><span className="font-semibold">{delivery === 0 ? t("mk_free") : `₹${delivery}`}</span></div>
            <button onClick={() => navigate("checkout")} className="w-full py-4 rounded-2xl text-white font-bold text-lg active:scale-95 transition-transform" style={{ background: `linear-gradient(135deg, ${C.primary}, ${C.dark})` }}>
              {t("mk_checkout")} · ₹{(cartTotal + delivery).toLocaleString()}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

// ─── Checkout ─────────────────────────────────────────────────────────────────
function CheckoutScreen({ navigate, goBack }: { navigate: (s: Screen) => void; goBack: () => void }) {
  const { t } = useLang();
  const { user } = useUser();
  const { cart, cartTotal, placeOrder } = useStore();
  const [promo, setPromo] = useState("");
  const [applied, setApplied] = useState(false);
  const [pay, setPay] = useState<"cod" | "online">("cod");
  const delivery = cartTotal > 999 ? 0 : 49;
  const discount = applied ? Math.round(cartTotal * 0.1) : 0;
  const total = cartTotal + delivery - discount;
  const place = () => {
    placeOrder({ items: cart, subtotal: cartTotal, delivery, discount, total });
    navigate("orderSuccess");
  };
  if (cart.length === 0) {
    return (
      <div className="absolute inset-0 bg-background flex flex-col">
        <StatusBar /><PageHeader title={t("mk_checkout")} goBack={goBack} />
        <div className="flex-1 flex items-center justify-center"><p className="text-muted-foreground">{t("mk_cart_empty")}</p></div>
      </div>
    );
  }
  return (
    <div className="absolute inset-0 bg-background flex flex-col">
      <StatusBar />
      <PageHeader title={t("mk_checkout")} goBack={goBack} />
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        {/* Deliver to */}
        <div className="bg-card rounded-2xl p-4 mb-3" style={{ border: `1px solid ${C.border}` }}>
          <div className="flex items-center gap-2 mb-1"><MapPin size={15} color={C.primary} /><p className="font-bold text-sm text-foreground">{t("mk_deliver_to")}</p></div>
          <p className="text-sm text-foreground font-semibold">{user.name || "—"}</p>
          <p className="text-xs text-muted-foreground">{locationLabel(user) || "—"}</p>
        </div>
        {/* Items */}
        <div className="bg-card rounded-2xl p-4 mb-3" style={{ border: `1px solid ${C.border}` }}>
          <p className="font-bold text-sm text-foreground mb-2">{t("mk_order_items")}</p>
          {cart.map((c) => (
            <div key={c.id} className="flex justify-between text-sm py-1"><span className="text-muted-foreground truncate pr-2">{c.name} × {c.qty}</span><span className="font-semibold shrink-0">₹{(c.price * c.qty).toLocaleString()}</span></div>
          ))}
        </div>
        {/* Promo */}
        <div className="bg-card rounded-2xl p-4 mb-3" style={{ border: `1px solid ${C.border}` }}>
          <div className="flex gap-2">
            <div className="flex items-center gap-2 flex-1 px-3 rounded-xl" style={{ background: C.secondary }}>
              <Tag size={15} color={C.muted} />
              <input value={promo} onChange={(e) => setPromo(e.target.value.toUpperCase())} placeholder={t("mk_promo")} className="flex-1 bg-transparent outline-none text-sm py-2.5" />
            </div>
            <button onClick={() => setApplied(promo.length > 2)} className="px-4 rounded-xl text-white font-bold text-sm" style={{ background: C.primary }}>{t("mk_apply")}</button>
          </div>
          {applied && <p className="text-xs mt-2 font-semibold" style={{ color: C.primary }}>✓ {t("mk_promo_applied")} (−₹{discount})</p>}
        </div>
        {/* Payment */}
        <div className="bg-card rounded-2xl p-4 mb-3" style={{ border: `1px solid ${C.border}` }}>
          <p className="font-bold text-sm text-foreground mb-2">{t("mk_payment")}</p>
          {[{ k: "cod" as const, label: t("mk_cod"), icon: Wallet }, { k: "online" as const, label: t("mk_online"), icon: CreditCard }].map((o) => (
            <button key={o.k} onClick={() => setPay(o.k)} className="w-full flex items-center gap-3 py-2.5" >
              <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ border: `2px solid ${pay === o.k ? C.primary : C.border}` }}>{pay === o.k && <div className="w-2.5 h-2.5 rounded-full" style={{ background: C.primary }} />}</div>
              <o.icon size={16} color={C.muted} />
              <span className="text-sm text-foreground">{o.label}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="px-4 pt-3 pb-6 shrink-0" style={{ background: C.bg, borderTop: `1px solid ${C.border}` }}>
        <div className="flex justify-between text-sm mb-1"><span className="text-muted-foreground">{t("mk_subtotal")}</span><span className="font-semibold">₹{cartTotal.toLocaleString()}</span></div>
        <div className="flex justify-between text-sm mb-1"><span className="text-muted-foreground">{t("mk_delivery")}</span><span className="font-semibold">{delivery === 0 ? t("mk_free") : `₹${delivery}`}</span></div>
        {discount > 0 && <div className="flex justify-between text-sm mb-1"><span className="text-muted-foreground">{t("mk_discount")}</span><span className="font-semibold" style={{ color: C.primary }}>−₹{discount}</span></div>}
        <div className="flex justify-between text-base mb-2"><span className="font-bold">{t("mk_total")}</span><span className="font-extrabold">₹{total.toLocaleString()}</span></div>
        <button onClick={place} className="w-full py-4 rounded-2xl text-white font-bold text-lg active:scale-95 transition-transform" style={{ background: `linear-gradient(135deg, ${C.primary}, ${C.dark})` }}>{t("mk_place_order")}</button>
      </div>
    </div>
  );
}

// ─── Order success ────────────────────────────────────────────────────────────
function OrderSuccessScreen({ navigate }: { navigate: (s: Screen) => void; goBack: () => void }) {
  const { t } = useLang();
  const { orders } = useStore();
  const last = orders[0];
  return (
    <div className="absolute inset-0 bg-background flex flex-col items-center justify-center px-8 text-center">
      <StatusBar />
      <div className="w-24 h-24 rounded-full flex items-center justify-center mb-5" style={{ background: C.secondary }}>
        <CheckCircle size={52} color={C.primary} />
      </div>
      <h2 className="text-2xl font-extrabold text-foreground mb-1">{t("mk_order_success")}</h2>
      <p className="text-sm text-muted-foreground mb-2">{t("mk_order_success_sub")}</p>
      {last && <p className="text-sm font-bold mb-6" style={{ color: C.primary }}>{t("mk_order_id")}: {last.id}</p>}
      <button onClick={() => navigate("orders")} className="w-full py-4 rounded-2xl text-white font-bold mb-3" style={{ background: `linear-gradient(135deg, ${C.primary}, ${C.dark})` }}>{t("mk_view_orders")}</button>
      <button onClick={() => navigate("market")} className="w-full py-4 rounded-2xl font-bold" style={{ background: C.secondary, color: C.primary }}>{t("mk_continue_shopping")}</button>
    </div>
  );
}

// ─── Orders ───────────────────────────────────────────────────────────────────
function OrdersScreen({ navigate, goBack }: { navigate: (s: Screen) => void; goBack: () => void }) {
  const { t } = useLang();
  const { orders } = useStore();
  const fmt = (ms: number) => new Date(ms).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
  return (
    <div className="absolute inset-0 bg-background flex flex-col">
      <StatusBar />
      <PageHeader title={t("mk_my_orders")} goBack={goBack} />
      {orders.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mb-4" style={{ background: C.secondary }}><ShoppingBag size={34} color={C.primary} /></div>
          <p className="font-bold text-foreground mb-1">{t("mk_no_orders")}</p>
          <p className="text-sm text-muted-foreground mb-5">{t("mk_no_orders_sub")}</p>
          <button onClick={() => navigate("market")} className="px-6 py-3 rounded-2xl text-white font-bold" style={{ background: C.primary }}>{t("mk_browse")}</button>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto px-4 pb-28">
          {orders.map((o) => (
            <div key={o.id} className="bg-card rounded-2xl p-4 mb-3" style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.06)", border: `1px solid ${C.border}` }}>
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="font-bold text-sm text-foreground">{o.id}</p>
                  <p className="text-[11px] text-muted-foreground">{t("mk_order_on")} {fmt(o.date)}</p>
                </div>
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-full" style={{ background: C.secondary, color: C.primary }}>{t(`mk_status_${o.status}`)}</span>
              </div>
              <div className="flex items-center gap-2 mb-2">
                {o.items.slice(0, 4).map((it) => (
                  <div key={it.id} className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: C.secondary }}><CropBadge crop={it.crop} size={26} bg="transparent" /></div>
                ))}
                {o.items.length > 4 && <span className="text-xs text-muted-foreground">+{o.items.length - 4}</span>}
              </div>
              <div className="flex items-center justify-between pt-2 border-t" style={{ borderColor: C.border }}>
                <span className="text-xs text-muted-foreground">{o.items.reduce((n, i) => n + i.qty, 0)} {t("mk_items_count")}</span>
                <span className="font-extrabold text-sm text-foreground">₹{o.total.toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <LangProvider>
      <UserProvider>
        <StoreProvider>
          <AppInner />
        </StoreProvider>
      </UserProvider>
    </LangProvider>
  );
}

function AppInner() {
  const { t } = useLang();
  const { user } = useUser();
  const [screen, setScreen] = useState<Screen>("splash");
  const [history, setHistory] = useState<Screen[]>([]);
  const [scanMode, setScanMode] = useState<"disease" | "anything">("disease");
  // Guidance sub-navigation state
  const [guidanceTaskId, setGuidanceTaskId] = useState<string>("planting");
  const [guidanceArticleId, setGuidanceArticleId] = useState<string>("");
  const [guidanceCrop, setGuidanceCrop] = useState<string>("");

  const navigate = useCallback((to: Screen) => {
    setScreen((cur) => {
      setHistory((h) => [...h, cur]);
      return to;
    });
  }, []);
  const goBack = useCallback(() => {
    setHistory((h) => {
      if (h.length === 0) return h;
      setScreen(h[h.length - 1]);
      return h.slice(0, -1);
    });
  }, []);

  useEffect(() => {
    if (screen === "splash") {
      const t = setTimeout(() => navigate("language"), 2600);
      return () => clearTimeout(t);
    }
  }, [screen]);

  const mainAppScreens: Screen[] = [
    "dashboard", "crops", "cropAdvisor", "cropCalendar",
    "market", "scanResult", "scanResultUniversal", "chat",
    "profile", "myFarms", "expenses", "schemes", "forum", "settings", "help",
    "weather", "calculators", "fertCalc", "pestCalc", "farmCalc", "askCommunity",
    "cropDetail", "orders", "cultivation", "cropGuidance", "cropTask", "cropArticle", "cropBookmarks",
  ];
  const showNav = mainAppScreens.includes(screen);

  // A spoken description of the current screen, read aloud by the Voice Assistant.
  const readText = (() => {
    switch (screen) {
      case "splash":
      case "language":
      case "login":
      case "otp":
      case "farmSetup":
        return t("voice_welcome_read");
      case "dashboard":
        return `${t("greeting")}${user.name ? ", " + user.name : ""}. ${t("voice_dashboard_read")}`;
      case "scanResult":
        return `${t("sr_disease_name")}. ${t("sr_desc")} ${t("sr_symptoms_title")}: ${t("sr_symptom_1")}. ${t("scan_treatment")}: ${t("treat1_title")}. ${t("sr_recovery_title")}: ${t("sr_recovery_val")}.`;
      case "scanResultUniversal":
        return `${t("ur_object")}. ${t("ur_desc")}`;
      default:
        return t("voice_generic_read");
    }
  })();

  // The Voice Assistant is available everywhere except the live camera flow.
  const showVoice = screen !== "scan" && screen !== "analyzing" && screen !== "chat";

  const screenProps = { navigate, goBack };

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{
        background: "linear-gradient(135deg, #E8F0E0 0%, #D4E8C2 50%, #C8D8B0 100%)",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* Phone frame */}
      <div
        className="relative"
        style={{
          width: 390,
          height: 844,
          borderRadius: 48,
          overflow: "hidden",
          boxShadow: "0 60px 120px rgba(0,0,0,0.35), 0 0 0 1px rgba(0,0,0,0.08), inset 0 0 0 2px rgba(255,255,255,0.08)",
          background: C.bg,
        }}
      >
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 rounded-b-2xl z-50" style={{ background: "#0f0f0f" }} />

        {/* Screens */}
        {screen === "splash" && <SplashScreen />}
        {screen === "language" && <LanguageScreen {...screenProps} />}
        {screen === "login" && <LoginScreen {...screenProps} />}
        {screen === "otp" && <OTPScreen {...screenProps} />}
        {screen === "farmSetup" && <FarmSetupScreen {...screenProps} />}
        {screen === "dashboard" && <DashboardScreen {...screenProps} />}
        {screen === "crops" && <CropsScreen {...screenProps} />}
        {screen === "cropAdvisor" && <CropAdvisorScreen {...screenProps} />}
        {screen === "cropCalendar" && <CropCalendarScreen {...screenProps} />}
        {screen === "market" && <MarketScreen {...screenProps} />}
        {screen === "scan" && <ScanScreen {...screenProps} setScanMode={setScanMode} />}
        {screen === "analyzing" && <AnalyzingScreen navigate={navigate} scanMode={scanMode} />}
        {screen === "scanResult" && <ScanResultScreen {...screenProps} />}
        {screen === "scanResultUniversal" && <UniversalResultScreen {...screenProps} />}
        {screen === "chat" && <ChatScreen {...screenProps} />}
        {screen === "profile" && <ProfileScreen {...screenProps} />}
        {screen === "myFarms" && <MyFarmsScreen {...screenProps} />}
        {screen === "expenses" && <ExpensesScreen {...screenProps} />}
        {screen === "schemes" && <SchemesScreen {...screenProps} />}
        {screen === "forum" && <ForumScreen {...screenProps} />}
        {screen === "settings" && <SettingsScreen {...screenProps} />}
        {screen === "help" && <HelpScreen {...screenProps} />}
        {screen === "weather" && <WeatherScreen {...screenProps} />}
        {screen === "calculators" && <CalculatorsScreen {...screenProps} />}
        {screen === "fertCalc" && <FertilizerCalcScreen {...screenProps} />}
        {screen === "pestCalc" && <PesticideCalcScreen {...screenProps} />}
        {screen === "farmCalc" && <FarmingCalcScreen {...screenProps} />}
        {screen === "askCommunity" && <AskCommunityScreen {...screenProps} />}
        {screen === "cropDetail" && <CropDetailScreen {...screenProps} />}
        {screen === "cultivation" && <CropGuidanceScreen
          goBack={goBack}
          onOpenTask={(taskId, crop) => {
            setGuidanceTaskId(taskId);
            setGuidanceCrop(crop);
            navigate("cropTask");
          }}
          onOpenArticle={(articleId, crop) => {
            setGuidanceArticleId(articleId);
            setGuidanceCrop(crop);
            navigate("cropArticle");
          }}
          onOpenBookmarks={(crop) => {
            setGuidanceCrop(crop);
            navigate("cropBookmarks");
          }}
        />}
        {screen === "cropGuidance" && <CropGuidanceScreen
          goBack={goBack}
          onOpenTask={(taskId, crop) => {
            setGuidanceTaskId(taskId);
            setGuidanceCrop(crop);
            navigate("cropTask");
          }}
          onOpenArticle={(articleId, crop) => {
            setGuidanceArticleId(articleId);
            setGuidanceCrop(crop);
            navigate("cropArticle");
          }}
          onOpenBookmarks={(crop) => {
            setGuidanceCrop(crop);
            navigate("cropBookmarks");
          }}
        />}
        {screen === "cropTask" && <CropTaskScreen
          taskId={guidanceTaskId}
          crop={guidanceCrop || user.crops[0] || "wheat"}
          goBack={goBack}
          onOpenArticle={(articleId) => {
            setGuidanceArticleId(articleId);
            navigate("cropArticle");
          }}
        />}
        {screen === "cropArticle" && <CropArticleScreen
          articleId={guidanceArticleId}
          crop={guidanceCrop || user.crops[0] || "wheat"}
          goBack={goBack}
          onAskAI={() => navigate("chat")}
        />}
        {screen === "cropBookmarks" && <CropBookmarksScreen
          crop={guidanceCrop || user.crops[0] || "wheat"}
          goBack={goBack}
          onOpenArticle={(articleId) => {
            setGuidanceArticleId(articleId);
            navigate("cropArticle");
          }}
        />}
        {screen === "cart" && <CartScreen {...screenProps} />}
        {screen === "checkout" && <CheckoutScreen {...screenProps} />}
        {screen === "orderSuccess" && <OrderSuccessScreen {...screenProps} />}
        {screen === "orders" && <OrdersScreen {...screenProps} />}

        {/* Bottom Nav */}
        {showNav && <BottomNav screen={screen} navigate={navigate} />}

        {/* Floating voice assistant */}
        {showVoice && <VoiceAssistant navigate={navigate} readText={readText} isLoggedIn={user.onboarded} screen={screen} />}
      </div>

      <style>{`
        @keyframes scanLine {
          0%, 100% { transform: translateY(-30px); opacity: 0.4; }
          50% { transform: translateY(30px); opacity: 1; }
        }
        @keyframes voicePulse {
          0% { box-shadow: 0 0 0 0 rgba(221,161,94,0.5); }
          70% { box-shadow: 0 0 0 14px rgba(221,161,94,0); }
          100% { box-shadow: 0 0 0 0 rgba(221,161,94,0); }
        }
        @keyframes voiceRing {
          0% { transform: scale(0.75); opacity: 0.8; }
          100% { transform: scale(1.5); opacity: 0; }
        }
        @keyframes soundBar {
          0%, 100% { height: 8px; }
          50% { height: 26px; }
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes splashScale {
          0% { transform: scale(0.7); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        * { scrollbar-width: none; }
        *::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}

