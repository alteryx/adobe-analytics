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

    var existingElements = existingElements[0] !== '' ?  existingElements : [];
    var existingElements = _.filter(existingElements, function(x) {return x !== ''});

    var existingMetrics = existingMetrics[0] !== '' ?   existingMetrics : [];
    var existingMetrics = _.filter(existingMetrics, function(x) {return x !== ''});

    requestData.reportSuiteID = reportSuiteID;
    if (type === 'metric') {

      if (existingElements.length < 1) {
            requestData.reportType = getReportType(granularityValue, existingElements);
          } else {
            requestData.reportType = getReportType(granularityValue, existingElements);
            requestData.existingElements = existingElements;
          }
      if (existingMetrics.length > 0) {
            requestData.existingMetrics = existingMetrics;
      }
    }

    if (type === 'element') {
      requestData.reportType = getReportType(granularityValue, existingElements);
      if (existingMetrics.length > 0) {
            requestData.existingMetrics = existingMetrics;
      }
    }
    return requestData;
}
// **************** AJAX HELPER FUNCTIONS *********************


// ***********************Report Suites UI ****************************
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
    var url = endPoint + currMethod + "&access_token=" + hash;
    var reportSuiteList = [];
    var settings = {
      type: 'GET',
      url: url,
      dataType: 'json'
    }
    return $.ajax(settings);
}
//This function is meant to be chained onto the getAuthTokenAjaxCall
function fetchReportSuites(authTokenResult) {
  var endPoint = getEndpoint(Alteryx.Gui.manager.GetDataItem('dataCenter').value);
  return getReportSuitesAjaxCall(endPoint, authTokenResult.access_token);
}

function processReportSuitesList(result) {
  var data =  _.sortBy(result.report_suites, function (x){return x.site_title.toLowerCase()});
  var data = data.map( function (d,i) {
    return {uiobject: d.site_title,
            dataname: d.rsid}
  });
  return data
}

function populateReportSuitesList() {
  var url = "https://api.omniture.com/token";
  Alteryx.Gui.manager.GetDataItem('clientID').value = Alteryx.Gui.manager.GetDataItem('clientID').value.replace(/^[ ]+|[ ]+$/g, "");
  Alteryx.Gui.manager.GetDataItem('clientSecret').value = Alteryx.Gui.manager.GetDataItem('clientSecret').value.replace(/^[ ]+|[ ]+$/g, "");
  var clientID = Alteryx.Gui.manager.GetDataItem('clientID').value;
  var clientSecret = Alteryx.Gui.manager.GetDataItem('clientSecret').value;
  var fetchAuthToken = getAuthTokenAjaxCall(clientID, clientSecret, url)

  fetchAuthToken
    .then(fetchReportSuites)
    .then(processReportSuitesList)
    .done( function (reportsList) {
      console.log(reportsList);
      Alteryx.Gui.manager.GetDataItem('reportSuite').setStringList(reportsList);
    });
}
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
    var url = "https://api.omniture.com/token";
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
********************** ELEMENTS/DIMENSIONS ***********************************
******************************************************************************
*/
function updateElementDropDown(){
  var clientID = Alteryx.Gui.manager.GetDataItem('clientID').value;
  var clientSecret = Alteryx.Gui.manager.GetDataItem('clientSecret').value;
  var endPoint = getEndpoint(Alteryx.Gui.manager.GetDataItem('dataCenter').value);

  //Obtain currently selected values from all metric dropdowns.
  var metricsItems = ['metric_1', 'metric_2', 'metric_3'];
  var metricsItems = metricsItems.map(function(dataItem) {
    return Alteryx.Gui.manager.GetDataItem(dataItem).value
  })
  var elementsValue = [];
  //Obtain currently selected granularity from menu selection
  var granularityValue = Alteryx.Gui.manager.GetDataItem('granularitySelect').value;
  //Obtain reportSuiteID from selected report suite
  var reportSuiteID = Alteryx.Gui.manager.GetDataItem('reportSuite').value;
  // Create requestData payload.
  var requestData = generateRequestData('element', granularityValue,
                                        reportSuiteID, elementsValue,
                                        metricsItems);
  //Create a function here that will take a list and populate it to dataItem
  //string selector.  This will be called at end of chain.
  var populateElementList = function(response) {
      console.log('Running populate element list');
      console.log(response);
      Alteryx.Gui.manager.GetDataItem('dimensionSelect').setStringList(response);
  }
  //Create a promise which fetches a fresh authtoken in case user has not touched
  //workflow in 1 hour (token expires after 3600 seconds)
  var fetchAuthToken = getAuthTokenAjaxCall(clientID, clientSecret, '');
  //Use requestData object to fetch new elements list and populate the
  //specified dataitem with the new string list.
  function fetchElements(authTokenResult) {
    console.log(requestData);
    return getElementsAjaxCall(endPoint, authTokenResult.access_token, requestData);
  }

  fetchAuthToken
    .then(fetchElements)
    .then(processMetricsList) //we were able to reuse the metrics processing function
    .done(populateElementList)
}

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

