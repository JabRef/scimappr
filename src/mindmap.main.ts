//import $ from 'jquery-ts';
//var $ = require("./jquery-ts");

declare var PDFJS:any;
declare var Promise:any;
declare var $:any;
declare var hex_sha1:any;

declare var hex_hmac_sha1:any;
declare function prompt_info(message:string): any;
declare var _jm: {get_selected_node: Function, select_node: Function, add_node: Function, mind:{nodes:Function}, add_event_listener:Function, get_data:Function};
declare var jsMind:any;
declare var jmnodes:any;

// ========================================================= //
// Class Section
// ========================================================= //


/**
 *  Declare for a new SidebarNode of Drag & Drop
 */
class Nodes {
	private id:string;
	private topic:string;
	private filename:string;

    /**
     *
     * @param nodeId
     * @param nodeTopic
     */
	constructor(nodeId:string, nodeTopic:string, fileName:string) {
		this.id = nodeId;
		this.topic = nodeTopic;
		this.filename = fileName;
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

    public setFileName(filename:string) {
        this.filename = filename;
    }

    public getFileName():string {
        return this.filename;
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
				prompt_info('please select a node first.');
				return;
			}
			var nodeid = ui.helper.prevObject.context.id;
			var topic = ui.helper.prevObject.context.innerHTML;
			var pdfid = ui.helper.prevObject.context.title;
			var node = _jm.add_node(selected_node, nodeid, topic, "", pdfid);
		}
        }

        return temp
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
                listChange[x] = this.getListPdfFile(x);
                indexChange++;
            }
        }

        return [stsChange, listChange, indexChange];
    }

    /**
     * This is the promisse to get file names from the given directory
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
				        promise = this.href.replace("http://", "").replace("localhost/", "").replace("scimappr/","doc/");
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
            for (var i = 1; i < pdf.numPages; i++) {
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

    /**
     *
     * @param fileName
     * @param annotId
     * @param annotTopic
     * @param annotSubtype
     * @param annotTitle
     */
    constructor(fileName:string, annotId:string, annotTopic:string, annotSubtype:string, annotTitle:string) {
        this.fileName = fileName;
        this.id = annotId;
        this.topic = annotTopic;
        this.subtype = annotSubtype;
        this.title = annotTitle;
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

}
/**
 *
 *
 */
class ListAnnotations extends ListPdf {

    private listPdfFilesAnnotations:string[];

    /**
     *
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
            pages.forEach(annotations => {
            annotations.forEach(function(annotation){
                        if((annotation.contents != "") && (annotation.subtype == "Popup")) {
			                items.push({
                            filename: fileName,
                            id: util.getHashFunction(fileName + " " + annotation.contents),
                            subtype: annotation.subtype,
                            title: annotation.title,
                            topic: annotation.contents
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
 * Utilities that are using to support the main program
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

}
/**
 * Used when doing right click (to select some menus)
 */
class ContextMenu {

    private listData: string[];

    public setListData(input:string[]){
        this.listData = new Array;
        for(var i = 0; i < input.length; i++) {
            this.listData[i] = input[i];
        }
    }

    public getListData():string[] {
        return this.listData;
    }

    public actionCopy() {
        document.querySelector('#clipBoard').innerHTML = document.querySelector('#tempBoard').innerHTML;
        $('#contextMenu').hide();
    }

    public actionPaste() {
        var selected_node = _jm.get_selected_node(); // select node when mouseover
        var topic = document.querySelector('#clipBoard').innerHTML;
        _jm.add_node(selected_node, Date.now(), topic);
        $('#contextMenu').hide();
    }

    public actionOpenPdf(directory:string) {
        var selected_node = _jm.get_selected_node(); // select node when mouseover
        var pdfViewer:string = "/scimappr/build/pdf.js/web/viewer.html";
        var fileName:string = "?File=" + directory.replace("doc", "") + selected_node.pdfid;
        window.open(pdfViewer + fileName,"_blank","toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=1000, height=1000");
        $('#contextMenu').hide();
    }

    public actionCancel() {
        $('#contextMenu').hide();
    }
}
/**
 * For the creation of the side bar
 */
class GuiSideBar {

    private basicHtmlTitle:string;
    private basicHtmlContent:string;

