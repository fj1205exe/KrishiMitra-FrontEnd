# Mobile App UI Specification
## KrishiMitra — Every Screen, Every Tap, Every Flow

> **This is the missing doc.** Everything below describes what the farmer SEES and DOES.

---

## App Flow Overview

```
Install → Splash → Language Select → Phone OTP Login → 
  ↓ (first time)              ↓ (returning user)
Farm Setup Wizard          Dashboard (Home)
  ↓
Dashboard (Home)
```

---

## 1. SPLASH SCREEN (2 seconds)

- **Background**: Dark green gradient (`#0f1b0e` → `#1a2e19`)
- **Center**: KrishiMitra logo (leaf + AI brain icon)
- **Below logo**: "KrishiMitra" in Inter Bold 28px, white
- **Tagline**: "Your Personal Farming Advisor" in `#86efac`, 14px
- **Bottom**: Small loading spinner
- **Auto-navigates** to Language Select (first time) or Dashboard (if token exists)

---

## 2. LANGUAGE SELECTION SCREEN

**When shown**: First app open only. Stored in SharedPreferences after selection.

**Layout**:
- Title: "Choose Your Language" (shown in Hindi + English)
- **Grid of 10 language cards** (2 columns × 5 rows):

| Language | Native Script |
|----------|--------------|
| English | English |
| हिन्दी | Hindi |
| ਪੰਜਾਬੀ | Punjabi |
| தமிழ் | Tamil |
| తెలుగు | Telugu |
| मराठी | Marathi |
| বাংলা | Bengali |
| ગુજરાતી | Gujarati |
| ಕನ್ನಡ | Kannada |
| ଓଡ଼ିଆ | Odia |

- Each card: dark card (`#1a2e19`), green border on tap, 48px height
- 🎤 **Voice button** at bottom: "Tap to say your language" — for illiterate users
- On select → navigate to Login

---

## 3. LOGIN / SIGNUP SCREEN

**No password. Phone OTP only.** Farmers can't remember passwords.

### Layout:
- **Header**: "Welcome to KrishiMitra" (in selected language)
- **Phone input**: Country code `+91` pre-filled + 10-digit phone field
- **Button**: "Send OTP" → green (`#22c55e`), full width
- **Below**: "By continuing, you agree to our Terms"

### OTP Verification (same screen, slides up):
- **4-digit OTP input** (4 separate boxes, auto-focus next)
- **Timer**: "Resend OTP in 0:30"
- **Auto-submit** when 4th digit entered
- For demo: OTP is always `1234`

### What happens after OTP:
- **New user** (`isNewUser: true` from API) → Farm Setup Wizard
- **Returning user** → Dashboard directly (profile + farms already exist)

### Re-login flow:
- JWT stored in SharedPreferences
- On app open: check if token exists + not expired
- Valid → skip to Dashboard
- Expired → show Login screen again (phone pre-filled from storage)

---

## 4. FARM SETUP WIZARD (First-time only)

**3-step wizard with progress dots at top.**

### Step 1: Your Name
- Text field: "What's your name?"
- Voice button: speak your name
- "Next →" button

### Step 2: Your Farm
- **Farm name**: text field (default: "My Farm")
- **Area**: number input + dropdown (Hectares / Acres / Bigha)
- **Soil type**: dropdown (Alluvial, Black, Red, Laterite, Sandy, Clay)
- **Irrigation**: dropdown (Canal, Tubewell, Rain-fed, Drip)
- **Location**: "📍 Auto-detect" button (uses GPS) — shows district + state
- "Next →" button

### Step 3: Current Crop
- **Grid of crop icons** (12 common crops): Rice, Wheat, Maize, Cotton, Sugarcane, Mustard, Potato, Tomato, Onion, Chickpea, Soybean, Groundnut
- Tap to select (green highlight)
- "None right now" option
- **"Start Using KrishiMitra →"** button

→ Navigates to Dashboard

---

## 5. BOTTOM NAVIGATION BAR

**5 tabs. Always visible. Dark background (`#0f1b0e`), green active icon.**

```
┌──────┬──────┬──────┬──────┬──────┐
│  🏠  │  🌾  │  📷  │  💬  │  👤  │
│ Home │Crops │ Scan │ Chat │  Me  │
└──────┴──────┴──────┴──────┴──────┘
```

