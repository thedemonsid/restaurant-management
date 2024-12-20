const electron = require("electron");
//! Expose a method to the renderer process eg. widnow.electron.test()
electron.contextBridge.exposeInMainWorld("electron", {
  test: () => {
    console.log("Hello from preload");
  },
});
