const electron = require("electron");
import type { MenuItem } from "./database/types.ts" assert { "resolution-mode": "import" };

electron.contextBridge.exposeInMainWorld("restaurant", {
  menu: {
    getItems: () => electron.ipcRenderer.invoke("get-menu-items"),
    addItem: (item: Omit<MenuItem, "id" | "created_at" | "is_available">) =>
      electron.ipcRenderer.invoke("add-menu-item", item),
  },
});
