
$(document).ready(function() {
	

	function buildURL(baseURL, processInstanceId) {
		var urlToCall = baseURL.replace('{containerId}', $('#containerid').val());
		urlToCall = urlToCall.replace('{processInstanceId}', processInstanceId);
		urlToCall = urlToCall.replace('{protocolhostport}', $('#protocolhostport').val());
		return urlToCall;
	}

    $('#step1_button').click(function () {
        jQuery.support.cors = true;
        var urlToCall = buildURL($('#step1_url').val(), $('#processInstanceId').val());

        $.ajax(
            {
                type: "POST",
                url: urlToCall,
                data: $('#step1_json').val(),
                contentType: "application/json; charset=utf-8",
				crossDomain: true,
                headers: {
                        'Accept': 'application/json',
                        'Authorization': "Basic " + btoa($("#username").val() + ":" + $("#password").val())
                    },
                success: function (data) {
	//alert(JSON.stringify(data));
                    $('#processInstanceId').val(data);
                    //alert("Process instance created id:" + data);
                    $('#step2_json').val('');
                     $("#tabs").tabs("option", "active", 2);
                },

                error: function (msg, url, line) {
				alert(JSON.stringify(msg));
                    alert('error trapped msg = ' + msg + ', url = ' + url + ', line = ' + line);

                }
            });
     });

	function displayProcessInstanceState(processInstanceId) {
		var urlToCall = buildURL($('#step2b_url').val(), processInstanceId);
		jQuery.support.cors = true;
		 $.ajax(
            {
                type: "GET",
                url: urlToCall,
 				dataType: 'html',
                headers: {
                        'Accept': 'application/json; charset=utf-8',
                        'Authorization': "Basic " + btoa($("#username1").val() + ":" + $("#password1").val())
                    },
                success: function (data) {
					alert(JSON.stringify(data.process-instance-variables));
					
                },
                error: function (msg, url, line) {
                    alert('error trapped msg = ' + msg + ', url = ' + url + ', line = ' + line);

                }
            });
	}
	
	function displaySVG(urlToCall,index, processInstanceId) {
		jQuery.support.cors = true;
		 $.ajax(
            {
                type: "GET",
                url: urlToCall,
 				dataType: 'html',
                headers: {
                        'Accept': 'application/svg+xml',
                        'Authorization': "Basic " + btoa($("#username1").val() + ":" + $("#password1").val())
                    },
                success: function (data) {
					var div = $('<div/>');
					div.append('<p onclick="javascript:displayProcessInstanceState(' + processInstanceId + ')">Process Instance Id: ' + processInstanceId + '</p>')
					
					div.append(data);
					$("#svgimgs").append(div); 
					//$("#svgimg"+index).html(data);
                },
                error: function (msg, url, line) {
                    alert('error trapped msg = ' + msg + ', url = ' + url + ', line = ' + line);

                }
            });
	}
	var idx = 0;
	
	function getProcessInstanceChildren(urlToCall) {
		jQuery.support.cors = true;
		$.ajax(
            {
                type: "GET",
                url: urlToCall,
 				crossDomain: true,
                headers: {
                        'Accept': 'application/json',
                        'Authorization': "Basic " + btoa($("#username").val() + ":" + $("#password").val())
                    },
                success: function (data) {
					
					//alert(JSON.stringify(data));

					$.each(data["process-instance"], function(index, val) { 
						idx = idx + 1;
						displayDiagram(val["process-instance-id"]);
					});
                },
                error: function (msg, url, line) {
                    alert('error trapped msg = ' + msg + ', url = ' + url + ', line = ' + line);

                }
            });
	}
	
	function displayDiagram(processInstanceId) {
		jQuery.support.cors = true;
		var urlToCall = buildURL($('#step2_url').val(), processInstanceId);
		displaySVG(urlToCall,idx,processInstanceId);
		// Call the children
		var urlToCall = buildURL($('#step2a_url').val(), processInstanceId);
		obj = getProcessInstanceChildren(urlToCall);
		
		
		
		
	}
     $('#step2_button').click(function () {
		idx = 0;
		$("#svgimgs").empty();
		displayDiagram($('#processInstanceId').val());
		
       	
     });

     $('#step3a_button').click(function () {
        var urlToCall = $('#step3a_url').val().replace('{containerId}', $('#containerid').val());
        urlToCall = urlToCall.replace('{taskid}', $('#currentTaskId').val());
        doPut(urlToCall,0);
     });

    $('#step3b_button').click(function () {
        var urlToCall = $('#step3b_url').val().replace('{containerId}', $('#containerid').val());
        urlToCall = urlToCall.replace('{taskid}', $('#currentTaskId').val());
        doPut(urlToCall,0);
     });

     $('#step3c_button').click(function () {
        var urlToCall = $('#step3c_url').val().replace('{containerId}', $('#containerid').val());
        urlToCall = urlToCall.replace('{taskid}', $('#currentTaskId').val());
             doPut(urlToCall,4);
          });

    $('#step4_button').click(function () {
        jQuery.support.cors = true;

        $.ajax(
            {
                type: "GET",
                url: $('#step4_url').val(),
                contentType: "application/json; charset=utf-8",
                headers: {
                        'Accept': 'application/json',
                        'Authorization': "Basic " + btoa($("#username1").val() + ":" + $("#password1").val())
                    },
                dataType: "json",
                success: function (data) {

                    var formattedData = JSON.stringify(data, null, '\t');
                    $('#step4_json').val(formattedData);
                    var s = '';
                    var firstItem;
                    jQuery.each(data["task-summary"], function(index, item) {
                        if (!firstItem && item["task-proc-inst-id"] == $('#processInstanceId').val() &&
                            item["task-name"] == 'Hoa Approval') {
                            firstItem = item["task-id"];
                            $('#currentTaskId').val(firstItem);
                        }
                        if (item["task-proc-inst-id"] == $('#processInstanceId').val() &&
                                                    item["task-name"] == 'Hoa Approval') {
                            s = s + ' ' + item["task-id"];
                        }
                    });
                    alert("These Hoa Approval tasks are available for current process :" + s);
                    if (firstItem) {
                        alert("Defaulting using task of " + firstItem );
                    }
                },
                error: function (msg, url, line) {
                    alert('error trapped msg = ' + msg + ', url = ' + url + ', line = ' + line);

                }
            });
     });



 $('#step6a_button').click(function () {
        var urlToCall = $('#step6a_url').val().replace('{containerId}', $('#containerid').val());
        urlToCall = urlToCall.replace('{taskid}', $('#currentTaskId').val());
        doPut(urlToCall,0);
     });

    $('#step6b_button').click(function () {
        var urlToCall = $('#step6b_url').val().replace('{containerId}', $('#containerid').val());
        urlToCall = urlToCall.replace('{taskid}', $('#currentTaskId').val());
        doPut(urlToCall,6);
     });


$('#step7a_button').click(function () {
        jQuery.support.cors = true;
        var urlToCall = $('#step7_url').val().replace('{containerId}', $('#containerid').val());
        urlToCall = urlToCall.replace('{processInstanceId}', $('#processInstanceId').val());
        $.ajax(
            {
                type: "GET",
                url: urlToCall,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                headers: {
                        'Accept': '*/*',
                        'Authorization': "Basic " + btoa($("#username1").val() + ":" + $("#password1").val())
                    },
                success: function (data) {
                    var formattedData = JSON.stringify(data, null, '\t');
                    $('#step7a_json').val(formattedData);
                },
                error: function (msg, url, line) {
                    alert('error trapped msg = ' + msg + ', url = ' + url + ', line = ' + line);

                }
            });
     });

    $('#step7b_button').click(function () {
        jQuery.support.cors = true;
        var urlToCall = $('#step7_url').val().replace('{containerId}', $('#containerid').val());
        urlToCall = urlToCall.replace('{processInstanceId}', $('#processInstanceId').val());
        var jsonToSend = $('#step7b_json').val();
        $.ajax(
            {
                type: "POST",
                url: urlToCall,
                data: jsonToSend,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                headers: {
                        'Accept': '*/*',
                        'Authorization': "Basic " + btoa($("#username1").val() + ":" + $("#password1").val())
                    },
                complete: function(xhr) {
                     if (xhr.readyState == 4) {
                         if (xhr.status == 201) {
                             alert("Updated");
                             $("#tabs").tabs("option", "active", 7);
                         }
                     } else {
                         alert("Failed");
                     }
                 }
            });
     });

     $('#step8_button').click(function () {
        var urlToCall = $('#step8_url').val().replace('{containerId}', $('#containerid').val());
        urlToCall = urlToCall.replace('{taskid}', $('#currentTaskId').val());
             doPut(urlToCall,8);
          });



     function doPut(urlToCall, tabid) {
        jQuery.support.cors = true;

         $.ajax(
             {
                 type: "PUT",
                 url: urlToCall,
                 contentType: "application/json; charset=utf-8",
                 headers: {
                         'Accept': '*/*',
                         'Authorization': "Basic " + btoa($("#username1").val() + ":" + $("#password1").val())
                     },
                 complete: function(xhr) {
                     if (xhr.readyState == 4) {
                         if (xhr.status == 201) {
                             alert("Updated");
                             if (tabid > 0) {
                                $("#tabs").tabs("option", "active", tabid);
                             }
                         }
                     } else {
                         alert("Failed");
                     }
                 }
             });

     }



});