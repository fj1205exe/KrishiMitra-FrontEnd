# Development Rules & QA Protocol
## KrishiMitra — Rules for AI-Assisted Development

> **Reference this file at the start of EVERY development session.**

---

## Rule 1: Never Break Existing Features

- Make ONLY the requested change
- Don't refactor, rename, or "improve" things that weren't asked for
- If a change MIGHT break something — say so BEFORE making it
- Keep diffs as small as possible

---

## Rule 2: Design System is Sacred

```css
--bg-primary: #0f1b0e;       /* Dark green-black */
--bg-secondary: #1a2e19;     /* Card backgrounds */
--bg-tertiary: #243823;      /* Elevated surfaces */
--accent-green: #22c55e;     /* Primary actions */
--accent-lime: #84cc16;      /* Success indicators */
--accent-amber: #f59e0b;     /* Warnings */
--accent-red: #ef4444;       /* Errors / disease alerts */
--accent-blue: #3b82f6;      /* Links / info */
--text-primary: #f0fdf4;     /* Main text */
--text-secondary: #86efac;   /* Muted text */
--border: #2d4a2c;           /* Card borders */
```

- Font: **Inter** (Google Fonts)
- NEVER use inline colors — always CSS variables
- NEVER use white backgrounds — dark agricultural green theme
- Border radius: 12px cards, 8px buttons

---

## Rule 3: Build Backend First

```
1. API endpoint → Test with curl → Confirm working
2. ML model endpoint → Test with sample → Confirm predictions
3. Mobile screen → Connect to REAL API → Verify data flows
4. Web portal → Connect to REAL API → Verify
```

NEVER build UI with fake data unless explicitly for preview.

---

## Rule 4: Change Protocol

1. **Acknowledge**: "I'll change X. Affects Y files. Won't affect Z."
2. **Execute**: Minimum change needed
3. **Verify**: Test the change + confirm adjacent features still work
4. **Report**: "Changed X. Tested Y. No impact on Z."

---

## Rule 5: File Organization

```
KrishiMitra/
├── docs/                 ← Documentation (don't modify during dev)
├── backend/              ← Node.js + Express API
│   ├── server.js
│   ├── routes/
│   ├── middleware/
│   ├── models/
│   └── utils/
├── ml-engine/            ← Python FastAPI + ML models
│   ├── main.py
│   ├── models/
│   ├── utils/
│   └── data/
├── mobile/               ← Flutter app
│   └── lib/
│       ├── screens/
│       ├── widgets/
│       ├── services/     ← API calls
│       ├── models/       ← Data models
│       └── main.dart
└── admin-portal/         ← React.js web portal
    └── src/
        ├── components/
        ├── pages/
        ├── services/
        └── App.jsx
```

---

## Rule 6: Anti-Patterns (FORBIDDEN)

- ❌ White backgrounds
- ❌ Default blue links
- ❌ Bootstrap/Tailwind defaults
- ❌ Placeholder text or Lorem ipsum
- ❌ `window.alert()` for errors
- ❌ Console errors in browser
- ❌ Unstyled form inputs
- ❌ Components calling APIs directly (use services/)
