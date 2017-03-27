import AyxStore from '../stores/AyxStore'

const topLevelMetrics = (store) => {
  store.metric1.loading = true
  const Metrics = getMetrics(store)
  Metrics
    .then(mapMetrics)
    .then(sortMetrics)
    .then(removeInvalidMetrics)
    .then(pushMetrics)
    .fail((jqXHR) => {
      console.log(jqXHR)
    })
}

const getMetrics = (store) => {
  const endPoint = 'https://api.omniture.com/admin/1.4/rest/'
  const currentMethod = '?method=Report.GetMetrics'
  const url = endPoint + currentMethod + '&access_token=' + store.access_token
  const payload = {
    'reportSuiteID': store.reportSuite.selection
  }
  const Metrics = $.ajax({
    url: url,
    dataType: 'json',
    method: 'POST',
    data: payload
  })
  return Metrics
}

const mapMetrics = (response) => {
  const mapResponse = response.map((d) => {
    return {
      uiobject: d.name + ' | ' + d.id,
      dataname: d.id
    }
  })
  return mapResponse
}

const sortMetrics = (response) => {
  const sortResponse = response.sort((a, b) => {
    let uiNameA = a.uiobject.toLowerCase()
    let uiNameB = b.uiobject.toLowerCase()
    if (uiNameA < uiNameB) return -1 // sort string ascending
    if (uiNameA > uiNameB) return 1
    return 0 // default return value (no sorting)
  })
  return sortResponse
}

const removeInvalidMetrics = (response) => {
  const invalid = (value) => {
    if (value.dataname.startsWith('cm') && value.dataname.length === 30) {
      return false
    } else {
      return true
    }
  }
  return response.filter(invalid)
}

const pushMetrics = (response) => {
  const mapResponse = response
  const metricArray = [
    store.metric1,
    store.metric2,
    store.metric3,
    store.metric4,
    store.metric5
  ]

  for (let value of metricArray) {
    value.stringList = []
    mapResponse.forEach(d => {
      return value.stringList.push({
        uiobject: d.uiobject,
        dataname: d.dataname
      })
    })
  }
  store.metric1.loading = false
}

const validateMetrics = () => {
  store.metric1.loading = true
  const endPoint = 'https://api.omniture.com/admin/1.4/rest/'
  const currentMethod = '?method=Report.GetMetrics'
  const url = endPoint + currentMethod + '&access_token=' + store.access_token
  const payload = {
    'existingMetrics': store.metricSelections,
    'reportSuiteID': store.reportSuite.selection
  }
  $.ajax({
    url: url,
    dataType: 'json',
    method: 'POST',
    data: payload
  })
  .done(() => {
    store.setPage = '#elementSelectors'
    store.metricError = {
      'error_type': 'Success',
      'error_description': ''
    }
    console.log('valid metric combination')
    store.metric1.loading = false
  })
  .fail((jqXHR) => {
    console.log(jqXHR)
    store.metricError = {
      'error_type': jqXHR.responseJSON.error,
      'error_description': jqXHR.responseJSON.error_description,
      'metricName': metricName(jqXHR.responseJSON.error_description)
    }
    console.log('invalid metric')
    store.metric1.loading = false
  })

  const metricName = (description) => {
    const metricArray = [
      store.metric1,
      store.metric2,
      store.metric3,
      store.metric4,
      store.metric5
    ]

    for (let value of metricArray) {
      if (description.includes(value.selection)) {
        return value.selectionName
      }
    }
  }
}
export { topLevelMetrics, getMetrics, validateMetrics }