| Tab | Icon | Screen | What It Does |
|-----|------|--------|-------------|
| **Home** | 🏠 House | Dashboard | Weather, tasks, alerts, quick actions |
| **Crops** | 🌾 Wheat | Crop Hub | All crop advisory features |
| **Scan** | 📷 Camera | Scanner | Disease detection + Universal scanner |
| **Chat** | 💬 Bubble | AI Chat | Voice/text conversation with AI |
| **Me** | 👤 Person | Profile Hub | Farm management, expenses, settings |

---

## 6. HOME / DASHBOARD SCREEN (Tab 1)

**The main screen. Shows everything at a glance. Scrollable vertical layout.**

### Top Bar
- Left: "🌿 KrishiMitra" logo text
- Right: 🔔 Notification bell (red dot if unread) + 🌐 Language switcher

### Section A: Weather Card (top, full width)
```
┌─────────────────────────────────┐
│ 📍 Ludhiana, Punjab             │
│ ☀️ 28°C  Clear Sky              │
│ 💧 65% humidity  🌧 0% rain     │
│                                 │
│ ⚠️ Heatwave expected next week  │
│ 💡 Irrigate wheat before heat   │
└─────────────────────────────────┘
```
- Background: subtle gradient card
- Tap → expands to 7-day forecast
- Weather alert banner (amber) if any warnings

### Section B: Today's Task Card
```
┌─────────────────────────────────┐
│ 📋 TODAY'S TASK                 │
│ 🌾 Wheat — Week 6              │
│ "Apply urea — 60kg/hectare"    │
│                                 │
│ [✅ Mark Done]  [📖 Learn More] │
└─────────────────────────────────┘
```
- From Crop Calendar
- "Mark Done" updates local DB + syncs
- "Learn More" → opens Cultivation Guide for that step

### Section C: Quick Action Grid (2×2)
```
┌──────────────┬──────────────┐
│ 🌾 Crop      │ 🔬 Diagnose  │
│ Advisor      │ Crop         │
├──────────────┼──────────────┤
│ 💰 Market    │ 📷 Scan      │
│ Prices       │ Anything     │
└──────────────┴──────────────┘
```
- Each card: icon + 2-word label
- Tap → navigates to that feature

### Section D: Market Price Ticker
```
┌─────────────────────────────────┐
│ 📈 MARKET PRICES                │
│ Wheat  ₹2,275/q  ↑ +₹50       │
│ Rice   ₹2,100/q  → stable     │
│ Mustard ₹5,400/q ↓ -₹100      │
│                  [View All →]   │
└─────────────────────────────────┘
```
- Shows top 3 crops the farmer grows
- Green ↑ / Grey → / Red ↓ trend indicators
- "View All" → Market Prices full screen

### Section E: Farm Health Summary
```
┌─────────────────────────────────┐
│ 🌱 FARM HEALTH                  │
│                                 │
│ Climate Risk: ██░░░ 3/10 🟢    │
│ Crop Stage: Grain Filling       │
│ Next Harvest: ~45 days          │
│ Est. Yield: 4,500 kg            │
│                  [Details →]    │
└─────────────────────────────────┘
```

### Section F: Govt Scheme Alert (conditional)
```
┌─────────────────────────────────┐
│ 🇮🇳 YOU MAY QUALIFY             │
│ PM-KISAN: ₹6,000/year          │
│ [Check Eligibility →]          │
└─────────────────────────────────┘
```
- Only shows if farmer hasn't dismissed it

---

## 7. CROPS HUB SCREEN (Tab 2)

**Central place for all crop-related features. Card-based menu.**

### Layout: Scrollable list of feature cards

```
┌─────────────────────────────────┐
│ 🌾 CROP ADVISOR                 │
│ "What should I grow next?"      │
│ AI recommends best crops        │
│                      [Open →]   │
└─────────────────────────────────┘

┌─────────────────────────────────┐
│ 🧪 FERTILIZER ADVISOR           │
│ "What fertilizer should I use?" │
│ Custom NPK recommendation      │
│                      [Open →]   │
└─────────────────────────────────┘

┌─────────────────────────────────┐
│ 📅 CROP CALENDAR                │
│ Week-by-week farming tasks      │
│ Wheat — Week 6 of 16           │
│                      [Open →]   │
└─────────────────────────────────┘

┌─────────────────────────────────┐
│ 📊 YIELD PREDICTION             │
│ How much will you harvest?      │
│ Est: 4,500 kg this season       │
│                      [Open →]   │
└─────────────────────────────────┘

┌─────────────────────────────────┐
│ 📈 MARKET PRICES & SELLING      │
│ Live mandi prices + AI advice   │
│ Wheat ₹2,275/q ↑               │
│                      [Open →]   │
└─────────────────────────────────┘

┌─────────────────────────────────┐
│ 🌡️ CLIMATE RISK                 │
│ Weather-based risk for crops    │
│ Current risk: 3/10 🟢          │
│                      [Open →]   │
└─────────────────────────────────┘

┌─────────────────────────────────┐
│ 🛰️ SATELLITE HEALTH             │
│ NDVI crop monitoring from space │
│                      [Open →]   │
└─────────────────────────────────┘
```

