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





Alteryx.Gui.AfterLoad = function (manager, AlteryxDataItems) {


};
