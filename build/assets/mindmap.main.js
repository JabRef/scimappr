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
                _this.addPdfButton(pdfid, nodeid, pagenumber);
                project.setProjectStatus('edited');
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
    /**
    * adding PDF image link inside MindMap
    */
    Nodes.prototype.addPdfButton = function (pdfid, nodeid, pagenumber) {
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
            var selection = this.findNodeByAttribute("nodeid", nodeid);
            selection.appendChild(linkElement);
        }
    };
    return Nodes;
}());
/**
 * List of PDF files in a folder
 */
var ListPdf = (function () {
    /**
     *
     * @param listPdfFiles
     * @param lastModDatePdfFiles
     * @param directory
     */
    function ListPdf(listPdfFiles, lastModDatePdfFiles, directory) {
        this.listPdfFiles = listPdfFiles;
        this.directory = directory;
        this.lastModDatePdfFiles = lastModDatePdfFiles;
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
     * extract the all last modifyed date information from the pdf file list
     * @param util
     * @param listFile
     * @returns {Array}
     */
    ListPdf.prototype.getModDate = function (util, listFile) {
        var counter = 0;
        var modDateList = [];
        for (var x = 0; x < listFile.length; x++) {
            modDateList.push(util.getLastMod(listFile[x]));
        }
        return modDateList;
    };
    /**
     *getting the just one last modifyed date information with respect to the index input
     * @param idx
     * @returns {string}
     */
    ListPdf.prototype.getLastModDate = function (idx) {
        return this.lastModDatePdfFiles[idx];
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
}());
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
        var _this = _super.call(this, new Array, new Array, input) || this;
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
}(ListPdf));
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
            idxObj1++;
            obj1[idxObj1] = obj2[key];
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
    Utils.prototype.writeJsonFile = function (path, input, name) {
        var fs = require('fs');
        var buffer = new Buffer(input);
        fs.open(path + "\\" + name + ".json", 'w', function (err, fd) {
            if (err) {
                throw 'error opening file: ' + err;
            }
            fs.write(fd, buffer, 0, buffer.length, null, function (err) {
                if (err)
                    throw 'error writing file: ' + err;
                fs.close(fd, function () {
                    console.log('file has been written to ' + path + "\\" + name + ".json");
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
 * Used when doing right click (to select some menus)
 */
var ContextMenu = (function () {
    function ContextMenu() {
    }
    ContextMenu.prototype.setListData = function (input) {
        this.listData = new Array;
        for (var i = 0; i < input.length; i++) {
            this.listData[i] = input[i];
        }
    };
    ContextMenu.prototype.getListData = function () {
        return this.listData;
    };
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
        //var node = new Nodes(Date.now().toString(), topic, "", 0);
        //var tempNode = node.findNodeByAttribute("nodeid", node.getId());
        //tempNode.removeChild(tempNode.getElementsByTagName("a"));
        $('#contextMenu').hide();
    };
    ContextMenu.prototype.actionOpenPdf = function (directory) {
        var selected_node = _jm.get_selected_node(); // select node when mouseover
        var pdfViewer = "./build/pdf.js/web/viewer.html";
        var fileName = "?file=" + selected_node.pdfid;
        var page = "#page=" + selected_node.index;
        window.open(pdfViewer + fileName + page, "_blank", "toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=1000, height=1000");
        $('#contextMenu').hide();
    };
    ContextMenu.prototype.actionOpenPdfUserDefine = function (directory) {
        var selected_node = _jm.get_selected_node();
        var shell = require('electron').shell;
        var fileName = selected_node.pdfid;
        shell.openItem(fileName);
        $('#contextMenu').hide();
    };
    ContextMenu.prototype.actionCancel = function () {
        $('#contextMenu').hide();
    };
    return ContextMenu;
}());
/**
 * All Operations related to the Menu GUI
 */
var MindmapMenu = (function () {
    function MindmapMenu(jsMindObject) {
        this.jsMindObject = jsMindObject;
    }
    MindmapMenu.prototype.setFileTypeSave = function (input) {
        this.fileTypeSave = input;
    };
    MindmapMenu.prototype.getFileTypeSave = function () {
        return this.fileTypeSave;
    };
    MindmapMenu.prototype.newMap = function (project) {
        var mindmap = {
            "meta": {
                "name": "jsMind",
                "version": "0.2"
            },
            "format": "node_tree",
            "data": { "id": "root", "topic": "Root", "children": [] }
        };
        this.jsMindObject.show(mindmap);
        document.querySelector('#mindmap-chooser').value = ''; // Reset the file selector
        if ((project != null) || (project != undefined)) {
            project.setProjectStatus('edited');
        }
    };
    MindmapMenu.prototype.saveFile = function (fileType, project, util) {
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
        util.writeAnyTypeFile(project.getProjectLocation(), mind_str, project.getProjectName(), fileType);
        project.setProjectSavedFileLocation(project.getProjectLocation() + "\\" + project.getProjectName() + "." + fileType);
        project.setSaveProject(util);
    };
    MindmapMenu.prototype.getJsMindData = function () {
        var mindmapData;
        mindmapData = this.jsMindObject;
        return mindmapData;
    };
    MindmapMenu.prototype.selectFile = function (project) {
        var file_input = document.getElementById('mindmap-chooser');
        file_input.click();
    };
    MindmapMenu.prototype.setOpenFileListener = function () {
        var self = this;
        var mindMapChooser = document.getElementById('mindmap-chooser');
        mindMapChooser.addEventListener('change', function (event) {
            var files = mindMapChooser.files;
            console.log(files);
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
    MindmapMenu.prototype.loadFileJsMind = function (content, type, freemind_name) {
        if (type == "mm") {
            var freemind_data = content;
            if (freemind_data) {
                var mind_name = freemind_name.substring(0, freemind_name.length - 3);
                var mind = {
                    "meta": {
                        "name": mind_name,
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
    };
    return MindmapMenu;
}());
/**
 * for GUI operations in general (except the gui sidebar)
 */
var Gui = (function () {
    function Gui() {
    }
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
     * used for creating new project window
     * @param listPdf
     */
    Gui.prototype.windowNewProject = function (listPdf) {
        var pathName = "";
        var dirProcess = null;
        var listFiles = "";
        $("#myModal").modal();
        document.getElementById("projectName").value = "MyThesis";
        document.getElementById("projectPdf").value = "";
        var promise = new Promise(function (resolve, reject) {
            $("input:file").on("change", function (result) {
                var lastResult = new Array;
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
            });
        });
        return promise;
    };
    /**
    * Used for creating shaking effect into modal
    * @param id
    */
    Gui.prototype.effectShaking = function (id) {
        var element = document.getElementById(id);
        $(element).effect("shake");
    };
    return Gui;
}());
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
     */
    GuiSideBar.prototype.setGuiInit = function (data, directory) {
        $("#loading-data").remove();
        $("#drag").remove();
        var util = new Utils();
        // Parse JSON File
        var objekt = util.parseJsonFile(data);
        var titleFile = "";
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
     */
    GuiSideBar.prototype.setGuiOnAppend = function (object, directory) {
        this.setDynamicHtml(object, "append", directory);
    };
    /**
     *Clear the side bar
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
     * @param util
     */
    GuiSideBar.prototype.searchAnnotation = function (keyword, util, directory) {
        if (keyword == "") {
            this.resetSidebar();
            programCaller("refresh");
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
    };
    /**
     *Listener of the jsmind. It will update the main jsmind tree in any changes
     */
    GuiSideBar.prototype.setJsmindListener = function (contextMenu) {
        // Update the annotation panel on each MindMap event
        _jm.add_event_listener(function () {
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
     * Set Treeview based on input data in JSON Format
     * @param input
     */
    GuiSideBar.prototype.setTreeListener = function (input) {
        $('#tree').treeview({ data: input });
    };
    /**
     * Clear Treeview
     */
    GuiSideBar.prototype.resetTreeView = function () {
        $('#tree').treeview({ data: "" });
    };
    /**
     * Set the dynamic HTML for the input of the object
     * @param objekt
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
        this.basicHtmlTitle = "<li id=" + pdfId + " " + "class=pdf-title" + " " + "style='cursor: no-drop; background-color: #ccc;padding: 10px 18px'>" + fileName + "</li>";
        return this.basicHtmlTitle;
    };
    /**
     *Set the dynamic HTML for the annotation contents
     * @param node
     * @param appendToName
     * @param className
     */
    GuiSideBar.prototype.setDynamicHtmlContent = function (node, appendToName, className, mode, directory) {
        var htmlContent = document.createElement("li");
        htmlContent.setAttribute("id", node.getId());
        htmlContent.setAttribute("pagenumber", node.getPageNumber());
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
     * to validate & check the requirements for new project
     */
    Project.prototype.checkNewProject = function (gui) {
        var checkStatus = true;
        var parm1 = document.getElementById("projectName").value;
        var parm2 = document.getElementById("projectPdf").value;
        $("p.ProjName").attr("hidden", true);
        $("p.ProjPdf").attr("hidden", true);
        if (parm1 == "") {
            checkStatus = false;
            $("p.ProjName").attr("hidden", false);
        }
        if (parm2 == "") {
            checkStatus = false;
            $("p.ProjPdf").attr("hidden", false);
        }
        if (checkStatus == false) {
            gui.effectShaking("myModal");
        }
        else {
            $("#myModal").modal('hide');
        }
        return checkStatus;
    };
    /**
     * when new project modal is opened
     * @param listPdf
     */
    Project.prototype.setNewProjectModal = function (listPdf) {
        var self = this;
        var gui = new Gui;
        var promise = gui.windowNewProject(listPdf);
        Promise.all([promise]).then(function (result) {
            var tempResult = result[0];
            self.setProjectLocation(tempResult[0]);
            self.setProjectPdfList(tempResult[1]);
        });
    };
    /**
     * When save button is pressed in new project modal
     * @param util
     * @param guiSideBar
     * @param listPdf
     */
    Project.prototype.createNewProject = function (util, guiSideBar, listPdf) {
        this.setProjectName(document.getElementById("projectName").value);
        this.saveProject(util, this.getProjectName(), this.getProjectLocation(), this.getProjectPdfList(), "");
        this.saveTreeView(util, guiSideBar, listPdf, this.getProjectName(), this.getProjectLocation(), this.getProjectPdfList());
        this.setProjectStatus("edited");
        programCaller('refresh');
    };
    /**
     * to save project
     * @param util
     */
    Project.prototype.setSaveProject = function (util) {
        var msg = this.getProjectLocation();
        this.saveProject(util, this.getProjectName(), this.getProjectLocation(), this.getProjectPdfList(), this.getProjectSavedFileLocation());
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
    Project.prototype.saveProject = function (util, projectName, projectLoc, listFiles, projectSavedFile) {
        var project = [];
        var annotation = [];
        var correspondingnode = [];
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
            correspondingnode = [];
            if (temp.children.length == 0) {
                correspondingnode.push("");
            }
            else {
                for (var j = 0; j < temp.children.length; j++) {
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
            project: project,
            annotation: annotation
        });
        var result = util.setJsonFile(itemResult);
        util.writeJsonFile(projectLoc, result, projectName);
    };
    Project.prototype.setArrayAnnotation = function (correspondingnode, nodes, i) {
        var annotation = [];
        annotation.push({
            id: nodes[i].id,
            text: nodes[i].topic,
            correspondingnode: correspondingnode,
            file: nodes[i].pdfid,
            page: nodes[i].index,
            placed: nodes[i].expanded
        });
        return annotation;
    };
    /**
     * Used to create bootstrap treeview file (.json)
     * @param util
     * @param guiSideBar
     * @param listPdf
     * @param projectName
     * @param projectLoc
     * @param listFiles
     */
    Project.prototype.saveTreeView = function (util, guiSideBar, listPdf, projectName, projectLoc, listFiles) {
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
        util.appendJsonFile("./", resultDir, "root");
        guiSideBar.setTreeListener(resultDir);
        listPdf.setListPdfFile(listFiles);
        listPdf.setLastModDate(listPdf.getModDateFs(util, projectLoc, listFiles));
    };
    /**
     * when open project is pressed
     */
    Project.prototype.setOpenProjectModal = function (util, guiSideBar, listPdf, mindmapMenu) {
        var input = $(document.getElementById('file-chooser'));
        input.trigger("click"); // opening dialog
        this.setOpenProjectListener(util, guiSideBar, listPdf, this, mindmapMenu);
    };
    /**
     * Listener of the open project
     * @param util
     * @param guiSideBar
     * @param listPdf
     * @param self
     */
    Project.prototype.setOpenProjectListener = function (util, guiSideBar, listPdf, self, mindmapMenu) {
        $("#file-chooser").on("change", function (result) {
            var fs = require("fs");
            var filePath = result.target.files[0].path;
            fs.readFile(filePath, function (err, data) {
                if (err) {
                    return console.error(err);
                }
                self.openProject(data, self, util, guiSideBar, listPdf, mindmapMenu);
            });
        });
    };
    /**
     * Open Project Main Program
     * @param data
     * @param self
     * @param util
     * @param guiSideBar
     * @param listPdf
     */
    Project.prototype.openProject = function (data, self, util, guiSideBar, listPdf, mindmapMenu) {
        var dataObject = util.parseJsonFile(data);
        console.log(dataObject);
        self.setProjectName(dataObject[0].project[0].projectname);
        self.setProjectLocation(dataObject[0].project[0].projectlocation);
        self.setProjectPdfList(dataObject[0].project[0].projectfiles);
        self.setProjectSavedFileLocation(dataObject[0].project[0].projectsavedfile);
        self.saveTreeView(util, guiSideBar, listPdf, self.getProjectName(), self.getProjectLocation(), self.getProjectPdfList());
        listPdf.setDirectory(self.getProjectLocation());
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
            programCaller('refresh');
        });
    };
    /**
     * When close project is pressed
     * @param guiSideBar
     * @param menu
     */
    Project.prototype.setCloseProject = function (guiSideBar, menu, gui, status) {
        if (status == "noedit") {
            // do nothing
        }
        else {
            var closeProjectStatus = gui.windowConfirmation("you are about to close project, save changes?");
            if (closeProjectStatus) {
                this.setSaveProject(util);
                if ((menu.getFileTypeSave() != null)) {
                    menu.saveFile(menu.getFileTypeSave(), project, util);
                }
                else {
                    menu.saveFile("mm", project, util);
                }
            }
        }
        guiSideBar.resetTreeView();
        guiSideBar.resetSidebar();
        this.setProjectStatus("noedit");
        menu.newMap();
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
function programCaller(data) {
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
            var keyword = document.getElementById("annotSearch").value;
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
            if (newProjectStatus) {
                project.createNewProject(util, guiSideBar, listPdf);
            }
            break;
        case "closeProject":
            //set routine for close project
            var status = project.getProjectStatus();
            project.setCloseProject(guiSideBar, mindmapMenu, gui, status);
            break;
        case "saveProject":
            // set routine for save project
            var saveProjectStatus = gui.windowConfirmation("save changes?");
            if (saveProjectStatus) {
                var msg = project.setSaveProject(util);
                gui.windowAlert("project is saved in" + " " + msg);
            }
            break;
    }
}
