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
      'metrics': metrics(store) // ,
      // 'elements': [
      //   {
      //     'id': '(string)',
      //     'classification': '(string)',
      //     'top': '(int)',
      //     'startingWith': '(int)',
      //     'search': {
      //       'type': '(string)',
      //       'keywords': [
      //         '(string)'
      //       ],
      //       'searches': [
      //         '(reportDescriptionSearch)'
      //       ]
      //     },
      //     'selected': [
      //       '(string)'
      //     ],
      //     'parentID': '(string)',
      //     'checkpoints': [
      //       '(string)'
      //     ],
      //     'pattern': [
      //       [
      //         '(string)'
      //       ]
      //     ],
      //     'everythingElse': '(boolean)'
      //   }
      // ],
      // 'segments': [
      //   {
      //     'id': '(string)',
      //     'element': '(string)',
      //     'classification': '(string)',
      //     'search': {
      //       'type': '(string)',
      //       'keywords': [
      //         '(string)'
      //       ]
      //     },
      //     'selected': [
      //       '(string)'
      //     ]
      //   }
      // ],
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
export { validateReport, metrics }
