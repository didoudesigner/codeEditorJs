window.$ = window.jQuery = require(__dirname + '/bower_components/jquery/dist/jquery.min.js');
const TabGroup = require("electron-tabs");
const electron = require('electron')
const {ipcRenderer, remote} = electron
const fs = require('fs')
const swal = require('sweetalert2')

let tabGroup = new TabGroup();
let filePath;

let filesOpened = new Array();

let indexOfClosedTab;

var rootData = fs.readFileSync(__dirname + '/folderOpen.json', 'utf8', (err) => {
  if (err) {
    return
  }
})
if (rootData != '') {
  var root = JSON.parse(rootData);
}else {
  var root =  {
    path: '',
    name: '',
    children: [],
  }
}


var tree = require('electron-tree-view')({
    root,
    container: document.querySelector('#jstree_demo_div'),
    children: c => c.children,
    label: c => c.name
 })


ipcRenderer.on('file', (e, item) => {
  openFile(item);
 })

ipcRenderer.on('save', (e) => {

  saveFile();
  
 })

ipcRenderer.on('saveas', (e, filePath) => {

    // Get the current tab
    var currentTab = tabGroup.getActiveTab();

    // Get the title of the Tab
    var name = currentTab.getTitle();

    // Read the JSON file of the activated tab and parse it into **jsonFileContent variable
    var jsonFile = fs.readFileSync(__dirname + '/Files/' + name + '.json', 'utf8', (err) => {});
    var jsonFileContent = JSON.parse(jsonFile);
    
    // Get the content from the JSON file 
    var newSavedData = jsonFileContent.fileContent
    var selectedSavedAsFile;
    filesOpened.map((child) => {
      
      if (child.getFileName() == name){
        selectedSavedAsFile = child;
      }
    })

    
    /* Buffer the path so it can be used in fs.write IDK why in this func it said to me that you need to buufer
    so you'll not find any Path Buffer in other writing files */
    var path = Buffer.from(filePath, 'utf8');
    // Write the new file
    
    selectedSavedAsFile.saveAs(path, newSavedData)
    

 })

ipcRenderer.on('closetab', (e) => {
  
    // Get the current active Tab and close it
   closeTab();
 })

 /* !!!!!!!!!!!!!!!!!!!!!!!!!!  NEED TO FIX ERROR  !!!!!!!!!!!!!!!!!!!!!!!!!!*/
ipcRenderer.on('selectall', (e) => {

  // Get the current tab and the title
  var activeTab = tabGroup.getActiveTab();
  var nameOfTab = activeTab.getTitle();
 
  // Get access to the webview of the activated tab and select all the content of the webView
  //activeTab.EventListener('dom-ready', () => {
  //webview.selectAll()
  //})
 })

ipcRenderer.on('increasefontsize', (e) => { 

  // Get the param JSON File and parse it into **param variable
  var param = fs.readFileSync(__dirname + '/param.json', 'utf8', (err) => {})
  param = JSON.parse(param)

  
  fontSize = param.fontsize + 1 ; //Increase the font size of our local variable

  param.fontsize += 1; // Increase the font size of our global DATA Json Data

  //Stringify and write the new params
  var param = JSON.stringify(param);
  fs.writeFile(__dirname + '/param.json', param, (err) => {

  })


  // Read the CodeMirror Css file 
  var codeMirrorCss = fs.readFileSync(__dirname + '/codemirror/lib/codemirror.css','utf8' , (err) => {
    if (err){
      console.log('Error with reading CodeMirror css file');
      return;
    }
  })

  // Add the font Size property to CODEMirror text
  codeMirrorCss += '.CodeMirror {font-size :  ' + fontSize + 'px  }'
 
  // Rewrite the CodeMirror Css
  fs.writeFile(__dirname + '/codemirror/lib/codemirror.css', codeMirrorCss, (err) => {
    if (err) {
      console.log('Error with writing the CodeMirror css file')
    }
  })

  // Reload each tab so the new CSS takes a place
  tabGroup.eachTab((ctab, index, tabCollection) => {
    var webview = ctab.webview;
    webview.reload();
  })

 })

ipcRenderer.on('decreasefontsize', (e)=> {

  // Get the param JSON File and parse it into **param variable
  var param = fs.readFileSync(__dirname + '/param.json', 'utf8', (err) => {})
  param = JSON.parse(param)

  fontSize = param.fontsize - 1 ; //Decrease the font size of our local variable

  param.fontsize -= 1; // Decrease the font size of our global DATA Json Data

  //Stringify and write the new params
  var param = JSON.stringify(param);
  fs.writeFile('./param.json', param, (err) => {})

  // Read the CodeMirror Css file 
  var codeMirrorCss = fs.readFileSync(__dirname + '/codemirror/lib/codemirror.css','utf8' , (err) => {
    if (err){
      return;
    }
  })
  // Add the font Size property to CODEMirror text
  codeMirrorCss += '.CodeMirror {font-size :  ' + fontSize + 'px  }'
 
  // Rewrite the CodeMirror Css
  fs.writeFile(__dirname + '/codemirror/lib/codemirror.css', codeMirrorCss, (err) => {
    if (err) {
      return
    }
  })

  // Reload each tab so the new CSS takes a place
  tabGroup.eachTab((ctab, index, tabCollection) => {
    var webview = ctab.webview;
    webview.reload();
  })
 })

