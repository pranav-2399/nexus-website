import { cn } from "@/lib/utils"
import * as React from "react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, X } from "lucide-react"
import Image from "next/image"

interface LightboxProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    images: string[]
    title?: string
    date?: string
    initialIndex?: number
}

export function Lightbox({
    open,
    onOpenChange,
    images,
    title,
    date,
    initialIndex = 0
}: LightboxProps) {
    const [currentIndex, setCurrentIndex] = React.useState(initialIndex)
    const scrollRef = React.useRef<HTMLDivElement>(null)

    React.useEffect(() => {
        if (open) {
            setCurrentIndex(initialIndex)
        }
    }, [open, initialIndex])

    React.useEffect(() => {
        if (scrollRef.current) {
            const activeThumb = scrollRef.current.children[currentIndex] as HTMLElement
            if (activeThumb) {
                activeThumb.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" })
            }
        }
    }, [currentIndex])

    React.useEffect(() => {
        if (!open) return

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "ArrowLeft") {
                e.preventDefault()
                setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
            } else if (e.key === "ArrowRight") {
                e.preventDefault()
                setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
            }
        }

        window.addEventListener("keydown", handleKeyDown)
        return () => window.removeEventListener("keydown", handleKeyDown)
    }, [open, images.length])

    const nextImage = () => {
        setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
    }

    const prevImage = () => {
        setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
    }

    const closeLightbox = () => onOpenChange(false)

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-5xl w-[calc(100%-2rem)] sm:w-full h-[80vh] sm:h-[90vh] p-0 overflow-hidden bg-black border-none flex flex-col z-[150] rounded-2xl">
                <DialogTitle className="sr-only">Gallery Lightbox</DialogTitle>

                {/* Main Image Area */}
                <div className="relative flex-1 min-h-0 w-full bg-black">
                    <div className="relative w-full h-full">
                        <Image
                            src={images[currentIndex] || "/placeholder.svg"}
                            alt={(title ? `${title} - ` : "") + `Image ${currentIndex + 1}`}
                            fill
                            className="object-contain"
                            priority
                        />
                    </div>

                    {images.length > 0 && (
                        <>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute left-2 top-1/2 -translate-y-1/2 text-white/70 hover:text-white hover:bg-black/40 rounded-full h-12 w-12"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    prevImage()
                                }}
                            >
                                <ChevronLeft className="h-8 w-8" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-white/70 hover:text-white hover:bg-black/40 rounded-full h-12 w-12"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    nextImage()
                                }}
                            >
                                <ChevronRight className="h-8 w-8" />
                            </Button>
                        </>
                    )}

                    {/* Info Overlay */}
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4 pb-6 flex justify-between items-end pointer-events-none">
                        <div className="text-white">
                            {title && <h3 className="font-semibold text-lg">{title}</h3>}
                            {date && <p className="text-sm text-gray-300">{date}</p>}
                        </div>
                        <div className="text-white/80 text-sm bg-black/40 px-3 py-1 rounded-full backdrop-blur-sm">
                            {currentIndex + 1} / {images.length}
                        </div>
                    </div>
                </div>

                {/* Thumbnails Strip */}
                {images.length > 1 && (
                    <div className="h-28 shrink-0 border-t border-white/10 bg-black/95 flex items-center">
                        <div
                            ref={scrollRef}
                            className="flex items-center gap-3 overflow-x-auto w-full h-full px-[calc(50%-2.5rem)] scrollbar-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] snap-x snap-mandatory"
                        >
                            {images.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setCurrentIndex(idx)}
                                    className={cn(
                                        "relative h-16 w-20 shrink-0 rounded-md overflow-hidden transition-all duration-300 ease-out snap-center",
                                        idx === currentIndex
                                            ? "ring-2 ring-primary ring-offset-2 ring-offset-black opacity-100 scale-110 z-10"
                                            : "opacity-40 hover:opacity-80 hover:scale-105"
                                    )}
                                >
                                    <Image
                                        src={img}
                                        alt={`Thumbnail ${idx + 1}`}
                                        fill
                                        className="object-cover"
                                    />
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}
