const topLevelElements = (store) => {
  store.elementPrimary.loading = true
  const Elements = getElements(store)
  Elements
    .then(mapElements)
    .then(sortElements)
    .then(filterElements)
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
  const sortResponse = response.sort((a,b) => {
    let uiNameA = a.uiobject.toLowerCase()
    let uiNameB = b.uiobject.toLowerCase()
    if (uiNameA < uiNameB) return -1
    if (uiNameA > uiNameB) return 1
    return 0
  })
  return sortResponse
}

const filterElements = (response) => {
  console.log(response)
  const filterResponse = response.filter(d => {
    return d.dataname !== store.elementSecondary.selection
  })
  console.log(filterResponse)
  return filterResponse
}

const pushElements = (response) => {
  const mapResponse = response
  const elementArray = [
    store.elementPrimary,
    store.elementSecondary
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

export { topLevelElements }
