declare var PDFJS: any;
declare var Promise: any;
declare var $: any;
declare var hex_sha1: any;
declare var require: any;

declare var hex_hmac_sha1: any;
declare var _jm: { begin_edit: Function, get_selected_node: Function, remove_node: Function, resize: Function, select_node: Function, show: Function, add_node: Function, mind: { nodes: Function }, view_provider: { edit_node_end: Function }, add_event_listener: Function, get_data: Function };
declare var jsMind: any;
declare var jmnodes: any;
declare var Buffer: any;
const path = require('path');

// ========================================================= //
// Class Section
// ========================================================= //


/**
 * Used to set the Node's parameters in sidebar 
 */
class Nodes {
    private id: string;
    private topic: string;
    private filename: string;
    private pagenumber: number;

    /**
     *
     * @param nodeId
     * @param nodeTopic
     */
    constructor(nodeId: string, nodeTopic: string, fileName: string, pagenumber: number) {
        this.id = nodeId;
        this.topic = nodeTopic;
        this.filename = fileName;
        this.pagenumber = pagenumber;
    }

    /**
     *
     * @param id
     */
    public setId(id: string) {
        this.id = id;
    }

    /**
     *
     * @returns {string}
     */
    public getId(): string {
        return this.id;
    }

    /**
     *
     * @param topic
     */
    public setTopic(topic: string) {
        this.topic = topic;
    }

    /**
     *
     * @returns {string}
     */
    public getTopic(): string {
        return this.topic;
    }

    /**
     *
     * @param filename
     */
    public setFileName(filename: string) {
        this.filename = filename;
    }

    /**
     *
     * @returns {string}
     */
    public getFileName(): string {
        return this.filename;
    }

    /**
     *
     * @param pagenumber
     */
    public setPageNumber(pagenumber: number) {
        this.pagenumber = pagenumber;
    }

    /**
     *
     * @returns {number}
     */
    public getPageNumber(): number {
        return this.pagenumber;
    }

    /**
     * set Node to be Draggable
     * @returns {DragObject}
     */
    public setDraggable(): any {
        var temp: DragObject = {
            helper: 'clone',
            containment: 'frame',
            opacity: '0.5',
            revert: 'invalid',
            appendTo: 'body',
            stop: (ev: Event, ui): string => {
                var pos = $(ui.helper).offset();
                return "finish";
            }
        };
        return temp;
    }

    /**
     * set Node to be Droppable
     * @returns {DropObject}
     */
    public setDroppable(): any {
        var temp: DropObject = {
            drop: (ev: Event, ui): string => {
                var selected_node = _jm.get_selected_node(); // select node when mouseover
                if (!selected_node) {
                    alert('please select a node first.');
                    return;
                }
                var nodeid: string = ui.helper.prevObject[0].id;
                var topic: string = ui.helper.prevObject[0].innerHTML;
                var pdfid: string = ui.helper.prevObject[0].title;
                var pagenumber: number = ui.helper.prevObject[0].value;
                var directory: string = ui.helper.prevObject[0].href;
                var node: any = _jm.add_node(selected_node, nodeid, topic, "", pdfid, pagenumber);

                gui.setPdfButton(nodeid, pdfid, pagenumber, this);

                project.setProjectStatus('edited');
                project.setTempSaveProject("chgProject");
            }
        }

        return temp
    }

}

/**
 * Pdf file details in folder
 */
class Pdf {
    private pdfName: string;
    private pdfLocation: string;
    private pdfLastModifiedDate: string;

    public setPdfName(input: string) {
        this.pdfName = input;
    }

    public getPdfName() {
        return this.pdfName;
    }

    public setPdfLocation(input: string) {
        this.pdfLocation = input;
    }

    public getPdfLocation() {
        return this.getPdfLocation;
    }

    public setPdfModifiedDate(input: string) {
        this.pdfLastModifiedDate = input;
    }

    public getPdfModifiedDate() {
        return this.getPdfModifiedDate;
    }
}

/**
 * List of PDF files in a folder
 */
class ListPdf extends Pdf {
    /**
     *  Saves PDF Files' Name, Last Modification and Folder Directory
     */
    private listPdfFiles: string[];
    private lastModDatePdfFiles: string[];
    private directory: string;

    /**
     *
     * @param listPdfFiles
     * @param lastModDatePdfFiles
     * @param directory
     */
    constructor(listPdfFiles: string[], lastModDatePdfFiles: string[], directory: string) {
        super();
        this.listPdfFiles = listPdfFiles;
        this.directory = directory;
        this.lastModDatePdfFiles = lastModDatePdfFiles;
    }

    /**
     * save list of pdf files' name with input of pdf file lists
     * @param list
     */
    public setListPdfFile(list: string[]) {
        for (var x = 0; x < list.length; x++) {
            this.listPdfFiles[x] = list[x];
        }
    }

    /**
     * fetch list of pdf files' names with giving input by array index from saved file list
     * @param idx
     * @returns {string}
     */
    public getListPdfFile(idx: number): string {
        return this.listPdfFiles[idx];
    }

    /**
     *fetch list of pdf files' all names from saved file list
     * @returns {string[]}
     */
    public getListPdf(): string[] {
        return this.listPdfFiles;
    }

    /**
     *save list of pdf files' last modifiy date with input of last modifyed date lists
     * @param list
     */
    public setLastModDate(list: string[]) {
        for (var x = 0; x < list.length; x++) {
            this.lastModDatePdfFiles[x] = list[x];
        }
    }


    /**
     * extract the all last modifyed date information from the pdf file list
     * @param util
     * @param listFile
     * @returns {Array}
     */
    public getModDateFs(util, location: string, listFile: string[]) {
        var counter: number = 0;
        var modDateList = [];
        for (var x = 0; x < listFile.length; x++) {
            modDateList.push(util.getLastModFs(location, listFile[x]));
        }
        return modDateList;
    }

    /**
     * get all last modified date from last modified date list
     * @returns {string[]}
     */
    public getLastMod(): string[] {
        return this.lastModDatePdfFiles;
    }

    /**
     *Counting all the pdf files names inside the pdf files list
     * @returns {number}
     */
    public getCount(): number {
        return this.listPdfFiles.length;
    }

    public getPdfFromFs(): any {
        var result = this.readPdfInDirectory(this.directory);
        return result;
    }

    /**
     * subroutine for calling get pdf file page
     * @param filePath
     * @param fileName
     * @returns {any}
     */
    public getPdfPage(filePath: string, fileName: string): any {
        var result = this.getPdfFilesPage(filePath, fileName);
        return result;
    }

    /**
     * save the directory that contains pdf files
     * @param dir
     */
    public setDirectory(dir: string) {
        dir = path.normalize(dir);
        this.directory = dir;
    }

    /**
     *get the saved directory
     * @returns {string}
     */
    public getDirectory(): string {
        return this.directory;
    }

    /**
     *For comparing last modify date changes for updating the annotation
     * @param util
     * @param list
     * @returns {[boolean,string[],number]}
     */
    public chkDateChange(util, list: string[]): any {
        var newLastMod: string[] = [];
        var listChange: string[] = [];
        var stsChange: boolean = false;
        var indexChange: number = 0;
        for (var x = 0; x < list.length; x++) {
            newLastMod[x] = util.getLastModFs(project.getProjectSavedPdfLocation(), list[x]);
        }
        for (var x = 0; x < list.length; x++) {
            if (newLastMod[x] != this.lastModDatePdfFiles[x]) {
                stsChange = true;
                listChange[indexChange] = this.getListPdfFile(x);
                indexChange++;
            }
        }

        return [stsChange, listChange, indexChange];
    }

    /**
     * reading all pdf files in the specified directory
     * @param paths 
     */
    private readPdfInDirectory(paths: string): any {

        var process = new Promise(function (resolve, reject) {
            var promises = [], promise;
            var fs = require("fs");
            fs.readdir(paths, function (err, filenames) {
                if (err) {
                    alert("error reading directory");
                    return;
                }
                filenames.forEach(function (filename) {
                    if (filename.indexOf(".pdf") != -1) {
                        promise = filename;
                        promises.push(promise);
                    }
                });
                resolve(promises);
            })
        });

        return process;
    }

    /**
     * For each Pdf files get list of the pages that contain annotation
     * @param filePath
     * @param fileName
     * @returns {any}
     */
    private getPdfFilesPage(filePath: string, fileName: string): any {

        var processPage = new Promise(function (resolve, reject) {
            // Adding timestamp forces the browser to always trigger a
            // new request for the PDF file. This is a way to prevent
            // the browser to use the cached version of the file
            PDFJS.getDocument(`${filePath}?${Date.now()}`).then(function (pdf) {
                var promises = [], promise;
                for (var i = 1; i <= pdf.numPages; i++) {
                    promise = pdf.getPage(i).then(function (page) {
                        return page.getAnnotations();
                    });
                    promises.push(promise);
                }
                var resolvedPromises = Promise.all(promises);
                resolve(resolvedPromises);
            });
        });

        return processPage;

    }

    /**
     * to clear states of list Pdf
     */
    public clrListPdfState() {
        this.listPdfFiles = new Array();
        this.lastModDatePdfFiles = new Array();
    }
}

/**
 *Details of annotation
 */
class Annotation {
    private fileName: string;
    private id: string;
    private topic: string;
    private subtype: string;
    private title: string;
    private pagenumber: number

    /**
     *
     * @param fileName
     * @param annotId
     * @param annotTopic
     * @param annotSubtype
     * @param annotTitle
     */
    constructor(fileName: string, annotId: string, annotTopic: string, annotSubtype: string, annotTitle: string, pagenumber: number) {
        this.fileName = fileName;
        this.id = annotId;
        this.topic = annotTopic;
        this.subtype = annotSubtype;
        this.title = annotTitle;
        this.pagenumber = pagenumber;
    }

