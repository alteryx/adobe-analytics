import React from 'react'
import ReactDOM from 'react-dom'
import AyxStore from './stores/AyxStore'
import { extendObservable, autorun, toJS } from 'mobx'
import moment from 'moment'
import * as utils from './utils/utils'
import * as picker from './utils/date-pickers'
import DateMessage from './components/date-message.jsx'
import ConnectionErrorMessage from './components/connection-error-message.jsx'
import * as reportSuites from './utils/report-suites'
import * as metricSelectors from './utils/metric-selectors'
import InvalidMetric from './components/invalid-metric-message.jsx'
import InvalidElement from './components/invalid-element-message.jsx'
import * as segmentSelectors from './utils/segment-selectors'
import * as elementSelectors from './utils/element-selectors'
import * as reportValidation from './utils/report-validation'
// import _ from 'lodash'

Alteryx.Gui.AfterLoad = (manager) => {
  const collection = [
    {key: 'reportDefinition', type: 'value'},
    {key: 'client_id', type: 'value'},
    {key: 'client_secret', type: 'value'},
    {key: 'access_token', type: 'value'},
    {key: 'startDatePicker', type: 'value'},
    {key: 'endDatePicker', type: 'value'},
    {key: 'preDefDropDown', type: 'value'},
    {key: 'page', type: 'value'},
    {key: 'errorStatus', type: 'value'},
    {key: 'reportSuite', type: 'listBox'},
    {key: 'metric1', type: 'dropDown'},
    {key: 'metric2', type: 'dropDown'},
    {key: 'metric3', type: 'dropDown'},
    {key: 'metric4', type: 'dropDown'},
    {key: 'metric5', type: 'dropDown'},
    {key: 'metricError', type: 'value'},
    {key: 'granularity', type: 'dropDown'},
    {key: 'elementPrimary', type: 'dropDown'},
    {key: 'elementSecondary', type: 'dropDown'},
    {key: 'elementTertiary', type: 'dropDown'},
    {key: 'elementError', type: 'value'},
    {key: 'segment1', type: 'dropDown'},
    {key: 'segment2', type: 'dropDown'}
  ]

  // Instantiate the mobx store which will sync all dataItems
  // specified in the collection.
  const store = new AyxStore(manager, collection)

  // Set Predefined dropdown to 'custom' value if it is undefined.
  if (!store.preDefDropDown) {
    store.preDefDropDown = 'custom'
  }

  extendObservable(store, {
    // Compute if startDatePicker value is greater than endDatePicker value
    get startIsAfterEnd () {
      return store.startDatePicker > store.endDatePicker
    },
    // Compute start date for currently selected preDefDropDown value
    get preDefStart () {
      if (store.preDefDropDown === 'custom') {
        return store.startDatePicker
      } else {
        return picker.setDates(store.preDefDropDown).start
      }
    },
    // Compute end date for currently selected preDefDropDown value
    get preDefEnd () {
      if (store.preDefDropDown === 'custom') {
        return store.endDatePicker
      } else {
        return picker.setDates(store.preDefDropDown).end
      }
    },
    // Compute if preDefined date values match currently set picker values
    get isCustomDate () {
      return store.startDatePicker !== store.preDefStart ||
             store.endDatePicker !== store.preDefEnd
    },
    // Create array of selected metrics
    get metricSelections () {
      const selections = [
        store.metric1.selection,
        store.metric2.selection,
        store.metric3.selection,
        store.metric4.selection,
        store.metric5.selection
      ]

      return selections.filter(notEmpty)
    },
    // Array of metrics
    get metricArray () {
      const array = [
        store.metric1,
        store.metric2,
        store.metric3,
        store.metric4,
        store.metric5
      ]
      return array
    },
    // Create array of selected elements
    get elementSelections () {
      const selections = [
        store.elementPrimary.selection,
        store.elementSecondary.selection,
        store.elementTertiary.selection
      ]

      return selections.filter(notEmpty)
    }
  })

  const notEmpty = (value) => {
    return value !== ''
  }

  // Enable or Disable the Connect button on Developer Credentials page
  autorun(() => {
    const target = document.getElementById('connect_button')
    store.client_id === '' || store.client_secret === '' ? target.setAttribute('disabled', 'true') : target.removeAttribute('disabled')
  })

  // Enable or Disable the Next button on Report Suite page
  autorun(() => {
    const target = document.getElementById('reportSuiteNextBtn')
    store.reportSuite.selection === '' ? target.setAttribute('disabled', 'true') : target.removeAttribute('disabled')
  })

  // Update preDefined selector to 'custom' when a custom date is selected/entered
  autorun(() => {
    if (store.isCustomDate) {
      store.preDefDropDown = 'custom'
    }
  })

  // Update Start and End date picker values to the selected predefined date range
  autorun(() => {
    if (store.preDefDropDown) {
      if (store.preDefDropDown !== 'custom') {
        store.startDatePicker = store.preDefStart
        store.endDatePicker = store.preDefEnd
      }
    }
  })

  // Autorun function that populates metadata
  autorun(() => {
    if (store.access_token !== '') {
      reportSuites.topLevelReportSuites(store)
    }
  })

  autorun(() => {
    store.page === '' ? utils.displayFieldset('#authSelect') : utils.displayFieldset(store.page)
  })

  // Refreshes the metric dropdowns
  autorun(() => {
    if (store.access_token !== '' && store.reportSuite.selection !== '') {
      metricSelectors.topLevelMetrics(store)
      elementSelectors.topLevelElements(store)
    }
  })

  // Enable or Disable the Next button on metric selecotrs page
  autorun(() => {
    const target = document.getElementById('metricSelectorsNextBtn')
    store.metricSelections.length === 0 ? target.setAttribute('disabled', 'true') : target.removeAttribute('disabled')
  })

  // const filterElementsFunction = elementSelectors.filterElements.bind(this, store.elementPrimary.selection, store.elementSecondary)
  // const filterElementsFunction = elementSelectors.filterElements.apply(null, store.elementPrimary.selection, store.elementSecondary)

  // window.filterElementsFunction = elementSelectors.filterElements
  // Alteryx.Gui.manager.GetDataItem('elementPrimary').UserDataChanged.push(() => { elementSelectors.filterElements(store.elementPrimary.selection, store.elementSecondary) })

  // // Update the other element stores based on element selection
  // autorun(() => {
  //   console.log('store.elementPrimary.selection !== ""')
  //   // elementSelectors.filterElements(store.elementPrimary.selection, store.elementSecondary)
  //   // if (store.elementPrimary.selection !== '') {
  //   filterElementsFunction()
  //   // }
  // })

  // autorun(() => {
  //   const metricArray = [
  //     store.metric1,
  //     store.metric2,
  //     store.metric3,
  //     store.metric4,
  //     store.metric5
  //   ]

  //   for (let value of metricArray) {
  //     if (store.metricError.error_description.includes(value.selection)) {
  //       store.metricError.name = value.selectionName
  //     }
  //   }
  // })

  // Determines whether to show/hide the loading spinner based on page
  autorun(() => {
    // Shows or hides the loading spinner based on flag
    const loading = (flag) => {
      if (flag) {
        document.getElementById('loading').style.display = 'block'
        document.getElementById('loading-inner').style.display = 'block'
      } else {
        document.getElementById('loading').style.display = 'none'
        document.getElementById('loading-inner').style.display = 'none'
      }
    }

    switch (store.page) {
      case '#reportSuite':
        loading(store.reportSuite.loading)
        break
      case '#metricSelectors':
        loading(store.metric1.loading)
        break
      case '#elementSelectors':
        loading(store.elementPrimary.loading)
        break
      // case '#dimensions':
      //   loading(store.dimensionsList.loading)
      //   break
      // case '#segments':
      //   loading(store.segmentsList.loading)
      //   break
      // case '#summary':
      //   const flag = (store.metricsList.loading || store.dimensionsList.loading || store.segmentsList.loading)
      //   loading(flag)
      //   break
    }
  })

  // Seems to crash the devTools window
  // Populate the reportDefinition store
  // autorun(() => {
  //   store.reportDefintion = JSON.stringify(reportValidation.payload(store))
  // })

  // Show or Hide the Validate Selections buttons
  autorun(() => {
    store.metricSelections.length > 1 ? document.getElementById('metricValidation').style.display = 'block' : document.getElementById('metricValidation').style.display = 'none'
    // store.elementSelections.length > 1 ? document.getElementById('elementValidation').style.display = 'block' : document.getElementById('elementValidation').style.display = 'none'
  })

  // Render react component which handles connection error messaging
  autorun(() => {
    const devDiv = document.getElementById('devConnectionErrorMessage')
    const userDiv = document.getElementById('userConnectionErrorMessage')
    devDiv.innerHTML = ''
    userDiv.innerHTML = ''

    store.page === '#developerCreds' ? ReactDOM.render(<ConnectionErrorMessage store={store} />, devDiv) : ReactDOM.render(<ConnectionErrorMessage store={store} />, userDiv)
  })

  // Render react component which handles a warning message for End Date not at or after Start Date.
  ReactDOM.render(<DateMessage store={store} />, document.querySelector('#dateWarning'))

  // Render react component which handles a warning message for invalid metrics
  ReactDOM.render(<InvalidMetric store={store} />, document.querySelector('#invalidMetric'))

  // Render react component which handles a warning message for invalid elements
  ReactDOM.render(<InvalidElement store={store} />, document.querySelector('#invalidElement'))

  // All window declarations, below, are simply to expose functionality to the console, and
  // should probably be removed or commented out before shipping the connector.
  // Steve - I've found that if a function is referenced by the Gui.html file they need to be defined below
  window.store = store
  window.moment = moment
  window.toJS = toJS
  window.devLogin = utils.devLogin
  window.userLogin = utils.userLogin
  window.getDates = picker.getDates
  window.setDates = picker.setDates
  window.topLevelReportSuites = reportSuites.topLevelReportSuites
  window.displayFieldset = utils.displayFieldset
  window.setPage = utils.setPage
  window.showLoader = utils.showLoader
  window.resetFields = utils.resetFields
  window.topLevelMetrics = metricSelectors.topLevelMetrics
  window.getMetrics = metricSelectors.getMetrics
  window.validateMetrics = metricSelectors.validateMetrics
  window.topLevelSegments = segmentSelectors.topLevelSegments
  window.getSegments = segmentSelectors.getSegments
  window.topLevelElements = elementSelectors.topLevelElements
  window.filterElements = elementSelectors.filterElements
  window.validateElements = elementSelectors.validateElements
  window.validateReport = reportValidation.validateReport
  window.metrics = reportValidation.metrics
  window.elements = reportValidation.elements
  window.segments = reportValidation.segments
  window.payload = reportValidation.payload
}
