import React from 'react'
import { useRef } from 'react'
import { UseCanvas } from '@14islands/r3f-scroll-rig'
import { StickyScrollScene } from '@14islands/r3f-scroll-rig/powerups'
import StickyScene from './StickyScene'


const Scene = () => {

    const track = useRef()

    return (
        <main className='w-full h-[200vh] relative '>
            <section ref={track} className='w-[90%] h-[90vh] sticky top-14 left-0'>
                <UseCanvas>
                    <StickyScrollScene track={track}>
                        {(data) => {
                            return (
                                <StickyScene {...data} />
                            )
                        }}
                    </StickyScrollScene>
                </UseCanvas>
            </section>
        </main>
    )
}

export default Scene