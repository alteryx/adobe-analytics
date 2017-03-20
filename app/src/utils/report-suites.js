const topLevelReportSuites = (store) => {
  const reportSuites = getReportSuites(store)
  reportSuites
    .then(mapReportSuites)
    .then(pushReportSuites)
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
  const apiResponse = response.report_suites
  const mapResponse = apiResponse.map((d) => {
    return {
      uiobject: d.site_title,
      dataname: d.rsid
    }
  })
  return mapResponse
}

const pushReportSuites = (response) => {
  const mapResponse = response
  store.reportSuite.stringList = []

  mapResponse.forEach(d => {
    return store.reportSuite.stringList.push({
      uiobject: d.uiobject,
      dataname: d.dataname
    })
  })
}
export { topLevelReportSuites }
