import {
  setInitialProperties,
  diffProperties,
  updateProperties,
} from "./ReactDOMComponent";
import { precacheFiberNode, updateFiberProps } from "./ReactDOMComponentTree";
export function shouldSetTextContent(type, props) {
  return (
    typeof props.children === "string" || typeof props.children === "number"
  );
}

export const appendInitialChild = (parent, child) => {
  parent.appendChild(child);
};

export const createInstance = (type, props, internalInstanceHandle) => {
  const domElement = document.createElement(type);
  precacheFiberNode(internalInstanceHandle, domElement);
  updateFiberProps(domElement, props);
  return domElement;
};

export const createTextInstance = (content) => {
  return document.createTextNode(content);
};

export function finalizeInitialChildren(domElement, type, props) {
  setInitialProperties(domElement, type, props);
}

export function appendChild(parentInstance, child) {
  parentInstance.appendChild(child);
}

export function insertBefore(parentInstance, child, beforeChild) {
  parentInstance.insertBefore(child, beforeChild);
}

export function removeChild(parentInstance, child) {
  parentInstance.removeChild(child);
}

export function prepareUpdate(domElement, type, oldProps, newProps) {
  return diffProperties(domElement, type, oldProps, newProps);
}

export function commitUpdate(
  domElement,
  updatePayload,
  type,
  oldProps,
  newProps
) {
  updateProperties(domElement, updatePayload, type, oldProps, newProps);
  updateFiberProps(domElement, newProps);
}
