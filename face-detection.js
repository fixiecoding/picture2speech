$(document).ready(function() {

	//Credit: http://weblog.bocoup.com/using-datatransfer-with-jquery-events/
	jQuery.event.props.push("dataTransfer");

	var dropZone = $("#droparea");

	dropZone.on("dragover", function(e) {
		dropZone.addClass("dropready");
		e.stopPropagation();
		e.preventDefault();
		e.dataTransfer.dropEffect = 'copy';
	});
	dropZone.on("dragleave", function(e) {
		dropZone.removeClass("dropready");
	});

	dropZone.on("drop", function(e) {
		e.preventDefault();
		dropZone.removeClass("dropready");
		$("#statusText").html("");

		console.log("handling the drop like a mofo");

		if(e.dataTransfer.files.length === 0) return;
		if(e.dataTransfer.files.length >= 2) {
			$("#statusText").text("Please drop only one image at a time.");
			return;
		}
		var file = e.dataTransfer.files[0];

		var fileReader = new FileReader();
		fileReader.onload = function(e) {
			dropZone.html("<img/>")
			$("img",dropZone).attr("src", fileReader.result);
			doRekog(file);
		}
		fileReader.readAsDataURL(file);
	});

});

function doRekog(imgdata) {
	console.log("doRekog");
	var formData = new FormData();

	formData.append("uploaded_file",imgdata);
	formData.append("api_key", APIKEY);
	formData.append("api_secret", APISECRET);
	formData.append("jobs", "scene");

	$("#statusText").html("Sending picture to rekognition.com...");

	$.ajax({
		url: 'http://rekognition.com/func/api/',
		data: formData,
		cache: false,
		contentType: false,
		processData: false,
		dataType:"json",
		type: 'POST',
		success: function (data) {
			var result = "<h2>Results</h2>";
			if(data.scene_understanding) {
				for(var i=0, len=data.scene_understanding.length; i<len; i++) {
					var resultItem = data.scene_understanding[i];
					result += resultItem.label + " (Confidence: "+resultItem.score+")<br/>";
				}

			}
			$("#statusText").html(result);
		}
	});

}