    /**
     *Set pdf file name for this annotation
     * @param fileName
     */
    public setFileName(fileName: string) {
        this.fileName = fileName;
    }

    /**
     * Get pdf file name from the given annotation
     * @returns {string}
     */
    public getFileName() {
        return this.fileName;
    }

    /**
     * Set the Id of annotation
     * @param id
     */
    public setId(id: string) {
        this.id = id;
    }

    /**
     * Get the Id
     * @returns {string}
     */
    public getId(): string {
        return this.id;
    }

    /**
     * Set the topic of the annotation
     * @param topic
     */
    public setTopic(topic: string) {
        this.topic = topic;
    }

    /**
     * Get the topic
     * @returns {string}
     */
    public getTopic(): string {
        return this.topic;
    }

    /**
     * For the Pop up or Rectangle annotation type choose. We have only get popup option right now
     * But for the future implementation the Rectangle also can be choose
     * @param subtype
     */
    public setSubtype(subtype: string) {
        this.subtype = subtype;
    }

    /**
     * Get defined subtype from annotation
     * @returns {string}
     */
    public getSubtype() {
        return this.subtype;
    }

    /**
     * The name of the creator of this annotations
     * @param title
     */
    public setTitle(title: string) {
        this.title = title;
    }

    /**
     * Get the name of the creator of this annotations
     * @returns {string}
     */
    public getTitle(): string {
        return this.title;
    }
    /**
     * Set the number of page that stores the Annotation
     * @param pagenumber 
     */
    public setPageNumber(pagenumber: number) {
        this.pagenumber = pagenumber;
    }
    /**
     * get the number of page that stores the Annotation
     */
    public getPageNumber(): number {
        return this.pagenumber;
    }
    ss
}

/**
 * Used to manipulate list of annotations
 */
class ListAnnotations extends Annotation {

    private listPdfFilesAnnotations: string[];

    /**
     * set The constructor when class is called
     * @param input
     */
    constructor(input: string) {
        super("", "", "", "", "", 0);
        this.listPdfFilesAnnotations = new Array;
    }

    /**
     *After you get all the annotations you save it into listpdffilesanotations
     * @param input
     */
    public setListPdfFilesAnnotations(input: string[]) {
        this.listPdfFilesAnnotations = input;
    }

    /**
     * get listofannotations
     * @returns {string[]}
     */
    public getListPdfFilesAnnotations(): string[] {
        return this.listPdfFilesAnnotations;
    }

    /**
     *routine to get annotations detail
     * @param pages
     * @param fileName
     * @returns {any}
     */
    public getAnnotations(pages, fileName: string): any {
        var result = this.getAnnotationsDetail(pages, fileName);
        return result;
    }

    /**
     *Prommise for getting annotation details for eachpages of the pdf
     * @param pages
     * @param fileName
     * @returns {any}
     */
    private getAnnotationsDetail(pages, fileName: string): any {
        var util = new Utils();
        var ignoreList = ['Link'];
        var items = [];
        var processAnot = new Promise(function (resolve, reject) {
            var pageNumber: number = 0;
            pages.forEach(annotations => {
                pageNumber++;
                annotations.forEach(function (annotation) {
                    if ((annotation.contents != "") && (annotation.subtype == "Popup")) {
                        items.push({
                            filename: fileName,
                            id: util.getHashFunction(fileName + " " + annotation.contents),
                            subtype: annotation.subtype,
                            title: annotation.title,
                            topic: annotation.contents,
                            pagenumber: pageNumber,
                        });
                        this.listPdfFilesAnnotations = annotation.contents;
                    }
                });
                var temp = util.setJsonFile(items);
                util.concatJsonFiles(temp);
            });
            resolve(util.getJsonFile())
        });
        return processAnot;
    }
}


/**
 * Utilities that are used to support the main program
 */
class Utils {

    private jsonFile: string;
    private jsonObject: NodesObject;

    /**
     * Make a json file from anthing that is giving a list input to this method
     * @param input
     * @returns {string}
     */
    public setJsonFile(input: any[]): string {
        this.jsonFile = JSON.stringify(input);
        return this.jsonFile;
    }

    /**
     * The input is from only one section of the list, one by one
     * @param input
     * @returns {string}
     */
    public setJsonString(input: string): string {
        this.jsonFile = input;
        return this.jsonFile;
    }

    /**
     * Parsing json file to get the json object
     * @param input
     * @returns {NodesObject}
     */
    public parseJsonFile(input: string): NodesObject {
        this.jsonObject = JSON.parse(input);
        return this.jsonObject;
    }

    /**
     * Concat two json files into one json file
     * @param input
     * @returns {string}
     */
    public concatJsonFiles(input: string): string {
        var obj1 = JSON.parse(input);
        var obj2 = JSON.parse(this.jsonFile);
        var concatJson: string;
        var idxObj1 = obj1.length;
        for (var key in obj2) {
            obj1[idxObj1] = obj2[key];
            idxObj1++;
        }
        concatJson = JSON.stringify(obj1)
        return concatJson
    }

    /**
     *to get json file from the saved json file
     * @returns {string}
     */
    public getJsonFile() {
        return this.jsonFile;
    }

    /**
     * To get a json object from the saved json object
     * @returns {NodesObject}
     */
    public getJsonObject() {
        return this.jsonObject;
    }

    /**
     * Hashing method for hashing the sended strings
     * @param input
     * @returns {string}
     */
    public getHashFunction(input: string): string {
        var hash: string = hex_sha1("string");
        var hmac: string = hex_hmac_sha1("19", input);
        return hmac;
    }

    /**
     * The real method in order to get the last modified date from the given URL (using fs)
     * @param url
     * @returns {any}
     */
    public getLastModFs(location: string, url: string): any {
        var lastModifiedDate: any;
        var fs = require('fs');


        //fs.stat(location + "//" + url, function (err, stats) {
        //lastModifiedDate = stats.mtime;
        //});

        var result = fs.statSync(path.join(location, url));
        console.log(result);
        lastModifiedDate = result.mtime;

        return lastModifiedDate;
    }

    /**
     * Comparison function in order to understand whether the pdf file is changed or not
     * @param lstMod1
     * @param lstMod2
     * @returns {boolean}
     */
    public getCompareLastMod(lstMod1: string, lstMod2: string): boolean {
        var stsResult = false;
        if (lstMod1 != lstMod2) {
            stsResult = true;
        }
        return stsResult;
    }

    public writeAnyTypeFile(paths: string, input: string, name: string, type: string) {
        var fs = require('fs');
        var buffer = new Buffer(input);

        fs.open(path.join(paths, name) + "." + type, 'w', function (err, fd) {
            if (err) {
                throw 'error opening file: ' + err;
            }

            fs.write(fd, buffer, 0, buffer.length, null, function (err) {
                if (err) throw 'error writing file: ' + err;
                fs.close(fd, function () {
                    console.log('file has been written to ' + path.join(paths, name) + "." + type);
                })
            });
        });
    }

    public readAnyTypeFile(fullpath: string, readingtype: string, type: string): any {
        var fs = require('fs');
        var filepath: string = null;

        if (type != null) {
            filepath = fullpath + "." + type;
        } else {
            filepath = fullpath;
        }

        var result = new Promise(function (resolve, reject) {
            fs.readFile(filepath, readingtype, function (err, contents) {
                resolve(contents);
            });
        });

        return result;

    }

}

/**
 * for GUI operations in general (except the gui sidebar)
 */
class Gui {

    private jsMindProjectNameState: string[]; // for saving temporary project name state related to currently opened JsMind
    private jsMindProjectSavedState: string[]; // for saving temporary project state related to currently opened JsMind (in .json format) 
    private jsMindSavedState: string[]; // for saving temporary jsmind state related to currently opened JsMind (in .mm or .jm format)
    private jsMindStatusState: string[]; // for saving temporary jsmind status state related to currently opened JsMind (edited or noedit)
    private jsMindCurrentlyOpenedProject: number // for saving currently opened project state by its index number (1, 2, 3, etc)
    private savedStateChildElement: any // for saving child element (PDF Button) during edit or moving node in JsMind

    constructor() {
        this.jsMindProjectNameState = new Array();
        this.jsMindSavedState = new Array();
        this.jsMindProjectSavedState = new Array();
        this.jsMindStatusState = new Array();
        this.jsMindCurrentlyOpenedProject = 0;
        this.savedStateChildElement = null;
    }

    /**
     * to save the state of the name of JsMind project
     * @param input 
     * @param idx 
     */
    public setJsMindProjectNameState(input: string, idx: number) {
        this.jsMindProjectNameState[idx] = input;
    }

    /**
     * to find the sequence of the project's name in the saved state
     * @param name 
     */
    public getJsMindProjectNameState(name: string): number {
        for (var x = 1; x <= this.jsMindProjectNameState.length; x++) {
            if (this.jsMindProjectNameState[x] == name) {
                return x;
            }
        }
    }

    /**
     * to get the name of the project whose state has been saved in temporary
     * @param idx 
     */
    public getMindProjectName(idx: number): string {
        return this.jsMindProjectNameState[idx];
    }

    /**
     * to get the sequence of the saved state
     */
    public getCountProjectStatesNumber(): number {
        var projCounter: number = 0;
        if (this.jsMindProjectNameState.length == 0) {
            projCounter = 1;
        } else {
            projCounter = this.jsMindProjectNameState.length;
        }
        return projCounter;
    }

    /**
     * to set the current state of the project
     * @param input 
     * @param idx 
     */
    public setJsMindProjectState(input: string, idx: number) {
        this.jsMindProjectSavedState[idx] = input;
    }

