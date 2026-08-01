import { BrowserSymbol } from './symbol';

export class BrowserSprite {
  readonly #sprite: SVGSVGElement;
  readonly #symbols: Map<string, BrowserSymbol> = new Map();

  constructor(id: string) {
    let sprite = document.getElementById(id) as SVGSVGElement | null;

    if (sprite) {
      this.#symbols.forEach((symbol) => {
        symbol.mount(sprite as SVGSVGElement);
      });

      sprite.querySelectorAll('symbol').forEach((node: SVGSymbolElement) => {
        const symbol = BrowserSymbol.createFromExistingNode(node);

        this.add(symbol);
      });
    } else {
      sprite = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

      this.#symbols.forEach((symbol) => (sprite as SVGSVGElement).appendChild(symbol.node));

      document.body.appendChild(sprite);
    }

    this.#sprite = sprite;

    this.#sprite.style.width = '0px';
    this.#sprite.style.height = '0px';
    this.#sprite.style.position = 'absolute';

    this.#sprite.setAttribute('id', id);
    this.#sprite.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    this.#sprite.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');
    this.#sprite.setAttribute('aria-hidden', 'true');
  }

  has(id: string) {
    return this.#symbols.has(id);
  }

  get(id: string) {
    return this.#symbols.get(id);
  }

  add(symbol: BrowserSymbol) {
    this.#symbols.set(symbol.id, symbol);

    symbol.mount(this.#sprite);
  }

  delete(id: string) {
    const symbol = this.#symbols.get(id);

    if (!symbol) {
      return;
    }

    symbol.unmount();

    if (!symbol.mounted) {
      this.#symbols.delete(id);
    }
  }
}

export * from './symbol';
