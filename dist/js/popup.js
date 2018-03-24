/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 9);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
const defaultCountries = [{
    name: "United Kingdom",
    shortName: "uk",
    EURcoef: 1.13875119
}, {
    name: "USA",
    shortName: "us",
    EURcoef: 0.813980937
}, {
    name: "Norway",
    shortName: "no",
    EURcoef: 1
}, {
    name: "Germany",
    shortName: "de",
    EURcoef: 1
}];

class CountriesStorage {

    static init() {
        //if storage is empty set default values
        return this.getAll().then(countries => {
            if (countries === undefined) {
                var initPromise = this.saveAll(defaultCountries);
            } else {
                var initPromise = Promise.resolve();
            }
            return initPromise;
        });
    }

    static getAll() {
        let loadPromise = new Promise((resolve, reject) => {
            chrome.storage.local.get(['countries'], items => {
                resolve(items.countries);
            });
        });
        return loadPromise;
    }

    static saveAll(countries) {
        let savePromise = new Promise((resolve, reject) => {
            chrome.storage.local.set({ countries: countries }, () => {
                resolve();
            });
        });
        return savePromise;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = CountriesStorage;


/***/ }),
/* 1 */,
/* 2 */,
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["b"] = h;
/* harmony export (immutable) */ __webpack_exports__["a"] = app;
function h(name, attributes) {
  var rest = []
  var children = []
  var length = arguments.length

  while (length-- > 2) rest.push(arguments[length])

  while (rest.length) {
    var node = rest.pop()
    if (node && node.pop) {
      for (length = node.length; length--; ) {
        rest.push(node[length])
      }
    } else if (node != null && node !== true && node !== false) {
      children.push(node)
    }
  }

  return typeof name === "function"
    ? name(attributes || {}, children)
    : {
        nodeName: name,
        attributes: attributes || {},
        children: children,
        key: attributes && attributes.key
      }
}

