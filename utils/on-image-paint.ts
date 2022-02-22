import { EventHandler, SyntheticEvent } from 'react'

/** @description you should pass this to the onLoad event of the img element */
export function onImagePaint(
    cb: () => void,
): EventHandler<SyntheticEvent<HTMLImageElement, Event>> {
    return function () {
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                document.body.offsetWidth // force repaint
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        // done painting
                        cb()
                    })
                })
            })
        })
    }
}
