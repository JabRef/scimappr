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
 *  Declare for a new SidebarNode of Drag & Drop
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
                var nodeid = ui.helper.prevObject.context.id;
                var topic = ui.helper.prevObject.context.innerHTML;
                var pdfid = ui.helper.prevObject.context.title;
                var pagenumber = ui.helper.prevObject.context.value;
                var node = _jm.add_node(selected_node, nodeid, topic, "", pdfid, pagenumber);
                /**
                 * adding PDF image link inside MindMap
                 */
                if ((pdfid != "undefine") || (pdfid != null)) {
                    var pdfViewer = "/scimappr/build/pdf.js/web/viewer.html";
                    var fileName = "?File=" + "/scimappr/" + pdfid;
                    var pageNumber = "#page=" + pagenumber.toString();
                    var link = pdfViewer + fileName + pageNumber;
                    var linkElement = document.createElement("a");
                    linkElement.setAttribute("href", link);
                    linkElement.setAttribute("target", "_blank");
                    var zIndex = 5;
                    linkElement.setAttribute("style", "z-index:" + zIndex);
                    var imgElement = document.createElement("img");
                    imgElement.setAttribute("id", nodeid);
                    imgElement.setAttribute("src", "/scimappr/build/img/pdf.png");
                    linkElement.appendChild(imgElement);
                    var selection = _this.findNodeByAttribute("nodeid", nodeid);
                    selection.appendChild(linkElement);
                }
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
     * This is the promisse to get file names from the given directory
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
    Annotation.prototype.setPageNumber = function (pagenumber) {
        this.pagenumber = pagenumber;
    };
    Annotation.prototype.getPageNumber = function () {
        return this.pagenumber;
    };
    return Annotation;
}());
/**
 *
 *
 */
