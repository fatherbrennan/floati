/**
 * Floati
 * MIT Licensed
 *
 * @fatherbrennan
 */
const { app, BrowserWindow } = require('electron');

/**
 * Initialise main render
 */
function createWindow() {
    const win = new BrowserWindow({
        show: false,
        autoHideMenuBar: true,
        title: 'Floati',
        width: 320,
        height: 544,
        minWidth: 320,
        minHeight: 544,
        webPreferences: {
            contextIsolation: false,
            nodeIntegration: true,
            enableRemoteModule: true,
        },
    });

    // Pretty start
    win.once('ready-to-show', () => {
        win.show();
    });

    // Load url
    win.loadURL('http://localhost:3000');

    // Provide WebDev Tools
    win.webContents.openDevTools();
}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
