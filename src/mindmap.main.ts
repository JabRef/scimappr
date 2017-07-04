//import $ from 'jquery-ts';
//var $ = require("./jquery-ts");

declare var PDFJS:any;
declare var Promise:any;
declare var $:any;
declare var hex_md5:any;
declare var hex_hmac_md5:any;
declare function prompt_info(message:string): any;
declare var _jm: {get_selected_node: Function, select_node: Function, add_node: Function, mind:{nodes:Function}, add_event_listener:Function, get_data:Function};

// ========================================================= //
// Class Section
// ========================================================= //


class Nodes {
	private id:string;
	private topic:string;
	
	constructor(nodeId:string, nodeTopic:string) {
		this.id = nodeId;
		this.topic = nodeTopic;
	}

    public setId(id:string) {
        this.id = id;
    }

    public getId():string {
        return this.id;
    }

    public setTopic(topic:string) {
        this.topic = topic;
    }

    public getTopic():string {
        return this.topic;
    }

    public setDraggable():any {	
		var temp:DragObject = {
			helper: 'clone',
			containment: 'frame',
			opacity: '0.5',
			revert: 'invalid',
			appendTo: 'body',
			stop: (ev:Event, ui):string => {
                var pos = $(ui.helper).offset();
                // var selected_node = _jm.get_selected_node(); // select node when mouseover
		        // if(!selected_node){
				//     prompt_info('please select a node first.');
				//     return;
		        // }
		        // var nodeTemp = new Nodes(this.id, this.topic);
		        // nodeTemp.id = ui.helper.prevObject.context.id;
		        // nodeTemp.topic = ui.helper.prevObject.context.innerHTML;
		        // _jm.add_node(selected_node, nodeTemp.id, nodeTemp.topic);
                return "finish";
            }
		};
		return temp;
    }

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
			var node = _jm.add_node(selected_node, nodeid, topic);
		}
        }

        return temp
    }
   
}

class ListPdf {
    private listPdfFiles:string[];
    private lastModDatePdfFiles:string[];
    private directory:string;

    constructor(listPdfFiles:string[], lastModDatePdfFiles:string[], directory:string) {
        this.listPdfFiles = listPdfFiles;
        this.directory = directory;
        this.lastModDatePdfFiles = lastModDatePdfFiles;
    }

    public setListPdfFile(list:string[]) {
        for(var x = 0; x < list.length; x++) {
            this.listPdfFiles[x] = list[x];
        }
    }

    public getListPdfFile(idx:number):string {
        return this.listPdfFiles[idx];
    }

    public getListPdf():string[] {
        return this.listPdfFiles;
    }

    public setLastModDate(list:string[]) {
        for(var x = 0; x < list.length; x++) {
            this.lastModDatePdfFiles[x] = list[x];
        }
    }

    public getModDate(util, listFile:string[]) {
        var counter:number = 0;
        var promise = [];
        for (var x = 0; x < listFile.length; x++) {
            promise.push(util.getLastMod(listFile[x]));
        }
        var resolvedPromise = Promise.all(promise)
        return resolvedPromise;
    }

    public getLastModDate(idx:number):string {
        return this.lastModDatePdfFiles[idx];
    }

    public getLastMod():string[] {
        return this.lastModDatePdfFiles;
    }

    public getCount():number {
        return this.listPdfFiles.length;
    }

    public getPdf():any {
            var result = this.getPdfFiles(this.directory);
            return result;
    }

    public getPdfPage(filePath:string, fileName:string):any {
        var result = this.getPdfFilesPage(filePath, fileName);
        return result;
    }

    public setDirectory(dir:string) {
        this.directory = dir;
    }

    public getDirectory():string {
        return this.directory;
    }

    public chkDateChange(util, list:string[]):any {
        var newLastMod: string[];
        var listChange: string[] = null;
        var stsChange: boolean = false;
        var indexChange:number = 0;
        for(var x = 0; x < list.length; x++) {
           newLastMod[x] = util.lastModDatePdfFiles(list[x]);
        }
        for(var x = 0; x < list.length; x++) {
            if(newLastMod[x] != this.lastModDatePdfFiles[x]) {
                stsChange = true;
                listChange[x] = this.getListPdfFile(x);
                indexChange++;
            }
        }

        return [stsChange, listChange, indexChange+1];
    }

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

