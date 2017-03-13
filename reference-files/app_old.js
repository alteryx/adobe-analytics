//client id for the alteryx application
var client_id = '3398773387-alteryx';
//local redirect file
var redirectUri = 'http://cef.alteryx.com' + window.location.pathname;
//var redirectUri = 'http://cef.alteryx.com/C:/Program Files/Alteryx/bin/HtmlPlugins/Adobe Analytics/Adobe AnalyticsGui.html';
//construct the authURL for adobe
var authURL = "http://marketing.adobe.com/authorize?" + "client_id=" + client_id + "&response_type=" + "token" + "&redirect_uri=" + redirectUri;
//base URL for API requests
var endPoint = '';
//values that will be taken from the user input and stored in the config
var hash = '';
var reportSuite = '';

//hide all field sets to start

$("#authSelect").hide();
$("#creds").hide();
$("#reportOptions").hide();
$("#loader").hide();

function authMethod(auth) {
    clearError("authStatus");
    //set the auth method
    if (auth == "user") {
        document.getElementById('userButton').setAttribute("disabled", true);
        userGrant();
    }
    else {
        document.getElementById('devButton').setAttribute("disabled", true);
        devGrant();
    }
}

function userGrant() {
    //set the auth method in the config
    Alteryx.Gui.manager.GetDataItem('auth').value = 'user'
    //open the auth window with the current window
    window.location.href = authURL;
}

//auth flow for developer mode
function devGrant() {
    //set the auth method in the config
    Alteryx.Gui.manager.GetDataItem('auth').value = 'dev';
    //show the dev grant window
    $("#authSelect").hide();
    $("#creds").show();
}

function enableDev() {
    document.getElementById('connectButton').removeAttribute("disabled");
    clearError('connectionStatus');
}

//get auth token for developer mode
function getAuthToken() {
    //strip trailing whitespace from client id and secret
    Alteryx.Gui.manager.GetDataItem('clientID').value = Alteryx.Gui.manager.GetDataItem('clientID').value.replace(/^[ ]+|[ ]+$/g, "");
    Alteryx.Gui.manager.GetDataItem('clientSecret').value = Alteryx.Gui.manager.GetDataItem('clientSecret').value.replace(/^[ ]+|[ ]+$/g, "");
    //disable the connect button
    document.getElementById("connectButton").setAttribute("disabled", true);
    var url = "https://api.omniture.com/token";
    var authString = Alteryx.Gui.manager.GetDataItem('clientID').value + ":" + Alteryx.Gui.manager.GetDataItem('clientSecret').value;
    $.ajax({
        url: url,
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Basic " + btoa(authString));
        },
        type: "POST",
        data: "grant_type=client_credentials",
        success: function (data, status) {
            hash = data.access_token;
            Alteryx.Gui.manager.GetDataItem('token').value = hash;
            getEndpoint();
        },
        error: function (textStatus, errorThrown, jqXHR) {
            setError("connectionStatus", textStatus.responseJSON.error_description);
            devGrant();
        }
    });
}


//handle the loading of the configuration
if (Alteryx.Gui.manager === null && window.location.hash !== '') {
    setConfiguration();
}

//if the window search parameter is empty, it probably means that the user selected "cancel" and should be redirected to the landing page
else if (window.location.search !== '') {
    setConfiguration();
}

function setConfiguration() {
    window.Alteryx.JsEvent(JSON.stringify({
        Event: "RequestConfiguration",
        callback: "window.requestConfigCallback"
    }));

    window.requestConfigCallback = function (response) {

        var p1 = new Promise(function (resolve, reject) {
            Alteryx.Gui.SetConfiguration(response);
            resolve("Completed")
        })

        p1.then(function (result) {
            //if search is populated, then show the main landing page
            if (window.location.search !== '') {
            }
            //otherwise execute getReportSuites
            else {
                getEndpoint();
            }
        })
    }
}

//for the user auth flow, extract the auth token passed through the window.location
function extractHash() {
    //extract the hash
    hash = /(?:token=)([^&]*)/.exec(window.location.hash);
    hash = hash[1];
    Alteryx.Gui.manager.GetDataItem('token').value = hash;
}

function getReportSuites() {
    var currMethod = "?method=Company.GetReportSuites";
    var url = endPoint + currMethod + "&access_token=" + hash;
    var reportSuiteList = [];
    var reportSuites = $.ajax({
        url: url,
        dataType: 'json'
    });
    handleLoad(reportSuites);
    reportSuites.then(function (data) {
        var reports = data.report_suites;
        for (var i = 0; i < reports.length; i++) {
            reportSuiteList.push({
                uiobject: reports[i].site_title,
                dataname: reports[i].rsid
            })
        }
        Alteryx.Gui.manager.GetDataItem('reportSuite').setStringList(
            _.sortBy(reportSuiteList, function(x) {return x.uiobject.toLowerCase()})
        );
        checkReportSuite();
        $("#creds").hide();
        $("#reportOptions").show();

    }, function (textStatus, errorThrown, jqXHR) {
        //changeCredentials();
        //setError("authStatus", textStatus.responseJSON.error_description);
    });
}

