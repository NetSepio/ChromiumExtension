const getPriceText = () => {
  try {
    const tag = document.querySelector("div.ds-summary-row h4 span");
    if (!tag) {
      throw new Error("Element not found");
    }
    return (tag as HTMLElement).innerText;
  } catch (error) {
    console.error(error);
    return "No data";
  }
};

const getRentText = () => {
  try {
    const tag = document.querySelector(
      "div#ds-rental-home-values div.ds-expandable-card-section-default-padding div div span"
    );
    if (!tag) {
      throw new Error("Element not found");
    }
    return (tag as HTMLElement).innerText;
  } catch (error) {
    console.error(error);
    return "No data";
  }
};

chrome.runtime.onMessage.addListener((msg, sender, callback) => {
  console.log(msg, sender);
  callback(`Price: ${getPriceText()}\nRent: ${getRentText()}`);
});
