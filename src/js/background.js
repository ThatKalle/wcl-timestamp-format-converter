chrome.runtime.onInstalled.addListener(() => {
    chrome.action.disable();

    chrome.declarativeContent.onPageChanged.removeRules(undefined, () => {
        const rules = {
        conditions: [
            new chrome.declarativeContent.PageStateMatcher({
            pageUrl: { hostSuffix: 'warcraftlogs.com' },
            }),
        ],
        actions: [new chrome.declarativeContent.ShowAction()],
        };

        chrome.declarativeContent.onPageChanged.addRules([rules]);
    });
});
