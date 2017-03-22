import AyxStore from '../stores/AyxStore'

const getMetrics = (store, metricNumber) => {
  const endPoint = 'https://api.omniture.com/admin/1.4/rest/'
  const currentMethod = '?method=Report.GetMetrics'
  const url = endPoint + currentMethod + '&access_token=' + store.access_token
  const payload = {
    'existingMetrics': populatePayload(store, metricNumber),
    'reportSuiteID': store.reportSuite.selection
  }
  $.ajax({
    url: url,
    dataType: 'json',
    method: 'POST',
    data: payload
  })
  .done((response) => {
    const mapResponse = response.map((d) => {
      return {
        uiobject: d.name,
        dataname: d.id
      }
    })

    const metric = populateMetric(store, metricNumber)

    metric.stringList = []

    mapResponse.forEach(d => {
      return metric.stringList.push({
        uiobject: d.uiobject,
        dataname: d.dataname
      })
    })
  })
}

const populateMetric = (store, metricNumber) => {
  switch (metricNumber) {
    case 1:
    case '1':
      return store.metric1
    case 2:
    case '2':
      return store.metric2
    case 3:
    case '3':
      return store.metric3
    case 4:
    case '4':
      return store.metric4
    case 5:
    case '5':
      return store.metric5
  }
}

const populatePayload = (store, metricNumber) => {
  switch (metricNumber) {
    case 1:
    case '1':
      return store.metricSelections.filter((d) => d !== store.metric1.selection)
    case 2:
    case '2':
      return store.metricSelections.filter((d) => d !== store.metric2.selection)
    case 3:
    case '3':
      return store.metricSelections.filter((d) => d !== store.metric3.selection)
    case 4:
    case '4':
      return store.metricSelections.filter((d) => d !== store.metric4.selection)
    case 5:
    case '5':
      return store.metricSelections.filter((d) => d !== store.metric5.selection)
  }
}

export { getMetrics }