function getElements(elementComponent) {
    if (['elements', 'elementTwo', 'elementThree'].indexOf(elementComponent) == -1) {
        elementComponent = 'elements';
    }
    //if (elementComponent === null) {
    //    elementComponent = 'elements';
    //}
    var currMethod = "?method=Report.GetElements";
    var url = endPoint + currMethod + "&access_token=" + hash;
    var elements = [];
    var requestData = generateRequestData("element", elementComponent);
    //console.log(elementComponent + " " + JSON.stringify(requestData));
    var elementPromise = $.ajax({
        url: url,
        dataType: 'json',
        data: requestData,
        success: function (data, status) {
            data = _.sortBy(data, function (x){return x.name.toLowerCase()});
            //push the data to the element widget
            for (var i = 0; i < data.length; i++) {
                elements.push({
                    uiobject: data[i].name,
                    dataname: data[i].id
                })
            }

            //set the string list for the widget to be populated
            Alteryx.Gui.manager.GetDataItem(elementComponent).setStringList(elements);

            //call get elements  for element 2
            if (elementComponent == 'elements') {
                getElements('elementTwo');
            }
            //call get elements for element 3
            else if (elementComponent == 'elementTwo') {
                getElements('elementThree');
            }
        },

        error: function (textStatus) {
            //setError("authStatus", textStatus.responseJSON.error_description);
        }

    });
    handleLoad(elementPromise);
}

function changeCredentials() {
    //clear the values of auth type and token so that when the manager is set, there will be no conflict
    Alteryx.Gui.manager.GetDataItem("auth").value = '';
    Alteryx.Gui.manager.GetDataItem("token").value = '';

    //remove the disabled attributes of the buttons on the auth selection view
    document.getElementById('userButton').removeAttribute("disabled");
    document.getElementById('devButton').removeAttribute("disabled");
    enableDev();

    //show only the auth selection view
    $("#reportOptions").hide();
    $("#creds").hide();
    $("#authSelect").show();
    $("#loader").hide();
}
//Add reportType as an argument to this function.
function generateRequestData(type, elementComponent) {

    var requestData = {};
    var existingElements = [];
    //reportSuite
    reportSuite = Alteryx.Gui.manager.GetDataItem('reportSuite').value;
    requestData.reportSuiteID = reportSuite;

    if (type === 'metric') {
        //existing elements
        if (Alteryx.Gui.manager.GetDataItem('elements').value) {

            existingElements.push(Alteryx.Gui.manager.GetDataItem('elements').value);
            requestData.existingElements = existingElements;
        }
        //reportType
        if (getReportType()) {
            requestData.reportType = getReportType();
        }
    }

    if (type === 'element') {
        //existing metrics
        if (Alteryx.Gui.manager.GetDataItem('metrics').value) {
            var existingMetrics = [];
            existingMetrics.push(Alteryx.Gui.manager.GetDataItem('metrics').value);
            requestData.existingMetrics = existingMetrics;
        }

        if (elementComponent == 'elements') {
            if (Alteryx.Gui.manager.GetDataItem('elementTwo').value) {
                existingElements.push(Alteryx.Gui.manager.GetDataItem('elementTwo').value);
            }
            if (Alteryx.Gui.manager.GetDataItem('elementThree').value) {
                existingElements.push(Alteryx.Gui.manager.GetDataItem('elementThree').value);
            }
        }

        else if (elementComponent == 'elementTwo') {
            if (Alteryx.Gui.manager.GetDataItem('elements').value) {
                existingElements.push(Alteryx.Gui.manager.GetDataItem('elements').value);
            }
            if (Alteryx.Gui.manager.GetDataItem('elementThree').value) {
                existingElements.push(Alteryx.Gui.manager.GetDataItem('elementThree').value);
            }
        }

        else if (elementComponent == 'elementThree') {
            if (Alteryx.Gui.manager.GetDataItem('elements').value) {
                existingElements.push(Alteryx.Gui.manager.GetDataItem('elements').value);
            }
            if (Alteryx.Gui.manager.GetDataItem('elementTwo').value) {
                existingElements.push(Alteryx.Gui.manager.GetDataItem('elementTwo').value);
            }
        }
        requestData.existingElements = existingElements;
    }
    return requestData;
}

function getReportType() {
    var reportType = '';
    if (Alteryx.Gui.manager.GetDataItem('granularity').value && Alteryx.Gui.manager.GetDataItem('elements').value) {
        reportType = 'trended';
    }
    else if (Alteryx.Gui.manager.GetDataItem('granularity').value && Alteryx.Gui.manager.GetDataItem('elements').value == '') {
        reportType = 'overtime';
    }

    else if (Alteryx.Gui.manager.GetDataItem('granularity').value == '' && Alteryx.Gui.manager.GetDataItem('elements').value) {
        reportType = 'ranked';
    }
    return reportType
}

