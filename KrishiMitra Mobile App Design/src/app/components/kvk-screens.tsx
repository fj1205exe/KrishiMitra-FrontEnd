import { useState, useRef } from "react";
import {
  ChevronLeft, Plus, CheckCircle, ImageIcon,
  Camera, Send, X, Crown, Headphones,
  MessageSquare, Check, CreditCard,
  Smartphone, Loader2, AlertCircle, Paperclip
} from "lucide-react";

const C = {
  primary: "#6A994E",
  dark: "#606C38",
  accent: "#DDA15E",
  bg: "#F8F9F3",
  card: "#FFFFFF",
  fg: "#2E2E2E",
  muted: "#666666",
  border: "#E5E7EB",
  secondary: "#EEF4E8",
  destructive: "#D9534F",
};

// ─── Exported types ───────────────────────────────────────────────────────────

export type KvkQueryStatus = "pending" | "in_progress" | "resolved";

export type KvkQuery = {
  id: string;
  subject: string;
  thumb?: string;
  status: KvkQueryStatus;
  lastMsg: string;
  time: string;
  unread: number;
  fromScan?: boolean;
  district?: string;
};

type KvkMessage = {
  id: number;
  from: "system" | "farmer" | "expert";
  text: string;
  time: string;
  imageUrl?: string;
};

// ─── Initial data ─────────────────────────────────────────────────────────────

export const INITIAL_KVK_QUERIES: KvkQuery[] = [
  {
    id: "1",
    subject: "Yellow rust on wheat leaves",
    thumb: "1625246333195-78d9c38ad449",
    status: "in_progress",
    lastMsg: "Propiconazole 25 EC @ 1ml/L water, spray 2–3 times at 15-day intervals.",
    time: "2h",
    unread: 2,
    fromScan: true,
    district: "Ludhiana KVK",
  },
  {
    id: "2",
    subject: "Soil test interpretation needed",
    thumb: "1523741543316-beb7fc7023d8",
    status: "pending",
    lastMsg: "Query received. Expert will reply within 24 hours.",
    time: "1d",
    unread: 0,
    district: "Ludhiana KVK",
  },
  {
    id: "3",
    subject: "Mustard aphid infestation",
    thumb: "1574323347407-f5e1ad6d020b",
    status: "resolved",
    lastMsg: "Wear gloves and mask while spraying. Keep children away from the field.",
    time: "3d",
    unread: 0,
    district: "Ludhiana KVK",
  },
];

// Per-query message threads — each query has its own realistic conversation
const QUERY_MESSAGES: Record<string, KvkMessage[]> = {
  "1": [
    { id: 1, from: "system", text: "Query submitted to Ludhiana KVK", time: "9:30 AM" },
    {
      id: 2, from: "farmer",
      text: "I found yellow rust on my wheat plants yesterday. Leaves are turning yellow with orange powder. Please help!",
      time: "9:31 AM",
      imageUrl: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=240&h=160&fit=crop&auto=format",
    },
    {
      id: 3, from: "expert",
      text: "Thank you for the photos. This is Yellow Rust (Puccinia striiformis), a fungal disease spread through wind-borne spores. It thrives in cool, humid weather.",
      time: "10:15 AM",
    },
    {
      id: 4, from: "expert",
      text: "Recommended treatment:\n• Propiconazole 25 EC @ 1ml/L water\n• Spray 2–3 times at 15-day intervals\n• Start immediately — it spreads fast",
      time: "10:16 AM",
    },
    {
      id: 5, from: "farmer",
      text: "Thank you Doctor ji! Should I also spray neighboring fields?",
      time: "11:30 AM",
    },
  ],
  "2": [
    { id: 1, from: "system", text: "Query submitted to Ludhiana KVK", time: "Yesterday 10:00 AM" },
    {
      id: 2, from: "farmer",
      text: "Got my soil test done. pH 8.2, EC 1.4, low organic carbon (0.3%). Not sure which fertilizers to use. Attaching the soil report.",
      time: "Yesterday 10:01 AM",
      imageUrl: "https://images.unsplash.com/photo-1523741543316-beb7fc7023d8?w=240&h=160&fit=crop&auto=format",
    },
    { id: 3, from: "system", text: "Query received. Expert will reply within 24 hours.", time: "Yesterday 10:01 AM" },
  ],
  "3": [
    { id: 1, from: "system", text: "Query submitted to Ludhiana KVK", time: "Mon 8:00 AM" },
    {
      id: 2, from: "farmer",
      text: "My mustard crop has small green insects on leaves and stems. Leaves are turning yellow and curling up. Please advise.",
      time: "Mon 8:01 AM",
      imageUrl: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=240&h=160&fit=crop&auto=format",
    },
    {
      id: 3, from: "expert",
      text: "These are mustard aphids (Lipaphis erysimi), a common pest during cool weather.",
      time: "Mon 2:00 PM",
    },
    {
      id: 4, from: "expert",
      text: "Control measures:\n• Imidacloprid 17.8% SL @ 0.5ml/L water\n• Or Dimethoate 30 EC @ 1.7ml/L\n• Spray in evening hours\n• Repeat after 10 days if needed",
      time: "Mon 2:01 PM",
    },
    {
      id: 5, from: "farmer",
      text: "Thank you! Will spray this evening. What safety precautions should I take?",
      time: "Mon 5:00 PM",
    },
    {
      id: 6, from: "expert",
      text: "Wear gloves, mask, and full-sleeve clothes. Do not spray in windy conditions. Keep children and animals away. Wash hands thoroughly after spraying.",
      time: "Mon 5:30 PM",
    },
    { id: 7, from: "system", text: "Query marked as Resolved", time: "Tue 9:00 AM" },
  ],
};

