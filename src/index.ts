import { NodeEditor, Control, Component } from 'rete';
import { ClickStrategy } from './click-strategy';
import { DropStrategy } from './drop-strategy';
import { Plugin } from 'rete/types/core/plugin';

type PluginWithOptions = Plugin | [Plugin, any];
type Params = {
    container: HTMLElement,
    plugins: PluginWithOptions[],
    itemClass: string
    strategies?: any[];
}

const defaultStrategies = [
    ClickStrategy,
    DropStrategy
]

function install(editor: NodeEditor, { container, plugins, itemClass = 'dock-item', strategies = defaultStrategies } : Params) {
    if (!(container instanceof HTMLElement)) throw new Error('container is not HTML element');

    const copy = new NodeEditor(editor.id, editor.view.container);

    const strategyInstances = strategies.map(Strategy => new Strategy(editor));

    plugins.forEach(plugin => {
        if (Array.isArray(plugin)) {
            copy.use(plugin[0], plugin[1])
        } else {
            copy.use(plugin)
        }
    });

    editor.on('componentregister', async c => {
        const component: Component = Object.create(c);
        const el = document.createElement('div');

        el.classList.add(itemClass)

        container.appendChild(el);

        strategyInstances.map(strategy => strategy.addComponent(el, component));

        component.editor = copy;

        copy.trigger('rendernode', {
            el,
            node: await component.createNode({}),
            component: component.data,
            bindSocket: () => {},
            bindControl: (element: HTMLElement, control: Control) => {
                copy.trigger('rendercontrol', { el: element, control });
            }
        });
    });
}

export { DropStrategy, ClickStrategy };

export default {
    name: 'dock',
    install,
}
