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
/**
 * Used to set the Node's parameters in sidebar
 */
var Nodes = (function () {
    /**
     *
     * @param nodeId
     * @param nodeTopic
     */
    function Nodes(nodeId, nodeTopic, fileName, pagenumber) {
        this.id = nodeId;
        this.topic = nodeTopic;
        this.filename = fileName;
        this.pagenumber = pagenumber;
    }
    /**
     *
     * @param id
     */
    Nodes.prototype.setId = function (id) {
        this.id = id;
    };
    /**
     *
     * @returns {string}
     */
    Nodes.prototype.getId = function () {
        return this.id;
    };
    /**
     *
     * @param topic
     */
    Nodes.prototype.setTopic = function (topic) {
        this.topic = topic;
    };
    /**
     *
     * @returns {string}
     */
    Nodes.prototype.getTopic = function () {
        return this.topic;
    };
    /**
     *
     * @param filename
     */
    Nodes.prototype.setFileName = function (filename) {
        this.filename = filename;
    };
    /**
     *
     * @returns {string}
     */
    Nodes.prototype.getFileName = function () {
        return this.filename;
    };
    /**
     *
     * @param pagenumber
     */
    Nodes.prototype.setPageNumber = function (pagenumber) {
        this.pagenumber = pagenumber;
    };
    /**
     *
     * @returns {number}
     */
    Nodes.prototype.getPageNumber = function () {
        return this.pagenumber;
    };
    /**
     * set Node to be Draggable
     * @returns {DragObject}
     */
    Nodes.prototype.setDraggable = function () {
        var temp = {
            helper: 'clone',
            containment: 'frame',
            opacity: '0.5',
            revert: 'invalid',
            appendTo: 'body',
            stop: function (ev, ui) {
                var pos = $(ui.helper).offset();
                return "finish";
            }
        };
        return temp;
    };
    /**
     * set Node to be Droppable
     * @returns {DropObject}
     */
    Nodes.prototype.setDroppable = function () {
        var _this = this;
        var temp = {
            drop: function (ev, ui) {
                var selected_node = _jm.get_selected_node(); // select node when mouseover
                if (!selected_node) {
                    alert('please select a node first.');
                    return;
                }
                var nodeid = ui.helper.prevObject[0].id;
                var topic = ui.helper.prevObject[0].innerHTML;
                var pdfid = ui.helper.prevObject[0].title;
                var pagenumber = ui.helper.prevObject[0].value;
                var directory = ui.helper.prevObject[0].href;
                var node = _jm.add_node(selected_node, nodeid, topic, "", pdfid, pagenumber);
                gui.setPdfButton(nodeid, pdfid, pagenumber, _this);
                project.setProjectStatus('edited');
                project.setTempSaveProject("chgProject");
            }
        };
        return temp;
    };
    /**
     * Find Node by its attribute (nodeid, topic, pdfid)
     * @param attr
     * @param val
     * @returns {any}
     */
    Nodes.prototype.findNodeByAttribute = function (attr, val) {
        var All = document.getElementsByTagName('jmnode');
        for (var i = 0; i < All.length; i++) {
            if (All[i].getAttribute(attr) == val) {
                return All[i];
            }
        }
    };
    return Nodes;
}());
/**
 * Pdf file details in folder
 */
var Pdf = (function () {
    function Pdf() {
    }
    Pdf.prototype.setPdfName = function (input) {
        this.pdfName = input;
    };
    Pdf.prototype.getPdfName = function () {
        return this.pdfName;
    };
    Pdf.prototype.setPdfLocation = function (input) {
        this.pdfLocation = input;
    };
    Pdf.prototype.getPdfLocation = function () {
        return this.getPdfLocation;
    };
    Pdf.prototype.setPdfModifiedDate = function (input) {
        this.pdfLastModifiedDate = input;
    };
    Pdf.prototype.getPdfModifiedDate = function () {
        return this.getPdfModifiedDate;
    };
    return Pdf;
}());
/**
 * List of PDF files in a folder
 */
