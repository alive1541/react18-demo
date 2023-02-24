import { createRoot } from "react-dom/src/client/ReactDOMRoot";
import * as React from "./react";


// function FunctionComponent() {
//     console.log("FunctionComponent");
//     const [number, setNumber] = React.useState(0);
//     return number === 0 ? (
//       <ul key="container" onClick={() => setNumber(number 1)}>
//    <li key="A">A</li>
//    <li key="B" id="b">
//      B
//    </li>
//    <li key="C">C</li>
//    <li key="D">D</li>
//    <li key="E">E</li>
//    <li key="F">F</li>
//       </ul>
//     ) : (
//       <ul key="container" onClick={() => setNumber(number 1)}>
//    <li key="A">A2</li>
//    <li key="C">C2</li>
//    <li key="E">E2</li>
//    <li key="B" id="b2">
//      B2
//    </li>
//    <li key="G">G</li>
//    <li key="D">D2</li>
//       </ul>
//     );
//   }
  function Counter() {
    const [number, setNumber] = React.useState(0);
    React.useEffect(() => {
      console.log("useEffect1");
      return () => {
        console.log("destroy useEffect1");
      };
    });
    React.useEffect(() => {
      console.log("useEffect2");
      return () => {
        console.log("destroy useEffect2");
      };
    });
    React.useEffect(() => {
      console.log("useEffect3");
      return () => {
        console.log("destroy useEffect3");
      };
    });
    return (
      <div
        onClick={() => {
          setNumber(number + 1);
        }}
      >
        {number}
      </div>
    );
    }
    let element = <Counter />;
// let element = <FunctionComponent />
const root = createRoot(document.getElementById("root"));
root.render(element);