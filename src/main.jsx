import { createRoot } from "react-dom/src/client/ReactDOMRoot";
import * as React from "./react";


function FunctionComponent() {
    const [number, setNumber] = React.useState(0);
    return <button style={{width: '100px', height: '50px',backgroundColor: 'red'}} onClick={() => {
      setNumber(number + 1)
    }}>{number}</button>
}
const element = <FunctionComponent />;
const root = createRoot(document.getElementById("root"));
root.render(element);