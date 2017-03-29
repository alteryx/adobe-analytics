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

const elements = (store) => {
  const list = [
    store.elementPrimary,
    store.elementSecondary,
    store.elementTertiary
  ]

  const elements = list.filter(notEmpty)

  let elementDetails = []

  elements.forEach((item) => {
    elementDetails.push({
      'id': item.selection // ,
      // 'classification': '', // optional adv. option
      // 'top': '', // optional adv. option
      // 'startingWith': '' // optional adv. option
    })
  })

  return elementDetails
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

export { validateReport, metrics, elements, segments }
