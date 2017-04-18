import AyxStore from '../stores/AyxStore'

const validateReport = (store) => {
  showLoader(true)
  const endPoint = 'https://api.omniture.com/admin/1.4/rest/'
  const currentMethod = '?method=Report.Validate'
  const url = endPoint + currentMethod + '&access_token=' + store.access_token
  const validate = $.ajax({
    url: url,
    dataType: 'json',
    method: 'POST',
    data: payload(store)
  })
  validate
    .done((data) => {
      store.reportValidation = {
        'error_type': 'Success',
        'error_description': ''
      }
      showLoader(false)
    })
    .fail((jqXHR) => {
      store.reportValidation = {
        'error_type': jqXHR.responseJSON.error,
        'error_description': jqXHR.responseJSON.error_description
      }
      showLoader(false)
    })
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
  store.reportDescription = JSON.stringify(data)
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
  let elementDetails = []

  if (store.elementPrimary.selection !== '') { elementDetails.push(buildElement(store.elementPrimary.selection, store.advOptionsPrimary, store.elementPrimaryClassification.selection, store.topPrimary, store.startingWithPrimary)) }
  if (store.elementSecondary.selection !== '') { elementDetails.push(buildElement(store.elementSecondary.selection, store.advOptionsSecondary, store.elementSecondaryClassification.selection, store.topSecondary, store.startingWithSecondary)) }
  if (store.elementTertiary.selection !== '') { elementDetails.push(buildElement(store.elementTertiary.selection, store.advOptionsTertiary, store.elementTertiaryClassification.selection, store.topTertiary, store.startingWithTertiary)) }

  return elementDetails
}

const buildElement = (selection, advOption, classification, top, startingWith) => {
  let element

  if (advOption === true) {
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

const showLoader = (flag) => {
  if (flag) {
    document.getElementById('loading').style.display = 'block'
    document.getElementById('loading-inner').innerHTML = '<p style="font-size: 14px">XMSG("Validating report...")</p><img src=".//assets//loading_ring.svg">'
    document.getElementById('loading-inner').style.display = 'block'
  } else {
    document.getElementById('loading').style.display = 'none'
    document.getElementById('loading-inner').innerHTML = '<img src=".//assets//loading_ring.svg">'
    document.getElementById('loading-inner').style.display = 'none'
  }
}

const clearWarning = (store) => {
  return store.reportValidation = {
    'error_type': '',
    'error_description': ''
  }
}
export { validateReport, payload, clearWarning }
