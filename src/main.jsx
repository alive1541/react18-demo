import { createRoot } from "react-dom/src/client/ReactDOMRoot";
import * as React from "./react";


function FunctionComponent() {
  const [numbers, setNumbers] = React.useState(new Array(10).fill('A'));
  const divRef = React.useRef();
  React.useEffect(() => {
    setTimeout(() => {
      divRef.current.click();
    }, 10);
    setNumbers(numbers => numbers.map(item => item + 'B'))
  }, []);
  const spanStyle = {
    display: 'inline-block',
    width: '30px',
    height: '30px',
    backgroundColor: 'green',
    margin: '5px'
  }
  const divStyle = {
    height: '200px',
    backgroundColor: 'lightblue'
  }
  return (<div style={divStyle} ref={divRef} onClick={() => {
    setNumbers(numbers => numbers.map(item => item + 'C'))
  }}>{numbers.map((number, index) => <span style={spanStyle} key={index}>{number}</span>)}</div>)
}
const element = <FunctionComponent />;
const root = createRoot(document.getElementById("root"));
root.render(element);