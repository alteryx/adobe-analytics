const topLevelElements = (store) => {
  store.elementPrimary.loading = true
  const Elements = getElements(store)
  Elements
    .then(mapElements)
    .then(sortElements)
    .then(pushElements)
}

const getElements = (store) => {
  const endpoint = 'https://api.omniture.com/admin/1.4/rest/'
  const currentMethod = '?method=Report.GetElements'
  const url = endpoint + currentMethod + '&access_token=' + store.access_token
  const payload = {
    'reportSuiteID': store.reportSuite.selection
  }
  const Elements = $.ajax({
    url: url,
    dataType: 'json',
    method: 'POST',
    data: payload
  })
  return Elements
}

const mapElements = (response) => {
  const mapResponse = response.map((d) => {
    return {
      uiobject: d.name + ' | ' + d.id,
      dataname: d.id
    }
  })
  return mapResponse
}

const sortElements = (response) => {
  const sortResponse = response.sort((a, b) => {
    let uiNameA = a.uiobject.toLowerCase()
    let uiNameB = b.uiobject.toLowerCase()
    if (uiNameA < uiNameB) return -1
    if (uiNameA > uiNameB) return 1
    return 0
  })
  return sortResponse
}

const pushElements = (response) => {
  const mapResponse = response
  const elementArray = [
    store.elementPrimary,
    store.elementSecondary,
    store.elementTertiary
  ]

  for (let value of elementArray) {
    value.stringList = []
    mapResponse.forEach(d => {
      return value.stringList.push({
        uiobject: d.uiobject,
        dataname: d.dataname
      })
    })
  }
  store.elementPrimary.loading = false
}

const validateElements = () => {
  store.elementPrimary.loading = true
  const endPoint = 'https://api.omniture.com/admin/1.4/rest/'
  const currentMethod = '?method=Report.GetElements'
  const url = endPoint + currentMethod + '&access_token=' + store.access_token
  const payload = {
    'existingElements': store.elementSelections,
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
    store.elementError = {
      'error_type': 'Success',
      'error_description': '',
      'elementName': ''
    }
    console.log('validate done')
    store.elementPrimary.loading = false
  })
  .fail((jqXHR) => {
    console.log(jqXHR)
    store.elementError = {
      'error_type': jqXHR.responseJSON.error,
      'error_description': jqXHR.responseJSON.error_description,
      'elementName': elementName(jqXHR.responseJSON.error_description)
    }
    console.log('invalid element')
    store.elementPrimary.loading = false
  })

  const elementName = (description) => {
    const elementArray = [
      store.elementPrimary,
      store.elementSecondary,
      store.elementTertiary
    ]

    for (let value of elementArray) {
      if (description.includes(value.selection)) {
        return value.selectionName
      }
    }
  }
}

export { topLevelElements, validateElements }
