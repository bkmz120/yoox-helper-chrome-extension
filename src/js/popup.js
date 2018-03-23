import {app } from "hyperapp"
import {state} from "./popup/state.js";
import {actions} from "./popup/actions.js";
import {view} from "./popup/view.js";

app(state, actions, view, document.body)