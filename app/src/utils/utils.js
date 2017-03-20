import AyxStore from '../stores/AyxStore'

// Developer acccess_token request triggered by Connect button on developerCreds page
const devLogin = () => {
  const auth = store.client_id.trim() + ':' + store.client_secret.trim()

  var settings = {
    'async': true,
    'crossDomain': true,
    'url': 'https://api.omniture.com/token',
    'method': 'POST',
    'headers': {
      'authorization': 'Basic ' + btoa(auth),
      'content-type': 'application/x-www-form-urlencoded',
      'cache-control': 'no-cache'
    },
    'data': {
      'grant_type': 'client_credentials'
    }
  }

  $.ajax(settings)
    .done((data) => {
      store.access_token = data.access_token
      console.log('access_token is ' + store.access_token)
      setPage('#reportSuite')
    })
    .fail((jqXHR, textStatus, errorThrown) => {
      errorMessaging(jqXHR, textStatus, errorThrown)
    })
}

// User access_token request triggered by User Login button on authSelect page
const userLogin = () => {
  const base = 'https://marketing.adobe.com/authorize?'
  const scope = 'Company ReportSuite Report'  // may need to add to this later
  const clientId = '3398773387-alteryx'
  const redirectUri = 'https://developers.google.com/oauthplayground'
  const _url = base + 'scope=' + scope + '&redirect_uri=' + redirectUri + '&response_type=token' + '&client_id=' + clientId + '&access_type=offline'
  const win = window.open(_url, 'windowname1', 'width=800, height=600')
  // Alteryx.Gui.manager.GetDataItem('errorStatus').setValue('')

  // Hode all fieldsets and Show loading image
  setPage('#blank')
  showLoader(true)

  const pollTimer = window.setInterval(() => {
    try {
      if (win.document.location.origin === 'https://developers.google.com') {
        const url = win.document.URL
        console.log(url)
        const accessToken = parseToken(url, 'access_token')
        store.access_token = accessToken
        console.log('User login access_token is:' + store.access_token)
        win.close()
        showLoader(false)
        setPage('#reportSuite')
      }
    } catch (e) {
                // console.log("catch");
    }
  }, 500)
}

// Parses access_token from the response url returned in userLogin
const parseToken = (url, name) => {
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

const errorMessaging = (jqXHR, textStatus, errorThrown) => {
  console.log('jqXHR:')
  console.log(jqXHR)
  console.log('textStatus:')
  console.log(textStatus)
  console.log('errorThrown:')
  console.log(errorThrown)
  // Need to write custom error messages
}

const setPage = (page) => {
  store.page = page
}

// Used to show/hide different fielsets
const displayFieldset = (fieldsetName) => {
  // Array containing all fieldsets
  let hideArray = [
    '#authSelect',
    '#developerCreds',
    '#datePickers',
    '#reportSuite'
  ]

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

const showLoader = (flag) => {
  if (flag) {
    document.getElementById('loading').style.display = 'block'
    document.getElementById('loading-inner').style.display = 'block'
  } else {
    document.getElementById('loading').style.display = 'none'
    document.getElementById('loading-inner').style.display = 'none'
  }
}

export { devLogin, userLogin, setPage, displayFieldset, showLoader }