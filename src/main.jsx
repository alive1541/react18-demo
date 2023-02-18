import { createRoot } from "react-dom/src/client/ReactDOMRoot";
import { jsxDEV } from "./react/jsx-dev-runtime";

// let element = (
//   <h1>
//     hello<span style={{ color: "red" }}>world</span>
//     hello2<span style={{ color: "green" }}>world2</span>
//   </h1>
// );
function FunctionComponent () {
   return (
        <h2>
          hello<span style={{ color: "red" }}>world</span>
        </h2>
    );
}
let element = <FunctionComponent />
const root = createRoot(document.getElementById("root"));
root.render(element);