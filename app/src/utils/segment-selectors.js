import AyxStore from '../stores/AyxStore'

const topLevelSegments = (store) => {
  // store.segment1.loading = true
  const Segments = getSegments(store)
  Segments
    .then(filterSegments)
    // .then(mapSegments)
    // .then(sortSegments)
    // .then(removeInvalidSegments)
    // .then(pushSegments)
    .fail((jqXHR) => {
      console.log(jqXHR)
    })
}
const payload = (store) => {
  let rsidList = []
  rsidList.push(store.reportSuite.selection)

  return {
    'rsid_list': rsidList
  }
}

const getSegments = (store) => {
  const endPoint = 'https://api.omniture.com/admin/1.4/rest/'
  const currentMethod = '?method=Segments.Get'
  const url = endPoint + currentMethod + '&access_token=' + store.access_token
  const Segments = $.ajax({
    url: url,
    dataType: 'json',
    method: 'POST',
    data: payload(store)
  })
  return Segments
}

const filterSegments = (response) => {
  const segments = response[0].segments
  console.log(segments)
}

const mapSegments = (response) => {
  console.log(response[0])
  // const mapResponse = response.map((d) => {
  //   return {
  //     uiobject: d.name + ' | ' + d.id,
  //     dataname: d.id
  //   }
  // })
  // return mapResponse
}

const sortSegments = (response) => {
  const sortResponse = response.sort((a, b) => {
    let uiNameA = a.uiobject.toLowerCase()
    let uiNameB = b.uiobject.toLowerCase()
    if (uiNameA < uiNameB) return -1 // sort string ascending
    if (uiNameA > uiNameB) return 1
    return 0 // default return value (no sorting)
  })
  return sortResponse
}

const removeInvalidSegments = (response) => {
  const invalid = (value) => {
    if (value.dataname.startsWith('cm') && value.dataname.length === 30) {
      return false
    } else {
      return true
    }
  }
  return response.filter(invalid)
}

const pushSegments = (response) => {
  const mapResponse = response
  const segmentArray = [
    store.segment1,
    store.segment2,
    store.segment3,
    store.segment4,
    store.segment5
  ]

  for (let value of segmentArray) {
    value.stringList = []
    mapResponse.forEach(d => {
      return value.stringList.push({
        uiobject: d.uiobject,
        dataname: d.dataname
      })
    })
  }
  store.segment1.loading = false
}

const validateSegments = () => {
  store.segment1.loading = true
  const endPoint = 'https://api.omniture.com/admin/1.4/rest/'
  const currentMethod = '?method=Report.GetSegments'
  const url = endPoint + currentMethod + '&access_token=' + store.access_token
  const payload = {
    'existingSegments': store.segmentSelections,
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
    store.segmentError = {
      'error_type': '',
      'error_description': ''
    }
    console.log('validate done')
    store.segment1.loading = false
  })
  .fail((jqXHR) => {
    console.log(jqXHR)
    store.segmentError = {
      'error_type': jqXHR.responseJSON.error,
      'error_description': jqXHR.responseJSON.error_description,
      'segmentName': segmentName(jqXHR.responseJSON.error_description)
    }
    console.log('invalid segment')
    store.segment1.loading = false
  })

  const segmentName = (description) => {
    const segmentArray = [
      store.segment1,
      store.segment2,
      store.segment3,
      store.segment4,
      store.segment5
    ]

    for (let value of segmentArray) {
      if (description.includes(value.selection)) {
        return value.selectionName
      }
    }
  }
}
export { topLevelSegments, getSegments }

