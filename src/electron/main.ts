import { app, BrowserWindow } from "electron";
import path from "path";
import { isDev } from "./utils.js";

app.on("ready", () => {
  const mainWindow = new BrowserWindow({});
  if (isDev()) {
    console.log("Development");

    mainWindow.loadURL("http://localhost:5123");
  } else {
    console.log("Production");
    mainWindow.loadFile(path.join(app.getAppPath(), "/dist-react/index.html"));
  }
});
