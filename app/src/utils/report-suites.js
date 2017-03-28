const topLevelReportSuites = (store) => {
  store.reportSuite.loading = true
  const reportSuites = getReportSuites(store)
  reportSuites
    .then(mapReportSuites)
    .then(sortReportSuites)
    .then(pushReportSuites)
}

const getReportSuites = (store) => {
  const endPoint = 'https://api.omniture.com/admin/1.4/rest/'
  const currentMethod = '?method=Company.GetReportSuites'
  const url = endPoint + currentMethod + '&access_token=' + store.access_token
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

const sortReportSuites = (response) => {
  const sortResponse = response
  return sortResponse.sort((a, b) => {
    let uiNameA = a.uiobject.toLowerCase()
    let uiNameB = b.uiobject.toLowerCase()
    if (uiNameA < uiNameB) return -1 // sort string ascending
    if (uiNameA > uiNameB) return 1
    return 0 // default return value (no sorting)
  })
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
  store.reportSuite.loading = false
}
export { topLevelReportSuites }