function app(state, actions, view, container) {
  var map = [].map
  var rootElement = (container && container.children[0]) || null
  var oldNode = rootElement && recycleElement(rootElement)
  var lifecycle = []
  var skipRender
  var isRecycling = true
  var globalState = clone(state)
  var wiredActions = wireStateToActions([], globalState, clone(actions))

  scheduleRender()

  return wiredActions

  function recycleElement(element) {
    return {
      nodeName: element.nodeName.toLowerCase(),
      attributes: {},
      children: map.call(element.childNodes, function(element) {
        return element.nodeType === 3 // Node.TEXT_NODE
          ? element.nodeValue
          : recycleElement(element)
      })
    }
  }

  function resolveNode(node) {
    return typeof node === "function"
      ? resolveNode(node(globalState, wiredActions))
      : node != null ? node : ""
  }

  function render() {
    skipRender = !skipRender

    var node = resolveNode(view)

    if (container && !skipRender) {
      rootElement = patch(container, rootElement, oldNode, (oldNode = node))
    }

    isRecycling = false

    while (lifecycle.length) lifecycle.pop()()
  }

  function scheduleRender() {
    if (!skipRender) {
      skipRender = true
      setTimeout(render)
    }
  }

  function clone(target, source) {
    var out = {}

    for (var i in target) out[i] = target[i]
    for (var i in source) out[i] = source[i]

    return out
  }

  function set(path, value, source) {
    var target = {}
    if (path.length) {
      target[path[0]] =
        path.length > 1 ? set(path.slice(1), value, source[path[0]]) : value
      return clone(source, target)
    }
    return value
  }

  function get(path, source) {
    var i = 0
    while (i < path.length) {
      source = source[path[i++]]
    }
    return source
  }

  function wireStateToActions(path, state, actions) {
    for (var key in actions) {
      typeof actions[key] === "function"
        ? (function(key, action) {
            actions[key] = function(data) {
              var result = action(data)

              if (typeof result === "function") {
                result = result(get(path, globalState), actions)
              }

              if (
                result &&
                result !== (state = get(path, globalState)) &&
                !result.then // !isPromise
              ) {
                scheduleRender(
                  (globalState = set(path, clone(state, result), globalState))
                )
              }

              return result
            }
          })(key, actions[key])
        : wireStateToActions(
            path.concat(key),
            (state[key] = clone(state[key])),
            (actions[key] = clone(actions[key]))
          )
    }

    return actions
  }

  function getKey(node) {
    return node ? node.key : null
  }

  function eventListener(event) {
    return event.currentTarget.events[event.type](event)
  }

  function updateAttribute(element, name, value, oldValue, isSvg) {
    if (name === "key") {
    } else if (name === "style") {
      for (var i in clone(oldValue, value)) {
        var style = value == null || value[i] == null ? "" : value[i]
        if (i[0] === "-") {
          element[name].setProperty(i, style)
        } else {
          element[name][i] = style
        }
      }
    } else {
      if (name[0] === "o" && name[1] === "n") {
        if (!element.events) {
          element.events = {}
        }
        element.events[(name = name.slice(2))] = value
        if (value) {
          if (!oldValue) {
            element.addEventListener(name, eventListener)
          }
        } else {
          element.removeEventListener(name, eventListener)
        }
      } else if (name in element && name !== "list" && !isSvg) {
        element[name] = value == null ? "" : value
      } else if (value != null && value !== false) {
        element.setAttribute(name, value)
      }

      if (value == null || value === false) {
        element.removeAttribute(name)
      }
    }
  }

  function createElement(node, isSvg) {
    var element =
      typeof node === "string" || typeof node === "number"
        ? document.createTextNode(node)
        : (isSvg = isSvg || node.nodeName === "svg")
          ? document.createElementNS(
              "http://www.w3.org/2000/svg",
              node.nodeName
            )
          : document.createElement(node.nodeName)

    var attributes = node.attributes
    if (attributes) {
      if (attributes.oncreate) {
        lifecycle.push(function() {
          attributes.oncreate(element)
        })
      }

      for (var i = 0; i < node.children.length; i++) {
        element.appendChild(
          createElement(
            (node.children[i] = resolveNode(node.children[i])),
            isSvg
          )
        )
      }

      for (var name in attributes) {
        updateAttribute(element, name, attributes[name], null, isSvg)
      }
    }

    return element
  }

  function updateElement(element, oldAttributes, attributes, isSvg) {
    for (var name in clone(oldAttributes, attributes)) {
      if (
        attributes[name] !==
        (name === "value" || name === "checked"
          ? element[name]
          : oldAttributes[name])
      ) {
        updateAttribute(
          element,
          name,
          attributes[name],
          oldAttributes[name],
          isSvg
        )
      }
    }

    var cb = isRecycling ? attributes.oncreate : attributes.onupdate
    if (cb) {
      lifecycle.push(function() {
        cb(element, oldAttributes)
      })
    }
  }

  function removeChildren(element, node) {
    var attributes = node.attributes
    if (attributes) {
      for (var i = 0; i < node.children.length; i++) {
        removeChildren(element.childNodes[i], node.children[i])
      }

      if (attributes.ondestroy) {
        attributes.ondestroy(element)
      }
    }
    return element
  }

  function removeElement(parent, element, node) {
    function done() {
      parent.removeChild(removeChildren(element, node))
    }

    var cb = node.attributes && node.attributes.onremove
    if (cb) {
      cb(element, done)
    } else {
      done()
    }
  }

  function patch(parent, element, oldNode, node, isSvg) {
    if (node === oldNode) {
    } else if (oldNode == null || oldNode.nodeName !== node.nodeName) {
      var newElement = createElement(node, isSvg)
      parent.insertBefore(newElement, element)

      if (oldNode != null) {
        removeElement(parent, element, oldNode)
      }

      element = newElement
    } else if (oldNode.nodeName == null) {
      element.nodeValue = node
    } else {
      updateElement(
        element,
        oldNode.attributes,
        node.attributes,
        (isSvg = isSvg || node.nodeName === "svg")
      )

      var oldKeyed = {}
      var newKeyed = {}
      var oldElements = []
      var oldChildren = oldNode.children
      var children = node.children

      for (var i = 0; i < oldChildren.length; i++) {
        oldElements[i] = element.childNodes[i]

        var oldKey = getKey(oldChildren[i])
        if (oldKey != null) {
          oldKeyed[oldKey] = [oldElements[i], oldChildren[i]]
        }
      }

      var i = 0
      var k = 0

      while (k < children.length) {
        var oldKey = getKey(oldChildren[i])
        var newKey = getKey((children[k] = resolveNode(children[k])))

        if (newKeyed[oldKey]) {
          i++
          continue
        }

        if (newKey == null || isRecycling) {
          if (oldKey == null) {
            patch(element, oldElements[i], oldChildren[i], children[k], isSvg)
            k++
          }
          i++
        } else {
          var keyedNode = oldKeyed[newKey] || []

          if (oldKey === newKey) {
            patch(element, keyedNode[0], keyedNode[1], children[k], isSvg)
            i++
          } else if (keyedNode[0]) {
            patch(
              element,
              element.insertBefore(keyedNode[0], oldElements[i]),
              keyedNode[1],
              children[k],
              isSvg
            )
          } else {
            patch(element, oldElements[i], null, children[k], isSvg)
          }

          newKeyed[newKey] = children[k]
          k++
        }
      }

      while (i < oldChildren.length) {
        if (getKey(oldChildren[i]) == null) {
          removeElement(element, oldElements[i], oldChildren[i])
        }
        i++
      }

      for (var i in oldKeyed) {
        if (!newKeyed[i]) {
          removeElement(element, oldKeyed[i][0], oldKeyed[i][1])
        }
      }
    }
    return element
  }
}