// ─── Shared sub-components ────────────────────────────────────────────────────

function KvkStatusBar({ dark = true }: { dark?: boolean }) {
  const tc = dark ? "text-white" : "";
  const bc = dark ? "bg-white" : "";
  return (
    <div className={`flex items-center justify-between px-5 pt-3 pb-1 text-[11px] font-semibold ${tc}`}
      style={dark ? {} : { color: C.fg }}>
      <span>9:41</span>
      <div className="flex items-center gap-2">
        <div className="flex items-end gap-[2px] h-3">
          {[30, 50, 70, 100].map((h, i) => (
            <div key={i} className={`w-[3px] rounded-[1px] ${bc}`}
              style={{ height: `${h}%`, background: dark ? undefined : C.fg, opacity: h === 100 ? 1 : h / 100 + 0.2 }} />
          ))}
        </div>
        <div className={`w-5 h-2.5 rounded-[3px] border ${dark ? "border-white" : ""} relative`}
          style={dark ? {} : { borderColor: C.fg }}>
          <div className={`absolute inset-[2px] rounded-[1px] ${bc}`}
            style={{ background: dark ? undefined : C.fg, width: "75%" }} />
          <div className={`absolute -right-[3px] top-1/2 -translate-y-1/2 w-[3px] h-[6px] rounded-r-[1px] ${bc} opacity-60`}
            style={dark ? {} : { background: C.fg }} />
        </div>
      </div>
    </div>
  );
}

function StatusPill({ status }: { status: KvkQueryStatus }) {
  const config = {
    pending: { label: "Pending", bg: "#FFF4E6", color: "#DDA15E" },
    in_progress: { label: "In Progress", bg: "#EEF4E8", color: "#6A994E" },
    resolved: { label: "Resolved", bg: "#F0F0F0", color: "#666666" },
  }[status];
  return (
    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap"
      style={{ background: config.bg, color: config.color }}>
      {config.label}
    </span>
  );
}

// ─── Screen 1: KVK Query List ────────────────────────────────────────────────

