'use strict';
import ProductPageInjector from "./common/ProductPageInjector.js";
import CountriesStorage from "./common/CountriesStorage.js";

CountriesStorage.init().then(()=>{
    if (document.body.id==="Item") {
        var productPageInjector = new ProductPageInjector(document,window.location.href);
        productPageInjector.inject();
    }
});