    /**
     * to return back the state of the current project
     * @param idx 
     */
    public getJsMindProjectState(idx: number): string {
        return this.jsMindProjectSavedState[idx];
    }
    /**
     * to save the current state of mindmap
     * @param input 
     * @param idx 
     */
    public setJsMindSavedState(input: string, idx: number) {
        this.jsMindSavedState[idx] = input;
    }

    /**
     * to get the current saved state of the mindmap
     * @param idx 
     */
    public getJsMindSavedState(idx: number): string {
        return this.jsMindSavedState[idx];
    }

    /**
     * to save the state of the status of the project (edited or noedit)
     * @param input 
     * @param idx 
     */
    public setJsMindStatusState(input: string, idx: number) {
        this.jsMindStatusState[idx] = input;
    }

    /**
     * to get the current saved state of the status of the project
     * @param idx 
     */
    public getJsMindStatusState(idx: number) {
        return this.jsMindStatusState[idx];
    }

    /**
     * to save the state of which current project is being opened
     * @param input 
     */
    public setJsMindOpenProject(input: number) {
        this.jsMindCurrentlyOpenedProject = input;
    }

    /**
     * to get the state of which current project is being opened
     */
    public getJsMindOpenProject(): number {
        return this.jsMindCurrentlyOpenedProject;
    }

    /**
     * to save the child element
     */
    public setChildElement(input: any) {
        this.savedStateChildElement = input;
    }

    /**
     * to get the child element
     */
    public getChildElement(): any {
        return this.savedStateChildElement;
    }

    /**
     * to recreate the saved state of the opened projects after a project is being closed
     * @param list 
     */
    public setReCreateState(list: any) {

        var newListName: string[] = new Array();
        var newSavedState: string[] = new Array();
        var newProjectState: string[] = new Array();
        var newStatusState: string[] = new Array();
        var newOpenedProject: number = 0;
        for (var i = 0; i < list.length; i++) {
            for (var j = 1; j <= this.jsMindProjectNameState.length; j++) {
                if (list[i].text == this.jsMindProjectNameState[j]) {
                    newListName[i] = this.jsMindProjectNameState[j];
                    newSavedState[i] = this.jsMindSavedState[j];
                    newProjectState[i] = this.jsMindProjectSavedState[j];
                    newStatusState[i] = this.jsMindStatusState[j];
                }
            }
        }

        newOpenedProject = list.length;

        this.jsMindProjectNameState = new Array();
        this.jsMindSavedState = new Array();
        this.jsMindProjectSavedState = new Array();
        this.jsMindStatusState = new Array();
        this.jsMindCurrentlyOpenedProject = 0;

        this.setJsMindOpenProject(newOpenedProject);
        var x = 1;
        for (var i = 0; i < newListName.length; i++) {
            this.setJsMindProjectNameState(newListName[i], x);
            this.setJsMindSavedState(newSavedState[i], x);
            this.setJsMindProjectState(newProjectState[i], x);
            this.setJsMindStatusState(newStatusState[i], x);
            x++;
        }
    }

    /**
     * Setting GUI when Initializing the program
     * @param mindmapMenu 
     */
    public setGuiInitialize(mindmapMenu: any): any {
        //to set nodes as draggable and droppable
        $(".drag").draggable(node.setDraggable());
        $(".drop").droppable(node.setDroppable());

        // Render existing MindMap
        var options = {
            container: 'jsmind_container',
            theme: 'primary',
            editable: true
        }
        var mindmap = {
            "meta": {
                "name": "jsMind",
                "version": "0.2"
            },
            "format": "node_tree",
            "data": { "id": "root", "topic": "Root", "children": [] }
        };

        _jm = jsMind.show(options, mindmap);
        mindmapMenu = new MindmapMenu(_jm);
        mindmapMenu.setOpenFileListener();

        return mindmapMenu;
    }

    /**
     * used for creating confirmation window
     * @param msg 
     */
    public windowConfirmation(msg: string): boolean {
        var result: boolean = confirm(msg);
        return result;
    }

    /**
     * used for creating alert window
     * @param msg 
     */
    public windowAlert(msg: string) {
        alert(msg);
    }

    /**
     * listener for size changing
     */
    public windowResizeListener() {
        var c = document.getElementById('jsmind_container');
        var widthSize = c.offsetWidth;
        var heightSize = c.offsetHeight;

        window.addEventListener('resize', function (result) {
            if ((window.innerWidth == widthSize) && (window.innerHeight == heightSize)) {
                c.style.width = widthSize.toString();
                c.style.height = heightSize.toString();
                _jm.resize();
            } else {
                var width = window.innerWidth - 170;
                var height = window.innerHeight - 300;
                c.style.width = width.toString();
                c.style.height = height.toString();
                _jm.resize();
            }
        });
    }

    /**
     * give pdf button to all nodes when opening a new project
     * @param contents 
     */
    public loadPdfButton(contents: any) {
        var self = this;

        jmnodes = document.querySelectorAll('jmnodes');
        var nodes = jmnodes[0].children;
        var node = null;
        var content = contents[0];
        var counter: number = 0

        for (var i = 0; i < nodes.length; i++) {
            if (nodes[i].nodeName == "JMNODE") {
                var tempContent = content.annotation[counter];
                var realContent = tempContent[0];
                counter++;
                if (realContent.id == nodes[i].attributes[0].value) {
                    if (realContent.id != "root") {
                        node = new Nodes(realContent.id, realContent.text, realContent.file, realContent.page);
                        self.setPdfButton(node.getId(), node.getFileName(), node.getPageNumber().toString(), node);
                        var tempElement = this.findNodeByAttribute("nodeid", node.getId());
                        if ((tempElement != null) && (tempElement != undefined)) {
                            tempElement.setAttribute("pdfid", node.getFileName());
                        }
                    }
                } else {
                    counter--;
                }
            }
        }
    }

    /**
     * setting pdf button in all nodes
     * @param nodeid 
     * @param pdfid 
     * @param pagenumber 
     * @param node 
     */
    public setPdfButton(nodeid: string, pdfid: string, pagenumber: string, node: any) {
        if ((pdfid != "undefine") || (pdfid != null)) {

            var pdfViewer: string = "./build/pdf.js/web/viewer.html";
            //var fileName:string = "?File=" + "./" + pdfid;
            var fileName: string = "?file=" + pdfid;
            var pageNumber: string = "#page=" + pagenumber.toString();
            var link: string = pdfViewer + fileName + pageNumber;

            var linkElement: any = document.createElement("a")
            linkElement.setAttribute("href", link);
            linkElement.setAttribute("target", "_blank");
            linkElement.setAttribute("style", "z-index:5; float:left; padding-right:5px");

            var imgElement: any = document.createElement("img");
            imgElement.setAttribute("id", nodeid);
            imgElement.setAttribute("src", "./build/img/pdf.png");

            linkElement.appendChild(imgElement);
            var selection = this.findNodeByAttribute("nodeid", nodeid);
            selection.appendChild(linkElement);
        }
    }

    /**
     * used for creating new project window
     */
    public windowNewProject() {
        $("#myModal").modal();
        (<HTMLInputElement>document.getElementById("projectName")).value = "MyThesis";
        (<HTMLInputElement>document.getElementById("projectPdf")).value = "";
        (<HTMLInputElement>document.getElementById("projectHome")).value = "";
    }

    /**
     * used for opening existing project window
     */
    public windowOpenProject() {
        var input = $(document.getElementById('file-chooser'));
        input.trigger("click"); // opening dialog
    }

    /**
     * set listener of the JsMind and make changes during drag and drop of the annotations into JsMind
     */
    public setJsmindListener() {
        var self = this;

        _jm.add_event_listener(function () {
            self.setContextMenu();
            var nodes = $('#annotation-group').get();
            var children = nodes[0].children;
            // Update the annotation panel on each MindMap addition event (when mindmap has been dropped, annotation in the sidebar will be hide)
            for (var i = 0; i < children.length; i++) {
                var tempNode = children[i];
                if (_jm.mind.nodes[tempNode.id]) {
                    $('#' + tempNode.id).removeClass("show");
                    $('#' + tempNode.id).addClass("hide");
                    //$('#' + tempNode.id).hide();
                } else {
                    $('#' + tempNode.id).removeClass("hide");
                    $('#' + tempNode.id).addClass("show");
                    //$('#' + tempNode.id).show();
                }
            }

            guiSideBar.setAnnotationTitleVisibility();

            self.setElementVisibility();

        });

        
        $('#wrapper').click(function(){
            $('#contextMenu').hide();
        });
    }

    /**
     * set listener of the context menu (when user do right click)
     */
    public setContextMenu() {
        jmnodes = document.querySelectorAll('jmnode');
        for (var i = 0; i < jmnodes.length; i++) {
            // Not efficient, need to figure out another way to do this.
            jmnodes[i].oncontextmenu = function (e) {
                e.preventDefault();
                if (e.target.getAttribute('pdfid') != 'undefined') {
                    $('#contextMenu .actionOpenPdf').show();
                } else {
                    $('#contextMenu .actionOpenPdf').hide();
                }
                $('#contextMenu').show();
                $('#contextMenu').css({ position: 'absolute', marginLeft: e.clientX, marginTop: e.clientY - 45 });
                contextMenu.setTempBoard(e.target.innerHTML);
            }
        }
    }

    /**
    * Used for creating shaking effect into modal
    * @param id 
    */
    public setEffectShaking(id: string) {
        var element: any = document.getElementById(id);
        $(element).effect("shake");
    }

