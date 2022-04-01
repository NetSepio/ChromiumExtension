const getPriceText = () => {
  const tag = document.querySelector('div.ds-summary-row h4 span');
  return tag?.innerText ?? 'No data';
};

const getRentText = () => {
  const tag = document.querySelector(
    'div#ds-rental-home-values div.ds-expandable-card-section-default-padding div div span'
  );
  return tag?.innerText ?? 'No data';
};

chrome.runtime.onMessage.addListener((msg, sender, callback) => {
  console.log(msg, sender);
  callback(`Price: ${getPriceText()}\nRent: ${getRentText()}`);
});
