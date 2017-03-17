import React from 'react'
import ReactDOM from 'react-dom'
import AyxStore from './stores/AyxStore'
import { extendObservable, autorun, toJS } from 'mobx'
import moment from 'moment'
import * as utils from './utils/utils'
import * as reportSuites from './utils/get-report-suites'
// import _ from 'lodash'

Alteryx.Gui.AfterLoad = (manager) => {
  const collection = [
    {key: 'client_id', type: 'value'},
    {key: 'client_secret', type: 'value'},
    {key: 'access_token', type: 'value'}
  ]

  // Instantiate the mobx store which will sync all dataItems
  // specified in the collection.
  const store = new AyxStore(manager, collection)

  autorun(() => {
    const target = document.getElementById('connect_button')
    store.client_id === '' || store.client_secret === '' ? target.setAttribute('disabled', 'true') : target.removeAttribute('disabled')
  })

  // All window declarations, below, are simply to expose functionality to the console, and
  // should probably be removed or commented out before shipping the connector.
  // Steve - I've found that if a function is referenced by the Gui.html file they need to be defined below
  window.store = store
  window.moment = moment
  window.toJS = toJS
  window.devLogin = utils.devLogin
  window.userLogin = utils.userLogin
  window.topLevelReportSuites = reportSuites.topLevelReportSuites
}
