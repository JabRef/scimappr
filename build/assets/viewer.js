/*global PDFJS:false, console:false, Promise:false */

'use strict';

PDFJS.disableWorker = true;
PDFJS.disableRange = true;

// JSMind Configuration
var options = {
  container:'jsmind_container',
  editable:true,
  theme:'orange'
};
var mind = {
  meta: {
    "name":"jsMind remote",
    "author":"hizzgdev@163.com",
    "version":"0.2"
  },
  format:"node_tree",
  data: {
    id: "root", topic: "PDF", children: []
  }
}
var jm = new jsMind(options);

var sendData = function (data) {
  var xhr = new XMLHttpRequest();
  xhr.open("POST", '/sendData', false);

  // Send the proper header information along with the request
  xhr.setRequestHeader("Content-type", "application/json");

  xhr.send(JSON.stringify(data));
}

var getRandomString = function (num) {
  num = num || 6;
  return Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, num);
};

// to read pdfs and extract annottations
var loadPDF = function (filePath, fileName) {
  PDFJS.getDocument(filePath).then(function (pdf) {
    var promises = [], promise;

    for (var i = 1; i < pdf.numPages; i++) {
      promise = pdf.getPage(i).then(function (page) {
        return page.getAnnotations();
      });
      promises.push(promise);
    }

    var ignoreList = ['Link'];

    Promise.all(promises).then(function (pages) {
      var items = [];

      pages.forEach(function(annotations) {
        annotations
          .filter(function (annotation) {
            return !ignoreList.includes(annotation.subtype)
          })
          .forEach(function(annotation) {
            if( (annotation.subtype == "Popup")){
              items.push({
                id: getRandomString(),
                subtype: annotation.subtype,
                title: annotation.title,
                topic: annotation.contents
              });
            }
          });
        });

      mindmap[fileName] = items;

      // Prepare MindMap Node
      var mindmapNode = { id: getRandomString(), topic: fileName };
      mindmapNode.children = items;

      // Add the Node to the Mindmap
      // mind.data.children.push(mindmapNode);
      pdfTree.push({ id: getRandomString(), fileName: fileName, annotations: items });
      sendData({ fileName: fileName, data: items });
    }).then(function () {
      // Re-render Mindmap after processing every PDF
      jm.show(mind);
      renderPDFList();
    });
  });
}

function renderPDFList() {
	var base = '<h3>PDFs</h3>';
	pdfTree.forEach(function (eachCard) {
		base += '<div class="pdfCard" onclick="renderAnnotations(\'' + eachCard.id + '\')">' + eachCard.fileName + '</div>';
	});

  // 'base' variable contains the HTML for the pdfList inner data
  // Set the innerHTML with contents of 'base' 
	document.getElementById('pdfList').innerHTML = base;
}

function renderAnnotations(fileId) {
  // Select the required file based on the fileId
  var selectedFile = pdfTree.filter(function (eachCard) {
    return eachCard.id === fileId;
  })[0];

  var base = '<h3>Annotations</h3>';
  selectedFile.annotations.forEach(function (eachCard) {
    base += '<div class="annotationCard" onclick="addToMindmap(\'' + eachCard.id + '\')">' + eachCard.topic + '</div>';
  });

  // 'base' variable contains the HTML for the annotationList inner data
  // Set the innerHTML with contents of 'base' 
  document.getElementById('annotationList').innerHTML = base;
  
  // Make the annotationList box visible
  document.getElementById('annotationList').style.display = 'block';
}

function addToMindmap() {
  // To be implemented
}

var files,
  file,
  extension,
  input = document.getElementById("fileURL"),
  mindmap = {},
  pdfTree = [],
  selectedFile;

window.pdfTree = pdfTree;
window.mindmap = mindmap;
input.addEventListener("change", function(e) {
  // Reset
  pdfTree = [];
  files = e.target.files;
  var len = files.length;
  var promises = [], promise;

  for (var i = 0; i < len; i++) {
    file = files[i];
    extension = file.name.split(".").pop();
    if (extension == 'pdf') {
      loadPDF(URL.createObjectURL(file), file.name);
    }
  }
}, false);
