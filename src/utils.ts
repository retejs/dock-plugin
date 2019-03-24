import { Component } from "rete";

export async function createNode(component: Component, position: { x: number, y: number }) {
    let node = await component.createNode({});

    node.position = [position.x, position.y];

    return node;
}