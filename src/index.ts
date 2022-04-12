import { Component, Control, NodeEditor } from 'rete';
import { ClickStrategy } from './click-strategy';
import { DropStrategy } from './drop-strategy';
import { Plugin } from 'rete/types/core/plugin';

type PluginWithOptions = Plugin | [Plugin, any];
type TypeStrategies = typeof ClickStrategy | typeof DropStrategy;
type Params = {
    container: HTMLElement;
    plugins: PluginWithOptions[];
    itemClass?: string;
    strategies?: TypeStrategies[];
    filterComponents?: string[];
}

const install = (editor: NodeEditor | any, options: Params | any): void => {
    const itemClass = options.itemClass || 'dock-item';
    const strategies = options.strategies || [ClickStrategy, DropStrategy];
    const {
        container,
        plugins
    } = options;

    if (!(container instanceof HTMLElement)) throw new Error('container is not HTML element');

    const copy = new NodeEditor(editor.id, editor.view.container);

    // eslint-disable-next-line new-cap
    const strategyInstances = strategies.map((strategy: TypeStrategies) => new strategy(editor));

    plugins.forEach((plugin: PluginWithOptions) => {
        if (Array.isArray(plugin)) {
            copy.use(plugin[0], plugin[1])
        } else {
            copy.use(plugin)
        }
    });

    editor.on('componentregister', async (c: Component) => {
        if(options.filterComponents && (options.filterComponents.indexOf(c.name) === -1)) return;

        const component: Component = Object.create(c);
        const el = document.createElement('div');

        el.classList.add(itemClass)

        container.appendChild(el);

        strategyInstances
            .map((strategy: ClickStrategy | DropStrategy) => strategy.addComponent(el, component));

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
    install
}
