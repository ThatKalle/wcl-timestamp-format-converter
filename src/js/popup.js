let convertButton = document.getElementById("convertButton");
let formatPicker = document.getElementById("formatPicker");

convertButton.addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: convert,
    args: [formatPicker.value],
  });
});

function convert(selectedStyle) {
  const timestampRegEx = /([0-9]{1,2})?:[0-9]{1,2} ?(am|pm)/gi;

  var paddingZero = true,
      delimiter = ":";

  selectedStyle = selectedStyle.toLowerCase();
  if (selectedStyle.includes("nopaddingzero")) {
    paddingZero = false;
  }
  if (selectedStyle.includes("withanh")) {
    delimiter = "h";
  }
  if (selectedStyle.includes("military")) {
    delimiter = "";
  }

  function findandreplace(root, paddingZero, delimiter) {
    let count = 0;
    let TreeWalker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let node, digits, hours;

    while ((node = TreeWalker.nextNode()) !== null) {
      if (node.textContent == null) {
        continue;
      }
      if (!node.textContent.match(timestampRegEx)) {
        continue;
      }

      node.textContent = node.textContent.replace(timestampRegEx, function (match) {
        count++;
        digits = match.match(/[0-9]+/g);
        hours = parseInt(digits[0]);
        mins = digits[1] || "00";
        if (match.match(/p/i)) {
          hours += 12;
        }
        if (hours == 12) {
          hours = 0;
        } else if (hours == 24) {
          hours = 12;
        }
        return (hours < 10 && paddingZero ? "0" : "") + hours + delimiter + mins;
      });
    }

    return count;
  }

  let ccount = findandreplace(document.body, paddingZero, delimiter);
  console.log("converted " + ccount + " timestamps.");
}
