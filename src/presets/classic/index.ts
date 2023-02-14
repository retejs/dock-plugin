import { BaseSchemes } from 'rete'
import { AreaPlugin } from 'rete-area-plugin'

import { Preset } from '../types'

function getGradient(size: number) {
  return `linear-gradient(
      0deg,
      white 0%,
      white ${size * 0.6}px,
      rgba(255,255,255, 0.9) ${size * 0.7}px,
      transparent ${size}px
    )`
}

// eslint-disable-next-line max-statements
function getContainer(size: number) {
  const element = document.createElement('div')
  const { style } = element

  style.position = 'absolute'
  style.overflowY = 'hidden'
  style.whiteSpace = 'nowrap'
  style.boxSizing = 'border-box'
  style.left = '0'
  style.bottom = '0'
  style.height = `${size}px`
  style.width = '100%'

  style.background = getGradient(size)

  element.addEventListener('pointerdown', e => e.stopPropagation())
  element.addEventListener('contextmenu', e => e.stopPropagation())

  return element
}

// eslint-disable-next-line max-statements
function getNodeContainer(size: number, scale: number) {
  const element = document.createElement('div')
  const { style } = element

  style.display = 'inline-block'
  style.transform = `scale(${scale})`
  style.verticalAlign = 'top'
  style.margin = `0 -3em`
  style.padding = `1em`
  style.height = `${size / scale}px`
  style.overflow = 'hidden'
  style.transformOrigin = '50% 0'

  return element
}

export function setup<T>(props: { size?: number, scale?: number, area: AreaPlugin<BaseSchemes, T> }): Preset {
  const size = typeof props.size === 'undefined' ? 100 : props.size
  const scale = typeof props.scale === 'undefined' ? 0.7 : props.scale
  const container = getContainer(size)

  props.area.container.appendChild(container)

  return {
    createItem(index) {
      const element = getNodeContainer(size, scale)
      const beforeChild = typeof index !== 'undefined' ? container.children[index] : null

      container.insertBefore(element, beforeChild)

      return element
    },
    removeItem(element) {
      container.removeChild(element)
    }
  }
}