var ListPdf = (function (_super) {
    __extends(ListPdf, _super);
    /**
     *
     * @param listPdfFiles
     * @param lastModDatePdfFiles
     * @param directory
     */
    function ListPdf(listPdfFiles, lastModDatePdfFiles, directory) {
        var _this = _super.call(this) || this;
        _this.listPdfFiles = listPdfFiles;
        _this.directory = directory;
        _this.lastModDatePdfFiles = lastModDatePdfFiles;
        return _this;
    }
    /**
     * save list of pdf files' name with input of pdf file lists
     * @param list
     */
    ListPdf.prototype.setListPdfFile = function (list) {
        for (var x = 0; x < list.length; x++) {
            this.listPdfFiles[x] = list[x];
        }
    };
    /**
     * fetch list of pdf files' names with giving input by array index from saved file list
     * @param idx
     * @returns {string}
     */
    ListPdf.prototype.getListPdfFile = function (idx) {
        return this.listPdfFiles[idx];
    };
    /**
     *fetch list of pdf files' all names from saved file list
     * @returns {string[]}
     */
    ListPdf.prototype.getListPdf = function () {
        return this.listPdfFiles;
    };
    /**
     *save list of pdf files' last modifiy date with input of last modifyed date lists
     * @param list
     */
    ListPdf.prototype.setLastModDate = function (list) {
        for (var x = 0; x < list.length; x++) {
            this.lastModDatePdfFiles[x] = list[x];
        }
    };
    /**
     * extract the all last modifyed date information from the pdf file list
     * @param util
     * @param listFile
     * @returns {Array}
     */
    ListPdf.prototype.getModDateFs = function (util, location, listFile) {
        var counter = 0;
        var modDateList = [];
        for (var x = 0; x < listFile.length; x++) {
            modDateList.push(util.getLastModFs(location, listFile[x]));
        }
        return modDateList;
    };
    /**
     * get all last modified date from last modified date list
     * @returns {string[]}
     */
    ListPdf.prototype.getLastMod = function () {
        return this.lastModDatePdfFiles;
    };
    /**
     *Counting all the pdf files names inside the pdf files list
     * @returns {number}
     */
    ListPdf.prototype.getCount = function () {
        return this.listPdfFiles.length;
    };
    /**
     *subroutine for calling the get pdf private function
     * @returns {any}
     */
    ListPdf.prototype.getPdf = function () {
        var result = this.getPdfFiles(this.directory);
        return result;
    };
    ListPdf.prototype.getPdfFromFs = function () {
        var result = this.readPdfInDirectory(this.directory);
        return result;
    };
    /**
     * subroutine for calling get pdf file page
     * @param filePath
     * @param fileName
     * @returns {any}
     */
    ListPdf.prototype.getPdfPage = function (filePath, fileName) {
        var result = this.getPdfFilesPage(filePath, fileName);
        return result;
    };
    /**
     * save the directory that contains pdf files
     * @param dir
     */
    ListPdf.prototype.setDirectory = function (dir) {
        this.directory = dir;
    };
    /**
     *get the saved directory
     * @returns {string}
     */
    ListPdf.prototype.getDirectory = function () {
        return this.directory;
    };
    /**
     *For comparing last modify date changes for updating the annotation
     * @param util
     * @param list
     * @returns {[boolean,string[],number]}
     */
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
                listChange[indexChange] = this.getListPdfFile(x);
                indexChange++;
            }
        }
        return [stsChange, listChange, indexChange];
    };
    /**
     * reading all pdf files in the specified directory
     * @param path
     */
    ListPdf.prototype.readPdfInDirectory = function (path) {
        var process = new Promise(function (resolve, reject) {
            var promises = [], promise;
            var fs = require("fs");
            fs.readdir(path, function (err, filenames) {
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
            });
        });
        return process;
    };
    /**
     * This is the promise to get file names from the given directory in server
     * @param inputURL
     * @returns {any}
     */
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
                        promise = this.href.replace("http://", "").replace("localhost/", "").replace("scimappr/", "docs/");
                        promises.push(promise);
                    });
                    resolve(promises);
                }
            });
        });
        return process;
    };
    /**
     * For each Pdf files get list of the pages that contain annotation
     * @param filePath
     * @param fileName
     * @returns {any}
     */
    ListPdf.prototype.getPdfFilesPage = function (filePath, fileName) {
        var processPage = new Promise(function (resolve, reject) {
            // Adding timestamp forces the browser to always trigger a
            // new request for the PDF file. This is a way to prevent
            // the browser to use the cached version of the file
            PDFJS.getDocument(filePath + "?" + Date.now()).then(function (pdf) {
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
    };
    return ListPdf;
}(Pdf));
/**
 *Details of annotation
 */
var Annotation = (function () {
    /**
     *
     * @param fileName
     * @param annotId
     * @param annotTopic
     * @param annotSubtype
     * @param annotTitle
     */
    function Annotation(fileName, annotId, annotTopic, annotSubtype, annotTitle, pagenumber) {
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
    Annotation.prototype.setFileName = function (fileName) {
        this.fileName = fileName;
    };
    /**
     * Get pdf file name from the given annotation
     * @returns {string}
     */
    Annotation.prototype.getFileName = function () {
        return this.fileName;
    };
    /**
     * Set the Id of annotation
     * @param id
     */
    Annotation.prototype.setId = function (id) {
        this.id = id;
    };
    /**
     * Get the Id
     * @returns {string}
     */
    Annotation.prototype.getId = function () {
        return this.id;
    };
    /**
     * Set the topic of the annotation
     * @param topic
     */
    Annotation.prototype.setTopic = function (topic) {
        this.topic = topic;
    };
    /**
     * Get the topic
     * @returns {string}
     */
    Annotation.prototype.getTopic = function () {
        return this.topic;
    };
    /**
     * For the Pop up or Rectangle annotation type choose. We have only get popup option right now
     * But for the future implementation the Rectangle also can be choose
     * @param subtype
     */
    Annotation.prototype.setSubtype = function (subtype) {
        this.subtype = subtype;
    };
    /**
     * Get defined subtype from annotation
     * @returns {string}
     */
    Annotation.prototype.getSubtype = function () {
        return this.subtype;
    };
    /**
     * The name of the creator of this annotations
     * @param title
     */
    Annotation.prototype.setTitle = function (title) {
        this.title = title;
    };
    /**
     * Get the name of the creator of this annotations
     * @returns {string}
     */
    Annotation.prototype.getTitle = function () {
        return this.title;
    };
    /**
     * Set the number of page that stores the Annotation
     * @param pagenumber
     */
    Annotation.prototype.setPageNumber = function (pagenumber) {
        this.pagenumber = pagenumber;
    };
    /**
     * get the number of page that stores the Annotation
     */
    Annotation.prototype.getPageNumber = function () {
        return this.pagenumber;
    };
    return Annotation;
}());
/**
 * Used to manipulate list of annotations
 */
var ListAnnotations = (function (_super) {
    __extends(ListAnnotations, _super);
    /**
     * set The constructor when class is called
     * @param input
     */
    function ListAnnotations(input) {
        var _this = _super.call(this, "", "", "", "", "", 0) || this;
        _this.listPdfFilesAnnotations = new Array;
        return _this;
    }
    /**
     *After you get all the annotations you save it into listpdffilesanotations
     * @param input
     */
    ListAnnotations.prototype.setListPdfFilesAnnotations = function (input) {
        this.listPdfFilesAnnotations = input;
    };
    /**
     * get listofannotations
     * @returns {string[]}
     */
    ListAnnotations.prototype.getListPdfFilesAnnotations = function () {
        return this.listPdfFilesAnnotations;
    };
    /**
     *routine to get annotations detail
     * @param pages
     * @param fileName
     * @returns {any}
     */
    ListAnnotations.prototype.getAnnotations = function (pages, fileName) {
        var result = this.getAnnotationsDetail(pages, fileName);
        return result;
    };
    /**
     *Prommise for getting annotation details for eachpages of the pdf
     * @param pages
     * @param fileName
     * @returns {any}
     */
    ListAnnotations.prototype.getAnnotationsDetail = function (pages, fileName) {
        var util = new Utils();
        var ignoreList = ['Link'];
        var items = [];
        var processAnot = new Promise(function (resolve, reject) {
            var pageNumber = 0;
            pages.forEach(function (annotations) {
                pageNumber++;
                annotations.forEach(function (annotation) {
                    if ((annotation.contents != "") && (annotation.subtype == "Popup")) {
                        items.push({
                            filename: fileName,
                            id: util.getHashFunction(fileName + " " + annotation.contents),
                            subtype: annotation.subtype,
                            title: annotation.title,
                            topic: annotation.contents,
                            pagenumber: pageNumber
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
}(Annotation));
/**
 * Utilities that are used to support the main program
 */
var Utils = (function () {
    function Utils() {
    }
    /**
     * Make a json file from anthing that is giving a list input to this method
     * @param input
     * @returns {string}
     */
    Utils.prototype.setJsonFile = function (input) {
        this.jsonFile = JSON.stringify(input);
        return this.jsonFile;
    };
    /**
     * The input is from only one section of the list, one by one
     * @param input
     * @returns {string}
     */
    Utils.prototype.setJsonString = function (input) {
        this.jsonFile = input;
        return this.jsonFile;
    };
    /**
     * Parsing json file to get the json object
     * @param input
     * @returns {NodesObject}
     */
    Utils.prototype.parseJsonFile = function (input) {
        this.jsonObject = JSON.parse(input);
        return this.jsonObject;
    };
    /**
     * Concat two json files into one json file
     * @param input
     * @returns {string}
     */
    Utils.prototype.concatJsonFiles = function (input) {
        var obj1 = JSON.parse(input);
        var obj2 = JSON.parse(this.jsonFile);
        var concatJson;
        var idxObj1 = obj1.length;
        for (var key in obj2) {
            obj1[idxObj1] = obj2[key];
            idxObj1++;
        }
        concatJson = JSON.stringify(obj1);
        return concatJson;
    };
    /**
     *to get json file from the saved json file
     * @returns {string}
     */
    Utils.prototype.getJsonFile = function () {
        return this.jsonFile;
    };
    /**
     * To get a json object from the saved json object
     * @returns {NodesObject}
     */
    Utils.prototype.getJsonObject = function () {
        return this.jsonObject;
    };
    /**
     * Hashing method for hashing the sended strings
     * @param input
     * @returns {string}
     */
    Utils.prototype.getHashFunction = function (input) {
        var hash = hex_sha1("string");
        var hmac = hex_hmac_sha1("19", input);
        return hmac;
    };
    /**
     * The real method in order to get the last modified date from the given URL
     * @param url
     * @returns {any}
     */
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
    /**
     * The real method in order to get the last modified date from the given URL (using fs)
     * @param url
     * @returns {any}
     */
    Utils.prototype.getLastModFs = function (location, url) {
        var lastModifiedDate;
        var fs = require('fs');
        fs.stat(location + "\\" + url, function (err, stats) {
            console.log(stats);
            console.log(location + "\\" + url);
            lastModifiedDate = stats.mtime;
        });
        return lastModifiedDate;
    };
    /**
     * Comparison function in order to understand whether the pdf file is changed or not
     * @param lstMod1
     * @param lstMod2
     * @returns {boolean}
     */
    Utils.prototype.getCompareLastMod = function (lstMod1, lstMod2) {
        var stsResult = false;
        if (lstMod1 != lstMod2) {
            stsResult = true;
        }
        return stsResult;
    };
    Utils.prototype.writeAnyTypeFile = function (path, input, name, type) {
        var fs = require('fs');
        var buffer = new Buffer(input);
        fs.open(path + "\\" + name + "." + type, 'w', function (err, fd) {
            if (err) {
                throw 'error opening file: ' + err;
            }
            fs.write(fd, buffer, 0, buffer.length, null, function (err) {
                if (err)
                    throw 'error writing file: ' + err;
                fs.close(fd, function () {
                    console.log('file has been written to ' + path + "\\" + name + "." + type);
                });
            });
        });
    };
    Utils.prototype.appendJsonFile = function (path, input, name) {
        var fs = require('fs');
        var buffer = new Buffer(input);
        fs.open(path + "\\" + name + ".json", 'w', function (err, fd) {
            if (err) {
                throw 'error opening file: ' + err;
            }
            fs.appendFile(path + "\\" + name + ".json", buffer, function (err) {
                if (err)
                    throw err;
                console.log('Data has been appended to ' + path + "\\" + name + ".json");
            });
        });
    };
    Utils.prototype.readAnyTypeFile = function (fullpath, readingtype, type) {
        var fs = require('fs');
        var filepath = null;
        if (type != null) {
            filepath = fullpath + "." + type;
        }
        else {
            filepath = fullpath;
        }
        var result = new Promise(function (resolve, reject) {
            fs.readFile(filepath, readingtype, function (err, contents) {
                resolve(contents);
            });
        });
        return result;
    };
    return Utils;
}());
/**
 * for GUI operations in general (except the gui sidebar)
 */
var Gui = (function () {
    function Gui() {
        this.jsMindProjectNameState = new Array();
        this.jsMindSavedState = new Array();
        this.jsMindProjectSavedState = new Array();
        this.jsMindStatusState = new Array();
    }
    Gui.prototype.setJsMindProjectNameState = function (input, idx) {
        this.jsMindProjectNameState[idx] = input;
    };
    Gui.prototype.getJsMindProjectNameState = function (name) {
        for (var x = 0; x < this.jsMindProjectNameState.length; x++) {
            if (this.jsMindProjectNameState[x] == name) {
                return x;
            }
        }
    };
    Gui.prototype.getCountProjectStatesNumber = function () {
        var projCounter = 0;
        if (this.jsMindProjectNameState.length == 0) {
            projCounter = 1;
        }
        else {
            projCounter = this.jsMindProjectNameState.length;
        }
        return projCounter;
    };
    Gui.prototype.setJsMindProjectState = function (input, idx) {
        this.jsMindProjectSavedState[idx] = input;
    };
    Gui.prototype.getJsMindProjectState = function (idx) {
        return this.jsMindProjectSavedState[idx];
    };
    Gui.prototype.setJsMindSavedState = function (input, idx) {
        this.jsMindSavedState[idx] = input;
    };
    Gui.prototype.getJsMindSavedState = function (idx) {
        return this.jsMindSavedState[idx];
    };
    Gui.prototype.setJsMindStatusState = function (input, idx) {
        this.jsMindStatusState[idx] = input;
    };
    Gui.prototype.getJsMindStatusState = function (idx) {
        return this.jsMindStatusState[idx];
    };
    /**
     * Setting GUI when Initializing the program
     * @param mindmapMenu
     */
    Gui.prototype.setGuiInitialize = function (mindmapMenu) {
        //to set nodes as draggable and droppable
        $(".drag").draggable(node.setDraggable());
        $(".drop").droppable(node.setDroppable());
        // Render existing MindMap
        var options = {
            container: 'jsmind_container',
            theme: 'primary',
            editable: true
        };
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
    };
    /**
     * used for creating confirmation window
     * @param msg
     */
    Gui.prototype.windowConfirmation = function (msg) {
        var result = confirm(msg);
        return result;
    };
    /**
     * used for creating alert window
     * @param msg
     */
    Gui.prototype.windowAlert = function (msg) {
        alert(msg);
    };
    /**
     * give pdf button to all nodes when opening a new project
     * @param contents
     */
    Gui.prototype.loadPdfButton = function (contents) {
        var self = this;
        jmnodes = document.querySelectorAll('jmnodes');
        var nodes = jmnodes[0].children;
        var node = null;
        var content = contents[0];
        var counter = 0;
        for (var i = 0; i < nodes.length; i++) {
            if (nodes[i].nodeName == "JMNODE") {
                var tempContent = content.annotation[counter];
                var realContent = tempContent[0];
                counter++;
                if (realContent.id == nodes[i].attributes[0].value) {
                    if (realContent.id != "root") {
                        node = new Nodes(realContent.id, realContent.text, realContent.file, realContent.page);
                        self.setPdfButton(node.getId(), node.getFileName(), node.getPageNumber().toString(), node);
                        var tempElement = node.findNodeByAttribute("nodeid", node.getId());
                        if ((tempElement != null) && (tempElement != undefined)) {
                            tempElement.setAttribute("pdfid", node.getFileName());
                        }
                    }
                }
                else {
                    counter--;
                }
            }
        }
    };
    /**
     * setting pdf button in all nodes
     * @param nodeid
     * @param pdfid
     * @param pagenumber
     * @param node
     */
    Gui.prototype.setPdfButton = function (nodeid, pdfid, pagenumber, node) {
        if ((pdfid != "undefine") || (pdfid != null)) {
            var pdfViewer = "./build/pdf.js/web/viewer.html";
            //var fileName:string = "?File=" + "./" + pdfid;
            var fileName = "?file=" + pdfid;
            var pageNumber = "#page=" + pagenumber.toString();
            var link = pdfViewer + fileName + pageNumber;
            var linkElement = document.createElement("a");
            linkElement.setAttribute("href", link);
            linkElement.setAttribute("target", "_blank");
            linkElement.setAttribute("style", "z-index:5; float:left; padding-right:5px");
            var imgElement = document.createElement("img");
            imgElement.setAttribute("id", nodeid);
            imgElement.setAttribute("src", "./build/img/pdf.png");
            linkElement.appendChild(imgElement);
            var selection = node.findNodeByAttribute("nodeid", nodeid);
            selection.appendChild(linkElement);
        }
    };
    /**
     * used for creating new project window
     */
    Gui.prototype.windowNewProject = function () {
        $("#myModal").modal();
        document.getElementById("projectName").value = "MyThesis";
        document.getElementById("projectPdf").value = "";
        document.getElementById("projectHome").value = "";
    };
    /**
     * used for opening existing project window
     */
    Gui.prototype.windowOpenProject = function () {
        var input = $(document.getElementById('file-chooser'));
        input.trigger("click"); // opening dialog
    };
    /**
     * set listener of the jsmind. It will update the main jsmind tree in any changes
     */
    Gui.prototype.setJsmindListener = function () {
        var self = this;
        // Update the annotation panel on each MindMap event
        _jm.add_event_listener(function () {
            self.setContextMenu();
            var nodes = $('#annotation-group').get();
            var children = nodes[0].children;
            for (var i = 0; i < children.length; i++) {
                node = children[i];
                if (_jm.mind.nodes[node.id]) {
                    $('#' + node.id).hide();
                }
                else {
                    $('#' + node.id).show();
                }
            }
        });
    };
    /**
     * set listener of the context menu (when user do right click)
     */
    Gui.prototype.setContextMenu = function () {
        jmnodes = document.querySelectorAll('jmnode');
        for (var i = 0; i < jmnodes.length; i++) {
            // Not efficient, need to figure out another way to do this.
            jmnodes[i].oncontextmenu = function (e) {
                e.preventDefault();
                if (e.target.getAttribute('pdfid') != 'undefined') {
                    $('#contextMenu .actionOpenPdf').show();
                }
                else {
                    $('#contextMenu .actionOpenPdf').hide();
                }
                $('#contextMenu').show();
                $('#contextMenu').css({ position: 'absolute', marginLeft: e.clientX, marginTop: e.clientY - 45 });
                contextMenu.setTempBoard(e.target.innerHTML);
            };
        }
    };
    /**
    * Used for creating shaking effect into modal
    * @param id
    */
    Gui.prototype.setEffectShaking = function (id) {
        var element = document.getElementById(id);
        $(element).effect("shake");
    };
    Gui.prototype.loadRecentProjects = function () {
        var data = [];
        var fs = require('fs');
        try {
            data = JSON.parse(fs.readFileSync('./projects.json'));
        }
        catch (e) { }
        if (data.length == 0) {
            $('#recentProjectsList').html('<li>&nbsp;&nbsp;<i>No Projects</i></li>');
        }
        else {
            var projectList = data.map(function (each) {
                return "<li><a href=\"javascript:programCaller('openRecentProject', '" + each.projectFilePath.split('\\').join('\\\\') + ("')\">&nbsp;&nbsp;" + each.projectName + " <i>(" + each.projectFilePath + ")</i></a></li>");
            });
            $('#recentProjectsList').html(projectList.join(''));
        }
    };
    return Gui;
}());
/**
 * Used when users do right click (to select some menus)
 */
var ContextMenu = (function (_super) {
    __extends(ContextMenu, _super);
    function ContextMenu() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ContextMenu.prototype.setTempBoard = function (input) {
        this.tempBoard = input;
    };
    ContextMenu.prototype.setClipBoard = function () {
        this.clipBoard = this.tempBoard;
    };
    ContextMenu.prototype.getClipBoard = function () {
        return this.clipBoard;
    };
    ContextMenu.prototype.actionCopy = function () {
        this.setClipBoard();
        $('#contextMenu').hide();
    };
    ContextMenu.prototype.actionPaste = function (project) {
        var selected_node = _jm.get_selected_node(); // select node when mouseover
        var topic = this.getClipBoard();
        _jm.add_node(selected_node, Date.now(), topic, '', '');
        project.setProjectStatus('edited');
        $('#contextMenu').hide();
    };
    ContextMenu.prototype.actionOpenPdf = function (directory) {
        var selected_node = _jm.get_selected_node(); // select node when mouseover
        var pdfViewer = "./build/pdf.js/web/viewer.html";
        var fileName = null;
        var page = null;
        if ((selected_node.pdfid != null) && (selected_node.pdfid != undefined)) {
            fileName = "?file=" + selected_node.pdfid;
            page = "#page=" + selected_node.index;
        }
        else {
            var id_temp = selected_node.id;
            var temp_element = node.findNodeByAttribute("id", id_temp);
            var temp_html = temp_element.outerHTML;
            fileName = temp_html.substring(temp_html.indexOf("?file="), temp_html.indexOf("target="));
            page = null;
        }
        window.open(pdfViewer + fileName + page, "_blank", "toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=1000, height=1000");
        $('#contextMenu').hide();
    };
    ContextMenu.prototype.actionOpenPdfUserDefine = function (directory) {
        var selected_node = _jm.get_selected_node();
        var shell = require('electron').shell;
        var fileName = null;
        if ((selected_node.pdfid != null) && (selected_node.pdfid != undefined)) {
            fileName = selected_node.pdfid;
        }
        else {
            var id_temp = selected_node.id;
            var temp_element = node.findNodeByAttribute("id", id_temp);
            var temp_html = temp_element.outerHTML;
            fileName = temp_html.substring(temp_html.indexOf("pdfid=") + 7, temp_html.indexOf("style=") - 2);
        }
        shell.openItem(fileName);
        $('#contextMenu').hide();
    };
    ContextMenu.prototype.actionCancel = function () {
        $('#contextMenu').hide();
    };
    return ContextMenu;
}(Gui));
/**
 * All Operations related to the Menu GUI
 */
var MindmapMenu = (function (_super) {
    __extends(MindmapMenu, _super);
    function MindmapMenu(jsMindObject) {
        var _this = _super.call(this) || this;
        _this.jsMindObject = jsMindObject;
        return _this;
    }
    MindmapMenu.prototype.setFileTypeSave = function (input) {
        this.fileTypeSave = input;
    };
    MindmapMenu.prototype.getFileTypeSave = function () {
        return this.fileTypeSave;
    };
    /**
     * setting a new mindmap with only root file
     * @param project
     * @param rootName
     */
    MindmapMenu.prototype.newMap = function (project, rootName) {
        var mindmap = {
            "meta": {
                "name": "jsMind",
                "version": "0.2"
            },
            "format": "node_tree",
            "data": { "id": "root", "topic": rootName, "children": [] }
        };
        this.jsMindObject.show(mindmap);
        document.querySelector('#mindmap-chooser').value = ''; // Reset the file selector
        if ((project != null) || (project != undefined)) {
            project.setProjectStatus('edited');
        }
    };
    // loading State of JsMind which will be implemented into .jm or .mm
    MindmapMenu.prototype.loadFile = function (fileType) {
        var mind_data;
        var mind_object = this.getJsMindData();
        this.setFileTypeSave(fileType);
        if (fileType === 'jm') {
            mind_data = mind_object.get_data();
        }
        else {
            mind_data = mind_object.get_data('freemind');
        }
        var mind_str = (fileType === 'jm') ? jsMind.util.json.json2string(mind_data) : mind_data.data;
        return mind_str;
    };
    // Saving .mm or .jm file implementation
    MindmapMenu.prototype.saveFile = function (fileType, mind_str) {
        // Saving State into Project
        project.setProjectSavedFileLocation(project.getProjectLocation() + "\\" + project.getProjectName() + "." + fileType);
        project.setSaveProject();
        util.writeAnyTypeFile(project.getProjectLocation(), mind_str, project.getProjectName(), "mm");
        return (project.getProjectLocation() + "\\" + project.getProjectName() + "." + fileType);
    };
    /**
     * get data from JsMind
     */
    MindmapMenu.prototype.getJsMindData = function () {
        var mindmapData;
        mindmapData = this.jsMindObject;
        return mindmapData;
    };
    /**
     * selecting a file from open mind map
     */
    MindmapMenu.prototype.selectFile = function () {
        var file_input = document.getElementById('mindmap-chooser');
        file_input.click();
    };
    /**
     * set listener to the open mindmap
     */
    MindmapMenu.prototype.setOpenFileListener = function () {
        var self = this;
        var mindMapChooser = document.getElementById('mindmap-chooser');
        mindMapChooser.addEventListener('change', function (event) {
            var files = mindMapChooser.files;
            if (files.length <= 0) {
                alert('please choose a file first');
            }
            var file_data = files[0];
            if (/.*\.mm$/.test(file_data.name)) {
                jsMind.util.file.read(file_data, function (freemind_data, freemind_name) {
                    self.loadFileJsMind(freemind_data, "mm", freemind_name);
                });
            }
            else {
                jsMind.util.file.read(file_data, function (jsmind_data, jsmind_name) {
                    self.loadFileJsMind(jsmind_data, "jm", jsmind_name);
                });
            }
        });
    };
    /**
     *  loading all jsmind contents and view it into GUI
     * @param content
     * @param type
     * @param freemind_name
     */
    MindmapMenu.prototype.loadFileJsMind = function (content, type, freemind_name) {
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
            }
            else {
                alert('The selected file is not supported');
            }
        }
        else {
            var jsmind_data = content;
            mind = jsMind.util.json.string2json(jsmind_data);
            if (!!mind) {
                _jm.show(mind);
            }
            else {
                alert('The selected file is not supported');
            }
        }
        return mind;
    };
    return MindmapMenu;
}(Gui));
/**
 * For the creation of the side bar GUI
 */
var GuiSideBar = (function (_super) {
    __extends(GuiSideBar, _super);
    function GuiSideBar() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Initilize the Sidebar for the first time or when Refresh
     * @param data
     * @param directory
     */
    GuiSideBar.prototype.setGuiInit = function (data, directory) {
        $("#loading-data").remove();
        $("#drag").remove();
        var util = new Utils();
        // Parse JSON File
        var objekt = util.parseJsonFile(data);
        var titleFile = null;
        for (var i = 0; i < objekt.length; i++) {
            var tempObject = objekt[i];
            titleFile = this.setDynamicHtmlTitle(util, tempObject["filename"], tempObject["filename"]);
        }
        $(titleFile).appendTo("#annotation-group");
        this.setDynamicHtml(objekt, "init", directory);
    };
    /**
     * Adding GUI on SideBar when refreshAnnotation is done
     * @param object
     * @param directory
     */
    GuiSideBar.prototype.setGuiOnAppend = function (object, directory) {
        this.setDynamicHtml(object, "append", directory);
    };
    /**
     *Clear the side bar annotation tab
     */
    GuiSideBar.prototype.resetSidebar = function () {
        $("#annotation-group").empty();
    };
    /**
    * check if the SideBar Nodes have existed
    * if no then do refresh
    * if yes then do refreshAnnotation
    */
    GuiSideBar.prototype.checkSideBar = function () {
        var isSideBarExist = false;
        var nodes = $('.drag').get();
        if (nodes.length != 0) {
            isSideBarExist = true;
        }
        return isSideBarExist;
    };
    /**
     * Is used for searching the annotation using a form and button search
     * @param keyword
     * @param directory
     */
    GuiSideBar.prototype.searchAnnotation = function (keyword, directory) {
        if (keyword == "") {
            this.resetSidebar();
            programCaller("refreshAll");
        }
        else {
            var listAnnotation = document.querySelectorAll("#annotation-group");
            var list = listAnnotation[0].children;
            var nodeObject = null;
            var temp = [];
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
            this.resetSidebar();
            this.setGuiInit(util.setJsonFile(temp), directory);
        }
    };
    /**
     * Set Treeview in sidebar project tab based on input data in JSON Format (root.json)
     * @param input
     */
    GuiSideBar.prototype.openTreeView = function (input) {
        $('#tree').treeview({ data: input });
    };
    /**
     * Set listener to the treeview (when selected or unselected mode)
     */
    GuiSideBar.prototype.setTreeViewListener = function () {
        // when a project in tab project section treeview has been selected
        $('#tree').on('nodeSelected', function (event, data) {
            console.log(data);
            console.log(data.text);
            if (data.href == undefined) {
                if (project.getProjectName() == data.text) {
                    // do nothing
                }
                else {
                    var idx = gui.getJsMindProjectNameState(data.text);
                    if (idx > 0) {
                        // read from last state of the project
                        var lastProjectState = gui.getJsMindProjectState(idx);
                        var lastJsMindState = gui.getJsMindSavedState(idx);
                        var lastJsMindStatusState = gui.getJsMindStatusState(idx);
                        project = new Project();
                        project.openProject(lastProjectState, project, "chgProject", lastJsMindState);
                        project.setProjectStatus(lastJsMindStatusState);
                    }
                    else {
                        // read from existing project file .json
                        var projFullPath = project.getProjectLocation() + "\\" + data.text + ".json";
                        var content = util.readAnyTypeFile(projFullPath, "utf8");
                        Promise.all([content]).then(function (result) {
                            project = new Project();
                            project.openProject(result[0], project, "chgProject", null);
                        });
                    }
                }
            }
        });
    };
    /**
     * Clear Treeview in sidebar project tab
     */
    GuiSideBar.prototype.resetTreeView = function () {
        project.setProjectTreeView("");
        $('#tree').treeview({ data: "" });
    };
    /**
    * Create bootstrap treeview file
    * @param projectName
    * @param projectLoc
    * @param listFiles
    */
    GuiSideBar.prototype.createTreeView = function (projectName, projectLoc, listFiles) {
        var itemDirProject = [];
        var tempNodeName = [];
        for (var j = 0; j < listFiles.length; j++) {
            tempNodeName.push({
                text: listFiles[j],
                icon: "glyphicon glyphicon-file",
                href: projectLoc + "\\" + listFiles[j]
            });
        }
        itemDirProject.push({
            text: projectName,
            nodes: tempNodeName
        });
        var resultDir = util.setJsonFile(itemDirProject);
        var currentDir = project.getProjectTreeView();
        // append the JSON if there is still current directory exist
        if ((currentDir != null) && (currentDir != "") && (currentDir != undefined)) {
            resultDir = util.concatJsonFiles(currentDir);
        }
        console.log(currentDir);
        guiSideBar.openTreeView(resultDir);
        // set listener for tree view changes
        guiSideBar.setTreeViewListener();
        listPdf.setListPdfFile(listFiles);
        listPdf.setLastModDate(listPdf.getModDateFs(util, project.getProjectSavedPdfLocation(), listFiles));
        project.setProjectTreeView(resultDir);
    };
    /**
     * Set the dynamic HTML for the input of the object
     * @param objekt
     * @param mode
     * @param directory
     */
    GuiSideBar.prototype.setDynamicHtml = function (objekt, mode, directory) {
        var node;
        for (var i = 0; i < objekt.length; i++) {
            var input = objekt[i];
            var annot = new Annotation(input["filename"], input["id"], input["topic"], input["subtype"], input["title"], input["pagenumber"]);
            node = new Nodes(annot.getId(), annot.getTopic(), annot.getFileName(), annot.getPageNumber());
            // All annotations must exist in the Sidebar, whether hidden or visible
            if (!this.doesAnnotationExistInSidebar(node.getId())) {
                // If the annotation does not exist, add it to sidebar
                this.setDynamicHtmlContent(node, "#annotation-group", "list-group-item drag", mode, directory);
            }
            // Based on whether the annotation exists in mindmap or not, toggle the visibility
            if (this.checkJsmindNode(node.getId())) {
                $('#' + node.getId()).hide();
            }
            else {
                $('#' + node.getId()).show();
            }
        }
    };
    /**
     * Set the dynamic HTML for the title so called pdf name
     * @param util
     * @param id
     * @param fileName
     * @returns {string}
     */
    GuiSideBar.prototype.setDynamicHtmlTitle = function (util, id, fileName) {
        var pdfId = util.getHashFunction(id);
        var htmlContent = document.createElement("li");
        htmlContent.setAttribute("id", pdfId);
        htmlContent.setAttribute("class", "pdf-title");
        htmlContent.setAttribute("style", 'cursor: no-drop; background-color: #ccc; padding: 10px 18px; font-weight:bold');
        htmlContent.innerHTML = fileName;
        this.basicHtmlTitle = htmlContent;
        return this.basicHtmlTitle;
    };
    /**
     * Set the dynamic HTML for the annotation contents
     * @param node
     * @param appendToName
     * @param className
     * @param mode
     * @param directory
     */
    GuiSideBar.prototype.setDynamicHtmlContent = function (node, appendToName, className, mode, directory) {
        var htmlContent = document.createElement("li");
        htmlContent.setAttribute("id", node.getId());
        htmlContent.setAttribute("pagenumber", node.getPageNumber());
        htmlContent.setAttribute("filename", node.getFileName());
        htmlContent.value = node.getPageNumber();
        htmlContent.innerHTML = node.getTopic();
        htmlContent.title = directory + "\\" + node.getFileName();
        this.basicHtmlContent = htmlContent;
        if (mode == "init") {
            $(this.basicHtmlContent).appendTo(appendToName);
        }
        else {
            var temp = node.getFileName();
            var pdfId = util.getHashFunction(temp);
            $(this.basicHtmlContent).insertAfter('#' + pdfId);
        }
        $(this.basicHtmlContent).draggable(node.setDraggable());
        $(this.basicHtmlContent).droppable(node.setDroppable());
        document.getElementById(node.getId()).className += " " + className;
    };
    /**
     *Check whether the nodes already in the jsmind tree in the right side or not
     * @param id
     * @returns {boolean}
     */
    GuiSideBar.prototype.checkJsmindNode = function (id) {
        return !!_jm.mind.nodes[id];
    };
    /**
     *Check whether the nodes already in the Annotations List in the left side or not
     * @param id
     * @returns {boolean}
     */
    GuiSideBar.prototype.doesAnnotationExistInSidebar = function (id) {
        // Get the IDs of all annotations in the sidebar
        var nodesInSidebar = $('.list-group-item').get().map(function (eachNode) {
            return eachNode.id;
        });
        return (nodesInSidebar.indexOf(id) != -1);
    };
    return GuiSideBar;
}(Gui));
/**
 * All operations with Project
 */
var Project = (function () {
    function Project() {
        this.projectPdfList = new Array;
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
    Project.prototype.setProjectName = function (input) {
        this.projectName = input;
    };
    /**
     * to get the project name
     */
    Project.prototype.getProjectName = function () {
        return this.projectName;
    };
    /**
     * to save the project location
     * @param input
     */
    Project.prototype.setProjectLocation = function (input) {
        this.projectLocation = input;
    };
    /**
     * to get the project location
     */
    Project.prototype.getProjectLocation = function () {
        return this.projectLocation;
    };
    /**
     * to save list of pdf files of a project
     * @param input
     */
    Project.prototype.setProjectPdfList = function (input) {
        for (var i = 0; i < input.length; i++) {
            this.projectPdfList[i] = input[i];
        }
    };
    /**
     * to get the list of pdf files of a project
     */
    Project.prototype.getProjectPdfList = function () {
        return this.projectPdfList;
    };
    /**
     * to set the status of the project (edited or noedit)
     * @param input
     */
    Project.prototype.setProjectStatus = function (input) {
        this.projectStatus = input;
    };
    /**
     * to get the status of the project
     */
    Project.prototype.getProjectStatus = function () {
        return this.projectStatus;
    };
    /**
     * to save the file (.mm or .jm) location
     */
    Project.prototype.setProjectSavedFileLocation = function (input) {
        this.projectSavedFileLocation = input;
    };
    /**
     * to get the file (.mm or .jm) location
     */
    Project.prototype.getProjectSavedFileLocation = function () {
        return this.projectSavedFileLocation;
    };
    /**
     * to save the PDFs file location
     * @param input
     */
    Project.prototype.setProjectSavedPdfLocation = function (input) {
        this.projectSavedPDFLocation = input;
    };
    /**
     * to get the PDFs file location
     */
    Project.prototype.getProjectSavedPdfLocation = function () {
        return this.projectSavedPDFLocation;
    };
    /**
     * to save the treeview JSON file
     * @param input
     */
    Project.prototype.setProjectTreeView = function (input) {
        this.projectTreeView = input;
    };
    /**
     * to get the treeview JSON file
     */
    Project.prototype.getProjectTreeView = function () {
        return this.projectTreeView;
    };
    /**
     * to validate & check the requirements for new project
     */
    Project.prototype.checkNewProject = function () {
        var checkStatus = true;
        var parm1 = document.getElementById("projectName").value;
        var parm2 = document.getElementById("projectPdf").value;
        var parm3 = document.getElementById("projectHome").value;
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
        }
        else {
            $("#myModal").modal('hide');
        }
        return checkStatus;
    };
    /**
     * when new project modal is opened
     */
    Project.prototype.setNewProjectModal = function () {
        gui.windowNewProject();
        this.setNewProjectListener();
    };
    /**
     * Listener to the New Project
     */
    Project.prototype.setNewProjectListener = function () {
        var self = this;
        var pathName = "";
        var dirProcess = null;
        var promise = new Promise(function (resolve, reject) {
            $("#pdf-chooser").on("change", function (result) {
                var lastResult = new Array;
                var listFiles = "";
                pathName = result.target.files[0].path;
                listPdf.setDirectory(pathName);
                dirProcess = listPdf.getPdfFromFs();
                lastResult.push(pathName);
                Promise.all([dirProcess]).then(function (result) {
                    var temp = result[0];
                    var arrayList = [];
                    for (var i = 0; i < temp.length; i++) {
                        if (i == 0) {
                            listFiles += temp[i];
                        }
                        else {
                            listFiles += ", " + temp[i];
                        }
                        arrayList[i] = temp[i];
                    }
                    document.getElementById("projectPdf").value = listFiles;
                    lastResult.push(arrayList);
                    resolve(lastResult);
                });
                $("#pdf-chooser").val("");
            });
        });
        Promise.all([promise]).then(function (result) {
            var tempResult = result[0];
            self.setProjectSavedPdfLocation(tempResult[0]);
            self.setProjectPdfList(tempResult[1]);
        });
        var promise2 = new Promise(function (resolve, reject) {
            $("#folder-chooser").on("change", function (result) {
                pathName = result.target.files[0].path;
                document.getElementById("projectHome").value = pathName;
                resolve(pathName);
                $("#folder-chooser").val("");
            });
        });
        Promise.all([promise2]).then(function (result) {
            var tempResult = result[0];
            self.setProjectLocation(tempResult);
        });
    };
    /**
     * When save button is pressed in new project modal
     */
    Project.prototype.createNewProject = function () {
        this.setProjectName(document.getElementById("projectName").value);
        this.saveProject(util, this.getProjectName(), this.getProjectLocation(), this.getProjectPdfList(), "", "");
        this.setProjectStatus("edited");
        guiSideBar.createTreeView(this.getProjectName(), this.getProjectLocation(), this.getProjectPdfList());
        mindmapMenu.newMap(this, this.getProjectName());
        programCaller('refreshAll');
    };
    /**
     * to save project
     */
    Project.prototype.setSaveProject = function () {
        var msg = this.getProjectLocation();
        var result = this.saveProject(util, this.getProjectName(), this.getProjectLocation(), this.getProjectPdfList(), this.getProjectSavedFileLocation(), this.getProjectSavedPdfLocation());
        util.writeAnyTypeFile(this.getProjectLocation(), result, this.getProjectName(), "json");
        this.setProjectStatus('noedit');
        return msg;
    };
    /**
     * Used for saving project and creating file (.json) in local
     * @param util
     * @param projectName
     * @param projectLoc
     * @param listFiles
     */
    Project.prototype.saveProject = function (util, projectName, projectLoc, listFiles, projectSavedFile, projectSavedPdf) {
        var project = [];
        var annotation = [];
        var childnode = [];
        var itemResult = [];
        var nodes = [];
        var counter = 0;
        // to convert JSON from Object to array file
        var jsMindData = mindmapMenu.getJsMindData();
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
            }
            else {
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
            project: project,
            annotation: annotation
        });
        var result = util.setJsonFile(itemResult);
        this.addToRecentProjects(projectName, projectLoc + "\\" + projectName + ".json");
        gui.loadRecentProjects();
        return result;
    };
    /**
     * routine for setting array annotations
     * @param childnode
     * @param nodes
     * @param i
     */
    Project.prototype.setArrayAnnotation = function (childnode, nodes, i) {
        var annotation = [];
        annotation.push({
            id: nodes[i].id,
            text: nodes[i].topic,
            childnode: childnode,
            file: nodes[i].pdfid,
            page: nodes[i].index,
            placed: nodes[i].expanded
        });
        return annotation;
    };
    /**
     * to save temporary project for Multiple Project
     */
    Project.prototype.setTempSaveProject = function (param) {
        switch (param) {
            case "chgProject":
                var projectState = this.saveProject(util, this.getProjectName(), this.getProjectLocation(), this.getProjectPdfList(), this.getProjectSavedFileLocation(), this.getProjectSavedPdfLocation());
                var x = gui.getJsMindProjectNameState(this.getProjectName());
                gui.setJsMindProjectState(projectState, x);
                var jsMindState = mindmapMenu.loadFile("mm");
                gui.setJsMindSavedState(jsMindState, x);
                var jsMindStatusState = this.getProjectStatus();
                gui.setJsMindStatusState(jsMindStatusState, x);
                break;
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
        }
    };
    /**
     * The projects.json format looks like:
     * {
     *  projectName: 'name',
     *  projectFilePath: '<directory>/project.json',
     * }
     * @param projectName
     * @param projectFilePath
     */
    Project.prototype.addToRecentProjects = function (projectName, projectFilePath) {
        var data;
        var files;
        var fs = require('fs');
        try {
            data = fs.readFileSync('./projects.json');
        }
        catch (e) {
            fs.writeFileSync('./projects.json', '[]');
            data = '[]';
        }
        var recentProjects = JSON.parse(data);
        // Prevent duplicate entries
        var alreadyExists = recentProjects.filter(function (e) { return e.projectFilePath == projectFilePath; }).length > 0;
        if (alreadyExists) {
            return;
        }
        recentProjects.push({ projectName: projectName, projectFilePath: projectFilePath });
        fs.writeFileSync('./projects.json', JSON.stringify(recentProjects));
    };
    Project.prototype.openRecentProject = function (projectFilePath) {
        var self = this;
        var fs = require('fs');
        fs.readFile(projectFilePath, function (err, data) {
            if (err) {
                return console.error(err);
            }
            self.openProject(data, self, null, null);
        });
    };
    /**
     * when open project is pressed
     */
    Project.prototype.setOpenProjectModal = function () {
        gui.windowOpenProject();
        this.setOpenProjectListener(this);
    };
    /**
     * Listener of the open project
     * @param self
     */
    Project.prototype.setOpenProjectListener = function (self) {
        $("#file-chooser").on("change", function (result) {
            var fs = require("fs");
            var filePath = result.target.files[0].path;
            fs.readFile(filePath, function (err, data) {
                if (err) {
                    return console.error(err);
                }
                self.openProject(data, self, "listener", null);
                guiSideBar.createTreeView(self.getProjectName(), self.getProjectLocation(), self.getProjectPdfList());
            });
            $("#file-chooser").val("");
        });
    };
    /**
     * Open Project Main Program
     * @param data
     * @param self
     * @param mode
     * @param fileContent
     */
    Project.prototype.openProject = function (data, self, mode, fileContent) {
        var dataObject = util.parseJsonFile(data);
        self.setProjectName(dataObject[0].project[0].name);
        self.setProjectLocation(dataObject[0].project[0].location);
        self.setProjectPdfList(dataObject[0].project[0].files);
        self.setProjectSavedFileLocation(dataObject[0].project[0].savedfile);
        self.setProjectSavedPdfLocation(dataObject[0].project[0].savedPdf);
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
        }
        else {
            // fetch data from .jm or .mm file
            var htmlContent = document.getElementById('mindmap-chooser');
            var fileName = self.getProjectName();
            var content = util.readAnyTypeFile(self.getProjectSavedFileLocation(), 'utf8');
            Promise.all([content]).then(function (result) {
                if (self.getProjectSavedFileLocation().indexOf(".mm") == -1) {
                    // if file is not .mm
                    var type = "jm";
                }
                else {
                    //if file is .mm
                    type = "mm";
                }
                mindmapMenu.loadFileJsMind(result, type, fileName + "." + type);
                gui.loadPdfButton(dataObject);
                if (mode == "listener") {
                    self.setTempSaveProject("openProject");
                }
                programCaller('refreshAll');
            });
        }
    };
    /**
      * When close project is pressed
      * @param status
      */
    Project.prototype.setCloseProject = function (status) {
        if (status == "noedit") {
            // do nothing
        }
        else {
            var closeProjectStatus = gui.windowConfirmation("you are about to close project, save changes?");
            if (closeProjectStatus) {
                this.setSaveProject();
                if ((mindmapMenu.getFileTypeSave() != null)) {
                    var content = mindmapMenu.loadFile(mindmapMenu.getFileTypeSave());
                    var locationFile = mindmapMenu.saveFile(mindmapMenu.getFileTypeSave(), content);
                    gui.windowAlert("file is saved in" + " " + locationFile);
                }
                else {
                    var content = mindmapMenu.loadFile("mm");
                    var locationFile = mindmapMenu.saveFile("mm", content);
                    gui.windowAlert("MM file is saved in" + " " + locationFile);
                }
            }
        }
        this.setProjectStatus("noedit");
        guiSideBar.resetTreeView();
        guiSideBar.resetSidebar();
        mindmapMenu.newMap(project, "Root");
    };
    return Project;
}());
// ========================================================= //
// Function Section
// ========================================================= //
var node;
var dir = "./docs";
var listPdf = new ListPdf(new Array, new Array, dir);
var listAnnotation = new ListAnnotations(dir);
var util = new Utils();
var contextMenu = new ContextMenu();
var mindmapMenu;
var gui = null;
var guiSideBar = null;
var project = null;
/**
 * Main program, it is also called from the HTML file
 * @param data
 */
function programCaller(data, param) {
    if (param === void 0) { param = ''; }
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
            gui.setJsmindListener(contextMenu);
            // Load recent projects list
            gui.loadRecentProjects();
            // set initialize for Gui in sidebar
            guiSideBar = new GuiSideBar();
            // set Initialize for project
            project = new Project();
            break;
        /**
         *When the refresh pdf is pressed
         */
        case "refresh":
            /**
            * check if sidebar has been existed, if yes then do refreshAnnotation
            */
            var isSideBarExist = guiSideBar.checkSideBar();
            if (isSideBarExist) {
                programCaller("refreshAnnotation");
                break;
            }
            //get PDF's lists
            var pdfProcess = listPdf.getPdfFromFs();
            guiSideBar.resetSidebar();
            // get annotation's lists
            Promise.all([pdfProcess]).then(function (response) {
                listPdf.setListPdfFile(response[0]);
                for (var i = 0; i < listPdf.getCount(); i++) {
                    var pdfPages = listPdf.getPdfPage(listPdf.getDirectory() + "\\" + listPdf.getListPdfFile(i), listPdf.getListPdfFile(i));
                    Promise.all([pdfPages, pdfProcess, i]).then(function (responsePages) {
                        var pdfAnnots = listAnnotation.getAnnotations(responsePages[0], listPdf.getListPdfFile(responsePages[2]));
                        Promise.all([pdfProcess, pdfPages, pdfAnnots]).then(function (responseResult) {
                            var resultJson = responseResult[2];
                            guiSideBar.setGuiInit(resultJson, listPdf.getDirectory());
                        });
                    });
                }
            });
            break;
        /**
         * When the refresh annotation is called
         */
        case "refreshAnnotation":
            // change has flag, saying if files changed or not.
            // change[1] list of changed pdfs
            // change[2] num of files changed
            var change = listPdf.chkDateChange(util, listPdf.getListPdf());
            var listChange = change[1];
            var numChange = change[2];
            if (change[0] == true) {
                for (var i = 0; i < numChange; i++) {
                    var pdfPages = listPdf.getPdfPage(listChange[i], listChange[i]);
                    Promise.all([pdfPages, i]).then(function (responsePages) {
                        var pdfAnnots = listAnnotation.getAnnotations(responsePages[0], listChange[responsePages[1]]);
                        Promise.all([pdfProcess, pdfPages, pdfAnnots]).then(function (responseResult) {
                            var newNodes = JSON.parse(responseResult[2]);
                            guiSideBar.setGuiOnAppend(newNodes, listPdf.getDirectory());
                        });
                    });
                }
            }
            else {
                gui.windowAlert("No Change in Annotation");
            }
            break;
        /**
         * refresh without consent of sidebar checking
         */
        case "refreshAll":
            //get PDF's lists
            var pdfProcess = listPdf.getPdfFromFs();
            guiSideBar.resetSidebar();
            // get annotation's lists
            Promise.all([pdfProcess]).then(function (response) {
                listPdf.setListPdfFile(response[0]);
                for (var i = 0; i < listPdf.getCount(); i++) {
                    var pdfPages = listPdf.getPdfPage(listPdf.getDirectory() + "\\" + listPdf.getListPdfFile(i), listPdf.getListPdfFile(i));
                    Promise.all([pdfPages, pdfProcess, i]).then(function (responsePages) {
                        var pdfAnnots = listAnnotation.getAnnotations(responsePages[0], listPdf.getListPdfFile(responsePages[2]));
                        Promise.all([pdfProcess, pdfPages, pdfAnnots]).then(function (responseResult) {
                            var resultJson = responseResult[2];
                            guiSideBar.setGuiInit(resultJson, listPdf.getDirectory());
                        });
                    });
                }
            });
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
            var keyword = document.getElementById("annotSearch").value;
            guiSideBar.searchAnnotation(keyword, listPdf.getDirectory());
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
            if (newProjectStatus) {
                project.createNewProject();
            }
            break;
        case "closeProject":
            //set routine for close project
            var status = project.getProjectStatus();
            project.setCloseProject(status);
            project = new Project();
            break;
        case "saveProject":
            // set routine for save project
            var saveProjectStatus = gui.windowConfirmation("save changes?");
            if (saveProjectStatus) {
                var msg = project.setSaveProject();
                gui.windowAlert("project is saved in" + " " + msg);
            }
            break;
        case "openRecentProject":
            project.openRecentProject(param);
            break;
    }
}
