import { BaseSchemes, NodeEditor } from 'rete'
import { AreaPlugin } from 'rete-area-plugin'
import { Position } from 'rete-area-plugin/_types/types'

import { Strategy } from './strategy'

export class DropStrategy<K> implements Strategy {
  current?: () => BaseSchemes['Node']

  constructor(private editor: NodeEditor<BaseSchemes>, private area: AreaPlugin<BaseSchemes, K>) {
    area.container.addEventListener('dragover', e => e.preventDefault())
    area.container.addEventListener('drop', async event => {
      if (!this.current) return

      this.area.area.setPointerFrom(event)
      this.drop(this.current(), this.area.area.pointer)
    })
  }

  add(element: HTMLElement, create: () => BaseSchemes['Node']) {
    element.draggable = true

    element.addEventListener('dragstart', () => {
      this.current = create
    })
  }

  private async drop(node: BaseSchemes['Node'], position: Position) {
    await this.editor.addNode(node)

    const view = this.area.nodeViews.get(node.id)

    if (!view) throw new Error('view')

    await view.translate(position.x, position.y)
  }
}

