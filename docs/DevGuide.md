# SciMappr Development Guide

In this document, you will be informed about the internal structure of SCIMAPPR application.

# Structure of Scimappr Root Folder

The structure for the SciMappr root folder consists of:

|_docs
|____DevGuide.md
|____index.md
|____UserGuide.md

|_build
|____assets
|__________mindmap.main.js
|__________jsmind.js
|__________mindmap.css
|__________jsmind.css
|__________mindmap.js
|__________sha1.js
|__________sha1-min.js
|__________jsmind.draggable.js
|__________jsmind.droppable.js
|____img
|__________pdf.png
|____pdf.js

|_node_modules

|_src
|___mindmap.main.ts

|_server.js
|_start.js
|_init.js
|_package.json
|_README
|_index.html

The main program is mindmap.main.ts which is written in Typescript and is located in /src folder.
The transpile program from the main program is mindmap.main.js which is located in the /build/assets folder.
The HTML file is index.html & configuration for electron can be found in the package.json. Both of them are located in the /root folder.


# Explanation of Scimappr Program in Typescript

There will be explanation about the class structures, important functions and the variables.
For readability and the usability concerns the development of the application is done using object-oriented programming.
The development language is TypeScript. TypeScript is an extension language to the Javascript. 
For further information, you can visit www.typescriptlang.org/. 

The Scimappr in the Typescript consists of several classes, such as: Main Program, Gui, Project, Annotation, Utils, PDF and Nodes. These classes will be described in detail in this developer guide.

1.	Class Node 
Description: this class is used to set the sidebar annotation’s node parameters.
Variables:
	private id: string;
	private topic: string;
	private filename: string;
	private pagenumber: number;

Methods:
o	public setId() – this method is used to save the id of the node to the variable id
o	public getId() – this method is used to get the saved id from the variable id
o	public setTopic() – this method is used to save the topic of the node to the variable topic
o	public getTopic() – this method is used to get the saved topic from variable topic
o	public setFileName() – this method is used to save the filename of the node to the variable filename
o	public getFileName() – this method is used to get the saved filename from variable filename
o	public setPageNumber() – this method is used to save the page number of the node to the variable pagenumber
o	public getTopic() – this method is used to get the saved topic from variable topic
o	public setDraggable() – this method configures the options for the draggable
o	public setDroppable() – this method configures the options for the droppable

2.	Class Pdf
Description: This class is used to save a pdf file property details.
Variables: 
	private pdfName: string;
	private pdfLocation: string;
	private pdfLastModifiedDate: string;

Methods: 
o	Public setPdfName() – this method saves the pdfName of the pdf to the variable pdfName
o	Public getPdfName() – this method fetches the saved pdfName from variable pdfName
o	Public setPdfLocation() – this method saves the pdfLocation of the pdf to the variable pdfLocation
o	Public getPdfLocation() – this method fetches the saved pdfLocation from variable pdfLocation
o	Public setPdfLastModifiedDate() – this method saves the pdfLastModifiedDate of the pdf to the variable pdfLastModifiedDate
o	Public getPdfLastModifiedDate() – this method fetches the saved pdfLastModifiedDate from variable pdfLastModifiedDate

3.	Class ListPdf -> extends Class Pdf
Description: This class, as the extension from the Class Pdf, is used to save many pdf files property details in List.
Variables:
	private listPdfFiles: string[];
	private lastModDatePdfFiles: string[];
	private directory: string;

