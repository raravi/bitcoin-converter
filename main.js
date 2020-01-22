(function(window){
  'use strict';

  var bitcoinField = document.querySelector('.bitcoinfield__input');
  var inrField = document.querySelector('.inrfield__input');
  var urls = ['https://blockchain.info/ticker',
              'http://data.fixer.io/api/latest?access_key=YOUR_API_KEY&symbols=USD,INR'];
  var httpRequest1, httpRequest2;
  var bitcoinToUSD, eurToUSD, eurToINR;

  function onError(error) {
    console.error(error);
    console.error('Error in fetching from APIs!');
  }

  function getUSDINR() {
    if (httpRequest2.readyState === XMLHttpRequest.DONE) {
      if (httpRequest2.status === 200) {
        eurToINR = JSON.parse(httpRequest2.responseText).rates.INR;
        eurToUSD = JSON.parse(httpRequest2.responseText).rates.USD;
        if(!isNaN(eurToINR) && !isNaN(eurToUSD)) {
          inrField.value = bitcoinField.value * bitcoinToUSD * eurToINR / eurToUSD;
        } else {
          onError('Malformed JSON returned from fixer.io!');
        }
      } else {
        onError('Error in fetching from fixer.io!');
      }
    }
  }

  function getUSD() {
    if (httpRequest1.readyState === XMLHttpRequest.DONE) {
      if (httpRequest1.status === 200) {
        bitcoinToUSD = JSON.parse(httpRequest1.responseText).USD.last;
        if (!isNaN(bitcoinToUSD)) {
          httpRequest2 = new XMLHttpRequest();
          httpRequest2.onreadystatechange = getUSDINR;
          httpRequest2.open('GET', urls[1]);
          httpRequest2.send();
        }
        else {
          onError('Malformed JSON returned from blockchain.info!');
        }
      } else {
        onError('Error in fetching from blockchain.info!');
      }
    }
  }

  function formSubmittedXHR() {
    httpRequest1 = new XMLHttpRequest();
    httpRequest1.onreadystatechange = getUSD;
    httpRequest1.open('GET', urls[0]);
    httpRequest1.send();
  }

  function formSubmittedFetch() {
    Promise.all(urls.map(url =>
      fetch(url)
      .then(response => {
        // A fetch() promise will reject with a TypeError when a network error is encountered or CORS is misconfigured on the server-side, although this usually means permission issues or similar — a 404 does not constitute a network error, for example. An accurate check for a successful fetch() would include checking that the promise resolved, then checking that the Response.ok property has a value of true.
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
    )).then(texts => {
      if (isNaN(texts[0].USD.last)) {
        throw new Error('Malformed JSON returned from blockchain.info !');
      }
      if (isNaN(texts[1].rates.INR) || isNaN(texts[1].rates.USD)) {
        throw new Error('Malformed JSON returned from fixer.io !');
      }
      inrField.value = bitcoinField.value * texts[0].USD.last * texts[1].rates.INR / texts[1].rates.USD;
    }).catch(e => {
      console.error(e);
      console.error('Error in fetching from APIs!');
    })
  }

  function formSubmitted(event) {
    if (window.Promise && window.fetch) {
      formSubmittedFetch();
    }
    else {
      formSubmittedXHR();
    }
  }

  window.formSubmitted = formSubmitted;
})(window);
