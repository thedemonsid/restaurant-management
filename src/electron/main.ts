import { app, BrowserWindow } from "electron";
import path from "path";
import { isDev } from "./utils.js";
import { resolvePath } from "./pathResolver.js";

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
});
