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
  	})
  	.fail((jqXHR, textStatus, errorThrown) => {
  	  errorMessaging(jqXHR, textStatus, errorThrown)
  	})
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

export { devLogin }