    /**
     * populate all elements and deciding the visibility
     */
    public setElementVisibility() {
        // set show all elements that have show attribute
        var nodesShow = $('.show').get();
        if ((nodesShow != undefined) && (nodesShow != null)) {
            for (var j = 0; j < nodesShow.length; j++) {
                var tempNodeShow = nodesShow[j];
                this.setShowHide(tempNodeShow, "show");
            }
        }


        // set hide all elements that have hide attribute
        var nodesHide = $('.hide').get();
        if ((nodesHide != undefined) && (nodesHide != null)) {
            for (var j = 0; j < nodesHide.length; j++) {
                var tempNodeHide = nodesHide[j];
                this.setShowHide(tempNodeHide, "hide");
            }
        }

    }

    /**
     * set whether the element is visible or hide
     * @param elementName 
     * @param mode 
     */
    private setShowHide(elementName: string, mode: string) {
        if (mode == "hide") {
            $(elementName).hide();
        } else {
            $(elementName).show();
        }
    }

    /**
     * to load recent project for the recent project in project
     */
    public loadRecentProjects() {
        var data = [];
        var fs = require('fs');
        try {

            data = JSON.parse(fs.readFileSync('./projects.json'));
        } catch (e) { }
        if (data.length == 0) {
            $('#recentProjectsList').html('<li>&nbsp;&nbsp;<i>No Projects</i></li>');
        } else {
            var projectList: any = data.map(function (each) {
                return `<li><a href="javascript:programCaller('openRecentProject', '` + each.projectFilePath.split('//').join('////') + `')">&nbsp;&nbsp;${each.projectName} <i>(${each.projectFilePath})</i></a></li>`;
            });
            $('#recentProjectsList').html(projectList.join(''));
        }
    }

     /**
     * Routine to find Node of the mindmap by its attribute's name (ex:nodeid, topic, pdfid)
     * @param attr
     * @param val
     * @returns {any}
     */
    public findNodeByAttribute(attr: any, val: string): any {
        var All: any = document.getElementsByTagName('jmnode');

        for (var i = 0; i < All.length; i++) {
            if (All[i].getAttribute(attr) == val) { return All[i]; }
        }

    }
}

/**
 * Used when users do right click (to select some menus)
 */
class ContextMenu extends Gui {

    private tempBoard: string;
    private clipBoard: string;

    /**
     * to save the current copied data into clipboard
     * @param input 
     */
    public setTempBoard(input: string) {
        this.tempBoard = input;
    }

    public setClipBoard() {
        this.clipBoard = this.tempBoard;
    }

    public getClipBoard(): string {
        return this.clipBoard;
    }

    /**
     * actual routine for copy 
     */
    public actionCopy() {
        this.setClipBoard();
        $('#contextMenu').hide();
    }

    /**
     * actual routine for paste
     * @param project 
     */
    public actionPaste(project: any) {
        var selected_node = _jm.get_selected_node(); // select node when mouseover
        var topic = this.getClipBoard();
        _jm.add_node(selected_node, Date.now(), topic, '', '');
        project.setProjectStatus('edited');
        $('#contextMenu').hide();
    }

    /**
     * open the pdf based on selected node using pdfjs viewer
     * @param directory 
     */
    public actionOpenPdf(directory: string) {
        var selected_node = _jm.get_selected_node(); // select node when mouseover
        var pdfViewer: string = "./build/pdf.js/web/viewer.html";
        var fileName: string = null;
        var page: string = null;
        if ((selected_node.pdfid != null) && (selected_node.pdfid != undefined)) { fileName = "?file=" + selected_node.pdfid; page = "#page=" + selected_node.index; }
        else {
            var id_temp = selected_node.id;
            var temp_element = gui.findNodeByAttribute("id", id_temp);
            var temp_html = temp_element.outerHTML;
            fileName = temp_html.substring(temp_html.indexOf("?file="), temp_html.indexOf("target="));
            page = null;
        }

        window.open(pdfViewer + fileName + page, "_blank", "toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=1000, height=1000");
        $('#contextMenu').hide();
    }

    /**
     * open the pdf based on selected node using user defined pdf viewer
     * @param directory 
     */
    public actionOpenPdfUserDefine(directory: string) {
        var selected_node = _jm.get_selected_node();
        const { shell } = require('electron');

        var fileName: string = null;
        if ((selected_node.pdfid != null) && (selected_node.pdfid != undefined)) { fileName = selected_node.pdfid }
        else {
            var id_temp = selected_node.id;
            var temp_element = gui.findNodeByAttribute("id", id_temp);
            var temp_html = temp_element.outerHTML;
            fileName = temp_html.substring(temp_html.indexOf("pdfid=") + 7, temp_html.indexOf("style=") - 2);
        }
        shell.openItem(fileName);
        $('#contextMenu').hide();
    }

    /**
     * actual cancel routine
     */
    public actionCancel() {
        $('#contextMenu').hide();
    }

    /**
     * actual delete node routine
     */
    public actionDelete() {
        var selected_node = _jm.get_selected_node();
        var selected_id = selected_node.id;
        if (!selected_id) { gui.windowAlert('please select a node first.'); return; }
       
        _jm.remove_node(selected_id);
        project.setTempSaveProject("chgProject");
        $('#contextMenu').hide();
    }
}

/**
 * All Operations related to the Menu GUI
 */
class MindmapMenu extends Gui {
    private jsMindObject: any;
    private fileTypeSave: string;

    constructor(jsMindObject) {
        super();
        this.jsMindObject = jsMindObject;
    }

    /**
     * saving the state of filetype (.jm or .mm)
     * @param input 
     */
    public setFileTypeSave(input: string) {
        this.fileTypeSave = input;
    }

    /**
     * getting the state of filetype
     */
    public getFileTypeSave(): string {
        return this.fileTypeSave;
    }

    /**
     * setting a new mindmap with only root file
     * @param project 
     * @param rootName 
     */
    public newMap(project: any, rootName: string) {
        var mindmap = {
            "meta": {
                "name": "jsMind",
                "version": "0.2"
            },
            "format": "node_tree",
            "data": { "id": "root", "topic": rootName, "children": [] }
        };
        this.jsMindObject.show(mindmap);
        (<HTMLInputElement>document.querySelector('#mindmap-chooser')).value = '';// Reset the file selector
        if ((project != null) || (project != undefined)) { project.setProjectStatus('edited'); }
    }

    // loading State of JsMind which will be implemented into .jm or .mm
    public loadFile(fileType: string): string {
        var mind_data: any;
        var mind_object = this.getJsMindData();

        this.setFileTypeSave(fileType);

        if (fileType === 'jm') {
            mind_data = mind_object.get_data();
        } else {
            mind_data = mind_object.get_data('freemind');
        }
        var mind_str = (fileType === 'jm') ? jsMind.util.json.json2string(mind_data) : mind_data.data;

        return mind_str;
    }

    /**
     * Saving .mm or .jm file implementation
     */
    public saveFile(fileType: string, mind_str): string {
        // Saving State into Project
        project.setProjectSavedFileLocation(path.join(project.getProjectLocation(), project.getProjectName()) + "." + fileType);
        project.setSaveProject();
        project.setProjectStatus('noedit');
        util.writeAnyTypeFile(project.getProjectLocation(), mind_str, project.getProjectName(), fileType);

        return (path.join(project.getProjectLocation(), project.getProjectName()) + "." + fileType)
    }

    /**
     * get data from JsMind
     */
    public getJsMindData(): any {
        var mindmapData: any;
        mindmapData = this.jsMindObject;
        return mindmapData;
    }

    /**
     * selecting a file from open mind map
     */
    public selectFile() {
        var file_input = document.getElementById('mindmap-chooser');
        file_input.click();
    }

    /**
     * set listener to the open mindmap
     */
    public setOpenFileListener() {
        var self = this;
        var mindMapChooser = <HTMLInputElement>document.getElementById('mindmap-chooser');

        mindMapChooser.addEventListener('change', function (event) {
            var files: FileList = mindMapChooser.files;
            if (files.length <= 0) {
                gui.windowAlert('please choose a file first')
            }

            var file_data = files[0];
            if (/.*\.mm$/.test(file_data.name)) {
                jsMind.util.file.read(file_data, function (freemind_data, freemind_name) {
                    self.loadFileJsMind(freemind_data, "mm", freemind_name);
                });
            } else {
                jsMind.util.file.read(file_data, function (jsmind_data, jsmind_name) {
                    self.loadFileJsMind(jsmind_data, "jm", jsmind_name);
                });
            }

        });
    }

    /**
     *  loading all jsmind contents and view it into GUI
     * @param content 
     * @param type 
     * @param freemind_name 
     */
    public loadFileJsMind(content: any, type: string, freemind_name: any): any {
        if (type == "mm") {
            var freemind_data = content;
            if (freemind_data) {
                var mind_name = freemind_name.substring(0, freemind_name.length - 3);
                var mind = {
                    "meta": {
                        "name": mind_name,
                        "author": "user@gmail.com",
                        "version": "1.0.1"
                    },
                    "format": "freemind",
                    "data": freemind_data
                };
                _jm.show(mind);
            } else {
                alert('The selected file is not supported');
            }
        } else {
            var jsmind_data = content;
            mind = jsMind.util.json.string2json(jsmind_data);
            if (!!mind) {
                _jm.show(mind);
            } else {
                alert('The selected file is not supported');
            }
        }

        return mind;
    }
}

/**
 * For the creation of the side bar GUI
 */
class GuiSideBar extends Gui {

    private basicHtmlTitle: any;
    private basicHtmlContent: any;

    /**
     * Initilize the Sidebar for the first time or when Refresh
     * @param data 
     * @param directory 
     */
    public setGuiInit(data: string, directory: string) {
        $("#loading-data").remove();
        $("#drag").remove();

        var util = new Utils();

        // Parse JSON File
        var objekt = util.parseJsonFile(data);
        var titleFile: any = null;

        for (var i = 0; i < objekt.length; i++) {
            var tempObject = objekt[i];
            titleFile = this.setDynamicHtmlTitle(util, tempObject["filename"], tempObject["filename"])
        }

        $(titleFile).appendTo("#annotation-group");

        this.setDynamicHtml(objekt, "init", directory);

    }

