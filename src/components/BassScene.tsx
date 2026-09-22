import { useEffect, useRef } from 'react'
import {
  ACESFilmicToneMapping,
  Box3,
  Color,
  DirectionalLight,
  Group,
  HemisphereLight,
  PerspectiveCamera,
  Scene,
  SRGBColorSpace,
  Vector3,
  WebGLRenderer,
} from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'

// 3D model: "Bass Guitar" by Zsky (poly.pizza/m/ByBoHTCdYZ), licensed CC BY 3.0. Credited in the footer.
const MODEL_URL = '/models/bass-guitar.glb'

/**
 * A floating 3D bass guitar. It bobs and sways slowly, and the camera eases toward the
 * mouse (or stays still when the visitor prefers reduced motion).
 * Built with plain three.js so it works with any React version; loaded lazily by Hero.
 */
export default function BassScene() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // Renderer with a transparent background so the page shows through
    const renderer = new WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.outputColorSpace = SRGBColorSpace
    renderer.toneMapping = ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.15
    // CSS controls the canvas size; three.js only matches its resolution (see resize below)
    renderer.domElement.style.display = 'block'
    renderer.domElement.style.width = '100%'
    renderer.domElement.style.height = '100%'
    container.appendChild(renderer.domElement)

    const scene = new Scene()
    const camera = new PerspectiveCamera(32, 1, 0.1, 100)
    camera.position.set(0, 0, 6)

    // Lighting: soft fill, a warm key light and a mint rim light that matches the site accent
    scene.add(new HemisphereLight(0xffffff, 0x1a1f2b, 1.4))
    const key = new DirectionalLight(0xfff1dc, 3)
    key.position.set(3, 4, 5)
    scene.add(key)
    const rim = new DirectionalLight(new Color('#7fd8ae'), 4)
    rim.position.set(-4, 2, -3)
    scene.add(rim)

    // The bass sits inside a pivot group so we can float/rotate it around its center
    const pivot = new Group()
    scene.add(pivot)

    let disposed = false
    new GLTFLoader().load(MODEL_URL, (gltf) => {
      if (disposed) return
      const model = gltf.scene
      // Normalize: center the model and scale it to a fixed height
      const box = new Box3().setFromObject(model)
      const size = box.getSize(new Vector3())
      const center = box.getCenter(new Vector3())
      model.position.sub(center)
      const scale = 3.2 / Math.max(size.x, size.y, size.z)
      const holder = new Group()
      holder.add(model)
      holder.scale.setScalar(scale)
      pivot.add(holder)
      // Tilt it like it's leaning in a stand
      pivot.rotation.set(0.1, -0.5, -0.35)
      render()
    })

    // Mouse position in -1..1, eased toward in the animation loop
    const target = { x: 0, y: 0 }
    const onPointerMove = (event: PointerEvent) => {
      target.x = (event.clientX / window.innerWidth) * 2 - 1
      target.y = (event.clientY / window.innerHeight) * 2 - 1
    }
    if (!reduceMotion) window.addEventListener('pointermove', onPointerMove, { passive: true })

    const resize = () => {
      const { clientWidth: w, clientHeight: h } = container
      if (!w || !h) return
      renderer.setSize(w, h, false)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      render()
    }
    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(container)
    resize()

    function render() {
      renderer.render(scene, camera)
    }

    // Only animate while the hero is on screen
    let visible = true
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
    })
    visibilityObserver.observe(container)

    const start = performance.now()
    let frame = 0
    const loop = () => {
      frame = requestAnimationFrame(loop)
      if (!visible || document.hidden) return
      const t = (performance.now() - start) / 1000
      // Gentle float and sway
      pivot.position.y = Math.sin(t * 1.1) * 0.12
      pivot.rotation.y = -0.5 + Math.sin(t * 0.5) * 0.25
      pivot.rotation.z = -0.35 + Math.sin(t * 0.8) * 0.04
      // Camera eases toward the mouse (like a slow parallax)
      camera.position.x += (target.x * 0.6 - camera.position.x) * 0.04
      camera.position.y += (-target.y * 0.4 - camera.position.y) * 0.04
      camera.lookAt(0, 0, 0)
      render()
    }
    if (!reduceMotion) loop()

    return () => {
      disposed = true
      cancelAnimationFrame(frame)
      window.removeEventListener('pointermove', onPointerMove)
      resizeObserver.disconnect()
      visibilityObserver.disconnect()
      renderer.dispose()
      renderer.domElement.remove()
    }
  }, [])

  return (
    <div
      ref={containerRef}
      role="img"
      aria-label="3D model of a bass guitar"
      className="size-full"
    />
  )
}