    /**
     * Initilize the Sidebar for the first time
     * @param data
     */
    public setGuiInit(data:string) {
        $("#loading-data").remove();
	    $("#drag").remove();

        var util = new Utils();

        // Parse JSON File
		var objekt = util.parseJsonFile(data);

        for(var i = 0; i < objekt.length; i++) {
            var tempObject = objekt[i];
            var titleFile = this.setDynamicHtmlTitle(util, tempObject["filename"], tempObject["filename"])
        }

	    $(titleFile).appendTo(".list-group");

		this.setDynamicHtmlObject(objekt);

    }

    /**
     *Clear the side bar
     */
    public resetSidebar() {
        $(".list-group").empty();
    }

    /**
     * To add only one node into the sidebar
     * @param id
     * @param topic
     */
    public setGuiOnAppend(id:string, topic:string, filename:string) {
        var node = new Nodes(id, topic, filename);
        if(this.checkJsmindNode(node.getId()) == false) {
                this.setDynamicHtmlContent(node, ".list-group", " drag list-group-item");
        }
    }

    /**
     *Listener of the jsmind. It will update the main jsmind tree in any changes
     */
    public setJsmindListener() {
        // Update the annotation panel on each MindMap event
        _jm.add_event_listener(function () {
         	jmnodes = document.querySelectorAll('jmnode');
            for(var i = 0; i < jmnodes.length; i++) {
         		// Not efficient, need to figure out another way to do this.
         		jmnodes[i].oncontextmenu = function (e) {
         			e.preventDefault();
         			$('#contextMenu').show();
         			$('#contextMenu').css({ position: 'absolute', marginLeft: e.clientX, marginTop: e.clientY-45 });
         			document.querySelector('#tempBoard').innerHTML = e.target.innerHTML;
         		}
         	}

            var nodes = $('.list-group-item').get();
            nodes.forEach(function (node) {
                if (_jm.mind.nodes[node.id]) {
                    $('#'+node.id).hide();
                } else {
                    $('#'+node.id).show();
                }
            });

            // Update localStorage with the current mindmap data on every update
            window.localStorage.setItem('json_data', JSON.stringify(_jm.get_data()));
        });
    }

