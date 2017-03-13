
/*
* Create a url which incorporates the user selected data center from the config
* input and alters the base url accordingly.
* @param dataCenter:  The string which corresponds to the proper domain for the
*                     user's selected dataCenter from the Config.
*/
function getEndpoint(dataCenter) {
    var url = "https://" + dataCenter + "/admin/1.4/rest/";
    //Alteryx.Gui.manager.GetDataItem('baseURL').value = url;
    // ADD IN API VERSION AS ARGUMENT
    return(url);
}

/*
* Create a promise that will to the list of reportSuite objects
* This function accepts two string arguments.
*
* @param endPoint:  The url (with the datacenter domain embedded) returned
*                   by the getEndpoint function.
*
* @param hash:      The string returned by the hashPromise which is itself
*                   returned by
*                   the getAuthToken function.
*
* @return Promise object which will itself return the Object containing the list
*         report_suites which is a list of the report_suite objects.
*/
function getReportSuitesAjaxCall(endPoint, hash) {
    var currMethod = "?method=Company.GetReportSuites";
    console.log(hash);
    var url = endPoint + currMethod + "&access_token=" + hash;
    console.log(url);
    var reportSuiteList = [];
    var settings = {
      type: 'GET',
      url: url,
      dataType: 'json'
    }
    return $.ajax(settings);
}
//Helper that will be called with a map function on the reportSuites promise output.
//It will be used to populate the config Combo Box menu.
/*
* Helper function which takes in a given report object and returns an object
* which can be directly injected into Alteryx Config ComboBox element
*/
var extractReport = function(report) {
  return ({uiobject: report.site_title,
          dataname: report.rsid});
};
/*
* This function will return a promise object which will resolve to an object
* which contains an access_token property which maps to a hash string.
* This function is specific to the Developer Login.  Need to verify it will
* work with the Consumer login.
*
* @param clientID:  The user's clientID credential from the config interface
*
* @param clientSecret: The user's clientSecret from config interface.  String
*                      value.
*
* @param url:  This is the full url value (it needs to contain the dataCenter
*               information) that is returned from the getEndpoint function.
*
* @return hashPromise:  Promise object which will resolve to data object
*                       that contains the access_token string property.
*/
function getAuthTokenAjaxCall(clientID, clientSecret, url) {
    //strip trailing whitespace from client id and secret
    var clientID = clientID.replace(/^[ ]+|[ ]+$/g, "");
    var clientSecret = clientSecret.replace(/^[ ]+|[ ]+$/g, "");
    var url = url;
    var authString = clientID + ":" + clientSecret;

    var settings = {
      url: url,
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Basic " + btoa(authString));
        },
        type: "POST",
        data: "grant_type=client_credentials"
    }
    return $.ajax(settings);
}

/*
* This function returns the object which is used by the various data fetching
* functions which are passing requests to the Adobe API.
*
* @param type: String value which tells what type of data is being requested
*              metadata is being requested from the Adobe API.
* @param granularityValue: String value which contains the menu option the user
*                          selected.  Example: 'Day'
* @param reportSuiteID:  This is a string parameter which is taken from the
*                        users selection in the reportSuite ComboBox input.
*
* @param existingElements:  This is a list of element objects taken from the
*                           users existing element selections.  It ensures that
*                           the remaining menus aren't populated with redundant
*                           elements.
* @param existingMetrics:   Similar to existingElements, this is a list of
*                           metric objects already selected for the report.
*/
function generateRequestData(type, granularityValue,
                            reportSuiteID, existingElements, existingMetrics)
  {
    //helper function used within generateRequestData.
    var getReportType = function (granularityValue, elementsValue) {
      var reportType = '';
      if (granularityValue && elementsValue) {
          reportType = 'trended';}
      else if ( granularityValue && elementsValue == '') {
          reportType = 'overtime';
      }
      else if (granularityValue == '' && elementsValue) {
          reportType = 'ranked';
      }
      return reportType
    }
    var requestData = {};
    var existingElements = typeof existingElements !== 'undefined' ?  existingElements : [];
    var existingMetrics = typeof existingMetrics !== 'undefined' ?   existingMetrics : [];

    requestData.reportSuiteID = reportSuiteID;

    if (type === 'metric') {
        requestData.reportType = getReportType(granularityValue, existingElements);
        requestData.existingElements = existingElements;
    }

    if (type === 'element') {
        requestData.existingMetrics = existingMetrics;
        requestData.existingElements = existingElements;
    }
    return requestData;
}
//This function uses the menu selections from config
//for granularity option and elements option (only the first elements drop down).
/*
This function returns the string value "reportType" which is needed by
generateRequestData function.

*@param granularityValue: String value which contains the menu option the user
*                        selected.  Example: 'Day'
*
*@param elementsValue:  The selected elements for the first elements drop down
*                       ComboBox.
*@returns reportType:   String value such as 'trended', 'ranked', etc.
*/
function getReportType(granularityValue, elementsValue) {
    var reportType = '';
    if (granularityValue && elementsValue) {
        reportType = 'trended';
    }
    else if ( granularityValue && elementsValue == '') {
        reportType = 'overtime';
    }
    else if (granularityValue == '' && elementsValue) {
        reportType = 'ranked';
    }
    return reportType
}
/*
Populate Elements Menu Logic

*/
//  Need to break this up and try to separate out exactly what's going on here.

function getElementsAjaxCall(endPoint, hash, requestData) {
    var currMethod = "?method=Report.GetElements";
    var url = endPoint + currMethod + "&access_token=" + hash;
    console.log(JSON.stringify(requestData));
    var settings = {
      url: url,
      dataType: 'json',
      data: requestData
    }
    return $.ajax(settings);
}
//***************************************** Helper functions****************************************
var ayxSetComboBoxValue = function(dataName, newValue) {
  Alteryx.Gui.manager.GetDataItem(dataName).setStringList(newValue);
}