    private getPdfFilesPage(filePath:string, fileName:string):any {

       var processPage = new Promise(function(resolve, reject) {
        PDFJS.getDocument(filePath).then(function (pdf) {
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

class Annotation {
    private fileName:string;
    private id:string;
	private topic:string;
	private subtype:string;
	private title:string;

    constructor(fileName:string, annotId:string, annotTopic:string, annotSubtype:string, annotTitle:string) {
        this.fileName = fileName;
        this.id = annotId;
        this.topic = annotTopic;
        this.subtype = annotSubtype;
        this.title = annotTitle;
    }

    public setFileName(fileName:string) {
        this.fileName = fileName;
    }

    public getFileName() {
        return this.fileName;
    }

    public setId(id:string) {
        this.id = id;
    }

    public getId():string {
        return this.id;
    }

    public setTopic(topic:string) {
        this.topic = topic;
    }

    public getTopic():string {
        return this.topic;
    }

    public setSubtype(subtype:string) {
        this.subtype = subtype;
    }

    public getSubtype() {
        return this.subtype;
    }

    public setTitle(title:string) {
        this.title = title;
    }

    public getTitle():string {
        return this.title;
    }

}

class ListAnnotations extends ListPdf {

    private listPdfFilesAnnotations:string[];

    constructor(input:string) {
        super(new Array, new Array, input);
        this.listPdfFilesAnnotations = new Array;
    }

    public setListPdfFilesAnnotations(input:string[]) {
        this.listPdfFilesAnnotations = input;
    }

    public getListPdfFilesAnnotations():string[] {
        return this.listPdfFilesAnnotations;
    }
    
    public getAnnotations(pages, fileName:string):any{
        var result = this.getAnnotationsDetail(pages, fileName);
        return result;
    }

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
    



class Utils {

    private jsonFile:string;
    private jsonObject:NodesObject;

    public setJsonFile(input:any[]):string {
        this.jsonFile = JSON.stringify(input);
        return this.jsonFile;
    }

    public setJsonString(input:string):string {
        this.jsonFile = input;
        return this.jsonFile;
    }

    public parseJsonFile(input:string):NodesObject {
        this.jsonObject = JSON.parse(input);
        return this.jsonObject;
    }

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

    public getJsonFile() {
        return this.jsonFile;
    }

    public getJsonObject() {
        return this.jsonObject;
    }

    public getHashFunction(input:string):string {
        var hash:string = hex_md5("string");
		var hmac:string = hex_hmac_md5("19", input);
		return hmac;
    }

    public getLastMod(url:string):any {
        var promise = new Promise(function(resolve, reject){
            var req = new XMLHttpRequest();
		    req.open("GET", url);
	        req.send(null);
		    req.addEventListener("load", 
            function() 
                {resolve(req.getResponseHeader("Last-Modified"));
            }, false);
        });
        return promise;
    }

    public getCompareLastMod(lstMod1:string, lstMod2:string):boolean {
        var stsResult = false;
        if(lstMod1 != lstMod2) {
            stsResult = true;
        }
        return stsResult;
    }

}

class GuiSideBar {

    private basicHtmlTitle:string;
    private basicHtmlContent:string;

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

    public setGuiOnAppend(id:string, topic:string) {
        var node = new Nodes(id, topic);
        if(this.checkJsmindNode(node.getId()) == false) {
                this.setDynamicHtmlContent(node, ".list-group", " drag list-group-item");
        }
    }

    public setJsmindListener() {
        // Update the annotation panel on each MindMap event
        _jm.add_event_listener(function () {
		var mindmap = _jm.get_data();
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

    private setDynamicHtmlObject(objekt:NodesObject) {
        var node;
        for(var i = 0; i < objekt.length; i++) {
            var input = objekt[i];
            var annot = new Annotation(input["filename"], input["id"], input["topic"],input["subtype"], input["title"])
            node = new Nodes(annot.getId(), annot.getTopic());
            if(this.checkJsmindNode(node.getId()) == false) {
                this.setDynamicHtmlContent(node, ".list-group", " drag list-group-item");
            }
        }
    }

    private setDynamicHtmlTitle(util, id:string, fileName:string):string {
        this.basicHtmlTitle = "<li id=" + util.getHashFunction(id) + " " + "style='cursor: no-drop; background-color: #ccc;padding: 10px 18px'>" + fileName + "</li>";
        return this.basicHtmlTitle;
    }

    private setDynamicHtmlContent(node, appendToName:string, className:string) {
        this.basicHtmlContent = "<li id=" + node.getId() +  ">" + node.getTopic() + "</li>";
        $(this.basicHtmlContent).appendTo(appendToName).draggable(node.setDraggable());
        $(this.basicHtmlContent).droppable(node.setDroppable());
        document.getElementById(node.getId()).className += className;
    }

    private checkJsmindNode(id:string):boolean {
        var checkResult = false;
        if(_jm.mind.nodes[id]) {
            checkResult = true;
        }
        return checkResult;

    }


}

// ========================================================= //
// Interface Section
// ========================================================= //

interface DragObject {
	helper:string,
	containment:string,
	opacity:string,
	revert:string,
	appendTo:string,
	stop: (ev:Event, ui)=>string
}

interface DropObject {
    drop: (ev:Event, ui)=>string
}

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


function programCaller(data:any) {
    var node:any;
	switch(data) {

		case "init":
            var dir:string = "/scimappr/doc";
            var listPdf = new ListPdf(new Array,new Array, dir);
            var util = new Utils();
            node = new Nodes("", "");
            $(".drag").draggable(node.setDraggable());
            $(".drop").droppable(node.setDroppable());

            //get PDF's lists
            var pdfProcess = listPdf.getPdf();
            Promise.all([pdfProcess]).then(function(response){
                listPdf.setListPdfFile(response[0]);
                var promises = listPdf.getModDate(util, response[0]);
                Promise.all([promises]).then(function(responsePromise){
                    listPdf.setLastModDate(responsePromise[0]);
                })
            });

            console.log(listPdf.getListPdf());
            console.log(listPdf.getLastMod());

            var guiSideBar = new GuiSideBar();
            guiSideBar.setJsmindListener();

            break;

		case "refresh":
            // Call Constructors for some classes
            
            var listAnnotation = new ListAnnotations(dir);
            var guiSideBar = new GuiSideBar();
            var fileName:string;
            var callBackCounter:number = 0;

            var dir:string = "/scimappr/doc";
            var listPdf = new ListPdf(new Array,new Array, dir);

            //get PDF's lists
            var pdfProcess = listPdf.getPdf();
            
            // get annotation's lists
            Promise.all([pdfProcess]).then(function(response){
                listPdf.setListPdfFile(response[0]);
                //listPdf.setLastModDate(util, response[0])
                callBackCounter = listPdf.getCount();
                for(var i = 0; i < listPdf.getCount(); i++) {
                    var pdfPages = listPdf.getPdfPage(listPdf.getListPdfFile(i), listPdf.getListPdfFile(i).replace("http://", "").replace("localhost/", ""));
                    Promise.all([pdfPages]).then(function(responsePages){
                        callBackCounter--;
                        var pdfAnnots = listAnnotation.getAnnotations(responsePages[0], listPdf.getListPdfFile(callBackCounter));
                        Promise.all([pdfProcess, pdfPages, pdfAnnots]).then(function(responseResult){
                            var resultJson:string = responseResult[2];
                            guiSideBar.setGuiInit(resultJson);
                        })
                    })
                }
                
            })
            
            break;

        case "refreshAnnotation":
            var change:any = listPdf.chkDateChange(util, listPdf.getListPdf());
            var listChange:string[] = change[1];
            var numChange: number = change[2];
            if(change[0] == true) {
                for(var i = 0; i < numChange; i++) {
                    var pdfPages = listPdf.getPdfPage(listChange[i], listChange[i].replace("http://", "").replace("localhost/", ""));
                    Promise.all([pdfPages]).then(function(responsePages){
                        callBackCounter--;
                        var pdfAnnots = listAnnotation.getAnnotations(responsePages[0], listPdf.getListPdfFile(callBackCounter));
                        Promise.all([pdfProcess, pdfPages, pdfAnnots]).then(function(responseResult){
                            var resultJson:string = responseResult[2];
                            guiSideBar.setGuiOnAppend(node.getid(), node.getTopic());
                        })
                    })
                }
                
            } else{
                prompt_info("No Change in Annotation");
            }
            
            break;

	}
}

