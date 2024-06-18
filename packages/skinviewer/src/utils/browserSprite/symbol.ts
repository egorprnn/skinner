export class BrowserSymbol {
  #node: Element;
  #mounted = false;

  constructor(node: SVGSymbolElement) {
    this.#node = node;
  }

  static createFromExistingNode(node: SVGSymbolElement): BrowserSymbol {
    return new BrowserSymbol(node);
  }

  get id() {
    return this.#node.id;
  }

  get node() {
    return this.#node;
  }

  mount(target: Node) {
    if (this.#mounted) {
      return this.#node;
    }

    this.#mounted = true;

    console.log(target, this.#node);

    target.appendChild(this.#node);

    return this.#node;
  }

  unmount() {
    this.#node.remove();
  }
}
