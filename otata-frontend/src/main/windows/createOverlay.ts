import { BrowserWindow, screen } from 'electron';

declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

export function createOverlay(): BrowserWindow {
  // Get the primary display's work area
  const { x: ax, y: ay, width: aw } = screen.getPrimaryDisplay().workArea;


  // Window dimensions
  const windowWidth = 300;
  const windowHeight = 60;
  const padding = 0; // visual margin from the screen edge

  // Create the browser window as a transparent overlay
  const overlayWindow = new BrowserWindow({
    width: windowWidth,
    height: windowHeight,
    x: ax + aw - windowWidth - padding, // right edge
    y: ay + padding,                    // top edge (respecting menu bar)
    frame: false,                       // Remove window frame
    transparent: true,                   // Make window transparent
    alwaysOnTop: true,                  // Keep above other windows
    resizable: false,                   // Fixed size for now
    skipTaskbar: true,                  // Don't show in taskbar
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  // Load the app
  overlayWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  // Open DevTools in development (detached so it doesn't interfere with overlay)
  if (process.env.NODE_ENV === 'development') {
    overlayWindow.webContents.openDevTools({ mode: 'detach' });
  }

  return overlayWindow;
}