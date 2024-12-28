import { isDev } from "./utils.js";
import path from "path";
import { app } from "electron";
export function resolvePath(): string {
  return path.join(
    app.getAppPath(),
    isDev() ? "." : "..",
    "/dist-electron/preload.cjs"
  );
}
export function getUIPath() {
  return path.join(
    app.getAppPath(),
    isDev() ? "." : "..",
    "/dist-react/index.html"
  );
}
export function getAssetPath() {
  return path.join(app.getAppPath(), isDev() ? "." : "..", "/src/assets");
}
export function getRestaurantInfoPath() {
  return path.join(
    app.getAppPath(),
    isDev() ? "." : "..",
    "/dist-electron/restaurantInfo.json"
  );
}
