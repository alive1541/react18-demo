import { createRoot } from "react-dom/src/client/ReactDOMRoot";
import * as React from "./react";


function FunctionComponent() {
    const [number, setNumber] = React.useState(100);
    return <button style={{width: number + 'px', height: '50px',backgroundColor: 'red'}} onClick={() => {
      setNumber(number + 10)
    }}>{number}</button>
}
const element = <FunctionComponent />;
const root = createRoot(document.getElementById("root"));
root.render(element);