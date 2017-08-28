declare var PDFJS:any;
declare var Promise:any;
declare var $:any;
declare var hex_sha1:any;
declare var require:any;

declare var hex_hmac_sha1:any;
declare var _jm: {get_selected_node: Function, select_node: Function, show: Function, add_node: Function, mind:{nodes:Function}, add_event_listener:Function, get_data:Function};
declare var jsMind:any;
declare var jmnodes:any;
declare var Buffer:any;

// ========================================================= //
// Class Section
// ========================================================= //


/**
 * Used to set the Node's parameters in sidebar 
 */
class Nodes {
	private id:string;
	private topic:string;
	private filename:string;
	private pagenumber:number;

    /**
     *
     * @param nodeId
     * @param nodeTopic
     */
	constructor(nodeId:string, nodeTopic:string, fileName:string, pagenumber:number) {
		this.id = nodeId;
		this.topic = nodeTopic;
		this.filename = fileName;
		this.pagenumber = pagenumber;
	}

    /**
     *
     * @param id
     */
    public setId(id:string) {
        this.id = id;
    }

    /**
     *
     * @returns {string}
     */
    public getId():string {
        return this.id;
    }

    /**
     *
     * @param topic
     */
    public setTopic(topic:string) {
        this.topic = topic;
    }

    /**
     *
     * @returns {string}
     */
    public getTopic():string {
        return this.topic;
    }

    /**
     *
     * @param filename
     */
    public setFileName(filename:string) {
        this.filename = filename;
    }

    /**
     *
     * @returns {string}
     */
    public getFileName():string {
        return this.filename;
    }

    /**
     *
     * @param pagenumber
     */
    public setPageNumber(pagenumber:number) {
        this.pagenumber = pagenumber;
    }

    /**
     *
     * @returns {number}
     */
    public getPageNumber():number {
        return this.pagenumber;
    }

