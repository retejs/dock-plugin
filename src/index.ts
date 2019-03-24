import { NodeEditor, Control, Component } from 'rete';
import { Plugin } from 'rete/types/core/plugin';
import { ClickStrategy } from './click-strategy';
import { DropStrategy } from './drop-strategy';

type Params = {
    container: HTMLElement,
    plugins: Plugin[],
    itemClass: string
}

function install(editor: NodeEditor, { container, plugins, itemClass = 'dock-item' } : Params) {
    const copy = new NodeEditor(editor.id, editor.view.container);
    const clickStrategy = new ClickStrategy(editor);
    const dropStrategy = new DropStrategy(editor);

    plugins.map(plugin => copy.use(plugin))

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
            component,
            bindSocket: () => {},
            bindControl: (el: HTMLElement, control: Control) => {
                copy.trigger('rendercontrol', { el, control });
            }
        });
    });
}

export default {
    name: 'dock',
    install
}