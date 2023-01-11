chrome.contextMenus.create({
    id: 'cmenu-record-start',
    title: '开始录制',
})
chrome.contextMenus.create({
    id: 'cmenu-record-stop',
    title: '停止录制',
})

let stream = null
let mediaRecorder = null
const handleClick = async () => {
    stream = await navigator.mediaDevices.getDisplayMedia({
        video: true
    })
    const mime = MediaRecorder.isTypeSupported("video/webm; codecs=vp9")
        ? "video/webm; codecs=vp9"
        : "video/webm"
    mediaRecorder = new MediaRecorder(stream, {
        mimeType: mime
    })

    let chunks = []
    mediaRecorder.addEventListener('dataavailable', function (e) {
        chunks.push(e.data)
    })
    mediaRecorder.addEventListener('stop', function () {
        let blob = new Blob(chunks, {
            type: chunks[0].type
        })
        let url = URL.createObjectURL(blob)

        let a = document.createElement('a')
        a.href = url
        a.download = 'video.webm'
        a.click()
    })
    mediaRecorder.start()
}

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
    // console.log(info, tab);
    if (info.menuItemId == 'cmenu-record-start') {
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            function: handleClick,
            // args: [info.srcUrl]
        });
    } else if(info.menuItemId == 'cmenu-record-stop') {
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            function: () => {
                mediaRecorder && mediaRecorder.stop()
                stream && stream.getTracks().forEach( track => track.stop() )
                // MediaStreamTrack.stop()
            },
        });
    }
});


