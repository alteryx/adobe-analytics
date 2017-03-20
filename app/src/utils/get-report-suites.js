// import _ from 'lodash'

const topLevelReportSuites = (store) => {
  const reportSuites = getReportSuites(store)
  reportSuites
    .then(mapReportSuites)
    .then(console.log('Promise complete!!'))
}

const getReportSuites = (store) => {
  const endPoint = 'https://api.omniture.com/admin/1.4/rest/'
  const currentMethod = '?method=Company.GetReportSuites'
  const url = endPoint + currentMethod + '&access_token=' + store.access_token
  // const reportSuiteList = []
  const reportSuites = $.ajax({
    url: url,
    dataType: 'json',
    method: 'GET'
  })
  return reportSuites
}

const mapReportSuites = (response) => {
  console.log('response')
  console.log(response)
  // const mapResponse = response.map((d) => {
  //   return {
  //     uiobject: d.site_title,
  //     dataname: d.rsid
  //   }
  // })
  // return console.table(mapResponse)
}

// const pushReportSuites = (data) => {
//     const reports = data.report_suites;
//     for (let i = 0; i < reports.length; i++) {
//         reportSuiteList.push({
//             uiobject: reports[i].site_title,
//             dataname: reports[i].rsid
//         })
//     }
//     Alteryx.Gui.manager.GetDataItem('reportSuite').setStringList(
//         _.sortBy(reportSuiteList, function(x) {return x.uiobject.toLowerCase()})
//     )
//     checkReportSuite()
//     $("#creds").hide()
//     $("#reportOptions").show()
// }
// }, function (textStatus, errorThrown, jqXHR) {
//     //changeCredentials();
//     //setError("authStatus", textStatus.responseJSON.error_description);

export { topLevelReportSuites }
