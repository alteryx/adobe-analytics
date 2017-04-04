import _ from 'lodash'

const topLevelClassifications = (store) => {
  const Classifications = getClassifications(store)
  Classifications
    .then(mapClassifications)
    .then(prepClassifications)
    .then(pushClassifications)
	.then(removeMissingValues)
}

const getClassifications = (store) => {
  const endpoint = 'https://api.omniture.com/admin/1.4/rest/'
  const currentMethod = '?method=ReportSuite.GetClassifications'
  const url = endpoint + currentMethod + '&access_token=' + store.access_token
  const payload = {
    'rsid_list': [store.reportSuite.selection]
  }
  const Classifications = $.ajax({
    url: url,
    dataType: 'json',
    method: 'POST',
    data: payload
  })
  return Classifications
}

const mapClassifications = (response) => {
  const elementClassifications = response.map((d) => {
    return {
      element_classifications: d.element_classifications
    }
  })

  let mappedClassifications = []

  elementClassifications[0].element_classifications.forEach(d => {
    let elementId = d.id
    let elementName = d.name
    const elementStructure = d.classifications.map(d => {
      return {
        element_id: elementId, // saving element ID and name just in case
        element_name: elementName,
        classification_name: d.name, // Will become dataName
        uiobject: `${elementName} | ${d.name}`
      }
    })
    mappedClassifications = mappedClassifications.concat(elementStructure)
    return mappedClassifications
  })

  return mappedClassifications
}

// prepping includes sorting and identify unique Element and Classification combos
// the API response included a metric_id property that is not used. While metric_id is unique to each Classification, it is not being used so there are duplicates
const prepClassifications = (mappedClassifications) => {
  const sortPrepped = _.sortBy(mappedClassifications, 'uiobject')
  const uniqPrepped = _.uniqBy(sortPrepped, 'uiobject')
  return uniqPrepped
}

const pushClassifications = (response) => {
  const mapResponse = response
  const classificationsArray = [
    store.elementPrimaryClassification,
    store.elementSecondaryClassification,
    store.elementTertiaryClassification
  ]

  for (let value of classificationsArray) {
    value.stringList = []
    mapResponse.forEach(d => {
      return value.stringList.push({
        uiobject: d.uiobject,
        dataname: d.classification_name
      })
    })
  }
}

const removeMissingValues = () => {
  const classifications = [
    Alteryx.Gui.renderer.getReactComponentByDataName('elementPrimaryClassification'),
    Alteryx.Gui.renderer.getReactComponentByDataName('elementSecondaryClassification'),
    Alteryx.Gui.renderer.getReactComponentByDataName('elementTertiaryClassification')
  ]

  classifications.map((classification) => {
    classification.refs.widget.props.options.filter((d) => { return d.className !== '' || d.className === undefined })
    classification.missingFields = []
    classification.forceUpdate()
  })
}

export { topLevelClassifications }