---

## 8. SUB-SCREENS (opened from Crops Hub)

### 8A. Crop Advisor Screen
- **Auto-fetches**: soil type, weather, location from farm profile
- **Season selector**: Kharif / Rabi / Zaid (dropdown)
- **"Get Recommendations" button** → loading spinner → results:

```
TOP 5 CROPS FOR RABI SEASON:

┌─────────────────────────────────┐
│ #1 🌾 WHEAT         94% match  │
│ Est. Yield: 4,500 kg           │
│ Est. Profit: ₹32,000           │
│ Climate Risk: ██░░░ 2/10 🟢   │
│ [Select This Crop]             │
└─────────────────────────────────┘

┌─────────────────────────────────┐
│ #2 🌻 MUSTARD       87% match  │
│ Est. Yield: 1,200 kg           │
│ Est. Profit: ₹28,000           │
│ Climate Risk: ███░░ 3/10 🟢   │
│ [Select This Crop]             │
└─────────────────────────────────┘
... (3 more cards)
```

- **"Select This Crop"** → sets as current crop → auto-generates Crop Calendar → navigates to Calendar

### 8B. Crop Calendar Screen
- **Visual horizontal timeline** (scrollable)
- Each node = 1 week, colored by activity type:
  - 🟤 Prep | 🟢 Sow | 🔵 Water | 🟡 Fertilize | 🔴 Pest Control | 🟠 Harvest
- Current week highlighted with glow
- Tap a week → expand card showing task details
- Checkbox to mark tasks done
- Push notification reminder for upcoming tasks

### 8C. Market Prices Screen
- **Commodity tabs** at top: Wheat | Rice | Mustard | All
- **Mandi price cards** sorted by distance:

```
📍 Ludhiana Mandi (4.2 km)
   Wheat: ₹2,275/q  ↑ +₹50 this week
   
📍 Amritsar Mandi (45 km)
   Wheat: ₹2,250/q  → stable
```

- **AI Selling Advice box** at top:
  > "💡 Price trending up. Wait 3-5 days for ₹100-200/quintal more."

### 8D. Fertilizer Advisor Screen
- **Input form**: N, P, K values (number fields) OR "I don't have soil report" button
- If no soil report → uses default values for their soil type
- **Result card**: Fertilizer name, dosage, timing, "don't mix with" warnings

---

## 9. SCAN SCREEN (Tab 3 — Center Tab, Prominent)

**Two modes accessible via toggle at top.**

### Toggle: `[🔬 Disease Check]  [📷 Scan Anything]`

### Mode 1: Disease Check
- Full-screen camera viewfinder
- **Overlay text**: "Point at the diseased leaf"
- **Capture button** (large green circle at bottom)
- After capture → loading overlay "Analyzing..." → Result screen:

```
┌─────────────────────────────────┐
│ 🔴 RICE BLAST DETECTED          │
│ Confidence: 94%                 │
│                                 │
│ 💊 TREATMENT:                   │
│ Apply Tricyclazole 75% WP      │
│ at 0.6g per liter of water     │
│                                 │
│ 🛡️ PREVENTION:                  │
│ Use resistant varieties         │
│ Avoid excess nitrogen           │
│                                 │
│ 🏪 NEARBY SHOP:                 │
│ Agri Store — 2.3 km [Map →]    │
│                                 │
│ [👨‍🔬 Ask KVK Expert]            │
│ [📸 Scan Another]               │
└─────────────────────────────────┘
```

### Mode 2: Universal Scanner
- Same camera viewfinder
- **Overlay text**: "Point at any crop, pest, fertilizer, or seed packet"
- After capture → Gemini Vision result:

