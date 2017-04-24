import AyxStore from '../stores/AyxStore'
import _ from 'lodash'

const topLevelSegments = (store) => {
  store.segment1.loading = true
  const segmentsShared = getSegments(store, payload(store, 'shared'))
  const segmentsOwned = getSegments(store, payload(store, 'owned'))
  const promises = [segmentsShared, segmentsOwned]

  Promise.all(promises)
    .then(mergeSegments)
    .then(dedupeSegments)
    .then(mapSegments)
    .then(sortSegments)
    .then(pushSegments)
    .then(doneLoading)
    .then(removeMissingValues)
}

const getSegments = (store, payload) => {
  const endPoint = 'https://api.omniture.com/admin/1.4/rest/'
  const currentMethod = '?method=Segments.Get'
  const url = endPoint + currentMethod + '&access_token=' + store.access_token
  const segments = $.ajax({
    url: url,
    dataType: 'json',
    method: 'POST',
    data: payload
  })

  return segments
}

const payload = (store, access) => {
  return {
    'accessLevel': access,
    'filters': {
      'reportSuiteID': {
        'selection': store.reportSuite.selection
      }
    }
  }
}

const mergeSegments = (response) => {
  const shared = response[0]
  const owned = response[1]
  const segments = shared.concat(owned)
  return segments
}

const dedupeSegments = (response) => {
  const segments = _.uniqBy(response, (e) => {
    return e.id
  })

  return segments
}

const mapSegments = (response) => {
  const mapResponse = response.map((d) => {
    return {
      uiobject: d.name + ' | ' + d.id,
      dataname: d.id
    }
  })

  return mapResponse
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

const pushSegments = (response) => {
  const mapResponse = response
  const segmentArray = [
    store.segment1,
    store.segment2
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
}

const removeMissingValues = () => {
  const segments = [
    Alteryx.Gui.renderer.getReactComponentByDataName('segment1'),
    Alteryx.Gui.renderer.getReactComponentByDataName('segment2')
  ]

  segments.map((segment) => {
    segment.refs.widget.props.options.filter((d) => { return d.className === '' || d.className === undefined })
    segment.missingFields = []
    setTimeout(function () { segment.forceUpdate() }, 500)
  })
}

const doneLoading = () => {
  store.segment1.loading = false
}

export { topLevelSegments }