Methods:
o	public setLastModDate(list:string[]) – this method sets the modified date for a pdf
o	public getModDateFs(util, location:string, listFile:string[]) – this method fetches the modified date for all pdfs in the selected directory using electron file system.
o	public getLastModDate(idx:number) – this method fetches the saved mod date using a specific index.
o	public getListCount() -  this method fetches the number of pdfs in the listPdfFiles
o	public getListPdf() -  this method fetches all of the list of pdfs.
o	public getPdfFromFs() – this method reads pdf contents from file system using electron file system.
o	private readPdfInDirectory(path:string) – this method reads all pdf files in the specified path directory using electron (extended from  method getPdfFromFs()).
o	public getPdfPage(filePath:string, fileName:string) – this method fetches the pages in a selected pdf file.
o	private getPdfFilesPage() – this method reads all pages in a selected pdf (extended from method getPdfPage()).
o	public chkDateChange(util, list:string[]) – this method compares with the last modified date with previous saved last modified date to find the changes in one or more pdf(s).

4.	Class Annotation
Description: This class is used to save an annotation property details.
Variables: 
	private fileName: string;
	private id: string;
	private topic: string;
	private subtype: string;
	private title: string;
	private pagenumber: number;

Methods:
o	public setFileName() – this method saves the annotation’s name to the variable fileName
o	public getFileName() – this method fetches the saved annotation’s name from variable fileName.
o	public setId() – this method saves the annotation’s id to the variable id.
o	public getId() – this method fetches the saved annotation’s id from variable id.
o	public setTopic() – this method saves the annotation’s topic to the variable topic.
o	public getTopic() – this method fetches the saved annotation’s topic from variable topic.
o	public setSubType() – this method saves the annotation’s subtype to the variable subtype.
o	public getSubType() – this method fetches the saved annotation’s subtype from variable subtype.
o	public setTitle() – this method saves the annotation’s title to the variable title.
o	public getTitle() – this method fetches the saved annotation’s title from variable title.
o	public setPageNumber() – this method saves the annotation’s pagenumber to the variable pagenumber.
o	public getPageNumber() – this method fetches the saved annotation’s pagenumber from variable pagenumber.


5.	Class ListAnnotations -> extends Class Annotation
Description: This class, as an extension from Class Annotation, is used to save many annotations property details in List.
Variables:
	private listPdfFilesAnnotations: string[];

Methods:
o	public setListPdfFilesAnnotations() – this method is to save all annotations extracted from PDFs into listPdfFilesAnnotation variable.
o	public getListPdfFilesAnnotations() – this method fetches all annotations from variable listPdfFilesAnnotations.
o	Public getAnnotations(pages, filename: string) – this method will call another private method of getAnnotationDetail().
o	private getAnnotationsDetail(pages, fileName: string) – this method fetches all the annotations from PDFs.


6.	Class Utils
Description: This class is used to do some routines or utilities which will be used frequently during some methods calling, including making JSON object and JSON string, read and write file into the system, etc.
Variables:
	private jsonFile: string;
	private jsonObject: NodesObject;

Methods:
o	public setJsonFile(input: any[]) – this method will be used to make a JSON file from any lists given to this method for the input.
o	public setJsonString(input: string) – this method will be used to make a JSON file from string JSON given as an input for this method.
o	public parseJsonFile(input:string) – this method parses a JSON file string input and make it as JSON object. 
o	public concatJsonFiles(input: string) – this method will merge two different JSON files
o	public getJsonFile() – this method will return a string JSON file which has been saved in the jsonFile variable.
o	public getJsonObject() – this method will return an object of JSON file which has been saved in the jsonObject variable.
o	public getHashFunction(input: string) – to give the unique id to the nodes using hash function.
o	public getLastModFs(location: string, url: string) – this method will return the last modification date of the given url which is read using electron.
o	Public getComparedLastMod(parm1:string, parm2: string) – this method compares two last modification dates and return Boolean whether the two dates are different or not.
o	public writeAnyTypeFile(path: string, input: string, name: string) – to save file into the system (can be .json or .mm or .jm).
o	public readAnyTypeFile(fullpath: string, readingtype: string, type: string) – to read any type of file from the system (can be .json or .mm or .jm)


