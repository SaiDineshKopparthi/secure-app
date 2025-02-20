const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const fs = require("fs"); //Should use 'fs-extra'
const bcrypt = require("bcryptjs");
const path = require("path");
const { create } = require("domain");

let mainWindow;

const configPath = path.join(__dirname, "config.json");
let passwordHash = "";
if (fs.existsSync(configPath)) {
  const config = JSON.parse(fs.readFileSync(configPath));
  passwordHash = config.passwordHash;
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  mainWindow.loadFile("index.html");
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

ipcMain.handle("authenticate", (event, password) => {
  return new Promise((resolve, reject) => {
    if (bcrypt.compareSync(password, password)) {
      resolve(true);
    } else {
      reject(false);
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
