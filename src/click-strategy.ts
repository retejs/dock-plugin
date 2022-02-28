import { Component, NodeEditor } from 'rete';
import { createNode } from './utils';

export class ClickStrategy {

    editor: NodeEditor;
    position: {x: number, y: number};

    constructor(editor: NodeEditor) {
        this.editor = editor;
        this.position = { x: 0, y: 0 }
        
        editor.on('click', () => {
            this.position = editor.view.area.mouse;
        });
    }

    addComponent(el: HTMLElement, component: Component) {
        el.addEventListener('click', async () => {
            const node = await createNode(component, this.position);

            this.editor.addNode(node);
        });
    }
}