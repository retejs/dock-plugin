import { BaseSchemes, NodeEditor, Scope } from 'rete'
import { Area2DInherited, AreaPlugin } from 'rete-area-plugin'

import { ClickStrategy } from './click-strategy'
import { DropStrategy } from './drop-strategy'
import { Preset } from './presets/types'
import { Strategy } from './strategy'

export * as DockPresets from './presets'

type Props<Schemes extends BaseSchemes, K> = {
    editor: NodeEditor<Schemes>
    area: AreaPlugin<Schemes, K>
}

export class DockPlugin<Schemes extends BaseSchemes, K> extends Scope<never, Area2DInherited<Schemes, never>> {
    nodes: Schemes['Node'][] = []
    clickStrategy: Strategy
    dropStrategy: Strategy
    presets: Preset[] = []

    constructor(props: Props<Schemes, K>) {
        super('dock')

        this.clickStrategy = new ClickStrategy(props.editor, props.area)
        this.dropStrategy = new DropStrategy(props.editor, props.area)
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
