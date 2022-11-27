import { BaseSchemes, NodeEditor } from 'rete'
import { AreaPlugin } from 'rete-area-plugin'

import { Strategy } from './strategy'

export class ClickStrategy<K> implements Strategy {

    constructor(private editor: NodeEditor<BaseSchemes>, private area: AreaPlugin<BaseSchemes, K>) { }

    add(element: HTMLElement, create: () => BaseSchemes['Node']): void {
        element.addEventListener('click', async () => {
            const node = create()

            await this.editor.addNode(node)

            const viewportCenter = this.getViewportCenter()
            const view = this.area.nodeViews.get(node.id)

            if (!view) throw new Error('view')

            await view.translate(viewportCenter.x, viewportCenter.y)
        })
    }

    private getViewportCenter() {
        const { x, y, k } = this.area.area.transform
        const box = this.area.container.getBoundingClientRect()
        const halfWidth = box.width / 2 / k
        const halfHeight = box.height / 2 / k

        return { x: halfWidth - x / k, y: halfHeight - y / k }
    }
}
