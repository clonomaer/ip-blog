import { useEffect } from 'react'

function updateMobileVH() {
    document.documentElement.style.setProperty(
        '--vh',
        `${document.documentElement.clientHeight * 0.01}px`,
    )
}

export function useMobileVHFix(): void {
    useEffect(() => {
        updateMobileVH()
        window.addEventListener('resize', updateMobileVH)
        return () => {
            window.removeEventListener('resize', updateMobileVH)
        }
    }, [])
}
