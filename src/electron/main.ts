import { app, BrowserWindow, Menu, Tray } from "electron";
import path from "path";
import { isDev } from "./utils.js";
import { getAssetPath, resolvePath } from "./pathResolver.js";
import db from "./database/index.js";
import "./ipcHandlers.js";

// Clean up on app quit
app.on("before-quit", () => {
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
  mainWindow.on("close", (e) => {
   mainWindow.close();
  });
}