/*
***************************** SEGMENTS UI *************************************
*******************************************************************************
*/
function getSegmentsAjaxCall(endPoint, hash, reportSuiteID) {
  var currMethod = "?method=ReportSuite.GetSegments";
  var url = endPoint + currMethod + "&access_token=" + hash;
  var requestData = {
    "rsid_list":[
      reportSuiteID
    ]
  }
  var settings = {
      url: url,
      dataType: 'json',
      data: requestData
  }
  return $.ajax(settings);
}
/*
***************************** METRICS UI *************************************
*******************************************************************************
*/
// dataname argument takes in the given metric ui dataname and will check
// the other metric ui slots and ensure that metric list populates based on
// other two metric inputs.
function updateMetricDropDown(dataname){
  var clientID = Alteryx.Gui.manager.GetDataItem('clientID').value;
  var clientSecret = Alteryx.Gui.manager.GetDataItem('clientSecret').value;
  var endPoint = getEndpoint(Alteryx.Gui.manager.GetDataItem('dataCenter').value);

  var metricsItems = ['metric_1', 'metric_2', 'metric_3'];
  var metricsItems = _.filter(metricsItems, function (m) {return m != dataname });
  //Obtain currently selected values from other metric dropdowns.
  var metricsItems = metricsItems.map(function(dataItem) {
    return Alteryx.Gui.manager.GetDataItem(dataItem).value
  })
  //Obtain currently selected dimension/element value from element dropdown
  var elementsValue = [ Alteryx.Gui.manager.GetDataItem('dimensionSelect').value ];
  //Obtain currently selected granularity from menu selection
  var granularityValue = Alteryx.Gui.manager.GetDataItem('granularitySelect').value;
  //Obtain reportSuiteID from selected report suite
  var reportSuiteID = Alteryx.Gui.manager.GetDataItem('reportSuite').value;
  // Create requestData payload.
  var requestData = generateRequestData('metric', granularityValue,
                                        reportSuiteID, elementsValue,
                                        metricsItems);
  //Create a function here that will take a list and populate it to dataItem
  //string selector.  This will be called at end of chain.
  var populateMetricList = function(response) {
      console.log('Running populate metric list');
      console.log(response);
      Alteryx.Gui.manager.GetDataItem(dataname).setStringList(response);
  }
  //Create a promise which fetches a fresh authtoken in case user has not touched
  //workflow in 1 hour (token expires after 3600 seconds)
  var fetchAuthToken = getAuthTokenAjaxCall(clientID, clientSecret, '');
  //Use requestData object to fetch new metrics list and populate the
  //specified dataitem with the new string list.
  function fetchMetrics(authTokenResult) {
    console.log(requestData);
    return getMetricsAjaxCall(endPoint, authTokenResult.access_token, requestData);
  }

  fetchAuthToken
    .then(fetchMetrics)
    .then(processMetricsList)
    .done(populateMetricList)
}

var processMetricsList = function(response) {
  console.log(response);
  var data =  _.sortBy(response, function (x){return x.name.toLowerCase()});
  var metricsList = data.map(function(d, i) {
    return {uiobject: d.name,
            dataname: d.id}
  });
  console.log(metricsList);
  return metricsList;
}

function getMetricsAjaxCall(endPoint, hash, requestData) {
    var currMethod = "?method=Report.GetMetrics";
    var url = endPoint + currMethod + "&access_token=" + hash;
    //var requestData = generateRequestData("metric");

    var settings = {
      url: url,
      data: requestData,
      dataType: 'json',
    }
    return $.ajax(settings);
}
