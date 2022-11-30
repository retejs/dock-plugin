import { BaseSchemes, NodeEditor, Root, Scope } from 'rete'
import { Area2D, Area2DInherited, AreaPlugin } from 'rete-area-plugin'

import { ClickStrategy } from './click-strategy'
import { DropStrategy } from './drop-strategy'
import { Preset } from './presets/types'
import { Strategy } from './strategy'

export * as DockPresets from './presets'

export class DockPlugin<Schemes extends BaseSchemes> extends Scope<never, Area2DInherited<Schemes, never>> {
    nodes: Schemes['Node'][] = []
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

    add(create: () => Schemes['Node']) {
        if (!this.presets.length) throw new Error('presets not found')

        const node = create()

        this.nodes.push(node)

        const preset = this.presets[0]
        const element = preset.createItem()

        this.parentScope()?.emit({
                type: 'render',
                data: {
                    type: 'node',
                    element,
                payload: node
                }
            })

            this.clickStrategy.add(element, create)
            this.dropStrategy.add(element, create)
    }

    addPreset(preset: Preset) {
        this.presets.push(preset)
    }
}