export function KvkQueriesListScreen({
  goBack, freeLeft, isSubscribed, queries,
  onOpenThread, onNewQuery, onUpgrade,
}: {
  goBack: () => void;
  freeLeft: number;
  isSubscribed: boolean;
  queries: KvkQuery[];
  onOpenThread: (id: string) => void;
  onNewQuery: () => void;
  onUpgrade: () => void;
}) {
  return (
    <div className="absolute inset-0 flex flex-col" style={{ background: C.bg }}>
      {/* Header */}
      <div style={{ background: `linear-gradient(135deg, ${C.primary}, ${C.dark})` }}>
        <KvkStatusBar />
        <div className="flex items-center justify-between px-4 pt-1 pb-3">
          <button onClick={goBack} className="w-10 h-10 flex items-center justify-center rounded-full"
            style={{ background: "rgba(255,255,255,0.15)" }}>
            <ChevronLeft size={22} color="#fff" />
          </button>
          <div className="text-center">
            <h1 className="font-bold text-white text-base">KVK Expert Help</h1>
            <p className="text-white/70 text-xs">District KVK scientists reply here</p>
          </div>
          <div className="w-10" />
        </div>

        {/* Free queries chip */}
        <div className="px-4 pb-4">
          <div className="flex items-center gap-2 px-3 py-2 rounded-2xl"
            style={{ background: "rgba(255,255,255,0.15)" }}>
            {isSubscribed ? (
              <>
                <Crown size={14} color="#F6BD60" />
                <span className="text-white text-xs font-semibold">Unlimited · Active plan</span>
              </>
            ) : (
              <>
                <MessageSquare size={14} color="#A7C957" />
                <span className="text-white text-xs font-semibold flex-1">
                  Free queries left: {freeLeft} / 3
                </span>
                {freeLeft === 0 && (
                  <button onClick={onUpgrade} className="text-[10px] font-bold px-2.5 py-1 rounded-full"
                    style={{ background: C.accent, color: "#fff" }}>
                    Upgrade
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Query list — pb-36 reserves space above bottom nav + FAB */}
      <div className="flex-1 overflow-y-auto px-4 py-4 pb-36">
        {queries.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 gap-4">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
              style={{ background: C.secondary }}>
              <MessageSquare size={28} color={C.muted} />
            </div>
            <p className="font-bold text-base" style={{ color: C.fg }}>No queries yet</p>
            <p className="text-sm text-center" style={{ color: C.muted }}>
              Ask a KVK scientist for expert advice on your crops.
            </p>
            <button onClick={onNewQuery} className="px-5 py-3 rounded-2xl text-white font-bold text-sm"
              style={{ background: `linear-gradient(135deg, ${C.primary}, ${C.dark})` }}>
              + New query
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {queries.map((q) => (
              <button key={q.id} onClick={() => onOpenThread(q.id)}
                className="w-full bg-white rounded-2xl p-4 text-left flex items-start gap-3 active:scale-95 transition-transform"
                style={{
                  boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                  border: `1px solid ${q.unread > 0 ? C.primary : C.border}`,
                }}>
                {q.thumb ? (
                  <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0">
                    <img src={`https://images.unsplash.com/photo-${q.thumb}?w=80&h=80&fit=crop&auto=format`}
                      alt={q.subject} className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: C.secondary }}>
                    <Headphones size={22} color={C.primary} />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <p className="font-bold text-sm leading-tight" style={{ color: C.fg }}>{q.subject}</p>
                    {q.unread > 0 && (
                      <span className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
                        style={{ background: C.primary }}>
                        {q.unread}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <StatusPill status={q.status} />
                    <span className="text-[10px]" style={{ color: C.muted }}>{q.time} ago</span>
                  </div>
                  <p className="text-xs truncate" style={{ color: C.muted }}>{q.lastMsg}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* FAB — positioned above bottom nav and safe from viewport edges */}
      <div className="absolute right-4 z-20" style={{ bottom: 100 }}>
        <button onClick={onNewQuery}
          className="flex items-center gap-2 px-5 py-3.5 rounded-full shadow-xl active:scale-95 transition-transform"
          style={{
            background: freeLeft === 0 && !isSubscribed
              ? C.accent
              : `linear-gradient(135deg, ${C.primary}, ${C.dark})`,
          }}>
          {freeLeft === 0 && !isSubscribed
            ? <Crown size={18} color="#fff" />
            : <Plus size={18} color="#fff" />}
          <span className="font-bold text-white text-sm">
            {freeLeft === 0 && !isSubscribed ? "Upgrade to query" : "New query"}
          </span>
        </button>
      </div>
    </div>
  );
}

// ─── Screen 2: KVK Chat Thread ───────────────────────────────────────────────

export function KvkChatThreadScreen({
  goBack, queryId, queries,
}: {
  goBack: () => void;
  queryId: string;
  queries: KvkQuery[];
}) {
  const query = queries.find((q) => q.id === queryId);
  const isResolved = query?.status === "resolved";
  const fromScan = query?.fromScan ?? false;
  const district = query?.district ?? "Local KVK";

  // Load thread messages; fall back to a generic "submitted" message for new queries
  const [messages, setMessages] = useState<KvkMessage[]>(() =>
    QUERY_MESSAGES[queryId] ?? [
      { id: 1, from: "system", text: "Query submitted to KVK. Expert will reply within 24 hours.", time: "Just now" },
      { id: 2, from: "farmer", text: query?.subject ?? "Query submitted", time: "Just now" },
    ]
  );
  const [input, setInput] = useState("");
  const [attachedImage, setAttachedImage] = useState<string | null>(null);

  const galleryRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    const url = URL.createObjectURL(file);
    setAttachedImage(url);
  };

  const send = () => {
    if (!input.trim() && !attachedImage) return;
    setMessages((m) => [
      ...m,
      {
        id: m.length + 1,
        from: "farmer",
        text: input,
        time: "Now",
        imageUrl: attachedImage ?? undefined,
      },
    ]);
    setInput("");
    setAttachedImage(null);
  };

  return (
    <div className="absolute inset-0 flex flex-col" style={{ background: C.bg }}>
      {/* Header */}
      <div style={{ background: `linear-gradient(135deg, ${C.primary}, ${C.dark})` }}>
        <KvkStatusBar />
        <div className="flex items-center gap-3 px-4 pt-1 pb-3">
          <button onClick={goBack} className="w-9 h-9 flex items-center justify-center rounded-full shrink-0"
            style={{ background: "rgba(255,255,255,0.15)" }}>
            <ChevronLeft size={20} color="#fff" />
          </button>
          <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
            style={{ background: "rgba(255,255,255,0.2)" }}>
            <Headphones size={20} color="#fff" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="font-bold text-white text-sm truncate">KVK Expert</p>
              <StatusPill status={isResolved ? "resolved" : query?.status ?? "pending"} />
            </div>
            <p className="text-white/70 text-xs">{district}</p>
          </div>
        </div>
        {fromScan && (
          <div className="mx-4 mb-3 px-3 py-2 rounded-xl flex items-center gap-2"
            style={{ background: "rgba(255,255,255,0.12)" }}>
            <ImageIcon size={13} color="#A7C957" />
            <span className="text-white/90 text-xs font-semibold">From scan: Wheat Yellow Rust · 89%</span>
          </div>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.map((m) => (
          <div key={m.id}
            className={`flex ${m.from === "farmer" ? "justify-end" : m.from === "system" ? "justify-center" : "justify-start"}`}>
            {m.from === "system" ? (
              <span className="text-[11px] px-3 py-1 rounded-full"
                style={{ background: C.border, color: C.muted }}>
                {m.text}
              </span>
            ) : (
              <div className={`max-w-[78%] flex flex-col gap-1 ${m.from === "farmer" ? "items-end" : "items-start"}`}>
                {m.imageUrl && (
                  <div className="w-44 h-28 rounded-2xl overflow-hidden">
                    <img src={m.imageUrl} alt="attachment" className="w-full h-full object-cover" />
                  </div>
                )}
                {m.text && (
                  <div className="px-4 py-3 text-sm leading-relaxed whitespace-pre-line"
                    style={{
                      background: m.from === "farmer" ? C.primary : C.secondary,
                      color: m.from === "farmer" ? "#fff" : C.fg,
                      borderRadius: m.from === "farmer" ? "18px 4px 18px 18px" : "4px 18px 18px 18px",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                    }}>
                    {m.text}
                  </div>
                )}
                <p className="text-[10px] px-1" style={{ color: C.muted }}>{m.time}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Hidden file inputs */}
      <input ref={galleryRef} type="file" accept="image/*" className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ""; }} />
      <input ref={cameraRef} type="file" accept="image/*" capture="environment" className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ""; }} />

      {/* Composer */}
      {isResolved ? (
        <div className="px-4 py-3 pb-20" style={{ background: C.card, borderTop: `1px solid ${C.border}` }}>
          <div className="flex items-center justify-center gap-2 py-2">
            <CheckCircle size={16} color={C.muted} />
            <span className="text-sm font-semibold" style={{ color: C.muted }}>This query is resolved</span>
          </div>
        </div>
      ) : (
        <div style={{ background: C.card, borderTop: `1px solid ${C.border}` }}>
          {/* Image preview above composer */}
          {attachedImage && (
            <div className="px-4 pt-3 flex items-start gap-2">
              <div className="relative w-20 h-16 rounded-xl overflow-hidden">
                <img src={attachedImage} alt="preview" className="w-full h-full object-cover" />
                <button onClick={() => setAttachedImage(null)}
                  className="absolute top-1 right-1 w-5 h-5 rounded-full flex items-center justify-center"
                  style={{ background: "rgba(0,0,0,0.6)" }}>
                  <X size={10} color="#fff" />
                </button>
              </div>
              <p className="text-xs mt-1" style={{ color: C.muted }}>Image attached</p>
            </div>
          )}

          {/* Input row — pb-20 to clear bottom nav; z-index to stay above other layers */}
          <div className="flex items-center gap-2 px-4 py-3 pb-20 z-10">
            {/* Gallery */}
            <button onClick={() => galleryRef.current?.click()}
              className="w-10 h-10 flex items-center justify-center rounded-full shrink-0 active:scale-90 transition-transform"
              style={{ background: C.secondary }}>
              <ImageIcon size={18} color={C.muted} />
            </button>
            {/* Camera */}
            <button onClick={() => cameraRef.current?.click()}
              className="w-10 h-10 flex items-center justify-center rounded-full shrink-0 active:scale-90 transition-transform"
              style={{ background: C.secondary }}>
              <Camera size={18} color={C.muted} />
            </button>
            {/* File attach */}
            <button onClick={() => galleryRef.current?.click()}
              className="w-10 h-10 flex items-center justify-center rounded-full shrink-0 active:scale-90 transition-transform"
              style={{ background: C.secondary }}>
              <Paperclip size={16} color={C.muted} />
            </button>
            {/* Text input */}
            <div className="flex-1 flex items-center px-3 py-2.5 rounded-full"
              style={{ background: C.secondary }}>
              <input value={input} onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                placeholder="Type a message..."
                className="flex-1 bg-transparent outline-none text-sm"
                style={{ color: C.fg }} />
            </div>
            {/* Send */}
            <button onClick={send}
              className="w-10 h-10 flex items-center justify-center rounded-full shrink-0 active:scale-90 transition-transform"
              style={{ background: (input.trim() || attachedImage) ? C.primary : C.muted }}>
              <Send size={16} color="#fff" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Screen 3: New KVK Query ─────────────────────────────────────────────────

export function KvkNewQueryScreen({
  goBack, fromScan = false, onSubmit,
}: {
  goBack: () => void;
  fromScan?: boolean;
  onSubmit: (query: KvkQuery) => void;
}) {
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [includeScan, setIncludeScan] = useState(fromScan);
  const [photos, setPhotos] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const galleryRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);

  const addPhoto = (file: File) => {
    const url = URL.createObjectURL(file);
    setPhotos((p) => [...p, url]);
  };

  const handleSubmit = () => {
    if (!subject.trim() || !description.trim()) return;
    setSubmitting(true);
    setTimeout(() => {
      const newQuery: KvkQuery = {
        id: Date.now().toString(),
        subject: subject.trim(),
        status: "pending",
        lastMsg: description.trim().slice(0, 60) + (description.trim().length > 60 ? "..." : ""),
        time: "just now",
        unread: 0,
        fromScan: fromScan && includeScan,
        district: "Ludhiana KVK",
      };
      setSubmitting(false);
      onSubmit(newQuery);
    }, 1500);
  };

  return (
    <div className="absolute inset-0 flex flex-col" style={{ background: C.bg }}>
      {/* Header */}
      <div style={{ background: `linear-gradient(135deg, ${C.primary}, ${C.dark})` }}>
        <KvkStatusBar />
        <div className="flex items-center justify-between px-4 pt-1 pb-4">
          <button onClick={goBack} className="w-10 h-10 flex items-center justify-center rounded-full"
            style={{ background: "rgba(255,255,255,0.15)" }}>
            <ChevronLeft size={22} color="#fff" />
          </button>
          <div className="text-center">
            <h1 className="font-bold text-white text-base">New KVK Query</h1>
            <p className="text-white/70 text-xs">Scientists reply within 24 hours</p>
          </div>
          <div className="w-10" />
        </div>
      </div>

      {/* Hidden file inputs */}
      <input ref={galleryRef} type="file" accept="image/*" multiple className="hidden"
        onChange={(e) => { Array.from(e.target.files ?? []).forEach(addPhoto); e.target.value = ""; }} />
      <input ref={cameraRef} type="file" accept="image/*" capture="environment" className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) addPhoto(f); e.target.value = ""; }} />

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 pb-28">
        {/* Subject */}
        <div>
          <label className="block text-xs font-bold mb-1.5" style={{ color: C.muted }}>SUBJECT *</label>
          <input value={subject} onChange={(e) => setSubject(e.target.value)}
            placeholder="e.g. Yellow rust on wheat leaves"
            className="w-full px-4 py-3.5 rounded-2xl text-sm outline-none"
            style={{ border: `1.5px solid ${subject ? C.primary : C.border}`, background: C.card, color: C.fg }} />
        </div>

        {/* Photo upload */}
        <div>
          <label className="block text-xs font-bold mb-1.5" style={{ color: C.muted }}>
            ATTACH PHOTOS (images only, no video)
          </label>
          <div className="flex gap-3 mb-2">
            <button onClick={() => cameraRef.current?.click()}
              className="flex-1 h-20 rounded-2xl flex flex-col items-center justify-center gap-1.5 active:scale-95 transition-transform"
              style={{ border: `2px dashed ${C.border}`, background: C.card }}>
              <Camera size={20} color={C.muted} />
              <span className="text-xs font-semibold" style={{ color: C.muted }}>Camera</span>
            </button>
            <button onClick={() => galleryRef.current?.click()}
              className="flex-1 h-20 rounded-2xl flex flex-col items-center justify-center gap-1.5 active:scale-95 transition-transform"
              style={{ border: `2px dashed ${C.border}`, background: C.card }}>
              <ImageIcon size={20} color={C.muted} />
              <span className="text-xs font-semibold" style={{ color: C.muted }}>Gallery</span>
            </button>
            <button onClick={() => galleryRef.current?.click()}
              className="flex-1 h-20 rounded-2xl flex flex-col items-center justify-center gap-1.5 active:scale-95 transition-transform"
              style={{ border: `2px dashed ${C.border}`, background: C.card }}>
              <Paperclip size={20} color={C.muted} />
              <span className="text-xs font-semibold" style={{ color: C.muted }}>File</span>
            </button>
          </div>
          {photos.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {photos.map((url, i) => (
                <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden">
                  <img src={url} alt="attachment" className="w-full h-full object-cover" />
                  <button onClick={() => setPhotos((p) => p.filter((_, j) => j !== i))}
                    className="absolute top-1 right-1 w-5 h-5 rounded-full flex items-center justify-center"
                    style={{ background: "rgba(0,0,0,0.55)" }}>
                    <X size={10} color="#fff" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-bold mb-1.5" style={{ color: C.muted }}>
            DESCRIBE THE PROBLEM *
          </label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe what you see, when it started, area affected, crops involved..."
            rows={5}
            className="w-full px-4 py-3.5 rounded-2xl text-sm outline-none resize-none"
            style={{ border: `1.5px solid ${description ? C.primary : C.border}`, background: C.card, color: C.fg }} />
        </div>

        {/* Include scan toggle */}
        {fromScan && (
          <div className="flex items-center justify-between p-4 rounded-2xl"
            style={{ background: C.secondary, border: `1.5px solid ${C.border}` }}>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: C.primary + "22" }}>
                <ImageIcon size={18} color={C.primary} />
              </div>
              <div>
                <p className="text-sm font-bold" style={{ color: C.fg }}>Include scan result</p>
                <p className="text-xs" style={{ color: C.muted }}>Wheat Yellow Rust · 89% confidence</p>
              </div>
            </div>
            <button onClick={() => setIncludeScan(!includeScan)}
              className="w-12 h-6 rounded-full relative transition-colors"
              style={{ background: includeScan ? C.primary : C.border }}>
              <div className="absolute top-0.5 bottom-0.5 w-5 h-5 bg-white rounded-full shadow transition-all"
                style={{ left: includeScan ? "calc(100% - 22px)" : "2px" }} />
            </button>
          </div>
        )}
      </div>

      {/* CTA — pb-20 to clear bottom nav */}
      <div className="absolute bottom-0 left-0 right-0 px-4 py-4 pb-20 z-10"
        style={{ background: C.bg, borderTop: `1px solid ${C.border}` }}>
        <button onClick={handleSubmit}
          disabled={!subject.trim() || !description.trim() || submitting}
          className="w-full py-4 rounded-2xl text-white font-bold text-base flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-transform"
          style={{ background: subject.trim() && description.trim() ? `linear-gradient(135deg, ${C.primary}, ${C.dark})` : "#ccc" }}>
          {submitting && <Loader2 size={20} className="animate-spin" />}
          {submitting ? "Sending to KVK..." : "Send to KVK"}
        </button>
      </div>
    </div>
  );
}

// ─── Screen 4: Subscription / Paywall ────────────────────────────────────────

export function SubscriptionScreen({
  goBack, freeUsed, isSubscribed, onSubscribeSuccess,
}: {
  goBack: () => void;
  freeUsed: number;
  isSubscribed: boolean;
  onSubscribeSuccess: () => void;
}) {
  const [payState, setPayState] = useState<"idle" | "processing" | "success" | "failed">("idle");

  const handlePay = () => {
    setPayState("processing");
    setTimeout(() => setPayState("success"), 2000);
  };

  if (payState === "success") {
    return (
      <div className="absolute inset-0 flex flex-col" style={{ background: C.bg }}>
        <KvkStatusBar dark={false} />
        <div className="flex-1 flex flex-col items-center justify-center px-6 gap-4">
          <div className="w-24 h-24 rounded-full flex items-center justify-center mb-2" style={{ background: C.secondary }}>
            <CheckCircle size={52} color={C.primary} />
          </div>
          <h2 className="text-2xl font-extrabold" style={{ color: C.fg }}>Payment Successful!</h2>
          <p className="text-sm text-center" style={{ color: C.muted }}>
            You now have unlimited KVK Expert access for 30 days.
          </p>
          <button onClick={onSubscribeSuccess}
            className="w-full py-4 rounded-2xl text-white font-bold text-base shadow-lg mt-4 active:scale-95 transition-transform"
            style={{ background: `linear-gradient(135deg, ${C.primary}, ${C.dark})` }}>
            Continue to New Query
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 flex flex-col" style={{ background: C.bg }}>
      <div style={{ background: `linear-gradient(135deg, ${C.primary}, ${C.dark})` }}>
        <KvkStatusBar />
        <div className="flex items-center justify-between px-4 pt-1 pb-6">
          <button onClick={goBack} className="w-10 h-10 flex items-center justify-center rounded-full"
            style={{ background: "rgba(255,255,255,0.15)" }}>
            <ChevronLeft size={22} color="#fff" />
          </button>
          <h1 className="font-bold text-white text-lg">KVK Expert Access</h1>
          <div className="w-10" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 pb-8">
        {/* Status card */}
        <div className="bg-white rounded-2xl p-4"
          style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.06)", border: `1px solid ${C.border}` }}>
          {isSubscribed ? (
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0" style={{ background: C.secondary }}>
                <Crown size={24} color={C.primary} />
              </div>
              <div>
                <p className="font-bold" style={{ color: C.fg }}>Plan active</p>
                <p className="text-xs" style={{ color: C.muted }}>Unlimited expert chats until Aug 17, 2026</p>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm font-semibold" style={{ color: C.muted }}>3 free expert chats included</p>
                <span className="text-xs font-bold" style={{ color: freeUsed >= 3 ? C.destructive : C.primary }}>
                  {freeUsed} / 3 used
                </span>
              </div>
              <div className="h-2 rounded-full overflow-hidden mb-2" style={{ background: C.border }}>
                <div className="h-full rounded-full transition-all"
                  style={{ background: freeUsed >= 3 ? C.destructive : C.primary, width: `${(freeUsed / 3) * 100}%` }} />
              </div>
              <p className="text-xs" style={{ color: C.muted }}>
                {freeUsed >= 3
                  ? "All 3 free chats used. Subscribe to continue."
                  : `${3 - freeUsed} free chat${3 - freeUsed !== 1 ? "s" : ""} remaining.`}
              </p>
            </>
          )}
        </div>

        {/* Plan card */}
        <div className="bg-white rounded-2xl overflow-hidden"
          style={{ boxShadow: "0 4px 20px rgba(106,153,78,0.15)", border: `2px solid ${C.primary}` }}>
          <div className="px-4 py-3" style={{ background: C.primary }}>
            <div className="flex items-center justify-between">
              <p className="font-bold text-white">KVK Assist</p>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold"
                style={{ background: "rgba(255,255,255,0.22)", color: "#fff" }}>
                HACKATHON PLAN
              </span>
            </div>
          </div>
          <div className="px-4 py-4">
            <div className="flex items-end gap-1 mb-1">
              <span className="text-3xl font-extrabold" style={{ color: C.fg }}>₹30</span>
              <span className="text-sm mb-1" style={{ color: C.muted }}>one-time · 30 days</span>
            </div>
            <p className="text-xs mb-3" style={{ color: C.muted }}>Access resets after 30 days.</p>
            <div className="space-y-2.5">
              {[
                "Unlimited KVK expert chats",
                "Priority replies within 4 hours",
                "Image & photo queries",
                "All crop & pest questions covered",
              ].map((b) => (
                <div key={b} className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0" style={{ background: C.secondary }}>
                    <Check size={11} color={C.primary} strokeWidth={3} />
                  </div>
                  <span className="text-sm" style={{ color: C.fg }}>{b}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Payment */}
        <div>
          <p className="text-xs font-bold mb-3" style={{ color: C.muted }}>PAYMENT OPTIONS</p>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <button className="flex items-center justify-center gap-2 py-3.5 rounded-2xl active:scale-95 transition-transform"
              style={{ border: `2px solid ${C.border}`, background: C.card }}>
              <Smartphone size={18} color="#5F6368" />
              <span className="font-bold text-sm" style={{ color: C.fg }}>UPI / GPay</span>
            </button>
            <button className="flex items-center justify-center gap-2 py-3.5 rounded-2xl active:scale-95 transition-transform"
              style={{ border: `2px solid ${C.border}`, background: C.card }}>
              <span className="text-lg">📱</span>
              <span className="font-bold text-sm" style={{ color: "#5F259F" }}>PhonePe</span>
            </button>
          </div>
          <button onClick={handlePay} disabled={payState === "processing"}
            className="w-full py-4 rounded-2xl text-white font-bold text-base shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-transform mb-3"
            style={{ background: `linear-gradient(135deg, ${C.primary}, ${C.dark})` }}>
            {payState === "processing"
              ? <><Loader2 size={18} className="animate-spin" /> Processing...</>
              : <><CreditCard size={18} /> Pay ₹30 with Razorpay</>}
          </button>
          {payState === "failed" && (
            <div className="p-3 rounded-2xl flex items-center gap-2 mb-3" style={{ background: "#FEE8E8" }}>
              <AlertCircle size={16} color={C.destructive} />
              <p className="text-xs font-semibold flex-1" style={{ color: C.destructive }}>Payment failed. Please try again.</p>
              <button onClick={() => setPayState("idle")} className="text-xs font-bold" style={{ color: C.destructive }}>
                Retry
              </button>
            </div>
          )}
          <p className="text-[11px] text-center mb-3" style={{ color: C.muted }}>
            🔒 Secure payment · Demo may use Razorpay test mode
          </p>
          <button onClick={goBack} className="w-full py-3.5 rounded-2xl font-semibold text-sm active:scale-95 transition-transform"
            style={{ color: C.muted, background: C.card, border: `1px solid ${C.border}` }}>
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
}
