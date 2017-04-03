import AyxStore from '../stores/AyxStore'

const validateReport = (store) => {
  const endPoint = 'https://api.omniture.com/admin/1.4/rest/'
  const currentMethod = '?method=Report.Validate'
  const url = endPoint + currentMethod + '&access_token=' + store.access_token
  const validate = $.ajax({
    url: url,
    dataType: 'json',
    method: 'POST',
    data: payload(store)
  })
  return validate
}

const payload = (store) => {
  const data = {
    'reportDescription': {
      'reportSuiteID': store.reportSuite.selection,
      'dateFrom': store.startDatePicker,
      'dateTo': store.endDatePicker,
      'dateGranularity': store.granularity.selection,
      'metrics': metrics(store),
      'elements': elements(store),
      'segments': segments(store) // ,
      // 'elementDataEncoding': '(string)' // base64 or utf8
    }
  }

  return data
}

const metrics = (store) => {
  let metrics = []

  for (let value of store.metricSelections) {
    metrics.push({
      'id': value
    })
  }

  return metrics
}

    {key: 'elementPrimary', type: 'dropDown'},
    {key: 'advOptionsPrimary', type: 'value'},
    {key: 'topPrimary', type: 'value'},
    {key: 'startingWithPrimary', type: 'value'},
    {key: 'elementSecondary', type: 'dropDown'},
    {key: 'advOptionsSecondary', type: 'value'},
    {key: 'topSecondary', type: 'value'},
    {key: 'startingWithSecondary', type: 'value'},
    {key: 'elementTertiary', type: 'dropDown'},
    {key: 'advOptionsTertiary', type: 'value'},
    {key: 'topTertiary', type: 'value'},
    {key: 'startingWithTertiary', type: 'value'},
    {key: 'elementError', type: 'value'},

const elements = (store) => {
  let elementDetails = []

  if (store.elementPrimary !== '') { elementDetails.push(buildElement(store.elementPrimary, store.advOptionsPrimary, store.elementPrimaryClassification, store.topPrimary, store.startingWithPrimary)) }
  if (store.elementSecondary !== '') { elementDetails.push(buildElement(store.elementSecondary, store.advOptionsSecondary, store.elementSecondaryClassification, store.topSecondary, store.startingWithSecondary)) }
  if (store.elementTertiary !== '') { elementDetails.push(buildElement(store.elementTertiary, store.advOptionsTertiary, store.elementTertiaryClassification, store.topTertiary, store.startingWithTertiary)) }

  return elementDetails
}

const buildElement = (selection, advOption, classification, top, startingWith) => {
  let element

  if (advOptions === true) {
    element = {
      'id': selection,
      'classification': classification,
      'top': top,
      'startingWith': startingWith
    }
  } else {
    element = {
      'id': selection
    }
  }

  return element
}

const segments = (store) => {
  const list = [
    store.segment1,
    store.segment2
  ]

  const segments = list.filter(notEmpty)

  let segmentDetails = []

  segments.forEach((item) => {
    segmentDetails.push({
      'id': item.selection // ,
      // 'element': '(string)', // Don't believe this is needed since we aren't supporting inline segments
      // 'classification': '(string)' // Don't believe this is needed since we aren't supporting inline segments
    })
  })

  return segmentDetails
}

const notEmpty = (item) => {
  return item.selection !== ''
}

export { validateReport, metrics, elements, segments, payload }
