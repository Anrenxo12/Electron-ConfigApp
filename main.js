import { app, BrowserWindow, ipcMain } from 'electron/main'
import path from 'node:path'
import { fileURLToPath } from 'url';
import rethinkdb from 'rethinkdb';
import { format } from 'path';

console.log('Main process starting...');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow;

async function fetchAreasData() {
  console.log("inside fetchAreasdata function");
  
  const connectionOptions = {
    host: 'localhost',
    port: 28015,
  };

  const dbName = 'configDB';
  const tableName = 'areas';

  try {
    console.log('Attempting to connect to RethinkDB...');
    const connection = await rethinkdb.connect(connectionOptions);
    console.log('Connected to RethinkDB successfully.');

    const cursor = await rethinkdb.db(dbName).table(tableName).run(connection);
    const data = await cursor.toArray();
    console.log('Data fetched from RethinkDB:', data);
    return data;
  } catch (error) {
    console.error('Error fetching data from RethinkDB:', error);
    return [];
  }
}

function createWindow() {
  console.log('Creating main window...');
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'), // Ensure the path is correct
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  mainWindow.loadURL('http://localhost:3000'); // Make sure your Vite server is running on this port
}

app.whenReady().then(() => {
  createWindow();

  // Handle fetching areas data from renderer process
  ipcMain.handle('fetch-areas-data', async () => {
    console.log('Handling fetch-areas-data request'); // Log to verify handler is called
    return await fetchAreasData();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
