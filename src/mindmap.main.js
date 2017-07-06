//import $ from 'jquery-ts';
//var $ = require("./jquery-ts");
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
// ========================================================= //
// Class Section
// ========================================================= //
var Nodes = (function () {
    function Nodes(nodeId, nodeTopic) {
        this.id = nodeId;
        this.topic = nodeTopic;
    }
    Nodes.prototype.setId = function (id) {
        this.id = id;
    };
    Nodes.prototype.getId = function () {
        return this.id;
    };
    Nodes.prototype.setTopic = function (topic) {
        this.topic = topic;
    };
    Nodes.prototype.getTopic = function () {
        return this.topic;
    };
    Nodes.prototype.setDraggable = function () {
        var temp = {
            helper: 'clone',
            containment: 'frame',
            opacity: '0.5',
            revert: 'invalid',
            appendTo: 'body',
            stop: function (ev, ui) {
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
    };
    Nodes.prototype.setDroppable = function () {
        var temp = {
            drop: function (ev, ui) {
                var selected_node = _jm.get_selected_node(); // select node when mouseover
                if (!selected_node) {
                    prompt_info('please select a node first.');
                    return;
                }
                var nodeid = ui.helper.prevObject.context.id;
                var topic = ui.helper.prevObject.context.innerHTML;
                var node = _jm.add_node(selected_node, nodeid, topic);
            }
        };
        return temp;
    };
    return Nodes;
}());
var ListPdf = (function () {
    function ListPdf(listPdfFiles, lastModDatePdfFiles, directory) {
        this.listPdfFiles = listPdfFiles;
        this.directory = directory;
        this.lastModDatePdfFiles = lastModDatePdfFiles;
    }
    ListPdf.prototype.setListPdfFile = function (list) {
        for (var x = 0; x < list.length; x++) {
            this.listPdfFiles[x] = list[x];
        }
    };
    ListPdf.prototype.getListPdfFile = function (idx) {
        return this.listPdfFiles[idx];
    };
    ListPdf.prototype.getListPdf = function () {
        return this.listPdfFiles;
    };
    ListPdf.prototype.setLastModDate = function (list) {
        for (var x = 0; x < list.length; x++) {
            this.lastModDatePdfFiles[x] = list[x];
        }
    };
    ListPdf.prototype.getModDate = function (util, listFile) {
        var counter = 0;
        var modDateList = [];
        for (var x = 0; x < listFile.length; x++) {
            modDateList.push(util.getLastMod(listFile[x]));
        }
        return modDateList;
    };
    ListPdf.prototype.getLastModDate = function (idx) {
        return this.lastModDatePdfFiles[idx];
    };
    ListPdf.prototype.getLastMod = function () {
        return this.lastModDatePdfFiles;
    };
    ListPdf.prototype.getCount = function () {
        return this.listPdfFiles.length;
    };
    ListPdf.prototype.getPdf = function () {
        var result = this.getPdfFiles(this.directory);
        return result;
    };
    ListPdf.prototype.getPdfPage = function (filePath, fileName) {
        var result = this.getPdfFilesPage(filePath, fileName);
        return result;
    };
    ListPdf.prototype.setDirectory = function (dir) {
        this.directory = dir;
    };
    ListPdf.prototype.getDirectory = function () {
        return this.directory;
    };
    ListPdf.prototype.chkDateChange = function (util, list) {
        var newLastMod = [];
        var listChange = [];
        var stsChange = false;
        var indexChange = 0;
        for (var x = 0; x < list.length; x++) {
            newLastMod[x] = util.getLastMod(list[x]);
        }
        for (var x = 0; x < list.length; x++) {
            if (newLastMod[x] != this.lastModDatePdfFiles[x]) {
                stsChange = true;
                listChange[x] = this.getListPdfFile(x);
                indexChange++;
            }
        }
        return [stsChange, listChange, indexChange];
    };
    ListPdf.prototype.getPdfFiles = function (inputURL) {
        var process = new Promise(function (resolve, reject) {
            var promises = [], promise;
            var xhr = $.ajax({
                //This will retrieve the contents of the folder if the folder is configured as 'browsable'
                type: "GET",
                url: inputURL,
                success: function (data) {
                    //List all pdfs file names in the page
                    var counter = 0;
                    $(data).find("a:contains(" + ".pdf" + ")").each(function (success) {
                        promise = this.href.replace("http://", "").replace("localhost/", "").replace("scimappr/", "doc/");
                        promises.push(promise);
                    });
                    resolve(promises);
                }
            });
        });
        return process;
    };
    ListPdf.prototype.getPdfFilesPage = function (filePath, fileName) {
        var processPage = new Promise(function (resolve, reject) {
            // Adding timestamp forces the browser to always trigger a 
            // new request for the PDF file. This is a way to prevent 
            // the browser to use the cached version of the file 
            PDFJS.getDocument(filePath + "?" + Date.now()).then(function (pdf) {
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
    };
    return ListPdf;
}());
var Annotation = (function () {
    function Annotation(fileName, annotId, annotTopic, annotSubtype, annotTitle) {
        this.fileName = fileName;
        this.id = annotId;
        this.topic = annotTopic;
        this.subtype = annotSubtype;
        this.title = annotTitle;
    }
    Annotation.prototype.setFileName = function (fileName) {
        this.fileName = fileName;
    };
    Annotation.prototype.getFileName = function () {
        return this.fileName;
    };
    Annotation.prototype.setId = function (id) {
        this.id = id;
    };
    Annotation.prototype.getId = function () {
        return this.id;
    };
    Annotation.prototype.setTopic = function (topic) {
        this.topic = topic;
    };
    Annotation.prototype.getTopic = function () {
        return this.topic;
    };
    Annotation.prototype.setSubtype = function (subtype) {
        this.subtype = subtype;
    };
    Annotation.prototype.getSubtype = function () {
        return this.subtype;
    };
    Annotation.prototype.setTitle = function (title) {
        this.title = title;
    };
    Annotation.prototype.getTitle = function () {
        return this.title;
    };
    return Annotation;
}());
var ListAnnotations = (function (_super) {
    __extends(ListAnnotations, _super);
    function ListAnnotations(input) {
        var _this = _super.call(this, new Array, new Array, input) || this;
        _this.listPdfFilesAnnotations = new Array;
        return _this;
    }
    ListAnnotations.prototype.setListPdfFilesAnnotations = function (input) {
        this.listPdfFilesAnnotations = input;
    };
    ListAnnotations.prototype.getListPdfFilesAnnotations = function () {
        return this.listPdfFilesAnnotations;
    };
    ListAnnotations.prototype.getAnnotations = function (pages, fileName) {
        var result = this.getAnnotationsDetail(pages, fileName);
        return result;
    };
    ListAnnotations.prototype.getAnnotationsDetail = function (pages, fileName) {
        var util = new Utils();
        var ignoreList = ['Link'];
        var items = [];
        var processAnot = new Promise(function (resolve, reject) {
            pages.forEach(function (annotations) {
                annotations.forEach(function (annotation) {
                    if ((annotation.contents != "") && (annotation.subtype == "Popup")) {
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
            resolve(util.getJsonFile());
        });
        return processAnot;
    };
    return ListAnnotations;
}(ListPdf));
var Utils = (function () {
    function Utils() {
    }
    Utils.prototype.setJsonFile = function (input) {
        this.jsonFile = JSON.stringify(input);
        return this.jsonFile;
    };
    Utils.prototype.setJsonString = function (input) {
        this.jsonFile = input;
        return this.jsonFile;
    };
    Utils.prototype.parseJsonFile = function (input) {
        this.jsonObject = JSON.parse(input);
        return this.jsonObject;
    };
    Utils.prototype.concatJsonFiles = function (input) {
        var obj1 = JSON.parse(input);
        var obj2 = JSON.parse(this.jsonFile);
        var concatJson;
        var idxObj1 = obj1.length;
        for (var key in obj2) {
            idxObj1++;
            obj1[idxObj1] = obj2[key];
        }
        concatJson = JSON.stringify(obj1);
        return concatJson;
    };
    Utils.prototype.getJsonFile = function () {
        return this.jsonFile;
    };
    Utils.prototype.getJsonObject = function () {
        return this.jsonObject;
    };
    Utils.prototype.getHashFunction = function (input) {
        var hash = hex_md5("string");
        var hmac = hex_hmac_md5("19", input);
        return hmac;
    };
    Utils.prototype.getLastMod = function (url) {
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
    };
    Utils.prototype.getCompareLastMod = function (lstMod1, lstMod2) {
        var stsResult = false;
        if (lstMod1 != lstMod2) {
            stsResult = true;
        }
        return stsResult;
    };
    return Utils;
}());
var contextMenu = (function () {
    function contextMenu() {
    }
    contextMenu.actionCopy = function () {
        document.querySelector('#clipBoard').innerHTML = document.querySelector('#tempBoard').innerHTML;
        $('#contextMenu').hide();
    };
    ;
    contextMenu.actionPaste = function () {
        var selected_node = _jm.get_selected_node(); // select node when mouseover
        var topic = document.querySelector('#clipBoard').innerHTML;
        _jm.add_node(selected_node, Date.now(), topic);
        $('#contextMenu').hide();
    };
    ;
    return contextMenu;
}());
var GuiSideBar = (function () {
    function GuiSideBar() {
    }
    GuiSideBar.prototype.setGuiInit = function (data) {
        $("#loading-data").remove();
        $("#drag").remove();
        var util = new Utils();
        // Parse JSON File
        var objekt = util.parseJsonFile(data);
        for (var i = 0; i < objekt.length; i++) {
            var tempObject = objekt[i];
            var titleFile = this.setDynamicHtmlTitle(util, tempObject["filename"], tempObject["filename"]);
        }
        $(titleFile).appendTo(".list-group");
        this.setDynamicHtmlObject(objekt);
    };
    GuiSideBar.prototype.resetSidebar = function () {
        $(".list-group").empty();
    };
    GuiSideBar.prototype.setGuiOnAppend = function (id, topic) {
        var node = new Nodes(id, topic);
        if (this.checkJsmindNode(node.getId()) == false) {
            this.setDynamicHtmlContent(node, ".list-group", " drag list-group-item");
        }
    };
    GuiSideBar.prototype.setJsmindListener = function () {
        // Update the annotation panel on each MindMap event
        _jm.add_event_listener(function () {
            var jmnodes = document.querySelectorAll('jmnode');
            for (var i = 0; i < jmnodes.length; i++) {
                // Not efficient, need to figure out another way to do this. 
                jmnodes[i].oncontextmenu = function (e) {
                    e.preventDefault();
                    $('#contextMenu').show();
                    $('#contextMenu').css({ position: 'absolute', marginLeft: e.clientX, marginTop: e.clientY - 45 });
                    document.querySelector('#tempBoard').innerHTML = e.target.innerHTML;
                };
            }
            var mindmap = _jm.get_data();
            var nodes = $('.list-group-item').get();
            nodes.forEach(function (node) {
                if (_jm.mind.nodes[node.id]) {
                    $('#' + node.id).hide();
                }
                else {
                    $('#' + node.id).show();
                }
            });
            // Update localStorage with the current mindmap data on every update
            window.localStorage.setItem('json_data', JSON.stringify(_jm.get_data()));
        });
    };
    GuiSideBar.prototype.setDynamicHtmlObject = function (objekt) {
        var node;
        for (var i = 0; i < objekt.length; i++) {
            var input = objekt[i];
            var annot = new Annotation(input["filename"], input["id"], input["topic"], input["subtype"], input["title"]);
            node = new Nodes(annot.getId(), annot.getTopic());
            if (this.checkJsmindNode(node.getId()) == false) {
                this.setDynamicHtmlContent(node, ".list-group", " drag list-group-item");
            }
        }
    };
    GuiSideBar.prototype.setDynamicHtmlTitle = function (util, id, fileName) {
        this.basicHtmlTitle = "<li id=" + util.getHashFunction(id) + " " + "style='cursor: no-drop; background-color: #ccc;padding: 10px 18px'>" + fileName + "</li>";
        return this.basicHtmlTitle;
    };
    GuiSideBar.prototype.setDynamicHtmlContent = function (node, appendToName, className) {
        this.basicHtmlContent = "<li id=" + node.getId() + ">" + node.getTopic() + "</li>";
        $(this.basicHtmlContent).appendTo(appendToName).draggable(node.setDraggable());
        $(this.basicHtmlContent).droppable(node.setDroppable());
        document.getElementById(node.getId()).className += className;
    };
    GuiSideBar.prototype.checkJsmindNode = function (id) {
        var checkResult = false;
        // Get the IDs of all annotations in the sidebar
        var nodesInSidebar = $('.list-group-item').get().map(function (e) { return e.id; });
        // If the annotation is in the sidebar, it should stay as it is
        // Also, if the annotation is in jsMind, its state should also be as it is  
        if (nodesInSidebar.indexOf(id) != -1 || _jm.mind.nodes[id]) {
            checkResult = true;
        }
        return checkResult;
    };
    return GuiSideBar;
}());
// ========================================================= //
// Function Section
// ========================================================= //
var node;
var dir = "/scimappr/doc";
var listPdf = new ListPdf(new Array, new Array, dir);
var listAnnotation = new ListAnnotations(dir);
var util = new Utils();
function programCaller(data) {
    switch (data) {
        case "init":
            node = new Nodes("", "");
            $(".drag").draggable(node.setDraggable());
            $(".drop").droppable(node.setDroppable());
            // Render existing MindMap
            var options = {
                container: 'jsmind_container',
                theme: 'greensea',
                editable: true
            };
            var baseMindmap = {
                "meta": {
                    "name": "jsMind Example",
                    "version": "0.2"
                },
                "format": "node_tree",
                "data": { "id": "root", "topic": "jsMind", "children": [] }
            };
            var mindmap = JSON.parse(window.localStorage.getItem('json_data')) || baseMindmap;
            _jm = jsMind.show(options, mindmap);
            //get PDF's lists
            var pdfProcess = listPdf.getPdf();
            Promise.all([pdfProcess]).then(function (response) {
                listPdf.setListPdfFile(response[0]);
                listPdf.setLastModDate(listPdf.getModDate(util, response[0]));
            });
            console.log(listPdf.getListPdf());
            console.log(listPdf.getLastMod());
            var guiSideBar = new GuiSideBar();
            guiSideBar.setJsmindListener();
            break;
        case "refresh":
            // Call Constructors for some classes
            var guiSideBar = new GuiSideBar();
            var fileName;
            var callBackCounter = 0;
            //get PDF's lists
            var pdfProcess = listPdf.getPdf();
            guiSideBar.resetSidebar();
            // get annotation's lists
            Promise.all([pdfProcess]).then(function (response) {
                listPdf.setListPdfFile(response[0]);
                callBackCounter = listPdf.getCount();
                for (var i = 0; i < listPdf.getCount(); i++) {
                    var pdfPages = listPdf.getPdfPage(listPdf.getListPdfFile(i), listPdf.getListPdfFile(i));
                    Promise.all([pdfPages]).then(function (responsePages) {
                        callBackCounter--;
                        var pdfAnnots = listAnnotation.getAnnotations(responsePages[0], listPdf.getListPdfFile(callBackCounter));
                        Promise.all([pdfProcess, pdfPages, pdfAnnots]).then(function (responseResult) {
                            var resultJson = responseResult[2];
                            guiSideBar.setGuiInit(resultJson);
                        });
                    });
                }
            });
            break;
        case "refreshAnnotation":
            var guiSideBar = new GuiSideBar();
            var callBackCounter = 0;
            var change = listPdf.chkDateChange(util, listPdf.getListPdf());
            var listChange = change[1];
            var numChange = change[2];
            if (change[0] == true) {
                callBackCounter = numChange;
                for (var i = 0; i < numChange; i++) {
                    var pdfPages = listPdf.getPdfPage(listChange[i], listChange[i]);
                    Promise.all([pdfPages]).then(function (responsePages) {
                        callBackCounter--;
                        var pdfAnnots = listAnnotation.getAnnotations(responsePages[0], listPdf.getListPdfFile(callBackCounter));
                        Promise.all([pdfProcess, pdfPages, pdfAnnots]).then(function (responseResult) {
                            var newNodes = JSON.parse(responseResult[2]);
                            guiSideBar.setDynamicHtmlObject(newNodes);
                        });
                    });
                }
            }
            else {
                prompt_info("No Change in Annotation");
            }
            break;
    }
}
