import { useTexture } from '@react-three/drei'
import React, { useEffect, useMemo, useRef } from 'react'
import { useScrollbar } from '@14islands/r3f-scroll-rig'

const StickyScene = (data) => {
    const vertex = `
        varying vec2 vUv;
        uniform float uProgress;
        uniform float uVelocity;
        void main() {
            vUv = uv;

            vec3 nPos = position;

            nPos.z += sin(uv.y * 3.1451)  * uVelocity * 2.0;
            
            gl_Position = projectionMatrix * modelViewMatrix * vec4(nPos, 1.0);
        }
    `

    const fragment = `
        varying vec2 vUv;
        uniform sampler2D uTexture1;
        uniform sampler2D uTexture2;
        uniform float uProgress;
        uniform float uVelocity;


        void main() {
            vec4 tex1 = texture2D(uTexture1, vUv);
            vec4 tex2 = texture2D(uTexture2, vUv);

            float progress = vUv.y;

            progress -= sin(vUv.x * 3.145) * 0.005 * uVelocity;

            progress = step(progress, uProgress);

            gl_FragColor = mix(tex1, tex2, progress);
        }
    `

    // Load textures
    const [texture1, texture2] = useTexture([
        "https://images.unsplash.com/photo-1640903581708-8d491706515b?q=80&w=1675&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "https://images.unsplash.com/photo-1706076463257-20b41d9519f0?q=80&w=1632&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    ])

    // UseRef to ensure uniforms are always mutable, not tied to a potentially stale memo
    const uniforms = useRef({
        uTexture1: { value: null },
        uTexture2: { value: null },
        uProgress: { value: 0 },
        uVelocity: { value: 0 },
    })

    // Update texture uniforms reactively
    useEffect(() => {
        uniforms.current.uTexture1.value = texture1
        uniforms.current.uTexture2.value = texture2
    }, [texture1, texture2])

    // Hook up scroll progress to uniform
    const { __lenis } = useScrollbar()
    const lerp = (a, b, c) => a + (b - a) * c;
    useEffect(() => {
        if (!__lenis) return
        const onScroll = ({ progress, velocity }) => {
            uniforms.current.uProgress.value = progress;
            uniforms.current.uVelocity.value = lerp(uniforms.current.uVelocity.value, velocity, 0.1);
        }
        __lenis.on('scroll', onScroll)
        return () => __lenis.off('scroll', onScroll)
    }, [__lenis])

    return (
        <mesh {...data}>
            <planeGeometry args={[1, 1, 64, 64]} />
            <shaderMaterial
                uniforms={uniforms.current}
                fragmentShader={fragment}
                vertexShader={vertex}
            />
        </mesh>
    )
}

export default StickyScene