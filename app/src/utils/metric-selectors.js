import AyxStore from '../stores/AyxStore'
// import _ from 'lodash'

const topLevelMetrics = (store) => {
  store.metric1.loading = true
  const Metrics = getMetrics(store)
  Metrics
    .then(mapMetrics)
    .then(sortMetrics)
    .then(removeInvalidMetrics)
    .then(pushMetrics)
    .then(removeMissingValues)
    .then(doneLoading)
    .fail((jqXHR) => {
      store.metric1.loading = false
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

  for (let value of store.metricArray) {
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
  const metrics = [
    Alteryx.Gui.renderer.getReactComponentByDataName('metric1'),
    Alteryx.Gui.renderer.getReactComponentByDataName('metric2'),
    Alteryx.Gui.renderer.getReactComponentByDataName('metric3'),
    Alteryx.Gui.renderer.getReactComponentByDataName('metric4'),
    Alteryx.Gui.renderer.getReactComponentByDataName('metric5')
  ]

  metrics.map((metric) => {
    metric.refs.widget.props.options.filter((d) => { return d.className === '' || d.className === undefined })
    metric.missingFields = []
    setTimeout(function () { metric.forceUpdate() }, 500)
  })
}

const doneLoading = () => {
  store.metric1.loading = false
}

// Can't get to run on user data change
// const filterMetricLists = (store) => {
//   console.log('filtering metrics')
//   for (let metric of store.metricArray) {
//     // Array of selections across metrics
//     let selections = store.metricSelections.filter(d => {
//       return d !== metric.selection
//     })

//     // Need to refactor at some point
//     let list = metric.stringList
//     let list2 = _.filter(list, (d) => { return d.dataName !== selections[0] })
//     let list3 = _.filter(list2, (d) => { return d.dataName !== selections[1] })
//     let list4 = _.filter(list3, (d) => { return d.dataName !== selections[2] })
//     let list5 = _.filter(list4, (d) => { return d.dataName !== selections[3] })
//     let filteredList = _.filter(list5, (d) => { return d.dataName !== selections[4] })
//     console.log('metric')
//     console.log(metric)
//     console.log('filtered list')
//     console.log(filteredList)
//     metric.stringList = []
//     filteredList.forEach(d => {
//       metric.stringList.push({
//         uiobject: d.uiObject,
//         dataname: d.dataName
//       })
//     })
//   }
// }

export { topLevelMetrics }