/***/ }),
/* 4 */,
/* 5 */,
/* 6 */,
/* 7 */,
/* 8 */,
/* 9 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_hyperapp__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__popup_state_js__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__popup_actions_js__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__popup_view_js__ = __webpack_require__(12);





Object(__WEBPACK_IMPORTED_MODULE_0_hyperapp__["a" /* app */])(__WEBPACK_IMPORTED_MODULE_1__popup_state_js__["a" /* state */], __WEBPACK_IMPORTED_MODULE_2__popup_actions_js__["a" /* actions */], __WEBPACK_IMPORTED_MODULE_3__popup_view_js__["a" /* view */], document.body);

/***/ }),
/* 10 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
const state = {
    countries: [],
    newCountry: {
        name: "",
        shortName: "",
        EURcoef: ""
    },
    newCountryValid: {
        name: true,
        shortName: true,
        EURcoef: true
    },
    errorMsg: ""
};
/* harmony export (immutable) */ __webpack_exports__["a"] = state;


/***/ }),
/* 11 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__common_CountriesStorage_js__ = __webpack_require__(0);


const actions = {
    newCountry: {
        setName: value => state => ({ name: value }),
        setShortName: value => state => ({ shortName: value }),
        setEURcoef: value => state => ({ EURcoef: value })
    },
    addCountry: value => (state, actions) => {
        let valid = true;
        let errorMsg = "";
        state.newCountryValid = {
            name: true,
            shortName: true,
            EURcoef: true
        };

        if (state.newCountry.name == "") {
            valid = false;
            state.newCountryValid.name = false;
        }

        if (state.newCountry.shortName == "") {
            valid = false;
            state.newCountryValid.shortName = false;
        }

        if (state.newCountry.EURcoef == "") {
            valid = false;
            state.newCountryValid.EURcoef = false;
        }

        if (!valid) {
            errorMsg = "Fill all required fields";

            return {
                newCountryValid: state.newCountryValid,
                errorMsg: errorMsg
            };
        }

        for (var i = 0; i < state.countries.length; i++) {
            if (state.countries[i].shortName === state.newCountry.shortName) {
                errorMsg = "Short name must be unique";
                state.newCountryValid.shortName = false;
                valid = false;
                break;
            }
        }

        if (!valid) {
            return {
                newCountryValid: state.newCountryValid,
                errorMsg: errorMsg
            };
        }

        state.countries.push(state.newCountry);
        actions.saveSettings();
        return {
            countries: state.countries,
            newCountry: {
                name: "",
                shortName: "",
                EURcoef: ""
            },
            errorMsg: errorMsg
        };
    },
    removeCountry: shortName => (state, actions) => {
        for (var i = 0; i < state.countries.length; i++) {
            if (state.countries[i].shortName === shortName) {
                state.countries.splice(i, 1);
                break;
            }
        }
        actions.saveSettings();
        return {
            countries: state.countries
        };
    },
    setEURCoef: value => (state, actions) => {
        for (var i = 0; i < state.countries.length; i++) {
            if (state.countries[i].shortName === value.shortName) {
                state.countries[i].EURcoef = value.EURcoef;
                break;
            }
        }
        actions.saveSettings();
        return {
            countries: state.countries
        };
    },
    setAllCountries: value => {
        if (value === undefined) {
            value = [];
        }
        return {
            countries: value
        };
    },
    saveSettings: value => state => {
        __WEBPACK_IMPORTED_MODULE_0__common_CountriesStorage_js__["a" /* default */].saveAll(state.countries);
        return true;
    },
    loadSetting: value => (state, actions) => {
        __WEBPACK_IMPORTED_MODULE_0__common_CountriesStorage_js__["a" /* default */].getAll().then(countries => {

            actions.setAllCountries(countries);
        });
    }
};
/* harmony export (immutable) */ __webpack_exports__["a"] = actions;


