export type Preset = {
    createItem(index?: number): HTMLElement | null
    removeItem(element: HTMLElement): void
}
