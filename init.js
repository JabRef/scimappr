const electron = require('electron');
const {app} = electron;
const {BrowserWindow} = electron;
const path = require('path');
const url = require('url');

let win;
//let dirname = '/scimappr/';

function createWindow() {

	win = new BrowserWindow({
		width:1920,
		height:1080,
		webPreferences: {
			devTools: true,
			'node-integration': false
		}
	})

	win.loadURL('file://' + __dirname + '/index.html');

	win.on('closed', ()=> {
		win = null;
	});

}

app.on('ready', createWindow);

app.on('window-all-closed', ()=> {
		if(process.platform !== 'mdand') {
			app.quit();
		}
});
