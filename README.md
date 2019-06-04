Dock
====
#### Rete.js plugin

```js
import DockPlugin from 'rete-dock-plugin';

editor.use(DockPlugin, {
    container: document.querySelector('.dock'),
    itemClass: 'item' // default: dock-item 
    plugins: [VueRenderPlugin], // render plugins
    // or
    plugins: [
        [VueRenderPlugin, renderPluginOptions]
    ],
});
```

Example:

```html
<div class="editor">
    <div class="container">
        <div class="node-editor"></div>
    </div>
    <div class="dock"></div>
</div>
```

```css
.editor {
    display: flex;
    flex-wrap: nowrap;
    flex-direction: column;
    height: 100vh;
}

.dock {
    height: 100px;
    overflow-x: auto;
    overflow-y: hidden;
    white-space: nowrap;
}

.dock-item {
    display: inline-block;
    vertical-align: top;
    transform: scale(0.8);
    transform-origin: 50% 0;
}

.container {
    flex: 1;
    overflow: hidden;
}
```