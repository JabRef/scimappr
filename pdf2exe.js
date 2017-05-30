

PDFJS.workerSrc = '/labcourse/utils/pdf.js/build/pdf.worker.js';
var pdfData = '/labcourse/doc/example.pdf';

var currPage = 1;
var numPage = 0;
var thePdf = "";
var idCount = 0;
var pdfContents = [""];
var tempContents = "";
var result = {
	children: []
};

var arrayData = [];

var rootResult = "";
 
$(function () {
	// Main Program
    PDFJS.getDocument(pdfData).then(function (pdf) {
		setRoot();
		thePdf = pdf;
		numPage = pdf.numPages;
		return pdf.getPage(1); 
    }).then(async function handlePage(page) {
        setupAnnotations(page);
		currPage++;
		if (currPage <= numPage) {
			thePdf.getPage(currPage).then(handlePage);
		} else {
				return jsonConcat(result);
		}
	});
	
	// Functions
	function setRoot() {
		rootResult = {
			"name" : "mDandyFirmansyah",
			"author" : "mochamad.dandy@gmail.com",
			"version" : 1.0
		}
		
		arrayData.push({
			"id" : "root",
			"isroot" : "true",
			"topic" : "MyMindMap"
		});
		
	}	
	
	function jsonConcat(result) {
		
		for (j = 0; j < result.children.length; j++) {
					arrayData.push({
							"id" : result.children[j].id,
							"topic" : result.children[j].topic
					});
			}
		
		var json = {
			"meta" : rootResult,
			"format" : "node_tree",
			"data" : arrayData
		}
		json = JSON.stringify(json);
		console.log(json);
		}
	

    function setupAnnotations(page) {
		page.getAnnotations().then(function (pdfPage) {
		pdfContents = [""]; 	
        pdfPage.forEach(function (annotation) { 
          if(tempContents == annotation.contents) {
			  // nothing to do
		  } else {
		  if(annotation.contents != "") {
			  tempContents = annotation.contents;
			  var topic = annotation.contents;
			  pdfContents.push(topic);
		  }
		  }
		  return pdfContents;
        });
		printChild(pdfContents);
		return result;
		});
		return result;
    }
	
	function printChild(pdfContents) {
			for (var i in pdfContents) {
				var data = pdfContents[i];
				if (i != 0) {
					idCount++;
					result.children.push({
							"id" : "child" + idCount,
							"topic" : data
					});
				}
			}
	}

});

