import { app, BrowserWindow, Menu, Tray,ipcMain } from "electron";
import path from "path";
import { isDev } from "./utils.js";
import { getAssetPath, resolvePath } from "./pathResolver.js";
import db from "./database/index.js";
// Add IPC handlers
ipcMain.handle('get-menu-items', async () => {
  return db.getMenuItems();
});

ipcMain.handle('add-menu-item', async (_, item) => {
  return db.addMenuItem(item);
});

// Clean up on app quit
app.on('before-quit', () => {
  db.close();
});
app.on("ready", () => {
  const mainWindow = new BrowserWindow({
    webPreferences: {
      preload: resolvePath(),
    },
  });
  if (isDev()) {
    console.log("Development");

    mainWindow.loadURL("http://localhost:5123");
  } else {
    console.log("Production");
    mainWindow.loadFile(path.join(app.getAppPath(), "/dist-react/index.html"));
  }
  const tray = new Tray(path.join(getAssetPath(), "restaurant.png"));
  tray.setContextMenu(
    Menu.buildFromTemplate([
      {
        label: "Show",
        click: () => {
          mainWindow.show();
          if (app.dock) {
            app.dock.show();
          }
        },
      },
      {
        label: "Quit",
        click: () => app.quit(),
      },
    ])
  );
  handleCloseEvents(mainWindow);
});

function handleCloseEvents(mainWindow: BrowserWindow) {
  let willClose = false;
  mainWindow.on("close", (e) => {
    if (willClose) {
      return;
    }
    e.preventDefault();
    mainWindow.hide();
    if (app.dock) {
      app.dock.hide();
    }
  });
  app.on("before-quit", () => {
    willClose = true;
  });
  mainWindow.on("show", () => {
    willClose = false;
  });
}
