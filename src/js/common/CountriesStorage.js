export default class CountriesStorage {

    static init() {
        let defaultCountries = [
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

        this.saveAll(defaultCountries);
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