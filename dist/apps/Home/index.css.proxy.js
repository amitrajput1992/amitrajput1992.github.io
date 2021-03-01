// [snowpack] add styles to the page (skip if no document exists)
if (typeof document !== 'undefined') {
  const code = ".canvas {\n  position: absolute !important;\n  z-index: 0;\n  width: 100%;\n  height: 100%;\n}\n\n.html_root {\n  position: absolute;\n  top: 50%;\n  left: 50%;\n  transform: translate(-50%, -50%);\n  z-index: 1;\n}\n\n.html_root .hmh {\n  display: flex;\n  align-content: center;\n  justify-content: center;\n  font-size: 25px;\n}\n";

  const styleEl = document.createElement("style");
  const codeEl = document.createTextNode(code);
  styleEl.type = 'text/css';
  styleEl.appendChild(codeEl);
  document.head.appendChild(styleEl);
}