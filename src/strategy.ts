import { BaseSchemes } from 'rete';

export abstract class Strategy {
  abstract add(element: HTMLElement, create: () => BaseSchemes['Node']): void
}
