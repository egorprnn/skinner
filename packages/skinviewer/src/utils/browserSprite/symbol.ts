export class BrowserSymbol {
  #node: Element;
  #count = 0;
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

  get mounted() {
    return this.#mounted;
  }

  mount(target?: Node) {
    this.#count++;

    if (this.#mounted) {
      return this.#node;
    }

    this.#mounted = true;

    target?.appendChild(this.#node);

    return this.#node;
  }

  unmount() {
    if (this.#count && --this.#count) {
      return;
    }

    this.#mounted = false;

    this.#node.remove();
  }
}