    /**
     * Adding GUI on SideBar when refreshAnnotation is done
     * @param object 
     * @param directory 
     */
    public setGuiOnAppend(object: any, directory: string) {
        this.setDynamicHtml(object, "append", directory);
    }

    /**
     *Clear the side bar annotation tab
     */
    public resetSidebarAnnotation() {
        $("#annotation-group").empty();
    }

    /**
    * check if the SideBar Nodes have existed
    * if no then do refresh
    * if yes then do refreshAnnotation
    */
    public checkSideBar(): boolean {
        var isSideBarExist: boolean = false;
        var nodes: any = $('.drag').get();

        if (nodes.length != 0) {
            isSideBarExist = true;
        }

        return isSideBarExist;
    }

    /**
     * Is used for searching the annotation using a form and button search
     * @param directory 
     */
    public searchAnnotation(directory: string) {
        var keyword: string = (<HTMLInputElement>document.getElementById("annotSearch")).value;
        if (keyword == "") {
            this.resetSidebarAnnotation();
            programCaller("refreshAll");
        } else {
            var listAnnotation: any = document.querySelectorAll("#annotation-group");
            var list: any = listAnnotation[0].children;
            var nodeObject: NodesObject = null;
            var temp: any = [];
            for (var i = 0; i < listAnnotation[0].children.length; i++) {
                var value = listAnnotation[0].children[i].innerHTML;
                if (value.toLowerCase().includes(keyword.toLowerCase()) == true) {
                    temp.push({
                        filename: listAnnotation[0].children[i].getAttribute("filename"),
                        id: listAnnotation[0].children[i].id,
                        topic: value,
                        subtype: "",
                        title: "",
                        pagenumber: listAnnotation[0].children[i].value
                    });
                }
            }

            // Set The GUI based on selected annotation
            this.resetSidebarAnnotation();
            this.setGuiInit(util.setJsonFile(temp), directory);
        }
    }

    /**
     * Set Treeview in sidebar project tab based on input data in JSON Format (root.json)
     * @param input 
     */

    public openTreeView(input: string) {
        $('#tree').treeview({ data: input });
    }

    /**
     * Set listener to the treeview (when selected or unselected mode)
     */
    public setTreeViewListener() {
        // when a project in tab project section treeview has been selected
        $('#tree').on('nodeSelected', function (event, data) {
            if (data.href == undefined) {
                if (project.getProjectName() == data.text) {
                    // do nothing
                } else {
                    project.openProjectFromTreeView(data.text);
                }
            }
        });
    }

    /**
     * Clear Treeview in sidebar project tab
     */
    public resetTreeView() {
        $('#tree').treeview({ data: "" });
    }

    /**
    * Create bootstrap treeview file & populate file from all pdf lists
    * @param projectName 
    * @param projectLoc 
    * @param listFiles 
    */
    public setTreeView(projectName: string, projectLoc: string, listFiles: string[]) {
        var itemDirProject: any = [];
        var tempNodeName: any = [];

        // populate the JSON data for the new opened treeview
        for (var j = 0; j < listFiles.length; j++) {
            tempNodeName.push({
                text: listFiles[j],
                icon: "glyphicon glyphicon-file",
                href: path.join(projectLoc, listFiles[j])
            });
        }

        itemDirProject.push({
            text: projectName,
            state: { selected: true },
            nodes: tempNodeName
        });

        var resultDir: string = util.setJsonFile(itemDirProject);
        var currentDir: string = project.getProjectTreeView();
        var statusExist: boolean = false;

        /**
         * Select and unselect the project automation process
         */
        try {
            if ((currentDir != null) && (currentDir != undefined) && (currentDir != "")) {
                var currentDirObject = JSON.parse(currentDir);
                for (var x = 0; x < currentDirObject.length; x++) {
                    currentDirObject[x].state.selected = false;
                }
                currentDir = JSON.stringify(currentDirObject);
            }
        } catch (e) {
            gui.windowAlert(e);
        }

        /**
         * check whether the project has exist or not
         */
        try {
            if ((currentDir != null) && (currentDir != undefined) && (currentDir != "") && (resultDir != null) && (resultDir != undefined) && (resultDir != "")) {
                var currentDirObject = JSON.parse(currentDir);
                var resultDirObject = JSON.parse(resultDir);

                for (var x = 0; x < currentDirObject.length; x++) {
                    if (currentDirObject[x].text == resultDirObject[0].text) {

                        // set all state to false
                        for (var p = 0; p < currentDirObject.length; p++) {
                            currentDirObject[p].state.selected = false;
                        }

                        currentDirObject[x].state.selected = true;
                        currentDir = JSON.stringify(currentDirObject);
                        this.openTreeView(currentDir);
                        this.setTreeViewListener();
                        statusExist = true;

                        // stop next sequence and return to caller
                        return;
                    }
                }
            }
        } catch (e) {
            gui.windowAlert(e);
        }

        // append the JSON if there is still current directory exist
        if ((currentDir != null) && (currentDir != "") && (currentDir != undefined)) {
            resultDir = util.concatJsonFiles(currentDir);
        }

        /**
         * the rest operations after opening new treeview
         */
        this.openTreeView(resultDir);
        // set listener for tree view changes
        this.setTreeViewListener();

        listPdf.setListPdfFile(listFiles);
        listPdf.setLastModDate(listPdf.getModDateFs(util, project.getProjectSavedPdfLocation(), listFiles));
        project.setProjectTreeView(resultDir);
    }

    /**
     * recreate the treeview after a project is being closed
     */
    public setReCreateTreeView(): any {
        try {
            var tempTreeView: any = JSON.parse(project.getProjectTreeView());
        } catch (e) {
            alert(e);
        }

        var idx: number = gui.getJsMindOpenProject();
        if (idx > 0) {
            var tempOpenProjectName: string = gui.getMindProjectName(idx);
            var newTreeViewList: any = new Array();
            var j = 0;
            for (var i = 1; i <= tempTreeView.length; i++) {
                if (tempTreeView[i - 1].text != tempOpenProjectName) {
                    newTreeViewList[j] = tempTreeView[i - 1];
                    j++;
                }
            }

            var tempTreeViewString = JSON.stringify(newTreeViewList);
            this.openTreeView(tempTreeViewString);
            project.setProjectTreeView(tempTreeViewString);
        } else {
            newTreeViewList = new Array();
        }
        return newTreeViewList;
    }


    /**
     * Set the dynamic HTML for the input of the object
     * @param objekt 
     * @param mode 
     * @param directory 
     */
    private setDynamicHtml(objekt: NodesObject, mode: string, directory: string) {
        var node;
        for (var i = 0; i < objekt.length; i++) {
            var input = objekt[i];
            var annot = new Annotation(input["filename"], input["id"], input["topic"], input["subtype"], input["title"], input["pagenumber"])
            node = new Nodes(annot.getId(), annot.getTopic(), annot.getFileName(), annot.getPageNumber());
            // All annotations must exist in the Sidebar, whether hidden or visible
            if (!this.checkAnnotationExistInSidebar(node.getId())) {
                // If the annotation does not exist in JsMind then add it to sidebar
                this.setDynamicHtmlContent(node, "#annotation-group", "list-group-item drag", mode, directory);
            }
            // Based on whether the annotation exists in mindmap or not, toggle the visibility
            if (this.checkJsmindNode(node.getId())) {
                $('#' + node.getId()).removeClass('show');
                $('#' + node.getId()).addClass('hide');
            } else {
                $('#' + node.getId()).removeClass("hide");
                $('#' + node.getId()).addClass('show');
            }
        }

        this.setAnnotationTitleVisibility();
        this.setElementVisibility();
    }

    /**
     * Set the dynamic HTML for the title so called pdf name
     * @param util
     * @param id
     * @param fileName
     * @returns {string}
     */
    private setDynamicHtmlTitle(util, id: string, fileName: string): string {
        var pdfId = util.getHashFunction(id);
        var htmlContent = document.createElement("li");
        htmlContent.setAttribute("id", pdfId);
        htmlContent.setAttribute("name", "pdf-title");
        htmlContent.setAttribute("class", "pdf-title show");
        htmlContent.setAttribute("style", 'cursor: no-drop; background-color: #ccc; padding: 10px 18px; font-weight:bold');
        htmlContent.innerHTML = fileName;
        this.basicHtmlTitle = htmlContent;
        return this.basicHtmlTitle;
    }

    /**
     * real routine to set the dynamic HTML for the annotation contents
     * @param node 
     * @param appendToName 
     * @param className 
     * @param mode 
     * @param directory 
     */
    private setDynamicHtmlContent(node, appendToName: string, className: string, mode: string, directory: string) {
        var htmlContent = document.createElement("li");
        htmlContent.setAttribute("id", node.getId());
        htmlContent.setAttribute("name", "annotation");
        htmlContent.setAttribute("pagenumber", node.getPageNumber());
        htmlContent.setAttribute("filename", node.getFileName());
        htmlContent.setAttribute("parentid", util.getHashFunction(node.getFileName()));
        htmlContent.value = node.getPageNumber();
        htmlContent.innerHTML = node.getTopic();
        htmlContent.title = path.join(directory, node.getFileName());
        this.basicHtmlContent = htmlContent;

        if (mode == "init") {
            $(this.basicHtmlContent).appendTo(appendToName);
        } else {
            var temp = node.getFileName();
            var pdfId = util.getHashFunction(temp);
            $(this.basicHtmlContent).insertAfter('#' + pdfId);
        }

        $(this.basicHtmlContent).draggable(node.setDraggable());
        $(this.basicHtmlContent).droppable(node.setDroppable());
        document.getElementById(node.getId()).className += " " + className;
    }


