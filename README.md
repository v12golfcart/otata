# OTATA – Overlay Task & Time Assistant

A simple **Electron + React + TypeScript** app to help you stay focused.  
The app lives in a tiny transparent overlay in the top-right corner of your screen and shows your current task + time left.  
Hover expands it, click expands further to show your day.

---

## 📌 Project Vision

- **Collapsed overlay**  
  Small transparent bar showing *current task* and countdown.

- **Hover overlay**  
  Slightly larger, shows extra context or quick actions.

- **Expanded overlay**  
  Visual day timeline (todos + calendar).  
  In v1, only manually created todos are shown.  
  In later versions, calendar events will be merged automatically.

- **Settings window**  
  Accessible from the overlay gear button, with persistent preferences.

---

## 🗺️ Milestones

1. **Hello Overlay**  
   Frameless, transparent, always-on-top window pinned top-right.  
   Collapsed → hover → expanded transitions.

2. **Local Todos (current milestone)**
   - A **Todo** = `{ id, name, startISO, durationMin, completed: boolean }`
   - Stored in `electron-store` keyed by date
   - CRUD exposed via IPC with light typing (see Implementation Notes)
   - UI: Add form + daily list + start a countdown
   - Overlay collapsed view shows:
     - *Current task & time left* if active
     - Otherwise *next task & start time*

3. **Settings & Persistence**  
   - Electron Store settings: Pomodoro length, overlay opacity, autostart, etc.  
   - Separate Settings window.

4. **Calendar Integration (later)**  
   - OAuth flow (Google/Outlook) in main process  
   - Fetch events, normalize into `CalendarBlock` objects  
   - Merge with manual Todos for full day view.

5. **Polish**  
   - Tray menu (pause, open settings, quit)  
   - Auto-launch on login  
   - Packaging with Forge

---

## 📂 Project Structure

src/
├─ main/                       # Electron main process
│  ├─ windows/                 # Window creation helpers
│  │  ├─ createOverlay.ts
│  │  └─ createSettings.ts
│  ├─ ipc/                     # IPC handlers
│  │  ├─ todos.ts
│  │  └─ settings.ts
│  ├─ store.ts                 # electron-store wrapper
│  └─ index.ts                 # app lifecycle
│
├─ renderer/                   # React UI
│  ├─ overlay/                 # Overlay app
│  │  ├─ OverlayRoot.tsx
│  │  ├─ useOverlayStore.ts
│  │  └─ components/
│  │     ├─ TodoForm.tsx
│  │     └─ TodoList.tsx
│  │
│  ├─ settings/                # Settings page (future)
│  │  └─ (components TBD)
│  │
│  ├─ lib/
│  │  └─ types.ts              # shared types
│  │
│  └─ styles/
│     └─ index.css
│
└─ preload.ts                  # contextBridge APIs

---

## 🔄 Data Flow

- **Renderer (React)**:  
  Holds UI state (mode, countdown, todos in memory). Uses Zustand.

- **Main (Electron)**:  
  Owns windows, tray, OAuth, persistent storage.

- **IPC Bridge (Preload)**:  
  Renderer calls `window.otata.todos.*`, `window.otata.overlay.*`, etc.

---

## ✅ Current Features

- Overlay window with 3 modes (collapsed, hover, expanded)  
- Add a Todo with: name, start time, duration (minutes)  
- List todos for today (sorted)  
- Start a session → countdown timer shown in collapsed view  
- Data persisted locally in `electron-store`

---

## 🚀 How to Run

```bash
# Install deps
npm install

# Start dev mode
npm run start

# In a separate terminal, start the renderer
npm run start:renderer
```

## 🔮 Next Steps
	•	Add settings window & tray menu
	•	Add calendar integration
	•	Merge calendar events + todos in expanded overlay
	•	Polish animations & styles

⸻

## ⚠️ Best Practices
- `contextIsolation: true`, `nodeIntegration: false`
- Keep IPC surface narrow & typed
- One purpose per window (overlay vs settings)
- Use Zustand for small UI state
- Store user data with electron-store

---

## 📝 Implementation Notes

### Window Interaction
- **No click-through** for v1 - Keep normal transparent window with mouseenter/leave + click handlers
- Avoids complexity of `setIgnoreMouseEvents(true, { forward: true })` toggling

### IPC Typing (Light Approach)
```typescript
// preload.d.ts
export interface TodosAPI {
  listByDate(dateISO: string): Promise<Todo[]>;
  create(p: { dateISO: string; name: string; startISO: string; durationMin: number }): Promise<Todo>;
  update(p: { dateISO: string; todo: Todo }): Promise<boolean>;
  delete(p: { dateISO: string; id: string }): Promise<boolean>;
}
declare global { interface Window { otata: { todos: TodosAPI } } }
```

### Screen Positioning
- Use `screen.getPrimaryDisplay().workArea` for top-right positioning
- Multi-monitor support deferred to later version

### Mode Transitions (Simple Guard)
```typescript
type Mode = 'collapsed' | 'hover' | 'expanded';
const valid: Record<Mode, Mode[]> = {
  collapsed: ['hover', 'expanded'],
  hover: ['collapsed', 'expanded'],
  expanded: ['hover', 'collapsed'],
};
const setMode = (next: Mode) =>
  useOverlay.setState(s => valid[s.mode].includes(next) ? { mode: next } : s);
```