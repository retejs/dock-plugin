import { Component, Control, NodeEditor } from 'rete';
import { ClickStrategy } from './click-strategy';
import { DropStrategy } from './drop-strategy';
import { Plugin } from 'rete/types/core/plugin';

type PluginWithOptions = Plugin | [Plugin, any];
type Params = {
    container: HTMLElement,
    plugins: PluginWithOptions[],
    itemClass: string
}

function install(editor: NodeEditor, { container, plugins, itemClass = 'dock-item' } : Params) {
    if (!(container instanceof HTMLElement)) throw new Error('container is not HTML element');

    const copy = new NodeEditor(editor.id, editor.view.container);
    const clickStrategy = new ClickStrategy(editor);
    const dropStrategy = new DropStrategy(editor);

    plugins.forEach(plugin => {
        if (Array.isArray(plugin))
            copy.use(plugin[0], plugin[1])
        else 
            copy.use(plugin)
    });

    editor.on('componentregister', async c => {
        const component: Component = Object.create(c);
        const el = document.createElement('div');

        el.classList.add(itemClass)

        container.appendChild(el);

        clickStrategy.addComponent(el, component);
        dropStrategy.addComponent(el, component);

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

export default {
    name: 'dock',
    install
}