7.	Class Gui
Description: This Class is used as a general Gui operations (except the sidebar Gui)
Variables:
	private jsMindProjectNameState: string;
	private jsMindProjectSavedState: string;
	private jsMindSavedState: string;
	private jsMindStatusState: string;
	private jsMindCurrentlyOpenedProject: number;
	private savedStateChildElement: any;

Methods:
o	public setGuiInitialize(mindmapMenu:any) – initializes all things regarding Gui.
o	public loadPdfButton(contents:any) – loads the PDF icon in the mindmap.
o	public setJsmindListener() – this method listens all changes regarding mindmap operation in the mindmap section.
o	public setContextMenu() – this method provides the list of options during event of users do right click.
o	public setEffectShaking(id:string) – this method is used to shake the prompter in a certain event
o	public setElementVisibility() – this method is used to populate all elements which have class .hide/.show and call method setShowHide().
o	public setShowHide() – this method is used to show / hide a selected element. 
o	public showRecentProject() – this method is used to give href to the recent project in the project menu.
o	public findNodeByAttribute(attr:any, val:string) – this method finds the mindmap’s node by specifying its attribute

8.	Class ContextMenu -> extends Class Gui
Description: This class is used when users do right click in the mindmap section.
Variables:
    private listData: string[];
    private tempBoard: string;
    private clipBoard: string;
	
Methods:
o	public actionCopy()  - to copy the content of the node
o	public actionPaste(project:any) – to paste the content of the node
o	public actionOpenPdf(directory:string) – to open pdf
o	public actionOpenPdfUserDefine(directory:string) – to enable editing the pdf using user defined PDF reader
o	public actionCancel() – to close the dialog 
o	public actionDelete() – to delete the selected node

9.	Class MindmapMenu -> extends Class Gui
Description: This method, as an extension of the Class Gui, is used for all operations regarding the mindmap menu & mindmap changes.
Variables:
	private jsMindObject: any;
	private fileTypeSave:string;

Methods:
o	public setFileType() – to save the state of the filetype (.mm or .jm) into fileTypeSave variable
o	public getFileType() – to fetch the state of the filetype from fileTypeSave variable
o	public newMap(project:any, rootName:string) - creates new mindmap
o	public loadFile(filetype: string) – this method loads current mindmap state on the mindmap 
o	public saveFile(fileType:string) – saves the mindmap
o	public getJsMindData() – fetch data from mindmap current state.
o	public selectFile() – selects the file chose by the user 
o	public setOpenFileListener() – this method listens to the changes of the file .mm or .jm change
o	public loadFileJsMind(content:any, type:string, freemind_name:any) - opens the existing mindmaps

10.	Class GuiSideBar
Description: This class, as extension of the Class Gui, is used for all operations regarding to the sidebar Gui (tab project and tab annotation).
Variables:
	private basicHtmlTitle:any;
	private basicHtmlContent:any;

Functions:
o	public setGuiInit() – this method initializes the sidebar Gui
o	public setGuiOnAppend() – this method inserts annotation(s) extracted from PDFs when refresh button is pressed (in case annotation is added after opening scimappr application).
o	public resetSidebarAnnotation() – this method will clear all annotations in the sidebar
o	public checkSideBar() – check whether the annotation in the sidebar exist or not 
o	public searchAnnotation(keyword:string, directory:string) – searches the annotations
o	public openTreeView(input: string) – this method sets the treeview based on the JSON data input.
o	public setTreeViewListener() – this method listens to the changes of the nodes in the treeview of the sidebar project tab.
o	public resetTreeView() – this method clears the treeview.
o	public setTreeView() – this method populate all pdf files and creating the treeview JSON file.
o	public setReCreateTreeView() – this method recreates treeview after a project is closed.
o	private setDynamicHtmlTitle() – this method creates dynamic html for the pdf title in the sidebar.
o	private setDynamicHtml() – checks if same nodes present in the mindmap and sidebar and execute method setDynamicHtmlContent() create dynamic html for the annotations in the sidebar.
o	private setDynamicHtmlContent() – this method is the real method to create dynamic html and fill the html attributes.
o	public setAnnotationVisibility() – this method sets the annotation title visibility by comparing some annotation(s) which have become mindmap and the remaining annotation(s) in the sidebar.
o	private checkJsMindNode() – this method checks whether the nodes are already in the mindmap or still in the annotation’s sidebar section.
o	public checkAnnotationExistInSidebar() – this method checks whether there is annotation(s) in the sidebar or not.
o	public findAnnotationByAttribute() – this method searches for the annotation(s) in the sidebar by their attribute.  