function getMetrics() {
    var metrics = [];
    var currMethod = "?method=Report.GetMetrics";
    var url = endPoint + currMethod + "&access_token=" + hash;
    var requestData = generateRequestData("metric");
    var metricPromise = $.ajax({
        url: url,
        data: requestData,
        dataType: 'json',
        success: function (data, status) {
            data = _.sortBy(data, function (x){return x.name.toLowerCase()});
            for (var i = 0; i < data.length; i++) {
                metrics.push({
                    uiobject: data[i].name,
                    dataname: data[i].id
                })
            }
            Alteryx.Gui.manager.GetDataItem('metrics').setStringList(metrics);
        }
    })
    handleLoad(metricPromise);

}

//helper function to set the errors
function setError(element, error) {
    document.getElementById(element).setAttribute("style", "display:block; background: rgba(208, 2, 27, .2); padding-top: 10px; padding-bottom: 10px; padding-left: 5px; padding-right: 5px");
    document.getElementById(element).innerHTML = error;
}

//helper function to clear the errors
function clearError(element) {
    document.getElementById(element).innerHTML = '';
    document.getElementById(element).setAttribute("style", "display:none");
}

function checkReportSuite() {
    if (Alteryx.Gui.manager.GetDataItem('reportSuite').value) {
        getElements('elements');
        getMetrics();
    }
}

function getEndpoint() {
    var url = "https://" + Alteryx.Gui.manager.GetDataItem('dataCenter').value + "/admin/1.4/rest/";
    endPoint = url;
    Alteryx.Gui.manager.GetDataItem('baseURL').value = url;
    getReportSuites();
}

//function to show and hide the loading svg
function handleLoad(promiseName) {
    var loader = $('#loader');
    loader.show();
    promiseName.then(function (data) {
            loader.hide();
        }, function(textStatus, errorThrown, jqXHR){
            loader.hide();
            if(jqXHR == 'Forbidden'){
                changeCredentials();
                setError("authStatus", textStatus.responseJSON.error_description);
            }
            //clear the element options if the metric is invalid
            else if (JSON.parse(textStatus.responseText).error == 'metric_invalid'){
                //clear the element lists if an invalid metric is selected
                Alteryx.Gui.manager.GetDataItem('elements').setStringList();
                Alteryx.Gui.manager.GetDataItem('elementTwo').setStringList();
                Alteryx.Gui.manager.GetDataItem('elementThree').setStringList();
            }

			else if (JSON.parse(textStatus.responseText).error == 'element_combination_unsupported'){

			}

            //catch any other errors, test for additional errors
            else {
                changeCredentials();
                setError("authStatus", textStatus.responseJSON.error_description);
            }
        }
    )
}

Alteryx.Gui.AfterLoad = function (manager, AlteryxDataItems) {
  /*  if (window.location.hash) {
        extractHash();
        Alteryx.Gui.manager.GetDataItem("auth").value = "user";
    }

    else if (
        manager.GetDataItem('auth').value == 'user' && manager.GetDataItem('token').value !== ''
    //&& window.location.hash == ''
    ) {
        hash = Alteryx.Gui.manager.GetDataItem('token').value;
        getEndpoint();
        //getReportSuites();
    }

    else if (manager.GetDataItem('auth').value == 'dev') {
        if (manager.GetDataItem('clientID').value && manager.GetDataItem('clientSecret').value) {
            getAuthToken();
        }
        else {
            devGrant();
        }
    }

    //criteria to show the landing page - > empty auth method and empty hash or auth token?
    else if (manager.GetDataItem('auth').value == '') {
        $("#authSelect").show();
    }
    */
/*
    //call out for metrics any time that element, report suite, or granularity changes
    Alteryx.Gui.manager.GetDataItem('elements').UserDataChanged.push(getMetrics);
    Alteryx.Gui.manager.GetDataItem('granularity').UserDataChanged.push(getMetrics);
    Alteryx.Gui.manager.GetDataItem('reportSuite').UserDataChanged.push(getMetrics);

    ////call out for elements any time that metric, report suite, or granularity changes
    Alteryx.Gui.manager.GetDataItem('metrics').UserDataChanged.push(getElements);
    Alteryx.Gui.manager.GetDataItem('granularity').UserDataChanged.push(getElements);
    Alteryx.Gui.manager.GetDataItem('reportSuite').UserDataChanged.push(getElements);
    Alteryx.Gui.manager.GetDataItem('elements').UserDataChanged.push(getElements);
    Alteryx.Gui.manager.GetDataItem('elementTwo').UserDataChanged.push(getElements);
    Alteryx.Gui.manager.GetDataItem('elementThree').UserDataChanged.push(getElements);
*/
    //any time that the endpoint changes, update the endpoint and make calls with the new endpoint
    Alteryx.Gui.manager.GetDataItem('dataCenter').UserDataChanged.push(getEndpoint);

};
