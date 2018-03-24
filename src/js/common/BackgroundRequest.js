export default class BackgroundRequest {
    static GET(url) {
        let requestPromise = new Promise((resolve,reject)=>{
            chrome.runtime.sendMessage(
                {
                    method: "GETrequest",
                    url:url
                },
                (response) => {
                    resolve(response);
                }
            );
        });
        return requestPromise;
    }

    static cutCookies() {
        let cutPromise = new Promise((resolve,reject)=>{
            chrome.runtime.sendMessage(
                {
                    method: "cutCookies"
                },
                (response) => {
                    resolve(response);
                }
            );
        });
        return cutPromise;

        // var pairs = document.cookie.split(";");
        // var cookies = {};
        // for (var i=0; i<pairs.length; i++){
        //     var pair = pairs[i].split("=");
        //     cookies[(pair[0]+'').trim()] = unescape(pair[1]);
        // }
        // console.log(cookies);
    }

    static replaceCookies(cookies) {
        let replacePromise = new Promise((resolve,reject)=>{
            chrome.runtime.sendMessage(
                {
                    method: "replaceCookies",
                    cookies:cookies
                },
                (response) => {
                    resolve(response);
                }
            );
        });
        return replacePromise;
    }
}