ipcRenderer.on('resetfontsize', (e) => {

  // Get the param JSON File and parse it into **param variable
  var param = fs.readFileSync(__dirname + '/param.json', 'utf8', (err) => {})
  param = JSON.parse(param)

  fontSize = 12 ; //put the value 12 (reset the value) of the local variable

  param.fontsize = 12; // Reset the value (fontsize) of the param Data (JSON file)

  //Stringify and write the new params
  var param = JSON.stringify(param);
  fs.writeFile(__dirname + '/param.json', param, (err) => {})

  // Read the CodeMirror Css file 
  var codeMirrorCss = fs.readFileSync(__dirname + '/codemirror/lib/codemirror.css','utf8' , (err) => {
    if (err){
      return;
    }
  })
  // Add the font Size property to CODEMirror text
  codeMirrorCss += '.CodeMirror {font-size :  ' + fontSize + 'px  }'
 
  // Rewrite the CodeMirror Css
  fs.writeFile(__dirname + '/codemirror/lib/codemirror.css', codeMirrorCss, (err) => {
    if (err) {
      console.log('Error with writing the CodeMirror css file')
    }
  })

  // Reload each tab so the new CSS takes a place
  tabGroup.eachTab((ctab, index, tabCollection) => {
    var webview = ctab.webview;
    webview.reload();
  })
  })


ipcRenderer.on('folder', (e)=> {
  refreshWhenFolderOpen();
  })
ipcRenderer.on('delete', (e) => {
  refreshWhenFolderOpen();
    
})
ipcRenderer.on('closeButtonEvent', (e) => {
   if (quitApp()){
     ipcRenderer.send('quitAppAllFileSaved')
   }else {
    swal({
      title: 'Are you sure?',
      text: "There are some files aren't saved",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Quit any way!'
    }).then((result) => {
      if (result.value) {
        ipcRenderer.send('quitAppAllFileSaved');
      }
     
    })
   }
})


tree.on('selected', item => {
  // treeClickEvent Function that Create and add Files to our project
  treeClickEvent(item);
})

let tab = tabGroup.addTab({
    title: 'Home',
    src: __dirname + '/homeEditor.html',
    webviewAttributes: {
        'nodeintegration': true
    },
    icon: 'fa fa-home',
    visible: true,
    active: true,

})

readPrevious();

function openFile(item){
  data = item; // pass array [name, path] to data

  // Get the name of the file using regular expression and put it into **filename
  var filename = data[0].replace(/^.*[\\\/]/, '');
  // Get the extention of the file
  var exe = filename.split('.').pop();

  if (isOpen(data[0])) {
    return;
  }else {
  // Create the obj from File Class
  var file = new File(filename, data[0], data[1], exe, '12-12-2012');

  // Call the create File function
  file.createFile();
  closingEventTab();
   //Push file into a list that hold all the opened files
    filesOpened.push(file);
    }
  }

function closeTab(){

  var activeTab = tabGroup.getActiveTab();
  if (activeTab.getTitle() == 'Home'){
    activeTab.close()
  }else {
  var jsonContentFile = readingFileFromFiles(activeTab.getTitle());
  
  if (verifyIfFileIsSaved(jsonContentFile)){
  for (var i = 0; i < filesOpened.length; i++){
    if (filesOpened[i].getFileName() == activeTab.getTitle() ){
        filesOpened.splice(i, 1)
    }
  }
  activeTab.close(true);
  }else {
    swal({
      title: 'Are you sure?',
      text: "You file isn't saved, you want to save it!",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Quit any way!'
    }).then((result) => {
      if (result.value) {
        forceClose();
      }
     
    })
  }
 }
}
function forceClose(){
  var activeTab = tabGroup.getActiveTab();
  var jsonContentFile = fs.readFileSync(__dirname + '/Files/' + activeTab.getTitle() + '.json', 'utf8', (err) => {
    if (err){
      return
    }
  })
  for (var i = 0; i < filesOpened.length; i++){
    if (filesOpened[i].getFileName() == activeTab.getTitle() ){
        filesOpened.splice(i, 1)
    }
  }
  activeTab.close(true);
}

