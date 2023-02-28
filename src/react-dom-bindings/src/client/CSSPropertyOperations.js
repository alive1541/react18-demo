export function setValueForStyles(node, styles) {
  const { style } = node;
  for (let styleName in styles) {
    if (styles.hasOwnProperty(styleName)) {
      const styleValue = styles[styleName];
      style[styleName] = styleValue;
    }
  }
}
