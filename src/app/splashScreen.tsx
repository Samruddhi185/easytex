import React, { useEffect, useState } from "react";
import anime from "animejs"

const SplashScreen = ({finishLoading}) => {
    const [isMounted, setIsMounted] = useState(false)
    const animate = () => {
        const loader = anime.timeline({
            complete: () => finishLoading(),
        })

        loader.add({
            targets: "#title",
            delay: 0,
            scale: 2,
            duration: 600,
            erasing: "easeInOutExpo"
        })
    }

    useEffect(() => {
        const timeout = setTimeout(() => setIsMounted(true), 10)
        animate()
        return () => clearTimeout(timeout)
    }, [])

    return (
        <div className="flex h-screen items-center justify-center" isMounted={isMounted}>
            <h1 id="title" className="typewriter">
                EasyTeX
            </h1>
        </div>
    )
}

export default SplashScreen