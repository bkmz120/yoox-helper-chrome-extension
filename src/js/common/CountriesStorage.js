const defaultCountries = [
    {
        name:"United Kingdom",
        shortName:"uk",
        EURcoef:1.13875119,
    },
    {
        name:"USA",
        shortName:"us",
        EURcoef:0.813980937,
    },
    {
        name:"Norway",
        shortName:"no",
        EURcoef:1,
    },
    {
        name:"Germany",
        shortName:"de",
        EURcoef:1,
    }
];

export default class CountriesStorage {

    static init() {
        //if storage is empty set default values
        return CountriesStorage.getAll().then((countries)=>{
            if (countries===undefined) {
                var initPromise = CountriesStorage.saveAll(defaultCountries);
            }
            else {
                var initPromise = Promise.resolve();
            }
            return initPromise;
        });
    }

    static getAll() {
        let loadPromise = new Promise((resolve,reject)=>{
            chrome.storage.local.get(['countries'],(items)=>{
                resolve(items.countries);
            });
        });
        return loadPromise;
    }

    static saveAll(countries) {
        let savePromise = new Promise((resolve,reject)=>{
            chrome.storage.local.set({countries:countries},()=>{
                resolve();
            });
        });
        return savePromise;
    }
}