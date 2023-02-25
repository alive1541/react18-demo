import { createRoot } from "react-dom/src/client/ReactDOMRoot";
import * as React from "./react";


let element = <h1>hello</h1>
const root = createRoot(document.getElementById("root"));
root.render(element);