var ListAnnotations = (function (_super) {
    __extends(ListAnnotations, _super);
    /**
     *
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
 * Utilities that are using to support the main program
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
    ContextMenu.prototype.actionPaste = function () {
        var selected_node = _jm.get_selected_node(); // select node when mouseover
        var topic = this.getClipBoard();
        _jm.add_node(selected_node, Date.now(), topic, '', '');
        var node = new Nodes(Date.now().toString(), topic, "", 0);
        var tempNode = node.findNodeByAttribute("nodeid", node.getId());
        tempNode.removeChild(tempNode.getElementsByTagName("a"));
        $('#contextMenu').hide();
    };
    ContextMenu.prototype.actionOpenPdf = function (directory) {
        var selected_node = _jm.get_selected_node(); // select node when mouseover
        var pdfViewer = "/scimappr/build/pdf.js/web/viewer.html";
        var fileName = "?File=" + directory.replace("docs", "") + selected_node.pdfid;
        window.open(pdfViewer + fileName, "_blank", "toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=1000, height=1000");
        $('#contextMenu').hide();
    };
    ContextMenu.prototype.actionCancel = function () {
        $('#contextMenu').hide();
    };
    return ContextMenu;
}());
var MindmapMenu = (function () {
    function MindmapMenu(jsMindObject) {
        this.jsMindObject = jsMindObject;
    }
    MindmapMenu.prototype.newMap = function () {
        var mindmap = {
            "meta": {
                "name": "jsMind",
                "version": "0.2"
            },
            "format": "node_tree",
            "data": { "id": "root", "topic": "Root", "children": [] }
        };
        this.jsMindObject.show(mindmap);
        // Reset the file selector
        document.querySelector('#mindmap-chooser').value = '';
    };
    MindmapMenu.prototype.saveFile = function (fileType) {
        var mind_data;
        if (fileType === 'jm') {
            mind_data = this.jsMindObject.get_data();
        }
        else {
            mind_data = this.jsMindObject.get_data('freemind');
        }
        var mind_str = (fileType === 'jm') ? jsMind.util.json.json2string(mind_data) : mind_data.data;
        var file_name = prompt("Enter file name", mind_data.meta.name || 'jsMind');
        if (!file_name) {
            return;
        }
        if (fileType === 'jm') {
            jsMind.util.file.save(mind_str, 'text/jsmind', file_name + '.jm');
        }
        else {
            jsMind.util.file.save(mind_str, 'text/xml', file_name + '.mm');
        }
    };
    MindmapMenu.prototype.selectFile = function () {
        var file_input = document.getElementById('mindmap-chooser');
        file_input.click();
    };
    MindmapMenu.prototype.setListeners = function () {
        var mindMapChooser = document.getElementById('mindmap-chooser');
        mindMapChooser.addEventListener('change', function (event) {
            var files = mindMapChooser.files;
            if (files.length <= 0) {
                alert('please choose a file first');
            }
            var file_data = files[0];
            if (/.*\.mm$/.test(file_data.name)) {
                jsMind.util.file.read(file_data, function (freemind_data, freemind_name) {
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
                });
            }
            else {
                jsMind.util.file.read(file_data, function (jsmind_data, jsmind_name) {
                    var mind = jsMind.util.json.string2json(jsmind_data);
                    if (!!mind) {
                        _jm.show(mind);
                    }
                    else {
                        alert('The selected file is not supported');
                    }
                });
            }
        });
    };
    return MindmapMenu;
}());
/**
 * For the creation of the side bar
 */
var GuiSideBar = (function () {
    function GuiSideBar() {
    }
    /**
     * Initilize the Sidebar for the first time or when Refresh
     * @param data
     */
    GuiSideBar.prototype.setGuiInit = function (data) {
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
        $(titleFile).appendTo(".list-group");
        this.setDynamicHtmlObject(objekt);
    };
    /**
     * Adding GUI on SideBar when refreshAnnotation is done
     * @param object
     */
    GuiSideBar.prototype.setGuiOnAppend = function (object) {
        this.setDynamicHtmlObject(object);
    };
    /**
     *Clear the side bar
     */
    GuiSideBar.prototype.resetSidebar = function () {
        $(".list-group").empty();
    };
    /**
    * check if the SideBar Nodes have existed
    * if no then do refresh
    * if yes then do refreshAnnotation
    */
    GuiSideBar.prototype.checkSideBar = function () {
        var isSideBarExist = false;
        var nodes = $('.list-group-item').get();
        if (nodes.length != 0) {
            isSideBarExist = true;
        }
        return isSideBarExist;
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
            var nodes = $('.list-group-item').get();
            nodes.forEach(function (node) {
                if (_jm.mind.nodes[node.id]) {
                    $('#' + node.id).hide();
                }
                else {
                    $('#' + node.id).show();
                }
            });
        });
    };
    /**
     * Set the dynamic HTML for the input of the object
     * @param objekt
     */
    GuiSideBar.prototype.setDynamicHtmlObject = function (objekt) {
        var node;
        for (var i = 0; i < objekt.length; i++) {
            var input = objekt[i];
            var annot = new Annotation(input["filename"], input["id"], input["topic"], input["subtype"], input["title"], input["pagenumber"]);
            node = new Nodes(annot.getId(), annot.getTopic(), annot.getFileName(), annot.getPageNumber());
            // All annotations must exist in the Sidebar, whether hidden or visible
            if (!this.doesAnnotationExistInSidebar(node.getId())) {
                // If the annotation does not exist, add it to sidebar
                this.setDynamicHtmlContent(node, ".list-group", " drag list-group-item");
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
    GuiSideBar.prototype.setDynamicHtmlContent = function (node, appendToName, className) {
        var htmlContent = document.createElement("li");
        htmlContent.setAttribute("id", node.getId());
        htmlContent.setAttribute("pagenumber", node.getPageNumber());
        htmlContent.value = node.getPageNumber();
        htmlContent.innerHTML = node.getTopic();
        this.basicHtmlContent = htmlContent;
        //this.basicHtmlContent = "<li id=" + node.getId() + ">" + node.getTopic() + "</li>";
        $(this.basicHtmlContent).appendTo(appendToName).draggable(node.setDraggable());
        $(this.basicHtmlContent).droppable(node.setDroppable());
        document.getElementById(node.getId()).className += className;
        document.getElementById(node.getId()).title += node.getFileName();
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
}());
// ========================================================= //
// Function Section
// ========================================================= //
var node;
var dir = "/scimappr/docs";
var listPdf = new ListPdf(new Array, new Array, dir);
var listAnnotation = new ListAnnotations(dir);
var util = new Utils();
var contextMenu = new ContextMenu();
var mindmapMenu;
var guiSideBar = new GuiSideBar();
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
            node = new Nodes("", "", "", 0);
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
            mindmapMenu.setListeners();
            //get PDF's lists
            var pdfProcess = listPdf.getPdf();
            Promise.all([pdfProcess]).then(function (response) {
                listPdf.setListPdfFile(response[0]);
                listPdf.setLastModDate(listPdf.getModDate(util, response[0]));
            });
            //var guiSideBar = new GuiSideBar();
            guiSideBar.setJsmindListener(contextMenu);
            break;
        /**
         *When the refresh pdf is called
         */
        case "refresh":
            /**
            * check if sidebar is existed, if yes then do refreshAnnotation
            */
            var isSideBarExist = guiSideBar.checkSideBar();
            if (isSideBarExist) {
                programCaller("refreshAnnotation");
                break;
            }
            //get PDF's lists
            var pdfProcess = listPdf.getPdf();
            guiSideBar.resetSidebar();
            // get annotation's lists
            Promise.all([pdfProcess]).then(function (response) {
                listPdf.setListPdfFile(response[0]);
                for (var i = 0; i < listPdf.getCount(); i++) {
                    var pdfPages = listPdf.getPdfPage(listPdf.getListPdfFile(i), listPdf.getListPdfFile(i));
                    Promise.all([pdfPages, pdfProcess, i]).then(function (responsePages) {
                        var pdfAnnots = listAnnotation.getAnnotations(responsePages[0], listPdf.getListPdfFile(responsePages[2]));
                        Promise.all([pdfProcess, pdfPages, pdfAnnots]).then(function (responseResult) {
                            var resultJson = responseResult[2];
                            guiSideBar.setGuiInit(resultJson);
                        });
                    });
                }
            });
            break;
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
                        var pdfAnnots = listAnnotation.getAnnotations(responsePages[0], listPdf.getListPdfFile(responsePages[1]));
                        Promise.all([pdfProcess, pdfPages, pdfAnnots]).then(function (responseResult) {
                            var newNodes = JSON.parse(responseResult[2]);
                            guiSideBar.setGuiOnAppend(newNodes);
                        });
                    });
                }
            }
            else {
                alert("No Change in Annotation");
            }
            break;
        case "copyMenu":
            contextMenu.actionCopy();
            break;
        case "pasteMenu":
            contextMenu.actionPaste();
            break;
        case "openPDFMenu":
            contextMenu.actionOpenPdf(dir);
            break;
        case "cancelMenu":
            contextMenu.actionCancel();
            break;
    }
}
function menuAction(action, data) {
    mindmapMenu[action](data);
}