    /**
     * Set the dynamic HTML for the input of the object
     * @param objekt
     */
    public setDynamicHtmlObject(objekt:NodesObject) {
        var node;
        for(var i = 0; i < objekt.length; i++) {
            var input = objekt[i];
            var annot = new Annotation(input["filename"], input["id"], input["topic"],input["subtype"], input["title"])
            node = new Nodes(annot.getId(), annot.getTopic(), annot.getFileName());
            if(this.checkJsmindNode(node.getId()) == false) {
                this.setDynamicHtmlContent(node, ".list-group", " drag list-group-item");
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
        this.basicHtmlTitle = "<li id=" + pdfId  + " " + "style='cursor: no-drop; background-color: #ccc;padding: 10px 18px'>" + fileName + "</li>";
        return this.basicHtmlTitle;
    }

    /**
     *Set the dynamic HTML for the annotation contents
     * @param node
     * @param appendToName
     * @param className
     */
    private setDynamicHtmlContent(node, appendToName:string, className:string) {
        this.basicHtmlContent = "<li id=" + node.getId() + ">" + node.getTopic() + "</li>";
        $(this.basicHtmlContent).appendTo(appendToName).draggable(node.setDraggable());
        $(this.basicHtmlContent).droppable(node.setDroppable());
        document.getElementById(node.getId()).className += className;
        document.getElementById(node.getId()).title += node.getFileName();
    }

    /**
     *Check whether the nodes already in the jsmind tree in the right side or not
     * @param id
     * @returns {boolean}
     */
    private checkJsmindNode(id:string):boolean {
        var checkResult = false;
        // Get the IDs of all annotations in the sidebar
        var nodesInSidebar = $('.list-group-item').get().map((e) => e.id);

        // If the annotation is in the sidebar, it should stay as it is
        // Also, if the annotation is in jsMind, its state should also be as it is
        if (nodesInSidebar.indexOf(id) != -1 || _jm.mind.nodes[id]) {
            checkResult = true;
        }
        return checkResult;
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
}

// ========================================================= //
// Function Section
// ========================================================= //

var node:any;
var dir:string = "/scimappr/doc";
var listPdf = new ListPdf(new Array,new Array, dir);
var listAnnotation = new ListAnnotations(dir);
var util = new Utils();
var contextMenu = new ContextMenu();
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
            node = new Nodes("", "", "");
            //to set nodes as draggable and droppable
            $(".drag").draggable(node.setDraggable());
            $(".drop").droppable(node.setDroppable());

            // Render existing MindMap
            var options = {
                container:'jsmind_container',
                theme:'primary',
                editable:true
            }
            var baseMindmap = {
                "meta":{
                    "name":"jsMind Example",
                    "version":"0.2"
                },
                "format":"node_tree",
                "data":{"id":"root","topic":"jsMind","children": [] }
            };

            //this will find the cache json in order to not to lose already created jsmind tree json file
            var mindmap = JSON.parse(window.localStorage.getItem('json_data')) || baseMindmap;
            _jm = jsMind.show(options, mindmap);

            //get PDF's lists
            var pdfProcess = listPdf.getPdf();
            Promise.all([pdfProcess]).then(function(response){
                listPdf.setListPdfFile(response[0]);
                listPdf.setLastModDate(listPdf.getModDate(util, response[0]));
            });

            console.log(listPdf.getListPdf());
            console.log(listPdf.getLastMod());

            var guiSideBar = new GuiSideBar();
            guiSideBar.setJsmindListener();

            break;
        /**
         *When the refresh pdf called
         */
		case "refresh":
            // Call Constructors for some classes

            var guiSideBar = new GuiSideBar();
            var pdfNumberCounter:number = 0;

            //get PDF's lists
            var pdfProcess = listPdf.getPdf();
            guiSideBar.resetSidebar();
            
            // get annotation's lists
            Promise.all([pdfProcess]).then(function(response){
                listPdf.setListPdfFile(response[0]);
                pdfNumberCounter = listPdf.getCount();
                for(var i = 0; i < listPdf.getCount(); i++) {
                    var pdfPages = listPdf.getPdfPage(listPdf.getListPdfFile(i), listPdf.getListPdfFile(i));
                    Promise.all([pdfPages]).then(function(responsePages){
                        pdfNumberCounter--;
                        var pdfAnnots = listAnnotation.getAnnotations(responsePages[0], listPdf.getListPdfFile(pdfNumberCounter));
                        Promise.all([pdfProcess, pdfPages, pdfAnnots]).then(function(responseResult){
                            var resultJson:string = responseResult[2];
                            guiSideBar.setGuiInit(resultJson);
                        })
                    })
                }
                
            })
            
            break;

        case "refreshAnnotation":
            var guiSideBar = new GuiSideBar();
            var pdfNumberCounter:number = 0;
                // change has flag, saying if files changed or not.
                // change[1] list of changed pdfs
                // change[2] num of files changed
            var change:any = listPdf.chkDateChange(util, listPdf.getListPdf());
            var listChange:string[] = change[1];
            var numChange: number = change[2];
            if(change[0] == true) {
                pdfNumberCounter = numChange;
                for(var i = 0; i < numChange; i++) {
                    var pdfPages = listPdf.getPdfPage(listChange[i], listChange[i]);
                    Promise.all([pdfPages]).then(function(responsePages) {
                        pdfNumberCounter--;
                        var pdfAnnots = listAnnotation.getAnnotations(responsePages[0], listPdf.getListPdfFile(pdfNumberCounter));
                        Promise.all([pdfProcess, pdfPages, pdfAnnots]).then(function(responseResult){
                            var newNodes:NodesObject = JSON.parse(responseResult[2]);
                            guiSideBar.setDynamicHtmlObject(newNodes);
                        })
                    })
                }
                
            } else{
                prompt_info("No Change in Annotation");
            }
            
            break;

        case "copyMenu":
            var contextMenu = new ContextMenu();
            contextMenu.actionCopy();
            break;
        case "pasteMenu":
            var contextMenu = new ContextMenu();
            contextMenu.actionPaste();
            break;
        case "openPDFMenu":
            var contextMenu = new ContextMenu();
            contextMenu.actionOpenPdf(dir);
            break;
        case "cancelMenu":
            var contextMenu = new ContextMenu();
            contextMenu.actionCancel();
            break;


	}
}

