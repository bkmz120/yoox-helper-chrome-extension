'use strict';
import ProductPageInjector from "./common/ProductPageInjector.js";
import CountriesStorage from "./common/CountriesStorage.js";

CountriesStorage.init();


var productPageInjector = new ProductPageInjector(document,window.location.href);
productPageInjector.inject();