// Function to see if file is already open
function isOpen(filepath){
  var result;
  for (var i = 0; i < filesOpened.length; i++){
        if (filesOpened[i].getFilePath() == filepath){
          return true;
        }else {
          result = false;
        }

  }
  return result;
}
function treeClickEvent(item) {

  if (item.type == 'file') {
    if (isOpen(item.path)){
    }else {
      var dataOfNewFile = fs.readFileSync(item.path, 'utf8', (err)=> {
        console.log('can\'t read selected file') 
        return
      })
      var newItem = [item.path, dataOfNewFile];
      openFile(newItem);
    }
  }
}
function saveFile(){

   // Get the current tab
   let currentTab = tabGroup.getActiveTab();

   // Get the title of the time 
   var name = currentTab.getTitle();
   var selectedFileSave = null;
   filesOpened.map((child) => {
     if (child.getFileName() == name){
       selectedFileSave = child;
     }
   })

   selectedFileSave.saveFile();

}
// refreshWhenFolderOpen 
function refreshWhenFolderOpen(){
  // Save the opened Tabs in saveStateOfFile
  let saveStateOfFile = new Array();
  for (var i = 0 ; i < filesOpened.length; i++){
    saveStateOfFile.push(filesOpened[i].fileName);
  }
  saveStateOfFile = JSON.stringify(saveStateOfFile);
  //Write data (array of opened tabs before exit) in stateOfFile.json
  fs.writeFile(__dirname + '/stateOfFile.json', saveStateOfFile, (err) => {
    if (err) {
      return
    }
  })

  // Reload page
  location.reload();
  
  // Questionable Part ---- From Here ==> 
  /*
  var folderOpenJSON = fs.readFileSync('./folderOpen.json', 'utf8', (err, data) => {
    if (err) {
      console.log(err);
    }
    console.dir(data)
  });

  var root = JSON.parse(folderOpenJSON);

   console.log('new Tree Function Done')
  var tree = require('electron-tree-view')({
   root,
   container: document.querySelector('#jstree_demo_div'),
   children: c => c.children,
   label: c => c.name
  })

  refreshWhenFolderOpen();
  */
  // =====> To Here 
}

function readPrevious(){
  var readStateOfFileJSON = fs.readFileSync(__dirname + '/stateOfFile.json', 'utf8', (err, data) => {
    if (err){
      return
    }
  })
  var readFileState = JSON.parse(readStateOfFileJSON)
    if (readFileState.length == 0 ) {return}

    for(var i = 0; i < readFileState.length; i++){
    
    let tabState = tabGroup.addTab({
      title: readFileState[i],
      src: __dirname + '/Files/' + readFileState[i] + '.html',
      webviewAttributes: {
          'nodeintegration': true
      },
      icon: 'fa fa-home',
      visible: true,
      active: true,
  
  })
   
  }
  
}
function closingEventTab(){
  $('.etabs-tab-button-close').unbind('click').click(function(){
    indexOfClosedTab =  $('.etabs-tab-button-close').index(this);
    closeIndexTab(indexOfClosedTab)
  })
}
function closeIndexTab(index){
    let tab = tabGroup.getTabByPosition(index+1);
    let nameOfTab = tab.getTitle();
    if (nameOfTab == 'Home'){
      tab.close();
    }else {
    let fileReader = readingFileFromFiles(nameOfTab);
    if (verifyIfFileIsSaved(fileReader)){
      for (var i = 0; i < filesOpened.length; i++){
        if (filesOpened[i].getFileName() == nameOfTab){
            filesOpened.splice(i, 1)
        }
      }
      tab.close();
    }else {
      swal({
        title: 'Are you sure?',
        text: "You file isn't saved, you want to save it!",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Quit any way!'
      }).then((result) => {
        if (result.value) {
          for (var i = 0; i < filesOpened.length; i++){
            if (filesOpened[i].getFileName() == nameOfTab){
                filesOpened.splice(i, 1)
            }
          }
          tab.close();
        }
       
      })
    }
  }
}



function readingFileFromFiles(filename){
    return fs.readFileSync(__dirname + '/Files/' + filename + '.json', 'utf8', (err) => {
      if (err){
        return
      }
    })
}

function verifyIfFileIsSaved(fileReader){
  var result = JSON.parse(fileReader)
  return result.isSaved;
}

var viewFiles = document.querySelectorAll('span');
var arrayFiles = []
for (var i = 0; i < viewFiles.length; i++){
  arrayFiles.push(viewFiles[i]);
}
console.dir(arrayFiles)

arrayFiles.oncontextmenu = function (e){
  ipcRenderer.send('files_right_click', e)
}

// Click on pages Listener
var viewTabs = document.querySelector('.etabs-views') 
viewTabs.oncontextmenu = function (e) {
  
  ipcRenderer.send('home_page_right_click', e)
}



//Verify save state when quit app
function quitApp(){
  var allFilesSaved = true;
  for (tab of tabGroup.getTabs()){
    if (tab.getTitle() != 'Home'){
    var fileReader = readingFileFromFiles(tab.getTitle());
    if (!verifyIfFileIsSaved(fileReader)){
      allFilesSaved = false;
    }
  }
  }
  return allFilesSaved;
}


