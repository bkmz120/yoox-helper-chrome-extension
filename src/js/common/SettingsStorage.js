const defaultSettings = {
    autoLoadPriceStatus:true
}

export default class SettingsStorage {
    static init() {
        //if storage is empty set default values
        return SettingsStorage.getAll().then((settings)=>{
            if (settings===undefined) {
                var initPromise = SettingsStorage.saveAll(defaultSettings);
            }
            else {
                var initPromise = Promise.resolve();
            }
            return initPromise;
        });
    }

    static getAll() {
        let loadPromise = new Promise((resolve,reject)=>{
            chrome.storage.local.get(['settings'],(items)=>{
                resolve(items.settings);
            });
        });
        return loadPromise;
    }

    static saveAll(settings) {
        let savePromise = new Promise((resolve,reject)=>{
            console.log("settings",settings);
            chrome.storage.local.set({settings:settings},()=>{
                resolve();
            });
        });
        return savePromise;
    }
}