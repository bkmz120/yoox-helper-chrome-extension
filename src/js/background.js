import $ from "jquery";

/**
 * listen for messages
 */
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    switch (request.method) {
        case "GETrequest":
            GETrequest(request, sender, sendResponse);
            break;
        case "cutCookies":
            cutCookies(request, sender, sendResponse);
            break;
        case "replaceCookies":
            replaceCookies(request, sender, sendResponse);
            break;
    }
    return true;
});

function GETrequest(request, sender, sendResponse) {
    console.log("GETrequest");
    $.get(request.url,(data)=>{
        sendResponse(data);
    });
}

function cutCookies(request, sender, sendResponse){
    console.log("cutCookies");
    _cutCookiesPromise().then((cookies)=>{
        sendResponse(cookies);
    });
}

function _cutCookiesPromise() {
    return new Promise((cutResolve,cutReject)=>{
        chrome.cookies.getAll({domain:".yoox.com"},(cookies)=>{
            let removePromises = [];
            for (let i=0;i<cookies.length;i++) {
                let removePromise = new Promise((resolve,request)=>{
                    chrome.cookies.remove(
                    {
                            url:"https://www.yoox.com",
                            name:cookies[i].name
                        },
                        ()=>{
                            resolve();
                        }
                    );
                });
                removePromises.push(removePromise);
            }
            Promise.all(removePromises).then(()=>{
                cutResolve(cookies);
            })
        });
    });
}

function replaceCookies(request, sender, sendResponse) {
    console.log("replaceCookies");
    _cutCookiesPromise()
        .then(()=>{
            for (let i=0;i<request.cookies.length;i++) {
                chrome.cookies.set({
                    url:"https://www.yoox.com",
                    name:request.cookies[i].name,
                    value:request.cookies[i].value,
                    path:request.cookies[i].path,
                    domain:request.cookies[i].domain,
                    expirationDate:request.cookies[i].expirationDate,
                    secure:request.cookies[i].secure,
                    httpOnly:request.cookies[i].httpOnly,
                    sameSite:request.cookies[i].sameSite
                });
            }
        });
}