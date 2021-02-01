let hiddenInput;

const HIDDEN_STYLE = `
  width:0 !important;
  visibility:hidden !important;
  overflow:hidden !important;
  position:absolute !important;
  z-index:-1000 !important;
  top:0 !important;
  right:0 !important
`;

const CONTEXT_STYLE = [
  'letter-spacing',
  'padding-left',
  'padding-right',
  'font-family',
  'font-weight',
  'font-size',
  'text-rendering',
  'text-transform',
  'width',
  'text-indent',
  'padding-left',
  'padding-right',
  'border-width',
  'box-sizing'
];

function calculateNodeStyling(targetElement) {
  const style = window.getComputedStyle(targetElement);
  const boxSizing = style.getPropertyValue('box-sizing');
  const paddingSize = (
    parseFloat(style.getPropertyValue('padding-left')) +
    parseFloat(style.getPropertyValue('padding-right'))
  );

  const borderSize = (
    parseFloat(style.getPropertyValue('border-left-width')) +
    parseFloat(style.getPropertyValue('border-right-width'))
  );

  const contextStyle = CONTEXT_STYLE
    .map(name => `${name}:${style.getPropertyValue(name)}`)
    .join(';');
  return { contextStyle, paddingSize, borderSize, boxSizing };
}

export default function calcInputWidth(
  targetElement,
) {
  if (!hiddenInput) {
    hiddenInput = document.createElement('input');
    document.body.appendChild(hiddenInput);
  }
  let {
    paddingSize,
    borderSize,
    boxSizing,
    contextStyle
  } = calculateNodeStyling(targetElement);
  hiddenInput.setAttribute('style', `${contextStyle};${HIDDEN_STYLE};font-size:${targetElement.style.fontSize}`);
  hiddenInput.value = targetElement.value || targetElement.placeholder || '';
  let width = hiddenInput.scrollWidth;

  if (boxSizing === 'border-box') {
    width = width + borderSize;
  } else if (boxSizing === 'content-box') {
    width = width - paddingSize;
  }
  hiddenInput.value = '';
  hiddenInput.parentNode && hiddenInput.parentNode.removeChild(hiddenInput);
  hiddenInput = null;
  return width;
};
