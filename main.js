const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');


let localStorage = path.join(__dirname, '/storage/');
let win;
let windows = [];

var args = {};
console.log(args);
process.argv.slice(2).forEach((arg)=> {
  let split = arg.split('=');
  if(split.length > 1){
    args[split[0]] = split[1];
  } else {
    args[arg] = true;
  }
});
var url = `file://${__dirname}/www/index.html`;
if(args.dev) {url = 'http://localhost:8100';}


if (process.env.NODE_ENV === 'development') {
  require('electron-watch')(
    __dirname,
    'dev:electron-main',             // npm scripts, means: npm run dev:electron-main
    path.join(__dirname, '.src'),      // cwd
    2000,                            // debounce delay
  );
}

function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    width: 600,
    height: 300,
    minWidth: 400,
    minHeight: 200,
    backgroundColor: '#ffffff',
    alwaysOnTop: true,
    frame: false
  })
  win.loadURL(url);

  //// uncomment below to open the DevTools.

  win.webContents.openDevTools()

  // Event when the window is closed.
  win.on('closed', function () {
    win = null
  })
}

function initializeLocalFile(file) {
  return new Promise((res, rej) => {
    if (!fs.existsSync(file)) {
      let last_path = '';
      let directories = file.split('/');
      directories.forEach((directory, index) => {
        let new_path = last_path = path.join(last_path, directory)
        if(!fs.existsSync(new_path)) {
          if(directory.split('.').length > 1) {
            fs.writeFile(new_path, '', 'utf8', (err) => {
              if (err) {
                res(err);
              } else if(index == directories.length - 1) {
                res(true);
              }
            });
          } else {
            fs.mkdir(new_path, (err) => {
              if(err) {
                res(err);
              } else if(index == directories.length - 1) {
                res(true);
              }
            })
          }
        }
      })
    } else {
      res(true);
    }
  });
}

function initializeDirectory(){
  if (!fs.existsSync(localStorage)){
    fs.mkdirSync(localStorage);
  }
}

ipcMain.on('open-window', (e, data) => {
  let win = new BrowserWindow({
    width: 800,
    height: 450,
    minWidth: 300,
    minHeight: 200,
    backgroundColor: '#ffffff',
    frame: false
  })
  win.loadURL(url);

  //// uncomment below to open the DevTools.

  win.webContents.openDevTools()

  // Event when the window is closed.
  win.on('closed', () => {
    win = null;
  });

  windows.push(win);
});

ipcMain.on('discord-status', (e, obj) => {
  if(!obj.partyId || !obj.partySize || !obj.partyMax){
    delete activity.partyId;
    delete activity.partySize;
    delete activity.partyMax;
  }
  activity = Object.assign(activity, obj);
  rpc.setActivity(activity);
})

ipcMain.on('local-store', (e, obj) => {
  let fullFile = path.join(localStorage, obj.file);
  initializeLocalFile(fullFile).then(() => {
    fs.readFile(fullFile, 'utf8', (err, data) => {
      if (err) {
        console.log(err);
      }
      if (!obj.data) {
        e.sender.send('local-store-reply', true);
      } else {
        let json = JSON.stringify(obj.data);
        fs.writeFile(fullFile, json, 'utf8', (callback) => {
          e.sender.send('local-store-reply', true);
        });
      }
    });
  });
});

ipcMain.on('local-delete', (e, obj) => {
  let fullPath = path.join(localStorage, obj.path)
  if(fs.existsSync(fullPath)) {
    fs.unlink(fullPath, (err) => {
      if(!err) e.sender.send('local-delete-reply', true);
    })
  }
})

ipcMain.on('local-rename', (e, obj) => {
  if(obj.renames && obj.renames.length) {
    obj.renames.forEach((rename, index) => {
      console.log(rename);
      if(fs.existsSync(path.join(localStorage, rename.old_name))) {
        fs.rename(path.join(localStorage, rename.old_name), path.join(localStorage, rename.name), (err) => {
          if(!err && index == obj.renames.length - 1) e.sender.send('local-rename-reply', true);
        })
      } else if(!fs.existsSync(path.join(localStorage, rename.name))) {
        if(rename.name.split('.').length) {
          initializeLocalFile(path.join(localStorage, rename.name)).then(() => {
            if(index == obj.renames.length - 1) e.sender.send('local-rename-reply', true);
          })
        } else {
          fs.mkdir(path.join(localStorage, rename.name), (err) => {
            if(!err && index == obj.renames.length - 1) e.sender.send('local-rename-reply', true);
          })
        }
      } else {
        e.sender.send('local-rename-reply', {err, content: false, msg: 'File Name already exsists'});
      }
    })
  }
})

ipcMain.on('local-get', (e, obj) => {
  let fullFile = path.join(localStorage, obj.file);
  initializeLocalFile(fullFile).then(() => {
    fs.readFile(fullFile, 'utf8', (err, data) => {
      if (err || !data || data == '') {
        console.log('NoData');
        e.sender.send('local-get-reply', {err: err, content: false, msg: 'no data'});
      }
      else {
        let reply = JSON.parse(data);
        console.log(reply);
        e.sender.send('local-get-reply', {content: reply});
      }
    });
  });
});

ipcMain.on('local-folder', (e, obj) => {
  let fullFile = path.join(localStorage, obj.directory);
  fs.readdir(fullFile, 'utf8', (err, data) => {
    if (err || !data || data == '') {
      console.log('NoData');
      e.sender.send('local-folder-reply', {err: err, content: false, msg: 'no data'});
    } else {
      console.log(data);
      e.sender.send('local-folder-reply', {content: data});
    }
  });
});

// Create window on electron intialization
app.on('ready', () => {
  createWindow();
})

// Quit when all windows are closed.
app.on('window-all-closed', function () {

  // On macOS specific close process
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // macOS specific close process
  if (win === null) {
    createWindow()
  }
})