class Interactions {
  constructor() {
    this.swiping = false;
    this.isIE = !!window.MSInputMethodContext && !!document.documentMode;
  }
}

export default Interactions;
