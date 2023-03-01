import { createRoot } from "react-dom/src/client/ReactDOMRoot";
import * as React from "./react";


function FunctionComponent() {
    const [number, setNumber] = React.useState(100);
    const [color, setColor] = React.useState('red');
    React.useEffect(() => {
            setColor(color => {
                return color === 'yellow' ? 'red': 'yellow'
            });
    }, [number]);
    return <button style={{width: number + 'px', height: '50px',backgroundColor: color}} onClick={() => {
      setNumber(number + 10)
    }}>{number}</button>
}
const element = <FunctionComponent />;
const root = createRoot(document.getElementById("root"));
root.render(element);