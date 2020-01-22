(function(window){
  'use strict';

  let bitcoinField = document.querySelector('.bitcoinfield__input');
  let inrField = document.querySelector('.inrfield__input');
  let urls = ['https://blockchain.info/ticker',
              'http://data.fixer.io/api/latest?access_key=YOUR_API_KEY&symbols=USD,INR'];
  async function formSubmitted(event) {
    let bitcoinToUSD, eurToUSD, eurToINR;
    try {
      const response0 = await fetch(urls[0]);
      const text0 = await (response => {
        // A fetch() promise will reject with a TypeError when a network error is encountered or CORS is misconfigured on the server-side, although this usually means permission issues or similar — a 404 does not constitute a network error, for example. An accurate check for a successful fetch() would include checking that the promise resolved, then checking that the Response.ok property has a value of true.
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })(response0);
      await (text => {
        if (!isNaN(text.USD.last)) {
          bitcoinToUSD = text.USD.last;
        }
        else {
          throw new Error('Malformed JSON returned from blockchain.info !');
        }
      })(text0);
      const response1 = await fetch(urls[1]);
      const text1 = await (response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })(response1);
      await (text => {
        if (!isNaN(text.rates.INR) && !isNaN(text.rates.USD)) {
          eurToINR = text.rates.INR;
          eurToUSD = text.rates.USD;
          inrField.value = bitcoinField.value * bitcoinToUSD * eurToINR / eurToUSD;
        }
        else {
          throw new Error('Malformed JSON returned from fixer.io !');
        }
      })(text1);
    } catch (e) {
      console.error(e);
      console.error('Error in fetching from APIs!');
    }
  }
  window.formSubmitted = formSubmitted;
})(window);
