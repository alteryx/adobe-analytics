import AyxStore from '../stores/AyxStore'

// Accounts menu functions
const populateAccountsList = (store) => {
  const token = store.accessToken
  const fetchAccounts = getAcccountsAjaxCall(token)

  const parseAccounts = (results) => {
    const accounts = results.items
    const accountsList = accounts.map((d, i) => {
      return {uiobject: d.name, dataname: d.id}
    })
    return accountsList
  }

  const setAccountsDropdownMenu = (accountsList) => {
    // Alteryx.Gui.manager.GetDataItem('accountsDropDown').setStringList(accountsList);
    console.log(accountsList)
  }

  fetchAccounts
    .then(parseAccounts)
    .done(setAccountsDropdownMenu)
    // .fail(handleApiFail)
}

const getAcccountsAjaxCall = (accessToken) => {
  const auth = 'Bearer ' + accessToken
  const url = 'https://www.googleapis.com/analytics/v3/management/accounts'

  const settings = {
    'async': true,
    'crossDomain': true,
    'url': url,
    'method': 'GET',
    'dataType': 'json',
    'headers': {
      'authorization': auth,
      'cache-control': 'no-cache'
    }
  }

  return $.ajax(settings)
}
/*
Authentication logic
***********************************
***********************************
***********************************
*/
const checkToken = (data) => {
  if (typeof data.errors === 'undefined') {
    // Set access token
    const accessToken = data.access_token
    Alteryx.Gui.manager.GetDataItem('accessToken').setValue(accessToken)
  }
  // Remove any error messaging
  store.errorStatus = ''
  // Change page to current page or profileSelectors
  console.log('store page:  ' + store.page)
  switch (store.page) {
    case '':
      displayFieldset('#accessMethod')
      break
    case '#offlineCreds':
      store.page = '#profileSelectors'
      displayFieldset('#profileSelectors')
      break
    default:
      displayFieldset(store.page)
  }
}

// non interactive developer method
const getAccessTokenAjaxCall = () => {
  // Add vars for each of the user text box inputs
  const clientID = Alteryx.Gui.manager.GetDataItem('client_id').value
  const clientSecret = Alteryx.Gui.manager.GetDataItem('client_secret').value
  const refreshToken = Alteryx.Gui.manager.GetDataItem('refresh_token').value

  // API call settings
  const settings = {
    'async': true,
    'crossDomain': true,
    'url': 'https://accounts.google.com/o/oauth2/token',
    'method': 'POST',
    'dataType': 'json',
    'headers': {
      'cache-control': 'no-cache',
      'content-type': 'application/x-www-form-urlencoded'
    },
    'data': {
      'client_id': clientID,
      'client_secret': clientSecret,
      'refresh_token': refreshToken,
      'Host': 'accounts.google.com',
      'grant_type': 'refresh_token'
    }
  }

  return $.ajax(settings)
    .done(checkToken)
    .fail(connectionError)
}

// 1st step - Online login method
const login = (store) => {
  const OAUTHURL = 'https://accounts.google.com/o/oauth2/auth?'
  const SCOPE = 'https://www.googleapis.com/auth/analytics.readonly'
  const CLIENTID = '552512737410-g6admen5hqg6q268dmt3d9bminlri7en.apps.googleusercontent.com'
  const REDIRECT = 'https://developers.google.com/oauthplayground'
  const TYPE = 'token'
  const _url = OAUTHURL + 'scope=' + SCOPE + '&client_id=' + CLIENTID + '&redirect_uri=' + REDIRECT + '&response_type=' + TYPE
  const win = window.open(_url, 'windowname1', 'width=800, height=600')
  Alteryx.Gui.manager.GetDataItem('errorStatus').setValue('')

  const pollTimer = window.setInterval(() => {
    try {
      if (win.document.location.origin === 'https://developers.google.com') {
        const url = win.document.URL
        const accessToken = gup(url, 'access_token')
        Alteryx.Gui.manager.GetDataItem('accessToken').setValue(accessToken)
        validateToken(accessToken)
        win.close()
        setPage('#profileSelectors')
      }
    } catch (e) {
                // console.log("catch");
    }
  }, 500)
}

// 2nd step - Parses out the access token from the response url returned in login()
const gup = (url, name) => {
  name = name.replace(/[\[]/, '\\\[').replace(/[\]]/, '\\\]')
  const regexS = '[\\#&]' + name + '=([^&#]*)'
  const regex = new RegExp(regexS)
  const results = regex.exec(url)
  if (results == null) {
    return ''
  } else {
    return results[1]
  }
}

