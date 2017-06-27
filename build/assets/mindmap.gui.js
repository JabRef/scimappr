// ============================================================================================= //
// JQuery Section
// ============================================================================================= //


var draggableOptions = {
				helper: 'clone',
				containment:'frame',
				opacity:'0.5',
				revert: 'invalid',
				appendTo: 'body',
				stop: function (ev, ui) {	
				var pos = $(ui.helper).offset();
				objName = "#clonediv"
				$(objName).css({
					"left": pos.left,
					"top": pos.top
				});
				$(objName).removeClass("drag");
				}
}
	
var droppableOptions = {
		drop: function (ev, ui) {
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

var objName = "";

var drag_drop = function() {
			$( ".drag" ).draggable(draggableOptions);
			$(".drop").droppable(droppableOptions);
}

var refreshUiPdf = function (data) {

	$("#loading-data").remove();
	$("#drag").remove();
	var file_title = "<li style='cursor: no-drop; background-color: #ccc;padding: 10px 18px'>" + data.fileName + "</li>";
	$(file_title).appendTo(".list-group");
	for(var m = 0; m < data.data.length; m++) {

		// Build JSON File
		var json_listmaker = {
				data: {
					id: data.data[m].id, topic: data.data[m].topic
				}
			}

		var json_result = JSON.stringify(json_listmaker);

		// Parse JSON File back

		var objekt = JSON.parse(json_result);
		
		setDynamicHtml(objekt);
	}

}

var setDynamicHtml = function(objekt) {
	var html_dynamic = "<li id=" + objekt.data.id +  ">" + objekt.data.topic + "</li>";
			
	$(html_dynamic).appendTo(".list-group").draggable(draggableOptions);
			
	document.getElementById(objekt.data.id).className += " drag list-group-item";
	document.getElementById(objekt.data.id).style += "z-index: 5";

	// Hide nodes that are already in the mindmap
	if (_jm.mind.nodes[objekt.data.id]) {
		$('#'+objekt.data.id).hide();
	}
	
}	

var actionCopy = function () {
	document.querySelector('#contextMenu').dataset.topic = document.querySelector('#contextMenu .actionCopy').dataset.topic;
	$('#contextMenu').hide();
};

var actionPaste = function () {
	var selected_node = _jm.get_selected_node(); // select node when mouseover
	var topic = document.querySelector('#contextMenu').dataset.topic;
	_jm.add_node(selected_node, Date.now(), topic);
	$('#contextMenu').hide();
};

// Update the annotation panel on each MindMap event
_jm.add_event_listener(function () {
	document.querySelectorAll('jmnode').forEach(function(each) {
		// Not efficient, need to figure out another way to do this. 
		each.oncontextmenu = function (e) {
			e.preventDefault();
			$('#contextMenu').show();
			$('#contextMenu').css({ position: 'absolute', marginLeft: e.clientX, marginTop: e.clientY-45 });
			document.querySelector('#contextMenu .actionCopy').dataset.topic = e.target.innerHTML;
		}
	});

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

function myCloseConfirmation() {
	if(confirm('are you sure to close?'))
		return true;
    else
		return false;
}

function myExitConfirmation() {
	if(confirm('are you sure to exit?'))
		return true;
	else
		return false;
}

function getUserInfo() {
		try {
			var network = new ActiveXObject('WScript.Network');
			prompt_info('User ID : ' + network.UserName + '\nComputer Name : ' + network.ComputerName + '\nDomain Name : ' + network.UserDomain);
			document.getElementById('<%= currUserID.ClientID %>').value = network.UserName;
			document.getElementById('<%= currMachineName.ClientID %>').value = network.ComputerName;
			document.getElementById('<%= currMachineDOmain.ClientID %>').value = network.UserDomain;
		} catch (e) {
			
		}
}