/***/ }),
/* 12 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_hyperapp__ = __webpack_require__(3);


const CountryRow = ({ name, shortName, EURcoef, removeCountry, setEURCoef }) => Object(__WEBPACK_IMPORTED_MODULE_0_hyperapp__["b" /* h */])(
    "div",
    { "class": "country-row" },
    Object(__WEBPACK_IMPORTED_MODULE_0_hyperapp__["b" /* h */])(
        "div",
        { "class": "country-row__name" },
        name
    ),
    Object(__WEBPACK_IMPORTED_MODULE_0_hyperapp__["b" /* h */])(
        "div",
        { "class": "country-row__shortName" },
        shortName
    ),
    Object(__WEBPACK_IMPORTED_MODULE_0_hyperapp__["b" /* h */])("input", { type: "text",
        "class": "country-row__eurCoef",
        value: EURcoef,
        oninput: e => setEURCoef({
            EURcoef: e.target.value,
            shortName: shortName
        })
    }),
    Object(__WEBPACK_IMPORTED_MODULE_0_hyperapp__["b" /* h */])("i", { "class": "country-row__remove fas fa-times", onclick: () => removeCountry(shortName) })
);

const CountryNewRow = ({
    setName,
    setShortName,
    setEURCoef,
    addCountry,
    validName,
    validShortName,
    validEURcoef
}) => Object(__WEBPACK_IMPORTED_MODULE_0_hyperapp__["b" /* h */])(
    "div",
    { "class": "country-new-row" },
    Object(__WEBPACK_IMPORTED_MODULE_0_hyperapp__["b" /* h */])("input", { type: "text",
        "class": validName ? 'country-new-row__name' : 'country-new-row__name error-inp',
        oninput: e => setName(e.target.value),
        placeholder: "Country"
    }),
    Object(__WEBPACK_IMPORTED_MODULE_0_hyperapp__["b" /* h */])("input", { type: "text",
        "class": validShortName ? 'country-new-row__shortName' : 'country-new-row__shortName error-inp',
        oninput: e => setShortName(e.target.value),
        placeholder: "Short name"
    }),
    Object(__WEBPACK_IMPORTED_MODULE_0_hyperapp__["b" /* h */])("input", { type: "text",
        "class": validEURcoef ? 'country-new-row__eurCoef' : 'country-new-row__eurCoef error-inp',
        oninput: e => setEURCoef(e.target.value),
        placeholder: "to EUR coef"
    }),
    Object(__WEBPACK_IMPORTED_MODULE_0_hyperapp__["b" /* h */])(
        "div",
        { "class": "country-new-row__addBtn", onclick: () => addCountry() },
        "Add"
    )
);

const view = (state, actions) => {
    var countries = state.countries.map(country => {
        return Object(__WEBPACK_IMPORTED_MODULE_0_hyperapp__["b" /* h */])(CountryRow, {
            name: country.name,
            shortName: country.shortName,
            EURcoef: country.EURcoef,
            removeCountry: actions.removeCountry,
            setEURCoef: actions.setEURCoef
        });
    });

    return Object(__WEBPACK_IMPORTED_MODULE_0_hyperapp__["b" /* h */])(
        "div",
        { "class": "popup", oncreate: () => actions.loadSetting() },
        Object(__WEBPACK_IMPORTED_MODULE_0_hyperapp__["b" /* h */])(
            "div",
            { "class": "country-row country-row_label" },
            Object(__WEBPACK_IMPORTED_MODULE_0_hyperapp__["b" /* h */])(
                "div",
                { "class": "country-row__name country-row__name_label" },
                "Country"
            ),
            Object(__WEBPACK_IMPORTED_MODULE_0_hyperapp__["b" /* h */])(
                "div",
                { "class": "country-row__shortName country-row__shortName_label" },
                "Short name"
            ),
            Object(__WEBPACK_IMPORTED_MODULE_0_hyperapp__["b" /* h */])(
                "div",
                { "class": "country-row__eurCoef country-row__eurCoef_label" },
                "to EUR coef"
            )
        ),
        countries,
        Object(__WEBPACK_IMPORTED_MODULE_0_hyperapp__["b" /* h */])(CountryNewRow, {
            setName: actions.newCountry.setName,
            setShortName: actions.newCountry.setShortName,
            setEURCoef: actions.newCountry.setEURcoef,
            addCountry: actions.addCountry,
            validName: state.newCountryValid.name,
            validShortName: state.newCountryValid.shortName,
            validEURcoef: state.newCountryValid.EURcoef
        }),
        Object(__WEBPACK_IMPORTED_MODULE_0_hyperapp__["b" /* h */])(
            "div",
            { "class": "error-msg" },
            state.errorMsg
        )
    );
};
/* harmony export (immutable) */ __webpack_exports__["a"] = view;


/***/ })
/******/ ]);