```
┌─────────────────────────────────┐
│ 📷 IDENTIFIED                   │
│                                 │
│ DAP (Di-Ammonium Phosphate)    │
│ NPK Ratio: 18-46-0             │
│                                 │
│ 📋 HOW TO USE:                  │
│ Apply at sowing, 100kg/hectare │
│ Don't mix with urea            │
│ Store in dry place              │
│                                 │
│ [📸 Scan Another]               │
└─────────────────────────────────┘
```

---

## 10. CHAT SCREEN (Tab 4)

**Full AI chatbot with voice-first design.**

### Layout:
- **Top bar**: "🧠 KrishiMitra AI" + language indicator
- **Chat bubbles** area (scrollable):
  - User messages: right-aligned, green bubble
  - AI messages: left-aligned, dark card bubble
- **Input area at bottom**:

```
┌─────────────────────────────────┐
│ [🎤 Hold to Speak]              │ ← PRIMARY (big, centered)
│                                 │
│ [Type a message...    ] [Send]  │ ← secondary (smaller, below)
└─────────────────────────────────┘
```

### Voice Flow:
1. **Hold mic button** → pulsing animation + "Listening..." text
2. Release → "Processing..." → Sarvam STT converts speech to text
3. Text appears in chat as user message
4. AI responds → text bubble appears
5. **Auto-plays voice response** via Sarvam TTS (speaker icon to replay)

### Chat Context:
- AI knows farmer's name, location, current crop, soil type, language
- Example conversation:
  > 🧑‍🌾 "Meri fasal mein keede lag gaye hain"
  > 🤖 "Aapke gehu mein aphid lag sakta hai. Imidacloprid spray karein — 2ml per liter paani mein. Paas ke dukaan ka pata chahiye?"

---

## 11. PROFILE / "ME" SCREEN (Tab 5)

**Hub for farm management, finances, and settings.**

### Top Section: Farmer Card
```
┌─────────────────────────────────┐
│ 👨‍🌾 Rajveer Singh               │
│ 📍 Ludhiana, Punjab             │
│ 🌾 Current: Wheat (Week 6)     │
│ 📱 +91 98765 43210             │
│                    [Edit →]     │
└─────────────────────────────────┘
```

### Menu List (tappable rows):

```
🏡 My Farms                    →
   Manage your farms and crops

💰 Expenses & Profit           →
   Track costs, calculate profit

📜 Crop History                →
   Past seasons and yields

🇮🇳 Government Schemes          →
   Schemes you qualify for

👥 Community Forum             →
   Ask questions, share tips

👨‍🔬 Ask an Expert               →
   Connect with KVK scientists

📰 News & Updates              →
   Agriculture news & policies

⚙️ Settings                    →
   Language, notifications, about
```

---

## 12. KEY SUB-SCREENS (from "Me" tab)

### 12A. My Farms Screen
- **List of farm cards** (supports multi-farm)
- Each card shows: farm name, area, soil type, current crop, location
- **"+ Add Farm"** FAB button
- Tap farm → Farm Detail screen (edit fields, see crop history for that farm)

### 12B. Expenses & Profit Screen
- **Season/Year selector** at top: `Rabi 2025 ▼`
- **Expense list** (scrollable):

```
🌱 Seeds — Wheat HD-2967         ₹3,000
🧪 Fertilizer — DAP              ₹5,000  
👷 Labor — Sowing                ₹4,000
🧴 Pesticide — Imidacloprid      ₹800

TOTAL EXPENSES:                  ₹12,800
```

- **"+ Add Expense"** button → form: type dropdown, name, amount, date
- **Profit Calculator card** at bottom:

```
┌─────────────────────────────────┐
│ 💰 PROFIT CALCULATOR            │
│                                 │
│ Harvest: 45 quintals           │
│ Price: ₹2,275/quintal          │
│ Revenue: ₹45,000               │
│ Expenses: ₹12,800              │
│ ─────────────────               │
│ PROFIT: ₹32,200 ✅             │
└─────────────────────────────────┘
```
- Works fully offline (SQLite)

### 12C. Government Schemes Screen
- **List of eligible schemes** (matched based on farm size, location, crop):

```
┌─────────────────────────────────┐
│ ✅ ELIGIBLE                     │
│ 🇮🇳 PM-KISAN                    │
│ ₹6,000/year direct transfer    │
│ [Apply Online →]               │
└─────────────────────────────────┘

┌─────────────────────────────────┐
│ ✅ ELIGIBLE                     │
│ 🛡️ PM Fasal Bima Yojana        │
│ Crop insurance at 2% premium   │
│ [Apply Online →]               │
└─────────────────────────────────┘
```
- "Apply Online" → opens govt website in in-app browser

