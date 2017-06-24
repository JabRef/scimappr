"use strict";

	// ============================================================================================= //
	// Function PDF Section
	// ============================================================================================= //
	
	//'use strict';
	PDFJS.workerSrc = '/scimappr/build/assets/pdf.worker.js';
    PDFJS.disableWorker = true;
    PDFJS.disableRange = true;
	
	var dir = "/scimappr/doc/";
	var listFile = [];
	var files,
      file,
      extension,
      input = document.getElementById("fileURL"),
      mindmap = {};


	// When PDF is refreshed
	var mainRefreshPdf = function() {
		populateDir().then(function(v){
			listFile = v;
		Promise.all(listFile).then(function(v) {
				for(var k in listFile) {
				loadPDF(listFile[k], listFile[k].replace("http://", "").replace("localhost/", ""))
				}
			});
		});
	}
	
	
	// Keep the records of PDF File in a folder
	var populateDir = function() {
		return new Promise(function(resolve, reject) {
			var xhr = $.ajax({
            //This will retrieve the contents of the folder if the folder is configured as 'browsable'
			type:"GET",
            url: dir,
            success: function (data) {
				
               //List all pdfs file names in the page
               $(data).find("a:contains(" + ".pdf" + ")").each(function (e) {
					var filename = this.href.replace("http://", "").replace("localhost/", "").replace("scimappr/","doc/");
					getLastMod("/scimappr/" + filename, function(v) {
						console.log(v);
					});
					listFile.push(filename);
					resolve (listFile);
				});
            }
            });
		});
	}
	
	// get the annotations in a PDF File	
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
			  if((annotation.contents != "") && (annotation.subtype == "Popup")) {
			  items.push({
                  id: getHashFunction(fileName + " " + annotation.contents),
                  subtype: annotation.subtype,
                  title: annotation.title,
                  topic: annotation.contents
                });
			  }

              });
            });
          refreshUiPdf({ fileName: fileName, data: items });
        })
      });
    }

	// generate random string
	var getRandomString = function (num) {
      num = num || 6;
      return Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, num);
    };

	// generate Hash function for Id
	var getHashFunction = function (input) {
		var hash = hex_sha1("string");
		var hmac = hex_hmac_sha1("19", input);
		return hmac;
	}

	// generate last modified date & time
	var getLastMod = function(url, cb) {
		var req = new XMLHttpRequest();
		req.open("GET", url);
		req.send(null);
		req.addEventListener("load", function() {
			cb(req.getResponseHeader("Last-Modified"));
		}, false);
	}