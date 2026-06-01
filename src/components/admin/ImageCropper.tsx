'use client'

import { useState, useRef, useEffect } from 'react'
import { ZoomIn, ZoomOut, Check, X, RefreshCw, Loader2 } from 'lucide-react'

interface ImageCropperProps {
  isOpen: boolean
  file: File | null
  aspectRatio: number // e.g., 16/9, 4/3, 1/1
  onCrop: (croppedFile: File, croppedUrl: string) => void
  onCancel: () => void
}

export default function ImageCropper({
  isOpen,
  file,
  aspectRatio,
  onCrop,
  onCancel,
}: ImageCropperProps) {
  const [imageSrc, setImageSrc] = useState<string | null>(null)
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  
  // Fixed preview dimensions
  const cropWidth = 320
  const cropHeight = 320 / aspectRatio

  const [dimensions, setDimensions] = useState({
    imgInitWidth: 0,
    imgInitHeight: 0,
    naturalWidth: 0,
    naturalHeight: 0,
  })

  const [loading, setLoading] = useState(false)
  const imageRef = useRef<HTMLImageElement>(null)

  // 1. Read file into base64 Data URL
  useEffect(() => {
    if (!file) {
      setImageSrc(null)
      return
    }
    setLoading(true)
    setDimensions({
      imgInitWidth: 0,
      imgInitHeight: 0,
      naturalWidth: 0,
      naturalHeight: 0,
    })

    const reader = new FileReader()
    reader.onload = () => {
      setImageSrc(reader.result as string)
    }
    reader.readAsDataURL(file)
  }, [file])

  // 2. Load image dimensions when the image tag loads
  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget
    const nWidth = img.naturalWidth || img.width
    const nHeight = img.naturalHeight || img.height

    if (!nWidth || !nHeight) {
      setLoading(false)
      return
    }

    // Base scale to cover the crop container
    const scaleBase = Math.max(cropWidth / nWidth, cropHeight / nHeight)
    const initWidth = nWidth * scaleBase
    const initHeight = nHeight * scaleBase

    setDimensions({
      imgInitWidth: initWidth,
      imgInitHeight: initHeight,
      naturalWidth: nWidth,
      naturalHeight: nHeight,
    })
    setZoom(1)
    setPan({ x: 0, y: 0 })
    setLoading(false)
  }

  // Constrain pan offset so image always covers the crop window
  const getConstrainedPan = (x: number, y: number, currentZoom: number) => {
    if (dimensions.imgInitWidth === 0) return { x: 0, y: 0 }

    const zWidth = dimensions.imgInitWidth * currentZoom
    const zHeight = dimensions.imgInitHeight * currentZoom

    const maxPanX = Math.max(0, (zWidth - cropWidth) / 2)
    const maxPanY = Math.max(0, (zHeight - cropHeight) / 2)

    return {
      x: Math.min(maxPanX, Math.max(-maxPanX, x)),
      y: Math.min(maxPanY, Math.max(-maxPanY, y)),
    }
  }

  // Handle zooming with slider
  const handleZoomChange = (newZoom: number) => {
    setZoom(newZoom)
    setPan((prev) => getConstrainedPan(prev.x, prev.y, newZoom))
  }

  // Dragging handlers (Mouse)
  const handleMouseDown = (e: React.MouseEvent) => {
    if (dimensions.imgInitWidth === 0) return
    e.preventDefault()
    setIsDragging(true)
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return
    const newX = e.clientX - dragStart.x
    const newY = e.clientY - dragStart.y
    setPan(getConstrainedPan(newX, newY, zoom))
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  // Dragging handlers (Touch)
  const handleTouchStart = (e: React.TouchEvent) => {
    if (dimensions.imgInitWidth === 0 || e.touches.length !== 1) return
    setIsDragging(true)
    const touch = e.touches[0]
    setDragStart({ x: touch.clientX - pan.x, y: touch.clientY - pan.y })
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return
    const touch = e.touches[0]
    const newX = touch.clientX - dragStart.x
    const newY = touch.clientY - dragStart.y
    setPan(getConstrainedPan(newX, newY, zoom))
  }

  const handleTouchEnd = () => {
    setIsDragging(false)
  }

  // Crop & generate file
  const handleCrop = () => {
    if (!imageRef.current || dimensions.imgInitWidth === 0) return

    const zWidth = dimensions.imgInitWidth * zoom
    const zHeight = dimensions.imgInitHeight * zoom

    // Offsets of the crop window top-left relative to the zoomed image
    const leftOffset = (zWidth - cropWidth) / 2 - pan.x
    const topOffset = (zHeight - cropHeight) / 2 - pan.y

    // Map crop box coordinates back to high-res source image dimensions
    const cropX = (leftOffset / zWidth) * dimensions.naturalWidth
    const cropY = (topOffset / zHeight) * dimensions.naturalHeight
    const cropW = (cropWidth / zWidth) * dimensions.naturalWidth
    const cropH = (cropHeight / zHeight) * dimensions.naturalHeight

    const canvas = document.createElement('canvas')
    canvas.width = cropW
    canvas.height = cropH

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Draw the cropped portion
    ctx.drawImage(
      imageRef.current,
      cropX,
      cropY,
      cropW,
      cropH,
      0,
      0,
      cropW,
      cropH
    )

    canvas.toBlob(
      (blob) => {
        if (blob) {
          const croppedFile = new File([blob], file?.name || 'cropped_image.jpg', {
            type: 'image/jpeg',
            lastModified: Date.now(),
          })
          const croppedUrl = URL.createObjectURL(blob)
          onCrop(croppedFile, croppedUrl)
        }
      },
      'image/jpeg',
      0.92
    )
  }

  if (!isOpen || !imageSrc) return null

  // Derived style variables for center-aligned absolute image
  const zWidth = dimensions.imgInitWidth * zoom
  const zHeight = dimensions.imgInitHeight * zoom

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-brand-charcoal-950/80 backdrop-blur-sm p-4 animate-fade-in pointer-events-auto">
      <div className="bg-brand-charcoal-800 border border-brand-charcoal-100/10 rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl flex flex-col pointer-events-auto">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-brand-charcoal-100/5">
          <h3 className="font-bold text-white text-xs uppercase tracking-wider font-display">
            Crop & Preview Photo
          </h3>
          <button
            onClick={onCancel}
            type="button"
            className="p-1.5 rounded-lg text-brand-charcoal-100/50 hover:text-white hover:bg-brand-charcoal-100/5 transition-all"
          >
            <X className="h-4.5 w-4.5" />
          </button>
        </div>

        {/* Modal Content / Cropping workspace */}
        <div className="p-5 flex flex-col items-center gap-5">
          <p className="text-[10px] text-brand-charcoal-100/50 text-center uppercase tracking-wider">
            Drag photo to pan • Use slider to zoom
          </p>

          {/* Crop Container */}
          <div
            className="relative border border-brand-charcoal-100/15 rounded-2xl overflow-hidden bg-brand-charcoal-900 shadow-inner flex items-center justify-center select-none"
            style={{ width: `${cropWidth}px`, height: `${cropHeight}px` }}
          >
            {/* The cropping window area */}
            <div
              className="relative w-full h-full overflow-hidden cursor-move"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              {(loading || dimensions.imgInitWidth === 0) && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-brand-charcoal-900 text-brand-charcoal-100/30 text-xs z-10">
                  <Loader2 className="h-5 w-5 animate-spin text-brand-orange-500" />
                  <span>Loading Image...</span>
                </div>
              )}

              <img
                ref={imageRef}
                src={imageSrc}
                alt="Crop preview source"
                onLoad={handleImageLoad}
                className="max-w-none pointer-events-none absolute"
                style={{
                  width: `${zWidth}px`,
                  height: `${zHeight}px`,
                  left: `${(cropWidth - zWidth) / 2 + pan.x}px`,
                  top: `${(cropHeight - zHeight) / 2 + pan.y}px`,
                  transition: isDragging ? 'none' : 'transform 0.05s ease-out',
                  opacity: (loading || dimensions.imgInitWidth === 0) ? 0 : 1,
                  visibility: (loading || dimensions.imgInitWidth === 0) ? 'hidden' : 'visible',
                }}
              />

              {/* Grid overlay lines */}
              <div className="absolute inset-0 pointer-events-none border border-brand-orange-500/20 z-20">
                <div className="absolute inset-x-0 top-1/3 border-b border-dashed border-white/20" />
                <div className="absolute inset-x-0 top-2/3 border-b border-dashed border-white/20" />
                <div className="absolute inset-y-0 left-1/3 border-r border-dashed border-white/20" />
                <div className="absolute inset-y-0 left-2/3 border-r border-dashed border-white/20" />
              </div>
            </div>
          </div>

          {/* Zoom controls */}
          <div className="w-full space-y-1.5">
            <div className="flex justify-between items-center text-[10px] font-bold text-brand-charcoal-100/60 uppercase tracking-wider">
              <span className="flex items-center gap-1">
                <ZoomOut className="h-3 w-3" />
                Zoom Out
              </span>
              <span>{(zoom * 100).toFixed(0)}%</span>
              <span className="flex items-center gap-1">
                <ZoomIn className="h-3 w-3" />
                Zoom In
              </span>
            </div>
            
            <input
              type="range"
              min="1"
              max="3"
              step="0.01"
              value={zoom}
              onChange={(e) => handleZoomChange(parseFloat(e.target.value))}
              disabled={loading || dimensions.imgInitWidth === 0}
              className="w-full h-1 bg-brand-charcoal-900 rounded-lg appearance-none cursor-pointer accent-brand-orange-600 focus:outline-none disabled:opacity-50"
            />
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-2.5 px-5 py-3.5 bg-brand-charcoal-900/50 border-t border-brand-charcoal-100/5">
          <button
            onClick={onCancel}
            type="button"
            className="flex items-center gap-1 px-4 py-2 rounded-xl bg-brand-charcoal-800 border border-brand-charcoal-100/10 text-[11px] font-semibold text-brand-charcoal-100/70 hover:text-white transition-all"
          >
            <X className="h-3.5 w-3.5" />
            Cancel
          </button>
          
          <button
            onClick={() => {
              setZoom(1)
              setPan({ x: 0, y: 0 })
            }}
            type="button"
            disabled={loading || dimensions.imgInitWidth === 0}
            className="flex items-center gap-1 px-4 py-2 rounded-xl bg-brand-charcoal-800 border border-brand-charcoal-100/10 text-[11px] font-semibold text-brand-charcoal-100/70 hover:text-white transition-all disabled:opacity-50"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Reset
          </button>

          <button
            onClick={handleCrop}
            type="button"
            disabled={loading || dimensions.imgInitWidth === 0}
            className="flex items-center gap-1 px-4.5 py-2 rounded-xl bg-brand-orange-600 hover:bg-brand-orange-700 text-[11px] font-semibold text-white shadow-lg shadow-brand-orange-600/15 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Check className="h-3.5 w-3.5" />
            Apply Crop
          </button>
        </div>

      </div>
    </div>
  )
}
