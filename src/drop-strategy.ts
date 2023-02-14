import { BaseSchemes, NodeEditor } from 'rete'
import { AreaPlugin } from 'rete-area-plugin'

import { Strategy } from './strategy'

export class DropStrategy<K> implements Strategy {
  current?: () => BaseSchemes['Node']

  constructor(private editor: NodeEditor<BaseSchemes>, private area: AreaPlugin<BaseSchemes, K>) {
    area.container.addEventListener('dragover', e => e.preventDefault())
    area.container.addEventListener('drop', async event => {
      if (!this.current) return

      const node = this.current()

      await this.editor.addNode(node)

      this.area.area.setPointerFrom(event)

      const position = this.area.area.pointer
      const view = this.area.nodeViews.get(node.id)

      if (!view) throw new Error('view')

      await view.translate(position.x, position.y)
    })
  }

  add(element: HTMLElement, create: () => BaseSchemes['Node']) {
    element.draggable = true

    element.addEventListener('dragstart', () => {
      this.current = create
    })
  }
}