// 3rd step - Validates the token received from login()
const validateToken = (token) => {
  const VALIDURL = 'https://www.googleapis.com/oauth2/v1/tokeninfo?access_token='

    // API call settings
  const settings = {
    'async': true,
    'crossDomain': true,
    'url': VALIDURL + token,
    'method': 'GET',
    'dataType': 'jsonp'
  }
  return $.ajax(settings)
        .done(ajaxSuccess)
        .fail(connectionError)
}

const connectionError = (jqXHR, textStatus, errorThrown) => {
  store.errorStatus = jqXHR.status
}

const ajaxSuccess = (data, textStatus) => {
  const accessToken = store.accessToken
  document.getElementById('connectionStatus').innerHTML = ''
  document.getElementById('connectionStatusBox').setAttribute('style', 'display: none')
  Alteryx.Gui.manager.GetDataItem('accessToken').setValue(accessToken)
}

const setPage = (page) => {
  store.page = page
}

// Used to show/hide different fielsets
const displayFieldset = (fieldsetName) => {
  // Array containing all fieldsets
  let hideArray = [
    '#accessMethod',
    '#onlineCreds',
    '#offlineCreds',
    '#profileSelectors',
    '#datePickers',
    '#metrics',
    '#dimensions',
    '#segments',
    '#token',
    '#summary']

  let showArray = []

  showArray.push(fieldsetName)

  $(document).ready(() => {
    // Hide each item in the hideArray
    hideArray.forEach((v) => {
      $(v).hide()
    })
    // Show the fieldset corresponding with fieldsetName
    showArray.forEach((v) => {
      $(v).show()
    })
  })
}

// Used to initially hide all fieldsets on load
const hideAllFieldsets = () => {
  const fieldsetArray = [
    '#accessMethod',
    '#onlineCreds',
    '#offlineCreds',
    '#profileSelectors',
    '#datePickers',
    '#metrics',
    '#dimensions',
    '#segments',
    '#token']

  $(document).ready(() => {
    // Hide each item in the hideArray
    fieldsetArray.forEach((v) => {
      $(v).hide()
    })
  })
}

// Used to check that token is still valid within the AfterLoad function
const tokenValid = (store) => {
  hideAllFieldsets()
  if (store.accessToken === '') {
    return
  }

  if (store.client_id !== '' && store.client_secret !== '' && store.refresh_token !== '') {
    console.log('tokenValid - developer creds')
    getAccessTokenAjaxCall()
  } else {
    store.errorStatus = ''
    // API call settings
    const settings = {
      'async': true,
      'crossDomain': true,
      'url': 'https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=' + store.accessToken,
      'method': 'GET',
      'dataType': 'jsonp'
    }

    return $.ajax(settings)
    .done((data, textStatus) => {
      if (data.expires_in < 1 || data.expires_in == null) {
        setPage('#accessMethod')
        store.errorStatus = 1
      } else {
        displayFieldset(store.page)
      };
    })
    .fail((jqXHR, textStatus, errorThrown) => {
      store.errorStatus = jqXHR.status
      setPage('#accessMethod')
    })
  }
}

const resetFields = () => {
  const setValueArray = [
    'errorStatus',
    'client_id',
    'client_secret',
    'refresh_token',
    'accessToken',
    'accountsList',
    'webPropertiesList',
    'profilesList',
    'metricsList',
    'metricsGoalsList',
    'dimensionsList',
    'segmentsList'
  ]
  const stringListArray = [
    'accountsList',
    'webPropertiesList',
    'profilesList',
    'metricsList',
    'metricsGoalsList',
    'dimensionsList',
    'segmentsList'
  ]
  const renderArray = [
    'metricsList',
    'metricsGoalsList',
    'dimensionsList',
    'segmentsList'
  ]

  // Resets the selection value for widgets
  setValueArray.map(d => {
    Alteryx.Gui.manager.GetDataItem(d).setValue('')
  })

  // Resets the stringList for widgets
  stringListArray.map(d => {
    Alteryx.Gui.manager.GetDataItem(d).setStringList([])
  })

  // Remove prior selections from ListBox widgets
  renderArray.map(d => {
    Alteryx.Gui.renderer.getReactComponentByDataName(d).selectedItemsMap = {}
    Alteryx.Gui.renderer.getReactComponentByDataName(d).forceUpdate()
  })

  // Set default value for preDefDropDown and advOptions
  Alteryx.Gui.manager.GetDataItem('preDefDropDown').setValue('today')
  Alteryx.Gui.manager.GetDataItem('advOptions').setValue(false)
}

export { getAccessTokenAjaxCall, login, gup, validateToken, displayFieldset, setPage, tokenValid, resetFields, hideAllFieldsets }
