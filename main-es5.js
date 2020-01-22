(function(window){
  'use strict';

  var bitcoinField = document.querySelector('.bitcoinfield__input');
  var inrField = document.querySelector('.inrfield__input');
  var urls = ['https://blockchain.info/ticker',
              'http://data.fixer.io/api/latest?access_key=c88ca5ec463e3d87fff9015cafcc3ca3&symbols=USD,INR'];
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

  function formSubmitted(event) {
    httpRequest1 = new XMLHttpRequest();
    httpRequest1.onreadystatechange = getUSD;
    httpRequest1.open('GET', urls[0]);
    httpRequest1.send();
  }
  window.formSubmitted = formSubmitted;
})(window);
