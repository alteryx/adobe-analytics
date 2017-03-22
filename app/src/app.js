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
// import _ from 'lodash'

Alteryx.Gui.AfterLoad = (manager) => {
  const collection = [
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
    {key: 'granularity', type: 'dropDown'}
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

      const notEmpty = (value) => {
        return value !== ''
      }

      return selections.filter(notEmpty)
    }
  })

  // Enable or Disable the Connect button on Developer Credentials page
  autorun(() => {
    const target = document.getElementById('connect_button')
    store.client_id === '' || store.client_secret === '' ? target.setAttribute('disabled', 'true') : target.removeAttribute('disabled')
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
      metricSelectors.getMetrics(store, 1)
      metricSelectors.getMetrics(store, 2)
      metricSelectors.getMetrics(store, 3)
      metricSelectors.getMetrics(store, 4)
      metricSelectors.getMetrics(store, 5)
    }
  })

  // Enable or Disable the Next button on metric selecotrs page
  autorun(() => {
    const target = document.getElementById('metricSelectorsNextBtn')
    store.metricSelections.length === 0 ? target.setAttribute('disabled', 'true') : target.removeAttribute('disabled')
  })

  // // Determines whether to show/hide the loading spinner based on page
  // autorun(() => {
  //   // Shows or hides the loading spinner based on flag
  //   const loading = (flag) => {
  //     if (flag) {
  //       document.getElementById('loading').style.display = 'block'
  //       document.getElementById('loading-inner').style.display = 'block'
  //     } else {
  //       document.getElementById('loading').style.display = 'none'
  //       document.getElementById('loading-inner').style.display = 'none'
  //     }
  //   }

  //   switch (store.page) {
  //     case '#reportSuite':
  //       loading(store.accountsList.loading)
  //       break
  //     case '#developer':
  //       loading(store.metricsList.loading)
  //       break
  //     case '#dimensions':
  //       loading(store.dimensionsList.loading)
  //       break
  //     case '#segments':
  //       loading(store.segmentsList.loading)
  //       break
  //     case '#summary':
  //       const flag = (store.metricsList.loading || store.dimensionsList.loading || store.segmentsList.loading)
  //       loading(flag)
  //       break
  //   }
  // })

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
  window.getMetrics = metricSelectors.getMetrics
}
