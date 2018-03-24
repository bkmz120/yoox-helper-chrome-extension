import $ from "jquery";
import ProductPageParser from "./ProductPageParser.js";
import CountriesStorage from "./CountriesStorage.js";
import BackgroundRequest from "./BackgroundRequest.js";

export default class ProductCountriesIterator{

    constructor(productUrl) {
        this._productUrl = productUrl;
        const DOMAIN = "www.yoox.com";
        let domainEndPos = productUrl.indexOf(DOMAIN) + DOMAIN.length + 1;
        this._curCountryShortName = productUrl.substring(domainEndPos,domainEndPos+2);
        this._urlBeforeCountry = productUrl.substring(0,domainEndPos);
        this._urlAfterCountry =  productUrl.substring(domainEndPos+2);
        this._readyPromise = CountriesStorage.getAll().then((countries)=>{
            this._countries = countries;
            return true;
        });
    }

    getPrices() {
        let cookies;
        var getPricesPromise = this._readyPromise
            .then(BackgroundRequest.cutCookies)
            .then((_cookies)=>{
                cookies = _cookies;
                console.log(cookies);
                let parsePromisesArr = [];
                this._prices = [];
                for (let i=0;i<this._countries.length;i++) {
                    if (this._countries[i].shortName!==this._curCountryShortName) {
                        let url = this._makeUrlForCountry(this._countries[i].shortName);
                        this._countries[i].url = url;
                        var parsePromise = new Promise((resolve,reject)=>{
                            let productPageParser = new ProductPageParser(url);
                            var self = this;
                            productPageParser.ready(function(){
                                let price = this.getPriceValue(self._countries[i].EURcoef);
                                self._prices.push({
                                    price:price,
                                    price_str:price + "_" + self._countries[i].shortName,
                                    url:url,
                                });
                                resolve();
                            });
                        });
                        parsePromisesArr.push(parsePromise);
                    }
                }
                return Promise.all(parsePromisesArr);
            })
            .then(()=>{
                BackgroundRequest.replaceCookies(cookies);
                return this._prices;
            });
        return  getPricesPromise;
    }

    _makeUrlForCountry(countryShortName) {
        return this._urlBeforeCountry + countryShortName + this._urlAfterCountry;
    }
}