    /**
     * setting the annotation-title visibility
     */
    public setAnnotationTitleVisibility() {
        // Update the annotation panel on section pdf-title on each MindMap addition event (if all annotations is in the JsMind, then hide pdf-title)
        var nodesTitle = $('.pdf-title').get();
        for (var j = 0; j < nodesTitle.length; j++) {
            $('#' + nodesTitle[j].id).removeClass("hide");
            $('#' + nodesTitle[j].id).addClass("show");
            var results = guiSideBar.findGuiAnnotationByAttribute('annotation', 'parentid', nodesTitle[j].id);
            if ((results != undefined) && (results != null)) {
                var count: number = 0;
                for (var x = 0; x < results.length; x++) {
                    if (results[x].getAttribute('class').indexOf('hide') != -1) {
                        count++;
                    }
                }
                if (results.length == count) {
                    $('#' + nodesTitle[j].id).removeClass("show");
                    $('#' + nodesTitle[j].id).addClass("hide");
                }
            }
        }
    }

    /**
     *Check whether the nodes already in the jsmind tree in the right side or not
     * @param id
     * @returns {boolean}
     */
    private checkJsmindNode(id: string): boolean {
        return !!_jm.mind.nodes[id];
    }

    /**
     *Check whether the nodes already in the Annotations List in the left side or not
     * @param id
     * @returns {boolean}
     */
    public checkAnnotationExistInSidebar(id: string): boolean {
        // Get the IDs of all annotations in the sidebar
        var nodesInSidebar = $('.list-group-item').get().map(function (eachNode) {
            return eachNode.id;
        });
        return (nodesInSidebar.indexOf(id) != -1);
    }

    /**
     * to find the annotation in guisidebar by its attribute
     * @param attr 
     * @param val 
     */
    public findGuiAnnotationByAttribute(name: string, attr: any, val: string): any {
        var All: any = document.getElementsByName(name);
        var tempResult = [];

        for (var i = 0; i < All.length; i++) {
            if (All[i].getAttribute(attr) == val) {
                tempResult.push(All[i]);
            }
        }

        return tempResult;
    }

}

/**
 * All operations with Project
 */
class Project {
    private projectName: string; // to save the name of a project
    private projectLocation: string; // to save the folder location of a project
    private projectPdfList: string[]; // to save the pdf filename lists of a project
    private projectStatus: string; // to save whether the project has been edited or not
    private projectSavedFileLocation: string // to save the location of .mm or .jm file
    private projectSavedPDFLocation: string // to save the location of PDFs file
    private projectTreeView: string // to save treeview JSON file
    private projectPromises: any[] // to save new Project promises (for saving home folder & pdfs)

    constructor() {
        this.projectPdfList = new Array();
        this.projectPromises = new Array();
        this.projectStatus = "noedit";
        this.projectTreeView = "";
        this.projectName = "";
        this.projectLocation = "";
        this.projectSavedFileLocation = "";
        this.projectSavedPDFLocation = "";
    }

    /**
     * to save the project name
     * @param input 
     */
    public setProjectName(input: string) {
        this.projectName = input;
    }
    /**
     * to get the project name
     */
    public getProjectName(): string {
        return this.projectName;
    }
    /**
     * to save the project location
     * @param input 
     */
    public setProjectLocation(input: string) {
        input = path.normalize(input);
        this.projectLocation = input;
    }
    /**
     * to get the project location
     */
    public getProjectLocation(): string {
        return this.projectLocation;
    }
    /**
     * to save list of pdf files of a project
     * @param input 
     */
    public setProjectPdfList(input: string[]) {
        for (var i = 0; i < input.length; i++) {
            this.projectPdfList[i] = input[i];
        }
    }
    /**
     * to get the list of pdf files of a project
     */
    public getProjectPdfList(): string[] {
        return this.projectPdfList;
    }

    /**
     * to set the status of the project (edited or noedit)
     * @param input 
     */
    public setProjectStatus(input: string) {
        this.projectStatus = input;
    }

    /**
     * to get the status of the project
     */
    public getProjectStatus(): string {
        return this.projectStatus;
    }

    /**
     * to save the file (.mm or .jm) location
     */
    public setProjectSavedFileLocation(input: string) {
        input = path.normalize(input);
        this.projectSavedFileLocation = input;
    }

    /**
     * to get the file (.mm or .jm) location
     */
    public getProjectSavedFileLocation(): string {
        return this.projectSavedFileLocation;
    }

    /**
     * to save the PDFs file location
     * @param input 
     */
    public setProjectSavedPdfLocation(input: string) {
        input = path.normalize(input);
        this.projectSavedPDFLocation = input;
    }

    /**
     * to get the PDFs file location
     */
    public getProjectSavedPdfLocation(): string {
        return this.projectSavedPDFLocation;
    }

    /**
     * to save the treeview JSON file
     * @param input 
     */
    public setProjectTreeView(input: string) {
        this.projectTreeView = input;
    }

    /**
     * to get the treeview JSON file
     */
    public getProjectTreeView(): string {
        return this.projectTreeView;
    }

    /**
     * to save some promises in the new project prompter which are used in a project
     * @param input 
     */
    public setProjectPromises(input: any[]) {
        for (var i = 0; i < input.length; i++) {
            this.projectPromises[i] = input[i];
        }
    }

    /**
     * to get the saved promises in the new project prompter which are used in a project
     */
    public getProjectPromises(): any[] {
        return this.projectPromises;
    }

    /**
     * to validate & check the requirements for new project
     */
    public checkNewProject(): boolean {
        var checkStatus: boolean = true;
        var parm1: string = (<HTMLInputElement>document.getElementById("projectName")).value;
        var parm2: string = (<HTMLInputElement>document.getElementById("projectPdf")).value;
        var parm3: string = (<HTMLInputElement>document.getElementById("projectHome")).value;

        $("p.ProjName").attr("hidden", true);
        $("p.ProjPdf").attr("hidden", true);
        $("p.ProjHome").attr("hidden", true);

        if (parm1 == "") {
            checkStatus = false;
            $("p.ProjName").attr("hidden", false);
        }

        if (parm2 == "") {
            checkStatus = false;
            $("p.ProjPdf").attr("hidden", false);
        }

        if (parm3 == "") {
            checkStatus = false;
            $("p.ProjHome").attr("hidden", false);
        }

        if (checkStatus == false) {
            gui.setEffectShaking("myModal");
        } else {
            $("#myModal").modal('hide');
        }

        return checkStatus;
    }

    /**
     * when new project modal is opened
     */
    public setNewProjectModal() {
        gui.windowNewProject();
        this.setNewProjectListener();
    }

    /**
     * Listener to the New Project
     */
    private setNewProjectListener() {
        var self = this;
        var pathName: string = "";
        var dirProcess: any = null;
        var promises: any[] = new Array();

        var promise = new Promise(function (resolve, reject) {
            $("#pdf-chooser").on("change", function (result) {
                var lastResult: any[] = new Array;
                var listFiles: string = "";
                pathName = result.target.files[0].path;
                listPdf.setDirectory(pathName);
                dirProcess = listPdf.getPdfFromFs();
                lastResult.push(pathName);

                Promise.all([dirProcess]).then(function (result) {
                    var temp = result[0];
                    var arrayList: any = [];

                    for (var i = 0; i < temp.length; i++) {
                        if (i == 0) {
                            listFiles += temp[i];
                        } else {
                            listFiles += ", " + temp[i];
                        }
                        arrayList[i] = temp[i];
                    }

                    (<HTMLInputElement>document.getElementById("projectPdf")).value = listFiles;
                    lastResult.push(arrayList);
                    resolve(lastResult);
                });
            });

        });

        promises.push(promise);

        var promise2 = new Promise(function (resolve, reject) {
            $("#folder-chooser").on("change", function (result) {
                pathName = result.target.files[0].path;
                (<HTMLInputElement>document.getElementById("projectHome")).value = pathName;
                resolve(pathName);
            });
        });

        Promise.all([promise, promise2]).then(function (result) {
            var tempResult: any = result[0];
            var tempResult2: any = result[1];
            self.projectPdfList = new Array();
            self.setProjectSavedPdfLocation(tempResult[0]);
            self.setProjectPdfList(tempResult[1]);
            self.setProjectLocation(tempResult2);
        });

        promises.push(promise2);

        this.setProjectPromises(promises);
    }

    /**
     * When save button is pressed in new project modal
     */
    public createNewProject() {
        var promises: any[] = this.getProjectPromises();
        var promise = promises[0];
        var promise2 = promises[1];
        var self = this;

        Promise.all([promise, promise2]).then(function (result) {
            self.setProjectName((<HTMLInputElement>document.getElementById("projectName")).value);
            self.saveProject(util, self.getProjectName(), self.getProjectLocation(), self.getProjectPdfList(), "", "");
            self.setProjectStatus("edited");
            mindmapMenu.newMap(self, self.getProjectName());
            guiSideBar.setTreeView(self.getProjectName(), self.getProjectLocation(), self.getProjectPdfList());
            self.setTempSaveProject("newProject");
            programCaller('refreshAll');
            $("#pdf-chooser").val("");
            $("#folder-chooser").val("");
        });
    }

    /**
     * the routine called everywhere in order to save project
     */
    public setSaveProject(): string {
        var msg: string = this.getProjectLocation();
        var result = this.saveProject(util, this.getProjectName(), this.getProjectLocation(), this.getProjectPdfList(), this.getProjectSavedFileLocation(), this.getProjectSavedPdfLocation());
        util.writeAnyTypeFile(this.getProjectLocation(), result, this.getProjectName(), "json");
        return msg;
    }

