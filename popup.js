let btn = document.querySelector("#btnRecord")

btn.addEventListener("click", async function () {
    chrome.tabs.create({
        url: 'index.html'
    })
})