### 12D. Community Forum Screen
- **Post feed** (latest first):

```
┌─────────────────────────────────┐
│ 👨‍🌾 Gurpreet Kaur • Ludhiana    │
│ "Yellow spots on my wheat       │
│  leaves. What should I do?"     │
│ [📸 photo attached]             │
│                                 │
│ 💬 3 replies  ❤️ 5 likes        │
└─────────────────────────────────┘
```
- **"+ New Post"** FAB → text + optional photo
- Tap post → expand to see replies + reply input

### 12E. Settings Screen
- **Language**: dropdown (change anytime, app reloads in new language)
- **Notifications**: toggles for weather alerts, price changes, task reminders
- **Offline Data**: "Last synced: 2 hours ago" + "Sync Now" button
- **About**: version, credits, "Made for SIH 2025"
- **Logout**: clears JWT, goes to Login screen

---

## 13. NOTIFICATION TYPES

| Trigger | Notification Text | Tap Action |
|---------|-------------------|-----------|
| Weather alert | "⚠️ Heatwave expected tomorrow. Irrigate wheat today." | → Weather card |
| Price change | "📈 Wheat price up ₹50 at Ludhiana mandi" | → Market Prices |
| Task reminder | "📋 Today: Apply urea — 60kg/hectare" | → Crop Calendar |
| Disease alert | "🔴 Rice Blast reported in your district" | → Disease Check |
| Scheme deadline | "🇮🇳 PM-KISAN deadline in 7 days" | → Schemes |

---

## 14. NAVIGATION MAP

```
Splash
  └→ Language Select (first time)
      └→ Login (Phone OTP)
          ├→ Farm Setup Wizard (new user)
          │   └→ Dashboard
          └→ Dashboard (returning user)

Bottom Tabs:
├─ 🏠 Home (Dashboard)
│   ├→ 7-day Weather (expand)
│   ├→ Task Detail (from Today's Task)
│   └→ Market Prices (from ticker)
│
├─ 🌾 Crops Hub
│   ├→ Crop Advisor → Results → Select → Calendar
│   ├→ Fertilizer Advisor → Result
│   ├→ Crop Calendar → Week Detail
│   ├→ Yield Prediction → Result
│   ├→ Market Prices → Mandi List
│   ├→ Climate Risk → Detail
│   └→ Satellite NDVI → Map View
│
├─ 📷 Scan (Camera)
│   ├→ Disease Check → Result → Nearby Shop / Ask Expert
│   └→ Universal Scan → Result
│
├─ 💬 Chat (AI Chatbot)
│   └→ (self-contained, no sub-navigation)
│
└─ 👤 Me (Profile Hub)
    ├→ My Farms → Farm Detail → Edit
    ├→ Expenses → Add Expense / Profit Calculator
    ├→ Crop History → Season Detail
    ├→ Govt Schemes → Apply
    ├→ Community Forum → Post Detail → Reply
    ├→ Ask Expert → Request Form
    ├→ News & Updates → Article
    └→ Settings → Language / Notifications / Logout
```

---

## 15. DESIGN SYSTEM QUICK REFERENCE

```
COLORS:
  Background:   #0f1b0e (dark green-black)
  Cards:        #1a2e19 (dark green)
  Elevated:     #243823 (lighter green)
  Primary CTA:  #22c55e (bright green)
  Success:      #84cc16 (lime)
  Warning:      #f59e0b (amber)  
  Error:        #ef4444 (red)
  Info:         #3b82f6 (blue)
  Text:         #f0fdf4 (near-white)
  Muted text:   #86efac (soft green)
  Borders:      #2d4a2c

TYPOGRAPHY:
  Font: Inter (Google Fonts)
  H1: 24px Bold
  H2: 20px SemiBold  
  Body: 14px Regular
  Caption: 12px Regular

COMPONENTS:
  Cards: 12px border-radius, #1a2e19 bg, 1px #2d4a2c border
  Buttons: 8px radius, #22c55e bg, white text, 48px height
  Inputs: 8px radius, #243823 bg, #2d4a2c border, 48px height
  Icons: 24px, #86efac default, #22c55e active
```