    /**
     * real routine used for saving project and creating file (.json) in local
     * @param util 
     * @param projectName 
     * @param projectLoc 
     * @param listFiles 
     * @param projectSavedFile 
     * @param projectSavedPdf 
     */
    private saveProject(util: any, projectName: string, projectLoc: string, listFiles: string[], projectSavedFile: string, projectSavedPdf: string): string {
        var project: any = [];
        var annotation: any = [];
        var childnode: any = [];
        var itemResult: any = [];
        var nodes: any = [];
        var counter: number = 0;

        // to convert JSON from Object to array file
        var jsMindData: any = mindmapMenu.getJsMindData();
        var nodesJSON = jsMindData.mind.nodes;
        for (var x in nodesJSON) {
            nodes.push(nodesJSON[x]);
        }

        // to populate the annotation section from .JSON file
        for (var i = 0; i < nodes.length; i++) {
            var temp = nodes[i];
            childnode = [];
            if (temp.children.length == 0) {
                childnode.push("");
            } else {
                for (var j = 0; j < temp.children.length; j++) {
                    childnode.push([
                        temp.children[j].id
                    ]);
                }

            }
            annotation.push(this.setArrayAnnotation(childnode, nodes, i));
        }

        // to populate the project section from .JSON file
        project.push({
            name: projectName,
            location: projectLoc,
            savedfile: projectSavedFile,
            savedPdf: projectSavedPdf,
            files: listFiles
        });

        // build the JSON file with combine of project and annotation
        itemResult.push({
            project,
            annotation
        });
        var result: string = util.setJsonFile(itemResult);
        this.addToRecentProjects(projectName, path.join(projectLoc, projectName) + ".json");
        gui.loadRecentProjects();
        return result;
    }

    /**
     * routine for setting the array of annotations
     * @param childnode 
     * @param nodes 
     * @param i 
     */
    private setArrayAnnotation(childnode: any, nodes: any, i: any): any {
        var annotation: any = [];
        annotation.push({
            id: nodes[i].id,
            text: nodes[i].topic,
            childnode,
            file: nodes[i].pdfid,
            page: nodes[i].index,
            placed: nodes[i].expanded
        });
        return annotation;
    }

    /**
     *  to save temporary project for Multiple Project
     * @param param 
     */
    public setTempSaveProject(param: string) {

        switch (param) {

            // when there is a change in the project, then save the last edited state of the project
            case "chgProject":
                var projectState = this.saveProject(util, this.getProjectName(), this.getProjectLocation(), this.getProjectPdfList(), this.getProjectSavedFileLocation(), this.getProjectSavedPdfLocation());
                var x = gui.getJsMindProjectNameState(this.getProjectName());

                gui.setJsMindProjectState(projectState, x);
                var jsMindState = mindmapMenu.loadFile("mm");
                gui.setJsMindSavedState(jsMindState, x);
                var jsMindStatusState = this.getProjectStatus();
                gui.setJsMindStatusState(jsMindStatusState, x);
                break;

            // when opening the project, then save the project before state before opening a new one
            case "openProject":
                var projectState = this.saveProject(util, this.getProjectName(), this.getProjectLocation(), this.getProjectPdfList(), this.getProjectSavedFileLocation(), this.getProjectSavedPdfLocation());
                var x = gui.getCountProjectStatesNumber();
                gui.setJsMindProjectNameState(this.getProjectName(), x);

                gui.setJsMindProjectState(projectState, x);
                var jsMindState = mindmapMenu.loadFile("mm");
                gui.setJsMindSavedState(jsMindState, x);
                var jsMindStatusState = this.getProjectStatus();
                gui.setJsMindStatusState(jsMindStatusState, x);
                break;

            // when new project, save the last state of the before project (if any) and do new one
            case "newProject":
                var projectState = this.saveProject(util, this.getProjectName(), this.getProjectLocation(), this.getProjectPdfList(), this.getProjectSavedFileLocation(), this.getProjectSavedPdfLocation());
                var x = gui.getCountProjectStatesNumber();
                gui.setJsMindProjectNameState(this.getProjectName(), x);

                gui.setJsMindProjectState(projectState, x);
                var jsMindState = mindmapMenu.loadFile("mm");
                gui.setJsMindSavedState(jsMindState, x);
                var jsMindStatusState = this.getProjectStatus();
                gui.setJsMindStatusState(jsMindStatusState, x);
                break;
        }

    }

    /**
     * The projects.json format looks like:
     * {
     *  projectName: 'name',
     *  projectFilePath: '<directory>/project.json',
     * } 
     * @param projectName 
     * @param projectFilePath 
     */
    public addToRecentProjects(projectName: string, projectFilePath: string) {
        var data;
        var files;
        var fs = require('fs');
        try {
            data = fs.readFileSync('./projects.json');
        } catch (e) {
            fs.writeFileSync('./projects.json', '[]');
            data = '[]';
        }
        var recentProjects = JSON.parse(data);
        // Prevent duplicate entries during recent projects tab
        var alreadyExists = recentProjects.filter(function (e) { return e.projectFilePath == projectFilePath }).length > 0;
        if (alreadyExists) { return; }
        recentProjects.push({ projectName, projectFilePath });
        fs.writeFileSync('./projects.json', JSON.stringify(recentProjects));
    }

    /**
     * routine to open the project in the tab of recent projects
     * @param projectFilePath 
     */
    public openRecentProject(projectFilePath: string) {
        var self = this;
        var fs = require('fs');
        fs.readFile(projectFilePath, function (err, data) {
            if (err) { return console.error(err); }
            self.openProject(data, self, null, null);
            guiSideBar.setTreeView(self.getProjectName(), self.getProjectLocation(), self.getProjectPdfList());
        });
    }


    /**
     * when open project is pressed
     */
    public setOpenProjectModal() {
        gui.windowOpenProject();
        this.setOpenProjectListener(this);
    }

    /**
     * Listener of the open project
     * @param self 
     */
    private setOpenProjectListener(self: any) {
        $("#file-chooser").on("change", function (result) {
            var fs = require("fs");
            var filePath = result.target.files[0].path;
            console.log(result);
            fs.readFile(filePath, function (err, data) {
                if (err) { return console.error(err); }
                self.clrProjectState();
                self.openProject(data, self, "listener", null);
                guiSideBar.setTreeView(self.getProjectName(), self.getProjectLocation(), self.getProjectPdfList());
            });
            $("#file-chooser").val("");
        });
    }

    /**
     * Open Project Main Program
     * @param data 
     * @param self 
     * @param mode 
     * @param fileContent 
     */
    public openProject(data: string, self: any, mode: string, fileContent: string) {
        var dataObject: object = util.parseJsonFile(data);
        self.setProjectName(dataObject[0].project[0].name);
        self.setProjectLocation(dataObject[0].project[0].location);
        self.setProjectPdfList(dataObject[0].project[0].files);
        self.setProjectSavedFileLocation(dataObject[0].project[0].savedfile);
        self.setProjectSavedPdfLocation(dataObject[0].project[0].savedPdf);

        listPdf.listPdfFiles = new Array();
        listPdf.setDirectory(self.getProjectSavedPdfLocation());
        listPdf.setListPdfFile(self.getProjectPdfList());

        if ((fileContent != null) && (fileContent != undefined)) {
            // .mm file data is given from fileContent
            mindmapMenu.loadFileJsMind(fileContent, "mm", fileName + "." + "mm");
            gui.loadPdfButton(dataObject);

            if (mode == "listener") {
                self.setTempSaveProject("openProject");
            }

            programCaller('refreshAll');
        } else {
            // fetch data from .jm or .mm file
            var htmlContent: any = (<HTMLInputElement>document.getElementById('mindmap-chooser'));
            var fileName: string = self.getProjectName();

            // if there is no mindmap, savedFileLocation will be undefined 
            if (self.getProjectSavedFileLocation()) {
                var content = util.readAnyTypeFile(self.getProjectSavedFileLocation(), 'utf8');
            }

            Promise.all([content]).then(function (result) {
                if (self.getProjectSavedFileLocation()) {
                    if (self.getProjectSavedFileLocation().indexOf(".mm") == -1) {
                        // if file is not .mm
                        var type: string = "jm";
                    } else {
                        //if file is .mm
                        type = "mm";
                    }

                    mindmapMenu.loadFileJsMind(result, type, fileName + "." + type);

                    gui.loadPdfButton(dataObject);
                }

                if (mode == "listener") {
                    self.setTempSaveProject("openProject");
                    var idx: number = gui.getJsMindProjectNameState(self.getProjectName());
                    gui.setJsMindOpenProject(idx);
                }

                programCaller('refreshAll');
            });

        }


    }

    /**
     * Opening Project Using TreeView Event Handler (when select a project in the treeview or close project)
     * @param input 
     */
    public openProjectFromTreeView(input: string) {
        var idx: number = gui.getJsMindProjectNameState(input);
        if (idx > 0) {
            gui.setJsMindOpenProject(idx);
            // read from last state of the project
            var lastProjectState = gui.getJsMindProjectState(idx);
            var lastJsMindState = gui.getJsMindSavedState(idx);
            var lastJsMindStatusState = gui.getJsMindStatusState(idx);
            project.clrProjectState();
            project.openProject(lastProjectState, project, "chgProject", lastJsMindState);
            project.setProjectStatus(lastJsMindStatusState);
        } else {
            // read from existing project file .json
            var projFullPath: string = path.join(project.getProjectLocation(), input) + ".json";
            var content = util.readAnyTypeFile(projFullPath, "utf8");
            Promise.all([content]).then(function (result) {
                project.clrProjectState();
                project.openProject(result[0], project, "chgProject", null);
            })
        }
    }

