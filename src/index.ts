import { BaseSchemes, NodeEditor, Root, Scope } from 'rete'
import { Area2D, Area2DInherited, AreaPlugin } from 'rete-area-plugin'

import { ClickStrategy } from './click-strategy'
import { DropStrategy } from './drop-strategy'
import { Preset } from './presets/types'
import { Strategy } from './strategy'

export * as DockPresets from './presets'

/**
 * Dock plugin. Allows to create nodes from the dock by dragging or clicking.
 * @priority 10
 * @emits render
 */
export class DockPlugin<Schemes extends BaseSchemes> extends Scope<never, Area2DInherited<Schemes>> {
  nodes = new Map<() => Schemes['Node'], { preset: Preset, element: HTMLElement }>()
  clickStrategy!: Strategy
  dropStrategy!: Strategy
  presets: Preset[] = []

  constructor() {
    super('dock')
  }

  setParent(scope: Scope<Area2D<Schemes>, [Root<Schemes>]>): void {
    super.setParent(scope)

    const area = this.parentScope<AreaPlugin<Schemes>>(AreaPlugin)
    const editor = area.parentScope<NodeEditor<Schemes>>(NodeEditor)

    this.clickStrategy = new ClickStrategy(editor, area)
    this.dropStrategy = new DropStrategy(editor, area)
  }

  /**
   * Add node to the dock.
   * @param create Function that creates node.
   * @param index Index of the node in the dock, optional.
   */
  add(create: () => Schemes['Node'], index?: number) {
    if (!this.presets.length) throw new Error('presets not found')

    for (const preset of this.presets) {
      const element = preset.createItem(index)

      if (!element) continue

      void this.parentScope().emit({
        type: 'render',
        data: {
          type: 'node',
          element,
          payload: create()
        }
      })

      this.nodes.set(create, { preset, element })
      this.clickStrategy.add(element, create)
      this.dropStrategy.add(element, create)
      return
    }
  }

  /**
   * Remove node from the dock.
   * @param create Function that creates node. Must be the same as in `add` method.
   */
  remove(create: () => Schemes['Node']) {
    const item = this.nodes.get(create)

    if (item) {
      item.preset.removeItem(item.element)
    }
  }

  /**
   * Add preset to the dock plugin.
   * @param preset Preset that will manage dock items.
   */
  addPreset(preset: Preset) {
    this.presets.push(preset)
  }
}