11.	Class Project
Description: This class is mainly about all operations regarding to the project, such as new project, open project, save project and close project. 
Variables:
	private projectName: string;
	private projectLocation: string;
	private projectPdfList: string[];
	private projectStatus: string;
	private projectSavedFileLocation: string;
	private projectSavedPdfLocation: string;
	private projectTreeView: string;
	private projectPromises: string;

Functions:
o	public setProjectName() – this method saves the name of the project in the variable projectName.
o	public getProjectName() – this method fetches the name of the project from the saved variable projectName. 
o	public setProjectLocation() – this method saves the project location in the variable projectLocation.
o	public getProjectLocation() – this method fetches the project location from the variable projectLocation.
o	public setProjectPdfList() – this method saves the list of PDF(s) name into the variable projectPdfList.
o	public getProjectPdfList() – this method fetches the list of PDF(s) name from the variable projectPdfList.
o	public setProjectStatus() – this method saves the status of the project into variable projectStatus.
o	public getProjectStatus() – this method fetches the status of the project from variable projectStatus.
o	public setProjectSavedFileLocation() – this method saves the location/directory of the saved mindmap file (.mm or .jm) into variable projectSavedFileLocation.
o	public getProjectSavedFileLocation() – this method fetches the location/directory of the saved mindmap file (.mm or .jm) from variable projectSavedFileLocation.
o	public setProjectPdfFileLocation() – this method saves the location/directory of the PDF(s) file into variable projectSavedPdfLocation.
o	public getProjectPdfFileLocation() – this method fetches the location/directory of the PDF(s) file from variable projectSavedPdfLocation.
o	public setProjectTreeView() – this method saves the currently opened project treeview’s JSON file into variable projectTreeView
o	public getProjectTreeView() – this method fetches the currently opened project treeview’s JSON file from variable projectTreeView
o	public setProjectPromises() – this method saves promise results which are produced during opening new project modal into variable projectPromises.
o	public getProjectPromises() – this method fetches back promise results which are produced during opening new project modal from variable projectPromises.
o	public checkNewProject()  - this method checks the requirements for the new project and returns the Boolean of the project status.
o	public newProjectModal() – this method opens the new project modal.
o	public setNewProjectListener() – this method listens to the changes of the new project requirements during the new project modal is being opened.
o	public createNewProject() – this method is executed when user click saves from the new project modal. 
o	public setSaveProject() – this method is the routine which is called in order to save project.
o	private saveProject() – this method is the main program executed to do some stuffs, such as populating JSON data, building save mindmap file (.mm or .jm), etc, during saving the project.
o	public setTempSaveProject() – this method saves the temporary state of the running project (including after some changes have been made by the user). 
o	public addToRecentProject() – this method adds the recently opened project to the shortcut of recent project in the project menu and saves it into JSON file (project.json) in the root system.
o	public openRecentProject() – this method opens the saved recent project from JSON file  (project.json) in the root system. 
o	public setOpenProjectModal() – this method is executed during the open project click by the user. 
o	private setOpenProjectListener() – this method listens to the change made by project configuration file chooser (.json file).
o	public openProject() – this method is the main program to open a project.
o	public openProjectFromTreeView() – this method is used to open project based on treeview’s project selection.
o	public setCloseProject() – when close project is pressed, then this method is executed.
o	Public clrProjectState() – this method clears some parameter’s states. 