    /**
      * When close project is pressed, recreate the treeview, set the opened project again and get the state of actual opened project
      * @param status
      */
    public setCloseProject(status: string) {

        if (status == "noedit") {
            // do nothing
        } else {
            var closeProjectStatus = gui.windowConfirmation("you are about to close project, save changes?");
            if (closeProjectStatus) {
                this.setSaveProject();
                if ((mindmapMenu.getFileTypeSave() != null)) {
                    var content = mindmapMenu.loadFile(mindmapMenu.getFileTypeSave());
                    var locationFile = mindmapMenu.saveFile(mindmapMenu.getFileTypeSave(), content);
                    gui.windowAlert("file is saved in" + " " + locationFile);
                } else {
                    gui.windowConfirmation('file has not been saved in .mm or .jm, save changes in .mm file instead?');
                    var content = mindmapMenu.loadFile("mm");
                    var locationFile = mindmapMenu.saveFile("mm", content);
                    gui.windowAlert("MM file is saved in" + " " + locationFile);
                }
            }
        }

        this.setProjectStatus("noedit");
        guiSideBar.resetTreeView();
        var newList = guiSideBar.setReCreateTreeView();
        guiSideBar.resetSidebarAnnotation();
        if (newList.length != 0) {
            gui.setReCreateState(newList);
            var tempProjectName: string = gui.getMindProjectName(gui.getJsMindOpenProject());
            this.openProjectFromTreeView(tempProjectName);
            guiSideBar.setTreeViewListener();
        } else {
            mindmapMenu.newMap(project, "Root");
            project.clrProjectState();
            listPdf.clrListPdfState();
        }
    }

    /**
     * to clear some of the project states
     */
    public clrProjectState() {
        this.projectPdfList = new Array();
        this.projectPromises = new Array();
        this.projectName = null;
        this.projectLocation = null;
        this.projectStatus = "noedit";
    }

}

// ========================================================= //
// Interface Section
// ========================================================= //

/**
 * The template for the DragObject
 */
interface DragObject {
    helper: string,
    containment: string,
    opacity: string,
    revert: string,
    appendTo: string,
    stop: (ev: Event, ui) => string
}
/**
 * Template for dropobject
 */
interface DropObject {
    drop: (ev: Event, ui) => string
}
/**
 *Tempate for nodeobject
 */
interface NodesObject extends Array<object> {
    filename: string,
    id: string;
    topic: string;
    subtype: string;
    title: string;
    pagenumber: number;
}

// ========================================================= //
// Function Section
// ========================================================= //

var node: any;
var dir: string;
var listPdf: any = new ListPdf(new Array, new Array, dir);
var listAnnotation: any = new ListAnnotations(dir);
var util: any = new Utils();
var contextMenu: any = new ContextMenu();
var mindmapMenu: MindmapMenu;
var gui: any = null;
var guiSideBar: any = null;
var project: any = null;
var pdf: any = null;

/**
 * Main program, it is also called from the HTML file
 * @param data
 */
function programCaller(data: any, param: any = '') {

    switch (data) {

        /**
         * For the first initilization for the program
         */
        case "init":

            // set initialize for node
            node = new Nodes("", "", "", 0);

            // set Initialize for Gui
            gui = new Gui();
            mindmapMenu = gui.setGuiInitialize();

            // set listener for JsMind changes
            gui.setJsmindListener();

            // Load recent projects list
            gui.loadRecentProjects();

            // go to these section when resize the window
            gui.windowResizeListener();

            // set initialize for Gui in sidebar
            guiSideBar = new GuiSideBar();

            // set Initialize for project
            project = new Project();

            // set Initialize for Pdf
            pdf = new Pdf();

            break;

        /**
         *When refresh pdf is pressed
         */
        case "refresh":

            /**
            * check if sidebar has been existed, if yes then do refreshAnnotation
            */
            var isSideBarExist: boolean = guiSideBar.checkSideBar();
            if (isSideBarExist) {
                programCaller("refreshAnnotation");
                break;
            }

            //get PDF's lists
            var pdfProcess = listPdf.getPdfFromFs();
            guiSideBar.resetSidebarAnnotation();

            // get annotation's lists
            Promise.all([pdfProcess]).then(function (response) {
                listPdf.setListPdfFile(response[0]);
                for (var i = 0; i < listPdf.getCount(); i++) {
                    var pdfPages = listPdf.getPdfPage(path.join(listPdf.getDirectory(), listPdf.getListPdfFile(i)), listPdf.getListPdfFile(i));
                    Promise.all([pdfPages, pdfProcess, i]).then(function (responsePages) {
                        var pdfAnnots = listAnnotation.getAnnotations(responsePages[0], listPdf.getListPdfFile(responsePages[2]));
                        Promise.all([pdfProcess, pdfPages, pdfAnnots]).then(function (responseResult) {
                            var resultJson: string = responseResult[2];
                            guiSideBar.setGuiInit(resultJson, listPdf.getDirectory());
                        })
                    })
                }

            })

            break;

        /**
         * When the refresh annotation is called
         */
        case "refreshAnnotation":
            // change has flag, saying if files changed or not.
            // change[1] list of changed pdfs
            // change[2] num of files changed
            var change: any = listPdf.chkDateChange(util, listPdf.getListPdf());
            var listChange: string[] = change[1];
            var numChange: number = change[2];
            if (change[0] == true) {
                for (var i = 0; i < numChange; i++) {
                    var pdfPages = listPdf.getPdfPage(path.join(project.getProjectSavedPdfLocation(), listChange[i]), listChange[i]);
                    Promise.all([pdfPages, i]).then(function (responsePages) {
                        var pdfAnnots = listAnnotation.getAnnotations(responsePages[0], listChange[responsePages[1]]);
                        Promise.all([pdfProcess, pdfPages, pdfAnnots]).then(function (responseResult) {
                            var newNodes: NodesObject = JSON.parse(responseResult[2]);
                            guiSideBar.setGuiOnAppend(newNodes, listPdf.getDirectory());
                        })
                    })
                }

            } else {
                gui.windowAlert("No Change in Annotation");
            }

            break;

        /**
         * refresh without consent of sidebar checking
         */
        case "refreshAll":
            //get PDF's lists
            var pdfProcess = listPdf.getPdfFromFs();
            guiSideBar.resetSidebarAnnotation();

            // get annotation's lists
            Promise.all([pdfProcess]).then(function (response) {
                listPdf.setListPdfFile(response[0]);
                for (var i = 0; i < listPdf.getCount(); i++) {
                    var pdfPages = listPdf.getPdfPage(path.join(listPdf.getDirectory(), listPdf.getListPdfFile(i)), listPdf.getListPdfFile(i));
                    Promise.all([pdfPages, pdfProcess, i]).then(function (responsePages) {
                        var pdfAnnots = listAnnotation.getAnnotations(responsePages[0], listPdf.getListPdfFile(responsePages[2]));
                        Promise.all([pdfProcess, pdfPages, pdfAnnots]).then(function (responseResult) {
                            var resultJson: string = responseResult[2];
                            guiSideBar.setGuiInit(resultJson, listPdf.getDirectory());
                        })
                    })
                }

            })

            break;

        case "copyMenu":
            contextMenu.actionCopy();
            break;
        case "pasteMenu":
            contextMenu.actionPaste(project);
            break;
        case "openPDFMenu":
            dir = listPdf.getDirectory();
            contextMenu.actionOpenPdf(dir);
            break;
        case "openPDFUserDefine":
            dir = listPdf.getDirectory();
            contextMenu.actionOpenPdfUserDefine(dir);
            break;
        case "cancelMenu":
            contextMenu.actionCancel();
            break;
        case "deleteMenu":
            contextMenu.actionDelete();
            break;

        case "newMindmap":
            mindmapMenu.newMap(project, "Root");
            break;
        case "openExisting":
            mindmapMenu.selectFile();
            break;
        case "saveFileMM":
            var content = mindmapMenu.loadFile("mm");
            var locationFile = mindmapMenu.saveFile("mm", content);
            gui.windowAlert("MM file is saved in" + " " + locationFile);
            break;
        case "saveFileJM":
            var content = mindmapMenu.loadFile("jm");
            var locationFile = mindmapMenu.saveFile("jm", content);
            gui.windowAlert("JM file is saved in" + " " + locationFile);
            break;

        case "searchAnnotation":
            //searching annotation based on a keyword
            guiSideBar.searchAnnotation(listPdf.getDirectory());
            break;
        case "newProjectModal":
            //set modal of the new project
            project.setNewProjectModal();
            break;
        case "openProjectModal":
            //set modal of the open project
            project.setOpenProjectModal();
            break;

        case "newProject":
            //set routine for new project (when save in new project is pressed)
            var newProjectStatus = project.checkNewProject();
            if (newProjectStatus) { project.createNewProject(); }
            break;
        case "closeProject":
            //set routine for close project
            var status = project.getProjectStatus();
            project.setCloseProject(status);

            break;
        case "saveProject":
            // set routine for save project
            var saveProjectStatus = gui.windowConfirmation("save changes?");
            if (saveProjectStatus) {
                var msg: string = project.setSaveProject();
                if ((mindmapMenu.getFileTypeSave() != null)) {
                    var content = mindmapMenu.loadFile(mindmapMenu.getFileTypeSave());
                    var locationFile = mindmapMenu.saveFile(mindmapMenu.getFileTypeSave(), content);
                }
                project.setProjectStatus('noedit');
                gui.windowAlert("project is saved in" + " " + msg);
            }
            break;
        case "openRecentProject":
            // set routine for recent project
            project.openRecentProject(param);
            break;

    }
}