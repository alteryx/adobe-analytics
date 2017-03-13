import _ from 'lodash'

// get metadata for standard metrics
const getSegmentsMetadata = (store) => {
  const metadataRequestUri = 'https://www.googleapis.com/analytics/v3/management/segments'

  const settings = {
    'async': true,
    'crossDomain': true,
    'url': metadataRequestUri,
    'method': 'GET',
    'dataType': 'json',
    'headers': {
      'Authorization': 'Bearer ' + store.accessToken,
      'cache-control': 'private, max-age=0, must-revalidate, no-transform',
      'content-type': 'application/json; charset=UTF-8'
    }
  }
  return $.ajax(settings)
}

const parseSegments = (results) => {
  const segmentsList = results.items.map((d) => {
    return {
      uiobject: d.name,
      dataname: d.id,
      type: d.type,
      segmentId: d.segmentId,
      kind: d.kind,
      definition: d.definition
    }
  })
  return segmentsList
}
// sort segmentsList using lodash
const sortSegmentsList = (segmentsList) => {
  return _.orderBy(segmentsList, [a => a.uiobject.toLowerCase()], ['asc'])
}

const filterSegmentsList = (sortedSegments) => {
  return sortedSegments.filter(value => { return value.definition !== '' })
}

const segmentsStorePush = (result) => {
  store.segmentsList.stringList = []
  setTimeout(() => {
    store.segmentsList.loading = false
  }, 2000)

  result.map((d) => {
    // handling rogue commas in multiple condtion segments breaking listBox value
    d.definition = d.definition.replace(',', '|||')
    store.segmentsList.stringList.push({uiobject: `${d.uiobject} | ${d.segmentId}`, dataname: d.definition})
  })
}

const populateSegmentsList = (store) => {
  store.segmentsList.loading = true
  const fetchSegments = getSegmentsMetadata(store)

  fetchSegments
    .then(parseSegments)
    .then(sortSegmentsList)
    .then(filterSegmentsList)
    .done(segmentsStorePush)
}

export { getSegmentsMetadata, populateSegmentsList, segmentsStorePush, parseSegments }
