import { Component, NodeEditor } from "rete";
import { createNode } from "./utils";

export class DropStrategy {

    constructor(editor: NodeEditor) {
        editor.view.container.addEventListener('dragover', e => e.preventDefault())
        editor.view.container.addEventListener('drop', async e => {
            if(!e.dataTransfer) return;

            const name = e.dataTransfer.getData('componentName');
            const component = editor.components.get(name)

            if(!component) throw new Error(`Component ${name} not found`)

            // force update the mouse position
            editor.view.area.pointermove(e as any as PointerEvent);

            const node = await createNode(component as Component, editor.view.area.mouse);

            editor.addNode(node)
        })
    }

    addComponent(el: HTMLElement, component: Component) {
        el.draggable = true;

        el.addEventListener('dragstart', e => {
            if(!e.dataTransfer) return;

            e.dataTransfer.setData('componentName', component.name);
        });
    }

}