    /**
     * set Node to be Draggable
     * @returns {DragObject}
     */
    public setDraggable():any {
		var temp:DragObject = {
			helper: 'clone',
			containment: 'frame',
			opacity: '0.5',
			revert: 'invalid',
			appendTo: 'body',
			stop: (ev:Event, ui):string => {
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
    public setDroppable():any {
        var temp:DropObject = {
            drop: (ev:Event, ui):string => {
			var selected_node = _jm.get_selected_node(); // select node when mouseover
			if(!selected_node){
				alert('please select a node first.');
				return;
			}
			var nodeid:string = ui.helper.prevObject[0].id;
			var topic:string = ui.helper.prevObject[0].innerHTML;
			var pdfid:string = ui.helper.prevObject[0].title;
            var pagenumber:number = ui.helper.prevObject[0].value;
            var directory:string = ui.helper.prevObject[0].href;
            var node:any = _jm.add_node(selected_node, nodeid, topic, "", pdfid, pagenumber);
            
            this.addPdfButton(pdfid, nodeid, pagenumber);

            project.setProjectStatus('edited');

		    }
        }

        return temp
    }

    /**
     * Find Node by its attribute (nodeid, topic, pdfid)
     * @param attr
     * @param val
     * @returns {any}
     */
    public findNodeByAttribute(attr:any, val:string):any {
        var All:any = document.getElementsByTagName('jmnode');

        for (var i = 0; i < All.length; i++)       {
            if (All[i].getAttribute(attr) == val) { return All[i]; }
        }

    }

    /**
    * adding PDF image link inside MindMap
    */
    private addPdfButton(pdfid:string, nodeid:string, pagenumber:number) {
       
            if((pdfid != "undefine") || (pdfid != null)) {

                var pdfViewer:string = "./build/pdf.js/web/viewer.html";
                //var fileName:string = "?File=" + "./" + pdfid;
                var fileName:string = "?file=" + pdfid;
                var pageNumber:string =  "#page=" + pagenumber.toString();
                var link:string = pdfViewer + fileName + pageNumber;

                var linkElement:any = document.createElement("a")
                linkElement.setAttribute("href", link);
                linkElement.setAttribute("target", "_blank");
                linkElement.setAttribute("style", "z-index:5; float:left; padding-right:5px");

                var imgElement:any = document.createElement("img");
                imgElement.setAttribute("id", nodeid);
                imgElement.setAttribute("src", "./build/img/pdf.png");

                linkElement.appendChild(imgElement);
                var selection = this.findNodeByAttribute("nodeid", nodeid);
                selection.appendChild(linkElement);
            }

    }

}

/**
 * List of PDF files in a folder
 */
class ListPdf {
    /**
     *  Saves PDF Files' Name, Last Modification and Folder Directory
     */
    private listPdfFiles:string[];
    private lastModDatePdfFiles:string[];
    private directory:string;

    /**
     *
     * @param listPdfFiles
     * @param lastModDatePdfFiles
     * @param directory
     */
    constructor(listPdfFiles:string[], lastModDatePdfFiles:string[], directory:string) {
        this.listPdfFiles = listPdfFiles;
        this.directory = directory;
        this.lastModDatePdfFiles = lastModDatePdfFiles;
    }

    /**
     * save list of pdf files' name with input of pdf file lists
     * @param list
     */
    public setListPdfFile(list:string[]) {
        for(var x = 0; x < list.length; x++) {
            this.listPdfFiles[x] = list[x];
        }
    }

    /**
     * fetch list of pdf files' names with giving input by array index from saved file list
     * @param idx
     * @returns {string}
     */
    public getListPdfFile(idx:number):string {
        return this.listPdfFiles[idx];
    }

    /**
     *fetch list of pdf files' all names from saved file list
     * @returns {string[]}
     */
    public getListPdf():string[] {
        return this.listPdfFiles;
    }

    /**
     *save list of pdf files' last modifiy date with input of last modifyed date lists
     * @param list
     */
    public setLastModDate(list:string[]) {
        for(var x = 0; x < list.length; x++) {
            this.lastModDatePdfFiles[x] = list[x];
        }
    }


    /**
     * extract the all last modifyed date information from the pdf file list
     * @param util
     * @param listFile
     * @returns {Array}
     */
    public getModDateFs(util, location:string, listFile:string[]) {
        var counter:number = 0;
        var modDateList = [];
        for (var x = 0; x < listFile.length; x++) {
            modDateList.push(util.getLastModFs(location, listFile[x]));
        }
        return modDateList;
    }

    /**
     * extract the all last modifyed date information from the pdf file list
     * @param util
     * @param listFile
     * @returns {Array}
     */
    public getModDate(util, listFile:string[]) {
        var counter:number = 0;
        var modDateList = [];
        for (var x = 0; x < listFile.length; x++) {
            modDateList.push(util.getLastMod(listFile[x]));
        }
        return modDateList;
    }

    /**
     *getting the just one last modifyed date information with respect to the index input
     * @param idx
     * @returns {string}
     */
    public getLastModDate(idx:number):string {
        return this.lastModDatePdfFiles[idx];
    }

    /**
     * get all last modified date from last modified date list
     * @returns {string[]}
     */
    public getLastMod():string[] {
        return this.lastModDatePdfFiles;
    }

    /**
     *Counting all the pdf files names inside the pdf files list
     * @returns {number}
     */
    public getCount():number {
        return this.listPdfFiles.length;
    }

    /**
     *subroutine for calling the get pdf private function
     * @returns {any}
     */
    public getPdf():any {
            var result = this.getPdfFiles(this.directory);
            return result;
    }

    public getPdfFromFs():any {
        var result = this.readPdfInDirectory(this.directory);
        return result;
    }

    /**
     * subroutine for calling get pdf file page
     * @param filePath
     * @param fileName
     * @returns {any}
     */
    public getPdfPage(filePath:string, fileName:string):any {
        var result = this.getPdfFilesPage(filePath, fileName);
        return result;
    }

    /**
     * save the directory that contains pdf files
     * @param dir
     */
    public setDirectory(dir:string) {
        this.directory = dir;
    }

    /**
     *get the saved directory
     * @returns {string}
     */
    public getDirectory():string {
        return this.directory;
    }

    /**
     *For comparing last modify date changes for updating the annotation
     * @param util
     * @param list
     * @returns {[boolean,string[],number]}
     */
    public chkDateChange(util, list:string[]):any {
        var newLastMod: string[] = [];
        var listChange: string[] = [];
        var stsChange: boolean = false;
        var indexChange:number = 0;
        for(var x = 0; x < list.length; x++) {
           newLastMod[x] = util.getLastMod(list[x]);
        }
        for(var x = 0; x < list.length; x++) {
            if(newLastMod[x] != this.lastModDatePdfFiles[x]) {
                stsChange = true;
                listChange[indexChange] = this.getListPdfFile(x);
                indexChange++;
            }
        }

        return [stsChange, listChange, indexChange];
    }

    /**
     * reading all pdf files in the specified directory
     * @param path 
     */
    private readPdfInDirectory(path:string):any {

        var process = new Promise(function(resolve, reject){
        var promises = [], promise;
        var fs = require("fs");
        fs.readdir(path, function(err, filenames){
            if(err) {
                alert("error reading directory");
                return;
            }
            filenames.forEach(function(filename){
                if(filename.indexOf(".pdf") != -1) {
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
     * This is the promise to get file names from the given directory in server
     * @param inputURL
     * @returns {any}
     */
    private getPdfFiles(inputURL:string):any {

        var process = new Promise(function(resolve, reject) {
            var promises = [], promise;
		    var xhr = $.ajax({
                //This will retrieve the contents of the folder if the folder is configured as 'browsable'
			    type:"GET",
                url: inputURL,
                success: function (data) {
                    //List all pdfs file names in the page
                    var counter:number = 0;
                    $(data).find("a:contains(" + ".pdf" + ")").each(function (success) {
				        promise = this.href.replace("http://", "").replace("localhost/", "").replace("scimappr/","docs/");
                        promises.push(promise);
				    });
                    resolve(promises);
                }
            });
        });

        return process;
    }

    /**
     * For each Pdf files get list of the pages that contain annotation
     * @param filePath
     * @param fileName
     * @returns {any}
     */
    private getPdfFilesPage(filePath:string, fileName:string):any {

       var processPage = new Promise(function(resolve, reject) {
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


}

/**
 *Details of annotation
 */
class Annotation {
    private fileName:string;
    private id:string;
	private topic:string;
	private subtype:string;
	private title:string;
	private pagenumber:number

    /**
     *
     * @param fileName
     * @param annotId
     * @param annotTopic
     * @param annotSubtype
     * @param annotTitle
     */
    constructor(fileName:string, annotId:string, annotTopic:string, annotSubtype:string, annotTitle:string, pagenumber:number) {
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
    public setFileName(fileName:string) {
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
    public setId(id:string) {
        this.id = id;
    }

    /**
     * Get the Id
     * @returns {string}
     */
    public getId():string {
        return this.id;
    }

    /**
     * Set the topic of the annotation
     * @param topic
     */
    public setTopic(topic:string) {
        this.topic = topic;
    }

    /**
     * Get the topic
     * @returns {string}
     */
    public getTopic():string {
        return this.topic;
    }

    /**
     * For the Pop up or Rectangle annotation type choose. We have only get popup option right now
     * But for the future implementation the Rectangle also can be choose
     * @param subtype
     */
    public setSubtype(subtype:string) {
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
    public setTitle(title:string) {
        this.title = title;
    }

    /**
     * Get the name of the creator of this annotations
     * @returns {string}
     */
    public getTitle():string {
        return this.title;
    }
    /**
     * Set the number of page that stores the Annotation
     * @param pagenumber 
     */
    public setPageNumber(pagenumber:number) {
        this.pagenumber = pagenumber;
    }
    /**
     * get the number of page that stores the Annotation
     */
    public getPageNumber():number {
        return this.pagenumber;
    }
ss
}

/**
 * Used to manipulate list of annotations
 */
class ListAnnotations extends ListPdf {

    private listPdfFilesAnnotations:string[];

    /**
     * set The constructor when class is called
     * @param input
     */
    constructor(input:string) {
        super(new Array, new Array, input);
        this.listPdfFilesAnnotations = new Array;
    }

    /**
     *After you get all the annotations you save it into listpdffilesanotations
     * @param input
     */
    public setListPdfFilesAnnotations(input:string[]) {
        this.listPdfFilesAnnotations = input;
    }

    /**
     * get listofannotations
     * @returns {string[]}
     */
    public getListPdfFilesAnnotations():string[] {
        return this.listPdfFilesAnnotations;
    }

    /**
     *routine to get annotations detail
     * @param pages
     * @param fileName
     * @returns {any}
     */
    public getAnnotations(pages, fileName:string):any{
        var result = this.getAnnotationsDetail(pages, fileName);
        return result;
    }

    /**
     *Prommise for getting annotation details for eachpages of the pdf
     * @param pages
     * @param fileName
     * @returns {any}
     */
    private getAnnotationsDetail(pages, fileName:string):any {
        var util = new Utils();
        var ignoreList = ['Link'];
        var items = [];
        var processAnot = new Promise(function(resolve, reject) {
            var pageNumber:number = 0;
            pages.forEach(annotations => {
                pageNumber++;
            annotations.forEach(function(annotation){
                        if((annotation.contents != "") && (annotation.subtype == "Popup")) {
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

    private jsonFile:string;
    private jsonObject:NodesObject;

    /**
     * Make a json file from anthing that is giving a list input to this method
     * @param input
     * @returns {string}
     */
    public setJsonFile(input:any[]):string {
        this.jsonFile = JSON.stringify(input);
        return this.jsonFile;
    }

    /**
     * The input is from only one section of the list, one by one
     * @param input
     * @returns {string}
     */
    public setJsonString(input:string):string {
        this.jsonFile = input;
        return this.jsonFile;
    }

    /**
     * Parsing json file to get the json object
     * @param input
     * @returns {NodesObject}
     */
    public parseJsonFile(input:string):NodesObject {
        this.jsonObject = JSON.parse(input);
        return this.jsonObject;
    }

    /**
     * Concat two json files into one json file
     * @param input
     * @returns {string}
     */
    public concatJsonFiles(input:string):string {
        var obj1 = JSON.parse(input);
        var obj2 = JSON.parse(this.jsonFile);
        var concatJson:string;
        var idxObj1 = obj1.length;
        for (var key in obj2) {
            idxObj1++;
            obj1[idxObj1] = obj2[key];
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
    public getHashFunction(input:string):string {
        var hash:string = hex_sha1("string");
		var hmac:string = hex_hmac_sha1("19", input);
		return hmac;
    }

    /**
     * The real method in order to get the last modified date from the given URL
     * @param url
     * @returns {any}
     */
    public getLastMod(url:string):any {
        var lastModifiedDate;
        var xhr = $.ajax({
            type: "GET",
            cache: false,
            async: false,
            url: url,
            success: function (data, status, res) {
                lastModifiedDate = res.getResponseHeader("Last-Modified");
            }
        });
        return lastModifiedDate;
    }

    /**
     * The real method in order to get the last modified date from the given URL (using fs)
     * @param url
     * @returns {any}
     */
    public getLastModFs(location:string, url:string):any {
        var lastModifiedDate:any;
        var fs = require('fs');

        fs.stat(location+"\\"+url, function(err, stats){
            lastModifiedDate = stats.mtime;
        });
        return lastModifiedDate;
    }

    /**
     * Comparison function in order to understand whether the pdf file is changed or not
     * @param lstMod1
     * @param lstMod2
     * @returns {boolean}
     */
    public getCompareLastMod(lstMod1:string, lstMod2:string):boolean {
        var stsResult = false;
        if(lstMod1 != lstMod2) {
            stsResult = true;
        }
        return stsResult;
    }

    public writeAnyTypeFile(path:string, input:string, name:string, type:string) {
        var fs = require('fs');
        var buffer = new Buffer(input); 

        fs.open(path+"\\"+name+type, 'w', function(err, fd) {
            if (err) {
                throw 'error opening file: ' + err;
            }

            fs.write(fd, buffer, 0, buffer.length, null, function(err) {
                if (err) throw 'error writing file: ' + err;
                fs.close(fd, function() {
                    console.log('file has been written to ' + path+"\\"+name+"."+type);
                })
            });
        });
    }

    public writeJsonFile(path:string, input:string, name:string) {
        var fs = require('fs');
        var buffer = new Buffer(input);

        fs.open(path+"\\"+name+".json", 'w', function(err, fd) {
            if (err) {
                throw 'error opening file: ' + err;
            }

            fs.write(fd, buffer, 0, buffer.length, null, function(err) {
                if (err) throw 'error writing file: ' + err;
                fs.close(fd, function() {
                    console.log('file has been written to ' + path+"\\"+name+".json");
                })
            });
        });
    }

    public appendJsonFile(path:string, input:string, name:string) {
         var fs = require('fs');
         var buffer = new Buffer(input);

         fs.open(path+"\\"+name+".json", 'w', function(err, fd) {
            if (err) {
                throw 'error opening file: ' + err;
            }

            fs.appendFile(path+"\\"+name+".json", buffer, function (err) {
                if (err) throw err;
                console.log('Data has been appended to ' + path+"\\"+name+".json");
            });
        });
    }

}
/**
 * Used when doing right click (to select some menus)
 */
class ContextMenu {

    private listData: string[];
    private tempBoard: string;
    private clipBoard: string;

    public setListData(input:string[]){
        this.listData = new Array;
        for(var i = 0; i < input.length; i++) {
            this.listData[i] = input[i];
        }
    }

    public getListData():string[] {
        return this.listData;
    }

    public setTempBoard(input:string) {
        this.tempBoard = input;
    }

    public setClipBoard() {
        this.clipBoard = this.tempBoard;
    }

    public getClipBoard():string {
        return this.clipBoard;
    }

    public actionCopy() {
        this.setClipBoard();
        $('#contextMenu').hide();
    }

    public actionPaste(project:any) {
        var selected_node = _jm.get_selected_node(); // select node when mouseover
        var topic = this.getClipBoard();
        _jm.add_node(selected_node, Date.now(), topic, '', '');
        project.setProjectStatus('edited');
        //var node = new Nodes(Date.now().toString(), topic, "", 0);
        //var tempNode = node.findNodeByAttribute("nodeid", node.getId());
        //tempNode.removeChild(tempNode.getElementsByTagName("a"));
        $('#contextMenu').hide();
    }

    public actionOpenPdf(directory:string) {
        var selected_node = _jm.get_selected_node(); // select node when mouseover
        var pdfViewer:string = "./build/pdf.js/web/viewer.html";
        var fileName:string = "?file=" + selected_node.pdfid;
        var page:string = "#page=" + selected_node.index;
        window.open(pdfViewer + fileName + page,"_blank","toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=1000, height=1000");
        $('#contextMenu').hide();
    }

    public actionOpenPdfUserDefine(directory:string) {
        var selected_node = _jm.get_selected_node();
        const {shell} = require('electron');

        var fileName:string = selected_node.pdfid;
        shell.openItem(fileName);
        $('#contextMenu').hide();
    }

    public actionCancel() {
        $('#contextMenu').hide();
    }
}

/**
 * All Operations related to the Menu GUI
 */
class MindmapMenu {
    private jsMindObject: any;
    private fileTypeSave:string;

    constructor(jsMindObject) {
        this.jsMindObject = jsMindObject;
    }

    public setFileTypeSave(input:string) {
        this.fileTypeSave = input;
    }

    public getFileTypeSave():string {
        return this.fileTypeSave;
    }

    public newMap(project:any) {
        var mindmap = {
            "meta":{
                "name":"jsMind",
                "version":"0.2"
            },
            "format":"node_tree",
            "data":{"id":"root","topic":"Root","children": [] }
        };
        this.jsMindObject.show(mindmap);
        (<HTMLInputElement> document.querySelector('#mindmap-chooser')).value = '';// Reset the file selector
        if((project != null) || (project != undefined)) {project.setProjectStatus('edited');}
    }

    public saveFile(fileType:string, project:any, util:any) {
        var mind_data:any;
        var mind_object = this.getJsMindData();

        this.setFileTypeSave(fileType);

        if (fileType === 'jm') {
            mind_data = mind_object.get_data();
        } else {
            mind_data = mind_object.get_data('freemind');
        }
        var mind_str = (fileType === 'jm') ? jsMind.util.json.json2string(mind_data) : mind_data.data;

        util.writeAnyTypeFile(project.getProjectLocation(), mind_str, project.getProjectName(), fileType);

        project.setProjectSavedFileLocation(project.getProjectLocation()+"\\"+project.getProjectName()+"."+fileType);
        project.setSaveProject(util);
    }

    public getJsMindData():any {
        var mindmapData:any;
        mindmapData = this.jsMindObject;
        return mindmapData;
    }
    
    public selectFile(project:any) {
        var file_input = document.getElementById('mindmap-chooser');
        file_input.click();
    }

    public setOpenFileListener(input:any) {
        var mindMapChooser = <HTMLInputElement>document.getElementById('mindmap-chooser');
        if((input != null) || input != undefined) {
            mindMapChooser = input;
        } 
        
        mindMapChooser.addEventListener('change', function (event) {
            var files:FileList = mindMapChooser.files;
            if (files.length <= 0) {
                alert('please choose a file first')
            }
            
            var file_data = files[0];
            if (/.*\.mm$/.test(file_data.name)) {
                jsMind.util.file.read(file_data, function (freemind_data, freemind_name){
                    if (freemind_data) {
                        var mind_name = freemind_name.substring(0, freemind_name.length-3);
                        var mind = {
                            "meta":{
                                "name": mind_name,
                                "version":"1.0.1"
                            },
                            "format":"freemind",
                            "data": freemind_data
                        };
                        _jm.show(mind);
                    } else {
                        alert('The selected file is not supported');
                    }
                });
            } else {
                jsMind.util.file.read(file_data,function (jsmind_data, jsmind_name) {
                    var mind = jsMind.util.json.string2json(jsmind_data);
                    if (!!mind) {
                        _jm.show(mind);
                    } else {
                        alert('The selected file is not supported');
                    }
                });
            }
        });
    }
}

/**
 * for GUI operations in general (except the gui sidebar)
 */
class Gui {

    public setGuiInitialize(mindmapMenu:any):any {
            //to set nodes as draggable and droppable
            $(".drag").draggable(node.setDraggable());
            $(".drop").droppable(node.setDroppable());

            // Render existing MindMap
            var options = {
                container:'jsmind_container',
                theme:'primary',
                editable:true
            }
            var mindmap = {
                "meta":{
                    "name":"jsMind",
                    "version":"0.2"
                },
                "format":"node_tree",
                "data":{"id":"root","topic":"Root","children": [] }
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
    public windowConfirmation(msg:string):boolean {
        var result:boolean = confirm(msg);
        return result;
    }

    /**
     * used for creating alert window
     * @param msg 
     */
    public windowAlert(msg:string) {
        alert(msg);
    }

    /**
     * used for creating new project window
     * @param listPdf 
     */
    public windowNewProject(listPdf:any):any {
         var pathName:string = "";
        var dirProcess:any = null;
        var listFiles:string = "";
        
        $("#myModal").modal();
        (<HTMLInputElement> document.getElementById("projectName")).value = "MyThesis";
        (<HTMLInputElement> document.getElementById("projectPdf")).value = "";
        
        var promise = new Promise(function(resolve, reject){
        $("input:file").on("change", function(result){  
            var lastResult:any[] = new Array;
            pathName = result.target.files[0].path;
            listPdf.setDirectory(pathName);
            dirProcess = listPdf.getPdfFromFs();
            lastResult.push(pathName);

            Promise.all([dirProcess]).then(function(result){
                var temp = result[0];
                var arrayList:any = [];

                for(var i = 0; i < temp.length; i++) {
                        if(i == 0) {
                            listFiles += temp[i];
                        } else {
                            listFiles += ", " + temp[i];
                        }
                        arrayList[i] = temp[i];
                }
                       
                (<HTMLInputElement> document.getElementById("projectPdf")).value = listFiles;
                lastResult.push(arrayList);
                resolve(lastResult);
            });
        });

        });

        return promise;

    }

     /**
     * Used for creating shaking effect into modal
     * @param id 
     */
    public effectShaking(id:string) {
        var element:any = document.getElementById(id);
        $(element).effect("shake");
    }

}

/**
 * For the creation of the side bar GUI
 */
class GuiSideBar extends Gui {

    private basicHtmlTitle:string;
    private basicHtmlContent:any;

    /**
     * Initilize the Sidebar for the first time or when Refresh
     * @param data
     */
    public setGuiInit(data:string, directory:string) {
        $("#loading-data").remove();
	    $("#drag").remove();

        var util = new Utils();

        // Parse JSON File
		var objekt = util.parseJsonFile(data);
		var titleFile = "";

        for(var i = 0; i < objekt.length; i++) {
            var tempObject = objekt[i];
            titleFile = this.setDynamicHtmlTitle(util, tempObject["filename"], tempObject["filename"])
        }

	    $(titleFile).appendTo("#annotation-group");

		this.setDynamicHtml(objekt, "init", directory);

    }

    /**
     * Adding GUI on SideBar when refreshAnnotation is done
     * @param object
     */
    public setGuiOnAppend(object:any, directory:string) {
        this.setDynamicHtml(object, "append", directory);
    }

    /**
     *Clear the side bar
     */
    public resetSidebar() {
        $("#annotation-group").empty();
    }

     /**
     * check if the SideBar Nodes have existed
     * if no then do refresh
     * if yes then do refreshAnnotation
     */
    public checkSideBar():boolean {
        var isSideBarExist:boolean = false;
        var nodes:any = $('.drag').get();

        if(nodes.length != 0) {
            isSideBarExist = true;
        }

        return isSideBarExist;
    }

    /**
     * Is used for searching the annotation using a form and button search
     * @param keyword 
     * @param util 
     */
    public searchAnnotation(keyword:string, util:any, directory:string) {
        if(keyword == "") {
            this.resetSidebar();
            programCaller("refresh");
        } else {
            var listAnnotation:any = document.querySelectorAll("#annotation-group");
            var list:any = listAnnotation[0].children;
            var nodeObject:NodesObject = null;
            var temp:any = [];
            for(var i = 0; i < listAnnotation[0].children.length; i++) {
                var value = listAnnotation[0].children[i].innerHTML;
                if(value.toLowerCase().includes(keyword.toLowerCase()) == true ) {
                    temp.push({
                        filename: listAnnotation[0].children[i].title,
                        id: listAnnotation[0].children[i].id,
                        topic: value,
                        subtype: "",
                        title: "",
                        pagenumber: listAnnotation[0].children[i].value
                    });
                }
            }

            // Set The GUI based on selected annotation
            this.resetSidebar();
            this.setGuiInit(util.setJsonFile(temp), directory);
        }
    }

    /**
     *Listener of the jsmind. It will update the main jsmind tree in any changes
     */
    public setJsmindListener(contextMenu:ContextMenu) {
        // Update the annotation panel on each MindMap event
        _jm.add_event_listener(function () {
         	jmnodes = document.querySelectorAll('jmnode');
            for(var i = 0; i < jmnodes.length; i++) {
         		// Not efficient, need to figure out another way to do this.
         		jmnodes[i].oncontextmenu = function (e) {
         			e.preventDefault();
         			if (e.target.getAttribute('pdfid') != 'undefined') {
         			    $('#contextMenu .actionOpenPdf').show();
         			} else {
         			    $('#contextMenu .actionOpenPdf').hide();
         			}
         			$('#contextMenu').show();
         			$('#contextMenu').css({ position: 'absolute', marginLeft: e.clientX, marginTop: e.clientY-45 });
         			contextMenu.setTempBoard(e.target.innerHTML);
         		}
         	}

            var nodes = $('#annotation-group').get();
            var children = nodes[0].children;
            for(var i = 0; i < children.length; i++) {
                node = children[i];
                if (_jm.mind.nodes[node.id]) {
                    $('#'+node.id).hide();
                } else {
                    $('#'+node.id).show();
                }
            }
            
        });
    }

    /**
     * Set Treeview based on input data in JSON Format
     * @param input 
     */
    public setTreeListener(input:string) {
	    $('#tree').treeview({data:input});
    }

    /**
     * Clear Treeview
     */
    public resetTreeView() {
        $('#tree').treeview({data:""});
    }

    /**
     * Set the dynamic HTML for the input of the object
     * @param objekt
     */
    private setDynamicHtml(objekt:NodesObject, mode:string, directory:string) {
        var node;
        for(var i = 0; i < objekt.length; i++) {
            var input = objekt[i];
            var annot = new Annotation(input["filename"], input["id"], input["topic"],input["subtype"], input["title"], input["pagenumber"])
            node = new Nodes(annot.getId(), annot.getTopic(), annot.getFileName(), annot.getPageNumber());
            // All annotations must exist in the Sidebar, whether hidden or visible
            if (!this.doesAnnotationExistInSidebar(node.getId())) {
                // If the annotation does not exist, add it to sidebar
                this.setDynamicHtmlContent(node, "#annotation-group", "list-group-item drag", mode, directory);
            }
            // Based on whether the annotation exists in mindmap or not, toggle the visibility
            if (this.checkJsmindNode(node.getId())) {
                $('#'+node.getId()).hide();
            } else {
                $('#'+node.getId()).show();
            }
        }
    }

    /**
     * Set the dynamic HTML for the title so called pdf name
     * @param util
     * @param id
     * @param fileName
     * @returns {string}
     */
    private setDynamicHtmlTitle(util, id:string, fileName:string):string {
        var pdfId = util.getHashFunction(id);
        this.basicHtmlTitle = "<li id=" + pdfId  + " " + "class=pdf-title" + " " +  "style='cursor: no-drop; background-color: #ccc;padding: 10px 18px'>" + fileName + "</li>";
        return this.basicHtmlTitle;
    }

    /**
     *Set the dynamic HTML for the annotation contents
     * @param node
     * @param appendToName
     * @param className
     */
    private setDynamicHtmlContent(node, appendToName:string, className:string, mode:string, directory:string) {
        var htmlContent = document.createElement("li");
        htmlContent.setAttribute("id", node.getId());
        htmlContent.setAttribute("pagenumber", node.getPageNumber());
        htmlContent.value = node.getPageNumber();
        htmlContent.innerHTML = node.getTopic();
        htmlContent.title = directory + "\\" +node.getFileName();
        this.basicHtmlContent = htmlContent;

        if(mode == "init") {
            $(this.basicHtmlContent).appendTo(appendToName);
        } else{
            var temp = node.getFileName();
            var pdfId = util.getHashFunction(temp);
            $(this.basicHtmlContent).insertAfter('#' + pdfId);
        }

        $(this.basicHtmlContent).draggable(node.setDraggable());
        $(this.basicHtmlContent).droppable(node.setDroppable());
        document.getElementById(node.getId()).className += " " + className;
    }

    /**
     *Check whether the nodes already in the jsmind tree in the right side or not
     * @param id
     * @returns {boolean}
     */
    private checkJsmindNode(id:string):boolean {
        return !!_jm.mind.nodes[id];
    }

    /**
     *Check whether the nodes already in the Annotations List in the left side or not
     * @param id
     * @returns {boolean}
     */
    private doesAnnotationExistInSidebar(id:string):boolean {
        // Get the IDs of all annotations in the sidebar
        var nodesInSidebar = $('.list-group-item').get().map(function (eachNode) {
            return eachNode.id; 
        });
        return (nodesInSidebar.indexOf(id) != -1);
    }

}

/**
 * All operations with Project
 */
class Project {
    private projectName:string; // to save the name of a project
    private projectLocation:string; // to save the folder location of a project
    private projectPdfList:string[]; // to save the pdf filename lists of a project
    private projectStatus:string; // to save whether the project has been edited or not
    private projectSavedFileLocation:string // to save the location of .mm or .jm file

    constructor() {
        this.projectPdfList = new Array;
        this.projectStatus = "noedit";
    }

    /**
     * to save the project name
     * @param input 
     */
    public setProjectName(input:string) {
        this.projectName = input;
    }
    /**
     * to get the project name
     */
    public getProjectName():string {
        return this.projectName;
    }
    /**
     * to save the project location
     * @param input 
     */
    public setProjectLocation(input:string) {
        this.projectLocation = input;
    }
    /**
     * to get the project location
     */
    public getProjectLocation():string {
        return this.projectLocation;
    }
    /**
     * to save list of pdf files of a project
     * @param input 
     */
    public setProjectPdfList(input:string[]) {
        for(var i = 0; i < input.length; i++) {
            this.projectPdfList[i] = input[i];
        }
    }
    /**
     * to get the list of pdf files of a project
     */
    public getProjectPdfList():string[] {
        return this.projectPdfList;
    }

    /**
     * to set the status of the project (edited or noedit)
     * @param input 
     */
    public setProjectStatus(input:string) {
        this.projectStatus = input;
    }

    /**
     * to get the status of the project
     */
    public getProjectStatus():string {
        return this.projectStatus;
    }

    /**
     * to save the file (.mm or .jm) location
     */
    public setProjectSavedFileLocation(input:string) {
        this.projectSavedFileLocation = input;
    }

    /**
     * to get the file (.mm or .jm) location
     */
    public getProjectSavedFileLocation():string {
        return this.projectSavedFileLocation;
    }

    /**
     * to validate & check the requirements for new project
     */
    public checkNewProject(gui:any):boolean {
        var checkStatus:boolean = true;
        var parm1:string = (<HTMLInputElement> document.getElementById("projectName")).value;
        var parm2:string = (<HTMLInputElement> document.getElementById("projectPdf")).value;

        $("p.ProjName").attr("hidden", true);
        $("p.ProjPdf").attr("hidden", true);

        if(parm1 == "") {
            checkStatus = false;
            $("p.ProjName").attr("hidden", false);
        }

        if(parm2 == "") {
            checkStatus = false;
            $("p.ProjPdf").attr("hidden", false);
        }

        if(checkStatus == false) {
            gui.effectShaking("myModal");
        } else {
            $("#myModal").modal('hide');
        }

        return checkStatus;
    }

    /**
     * when new project modal is opened
     * @param listPdf 
     */
    public setNewProjectModal(listPdf:any) {
        var self:any = this;
        var gui = new Gui;
        var promise = gui.windowNewProject(listPdf);

        Promise.all([promise]).then(function(result){
            var tempResult:any = result[0];
            self.setProjectLocation(tempResult[0]);
            self.setProjectPdfList(tempResult[1]); 
        });
    }

    /**
     * When save button is pressed in new project modal
     * @param util 
     * @param guiSideBar 
     * @param listPdf 
     */
    public createNewProject(util:any, guiSideBar:any, listPdf:any) {
        this.setProjectName((<HTMLInputElement> document.getElementById("projectName")).value);
        this.saveProject(util, this.getProjectName(), this.getProjectLocation(), this.getProjectPdfList(), "");
        this.saveTreeView(util, guiSideBar, listPdf, this.getProjectName(), this.getProjectLocation(), this.getProjectPdfList());
        this.setProjectStatus("edited");
        programCaller('refresh');
    }

    /**
     * to save project
     * @param util 
     */
    public setSaveProject(util:any):string {
        var msg:string = this.getProjectLocation();
        this.saveProject(util, this.getProjectName(), this.getProjectLocation(), this.getProjectPdfList(), this.getProjectSavedFileLocation());
        this.setProjectStatus('noedit');
        return msg;
    }

   /**
    * Used for saving project and creating file (.json) in local
    * @param util 
    * @param projectName 
    * @param projectLoc 
    * @param listFiles 
    */
    private saveProject(util:any, projectName:string, projectLoc:string, listFiles:string[], projectSavedFile:string) {
        var project:any = [];
        var annotation:any = [];
        var correspondingnode:any = [];
        var itemResult:any = [];
        var nodes:any = [];
        var counter:number = 0;

        // to convert JSON from Object to array file
        var jsMindData:any = mindmapMenu.getJsMindData();
        var nodesJSON = jsMindData.mind.nodes;
        for(var x in nodesJSON) {
            nodes.push(nodesJSON[x]);
        }
        
        // to populate the annotation section from .JSON file
        for(var i = 0; i < nodes.length; i++) {
            var temp = nodes[i];
            correspondingnode = [];
        if(temp.children.length == 0) {
            correspondingnode.push("");
        } else {
                for(var j = 0; j < temp.children.length; j++) {
                    correspondingnode.push([
                            temp.children[j].id
                    ]);
                }
                
            }
        annotation.push(this.setArrayAnnotation(correspondingnode, nodes, i));
        }

        // to populate the project section from .JSON file
        project.push({
                projectname: projectName,
                projectlocation: projectLoc,
                projectsavedfile: projectSavedFile,
                projectfiles: listFiles
        });

        // build the JSON file with combine of project and annotation
        itemResult.push({
            project,
            annotation
        });
        var result:string = util.setJsonFile(itemResult);
        util.writeJsonFile(projectLoc, result, projectName);
    }

    private setArrayAnnotation(correspondingnode:any, nodes:any, i:any):any {
        var annotation:any = [];
        annotation.push({
                    id: nodes[i].id,
                    text: nodes[i].topic,
                    correspondingnode,
                    file: nodes[i].pdfid,
                    page: nodes[i].index,
                    placed: nodes[i].expanded
                });
        return annotation;    
    }

   /**
    * Used to create bootstrap treeview file (.json)
    * @param util 
    * @param guiSideBar 
    * @param listPdf 
    * @param projectName 
    * @param projectLoc 
    * @param listFiles 
    */
    private saveTreeView(util:any, guiSideBar:any, listPdf:any, projectName:string, projectLoc:string, listFiles:string[]) {
        var itemDirProject:any = [];
        var tempNodeName:any = [];

        for(var j = 0; j < listFiles.length; j++) {
            tempNodeName.push({
                text:listFiles[j],
                icon:"glyphicon glyphicon-file",
                href: projectLoc + "\\" + listFiles[j]
            });
        }
        
        itemDirProject.push({
            text: projectName,
            nodes: tempNodeName     
        });

        var resultDir:string = util.setJsonFile(itemDirProject);
        util.appendJsonFile("./", resultDir, "root");

        guiSideBar.setTreeListener(resultDir);

        listPdf.setListPdfFile(listFiles);
        listPdf.setLastModDate(listPdf.getModDateFs(util, projectLoc, listFiles));
    }

    /**
     * when open project is pressed
     */
    public setOpenProjectModal(util:any, guiSideBar:any, listPdf:any, mindmapMenu:any) {
        var input = $(document.getElementById('file-chooser'));
        input.trigger("click"); // opening dialog
        this.setOpenProjectListener(util, guiSideBar, listPdf, this, mindmapMenu);
    }
    /**
     * Listener of the open project
     * @param util 
     * @param guiSideBar 
     * @param listPdf 
     * @param self 
     */
    private setOpenProjectListener(util:any, guiSideBar:any, listPdf:any, self:any, mindmapMenu:any) {
         $("#file-chooser").on("change", function(result){
            var fs = require("fs");
            var filePath = result.target.files[0].path
            fs.readFile(filePath, function (err, data) {
                if (err) {
                    return console.error(err);
                }
                self.openProject(data, self, util, guiSideBar, listPdf, mindmapMenu);
            });
        });
    }

    /**
     * Open Project Main Program
     * @param data 
     * @param self 
     * @param util 
     * @param guiSideBar 
     * @param listPdf 
     */
    private openProject(data:string, self:any, util:any, guiSideBar:any, listPdf:any, mindmapMenu:any) {
        var dataObject:object = util.parseJsonFile(data);
        console.log(dataObject);
        self.setProjectName(dataObject[0].project[0].projectname);
        self.setProjectLocation(dataObject[0].project[0].projectlocation);
        self.setProjectPdfList(dataObject[0].project[0].projectfiles);
        self.setProjectSavedFileLocation(dataObject[0].project[0].projectsavedfile);
        self.saveTreeView(util, guiSideBar, listPdf, self.getProjectName(), self.getProjectLocation(), self.getProjectPdfList());

        listPdf.setDirectory(self.getProjectLocation());

        var htmlContent:any = (<HTMLInputElement> document.getElementById('mindmap-chooser'));
        htmlContent.filename = self.getProjectSavedFileLocation();
        mindmapMenu.setOpenFileListener(htmlContent);

        programCaller('refresh');
    }

    private loadMMJMFile() {

    }

    /**
     * When close project is pressed
     * @param guiSideBar
     * @param menu 
     */
    public setCloseProject(guiSideBar:any, menu:any, gui:any, status:string) {

        if(status == "noedit") {
                // do nothing
        } else {
                 var closeProjectStatus = gui.windowConfirmation("you are about to close project, save changes?");
                if(closeProjectStatus) {
                    this.setSaveProject(util);
                    if((menu.getFileTypeSave() != null)) {
                        menu.saveFile(menu.getFileTypeSave(), project, util);
                    } else {
                        menu.saveFile("mm", project, util);
                    }
                }
        }

        guiSideBar.resetTreeView();
        guiSideBar.resetSidebar();
        this.setProjectStatus("noedit");
        menu.newMap();
    }

}

// ========================================================= //
// Interface Section
// ========================================================= //

/**
 * The template for the DragObject
 */
interface DragObject {
	helper:string,
	containment:string,
	opacity:string,
	revert:string,
	appendTo:string,
	stop: (ev:Event, ui)=>string
}
/**
 * Template for dropobject
 */
interface DropObject {
    drop: (ev:Event, ui)=>string
}
/**
 *Tempate for nodeobject
 */
interface NodesObject extends Array<object> {
    filename:string,
	id:string;
	topic:string;
	subtype:string;
	title:string;
	pagenumber:number;
}

// ========================================================= //
// Function Section
// ========================================================= //

var node:any;
var dir:string = "./docs";
var listPdf:any = new ListPdf(new Array,new Array, dir);
var listAnnotation:any = new ListAnnotations(dir);
var util:any = new Utils();
var contextMenu:any = new ContextMenu();
var mindmapMenu:MindmapMenu;
var gui:any = null;
var guiSideBar:any = null;
var project:any = null;

/**
 * Main program, it is also called from the HTML file
 * @param data
 */
function programCaller(data:any) {
	switch(data) {

        /**
         * For the first initilization for the program
         */
        case "init":

            // set initialize for node
            node = new Nodes("", "", "", 0);

             // set Initialize for Gui
            gui = new Gui();
            mindmapMenu = gui.setGuiInitialize();
            
            // set initialize for Gui in sidebar
            // set listener for JsMind changes
            guiSideBar = new GuiSideBar();
            guiSideBar.setJsmindListener(contextMenu);

            // set Initialize for project
            project = new Project();

            break;

        /**
         *When the refresh pdf is called
         */
        case "refresh":
        
            /**
            * check if sidebar has been existed, if yes then do refreshAnnotation
            */
            var isSideBarExist:boolean = guiSideBar.checkSideBar();
            if(isSideBarExist) {
                programCaller("refreshAnnotation");
                break;
            } 

            //get PDF's lists
            var pdfProcess = listPdf.getPdfFromFs();
            guiSideBar.resetSidebar();
            
            // get annotation's lists
            Promise.all([pdfProcess]).then(function(response){
                listPdf.setListPdfFile(response[0]);
                for(var i = 0; i < listPdf.getCount(); i++) {
                    var pdfPages = listPdf.getPdfPage(listPdf.getDirectory() + "\\" + listPdf.getListPdfFile(i), listPdf.getListPdfFile(i));
                    Promise.all([pdfPages, pdfProcess, i]).then(function(responsePages){
                        var pdfAnnots = listAnnotation.getAnnotations(responsePages[0], listPdf.getListPdfFile(responsePages[2]));
                        Promise.all([pdfProcess, pdfPages, pdfAnnots]).then(function(responseResult){
                            var resultJson:string = responseResult[2];
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
            var change:any = listPdf.chkDateChange(util, listPdf.getListPdf());
            var listChange:string[] = change[1];
            var numChange: number = change[2];
            if(change[0] == true) {
                for(var i = 0; i < numChange; i++) {
                    var pdfPages = listPdf.getPdfPage(listChange[i], listChange[i]);
                    Promise.all([pdfPages, i]).then(function(responsePages) {
                        var pdfAnnots = listAnnotation.getAnnotations(responsePages[0], listChange[responsePages[1]]);
                        Promise.all([pdfProcess, pdfPages, pdfAnnots]).then(function(responseResult){
                            var newNodes:NodesObject = JSON.parse(responseResult[2]);
                            guiSideBar.setGuiOnAppend(newNodes, listPdf.getDirectory());
                        })
                    })
                }
                
            } else{
                gui.windowAlert("No Change in Annotation");
            }
            
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

        case "newMindmap":
            mindmapMenu.newMap(project);
            break;
        case "openExisting":
            mindmapMenu.selectFile(project);
            break;
        case "saveFileMM":
            var locationFile = mindmapMenu.saveFile("mm", project, util);
            break;
        case "saveFileJM":
            var locationFile = mindmapMenu.saveFile("jm", project, util);
            break;

        case "searchAnnotation":
            //searching annotation based on a keyword
            var keyword:string = (<HTMLInputElement> document.getElementById("annotSearch")).value;
            guiSideBar.searchAnnotation(keyword, util, listPdf.getDirectory());
            break;
        case "newProjectModal":
            //set modal of the new project
            project.setNewProjectModal(listPdf);
            break;
        case "openProjectModal":
            //set modal of the open project
            project.setOpenProjectModal(util, guiSideBar, listPdf, mindmapMenu);
            break;
        case "newProject":
            //set routine for new project
            var newProjectStatus = project.checkNewProject(gui);
            if(newProjectStatus) {project.createNewProject(util, guiSideBar, listPdf);}
            break;
        case "closeProject":
            //set routine for close project
            var status = project.getProjectStatus();
            project.setCloseProject(guiSideBar, mindmapMenu, gui, status);
            break;
        case "saveProject":
            // set routine for save project
            var saveProjectStatus = gui.windowConfirmation("save changes?");
            if(saveProjectStatus) {
                var msg:string = project.setSaveProject(util);
                gui.windowAlert("project is saved in" + " " + msg);
            }
            break;

	}
}