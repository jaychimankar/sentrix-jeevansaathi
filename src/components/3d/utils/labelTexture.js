import * as THREE from 'three'

const textureCache = new Map()

/**
 * Creates a high-resolution canvas texture for 3D annotations and badges.
 * Automatically computes text width and adjusts font size so text is NEVER cut off.
 */
export function getLabelTexture(text, subtext = '', textColor = '#2563eb', bgColor = 'rgba(7, 12, 20, 0.95)') {
  const key = `${text}|${subtext}|${textColor}|${bgColor}`
  if (textureCache.has(key)) {
    return textureCache.get(key)
  }

  const canvas = document.createElement('canvas')
  canvas.width = 1024
  canvas.height = 384
  const ctx = canvas.getContext('2d')

  if (ctx) {
    // 1. Clear background
    ctx.clearRect(0, 0, 1024, 384)

    // 2. Draw rounded card container
    const radius = 24
    const x = 12, y = 12, w = 1000, h = 360

    ctx.beginPath()
    ctx.moveTo(x + radius, y)
    ctx.lineTo(x + w - radius, y)
    ctx.quadraticCurveTo(x + w, y, x + w, y + radius)
    ctx.lineTo(x + w, y + h - radius)
    ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h)
    ctx.lineTo(x + radius, y + h)
    ctx.quadraticCurveTo(x, y + h, x, y + h - radius)
    ctx.lineTo(x, y + radius)
    ctx.quadraticCurveTo(x, y, x + radius, y)
    ctx.closePath()

    // Card background fill
    ctx.fillStyle = bgColor
    ctx.fill()

    // Card border
    ctx.lineWidth = 6
    ctx.strokeStyle = '#2563eb'
    ctx.stroke()

    // Subtle top accent line
    ctx.beginPath()
    ctx.moveTo(x + 40, y + 6)
    ctx.lineTo(x + w - 40, y + 6)
    ctx.lineWidth = 4
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.8)'
    ctx.stroke()

    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'

    // 3. Render Primary Title Text with Dynamic Auto-Fitting
    let titleFontSize = 58
    ctx.font = `bold ${titleFontSize}px "Courier New", monospace, sans-serif`
    let titleWidth = ctx.measureText(text).width
    const maxAvailableWidth = 920

    if (titleWidth > maxAvailableWidth) {
      titleFontSize = Math.floor(titleFontSize * (maxAvailableWidth / titleWidth))
      ctx.font = `bold ${Math.max(26, titleFontSize)}px "Courier New", monospace, sans-serif`
    }

    if (subtext) {
      // Draw Title on top half
      ctx.fillStyle = textColor
      ctx.fillText(text, 512, 130)

      // Draw Subtitle / MCU Signal on bottom half with Auto-Fitting
      let subFontSize = 38
      ctx.font = `bold ${subFontSize}px "Courier New", monospace, sans-serif`
      let subWidth = ctx.measureText(subtext).width

      if (subWidth > maxAvailableWidth) {
        subFontSize = Math.floor(subFontSize * (maxAvailableWidth / subWidth))
        ctx.font = `bold ${Math.max(20, subFontSize)}px "Courier New", monospace, sans-serif`
      }

      ctx.fillStyle = '#ffffff'
      ctx.fillText(subtext, 512, 240)
    } else {
      // Single line centered
      ctx.fillStyle = textColor
      ctx.fillText(text, 512, 192)
    }
  }

  const texture = new THREE.CanvasTexture(canvas)
  texture.minFilter = THREE.LinearFilter
  texture.magFilter = THREE.LinearFilter
  texture.needsUpdate = true
  textureCache.set(key, texture)
  return texture
}
