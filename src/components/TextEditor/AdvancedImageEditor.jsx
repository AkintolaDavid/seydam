//import 'cropperjs/dist/cropper.css';
import Cropper from "cropperjs";
import React, { useState, useRef, useEffect } from "react";
import {
  Crop,
  RotateCw,
  Trash2,
  Upload,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Move,
  X,
  Check,
  RotateCcw,
  FlipHorizontal,
  FlipVertical,
  ZoomIn,
  ZoomOut,
  RotateCw as Rotate90,
  Square,
} from "lucide-react";

export const AdvancedImageEditor = ({
  imageElement,
  onUpdate,
  onRemove,
  onClose,
}) => {
  const [mode, setMode] = useState("resize");
  const [cropper, setCropper] = useState(null);
  const [rotation, setRotation] = useState(0);
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);

  const cropperRef = useRef(null);
  const fileInputRef = useRef(null);
  const canvasRef = useRef(null);

  const currentWidth =
    parseInt(imageElement.style.width) || imageElement.naturalWidth;
  const currentHeight =
    parseInt(imageElement.style.height) || imageElement.naturalHeight;
  const currentAlignment =
    imageElement.closest(".image-container")?.getAttribute("data-alignment") ||
    "left";

  // Initialize cropper when in crop mode
  useEffect(() => {
    if (mode === "crop" && cropperRef.current) {
      const cropperInstance = new Cropper(cropperRef.current, {
        aspectRatio: NaN,
        viewMode: 1,
        autoCropArea: 0.8,
        responsive: true,
        restore: false,
        guides: true,
        center: true,
        highlight: false,
        cropBoxMovable: true,
        cropBoxResizable: true,
        toggleDragModeOnDblclick: false,
        minCropBoxWidth: 50,
        minCropBoxHeight: 50,
      });
      setCropper(cropperInstance);

      return () => {
        cropperInstance.destroy();
        setCropper(null);
      };
    }
  }, [mode]);

  // Apply transformations to canvas
  const applyTransformations = (canvas, ctx, img) => {
    const { width, height } = canvas;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Save context state
    ctx.save();

    // Move to center for transformations
    ctx.translate(width / 2, height / 2);

    // Apply rotation
    if (rotation !== 0) {
      ctx.rotate((rotation * Math.PI) / 180);
    }

    // Apply flips
    ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);

    // Apply filters
    ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`;

    // Draw image centered
    ctx.drawImage(img, -width / 2, -height / 2, width, height);

    // Restore context state
    ctx.restore();
  };

  // Handle crop
  const handleCrop = () => {
    if (cropper) {
      const canvas = cropper.getCroppedCanvas({
        maxWidth: 2000,
        maxHeight: 2000,
        imageSmoothingEnabled: true,
        imageSmoothingQuality: "high",
      });

      canvas.toBlob(
        (blob) => {
          if (blob) {
            const reader = new FileReader();
            reader.onload = () => {
              onUpdate({ src: reader.result });
              setMode("resize");
            };
            reader.readAsDataURL(blob);
          }
        },
        "image/png",
        0.9
      );
    }
  };

  // Handle rotation
  const handleRotate = (degrees) => {
    setRotation((prev) => (prev + degrees) % 360);
  };

  // Handle flip
  const handleFlip = (direction) => {
    if (direction === "horizontal") {
      setFlipH((prev) => !prev);
    } else {
      setFlipV((prev) => !prev);
    }
  };

  // Apply transformations and update image
  const applyTransformations2 = () => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      // Calculate new dimensions based on rotation
      const radians = (rotation * Math.PI) / 180;
      const sin = Math.abs(Math.sin(radians));
      const cos = Math.abs(Math.cos(radians));

      canvas.width = img.width * cos + img.height * sin;
      canvas.height = img.width * sin + img.height * cos;

      applyTransformations(canvas, ctx, img);

      const transformedDataUrl = canvas.toDataURL("image/png", 0.9);
      onUpdate({
        src: transformedDataUrl,
        width: canvas.width,
        height: canvas.height,
      });
    };
    img.src = imageElement.src;
  };

  // Handle file replacement
  const handleReplace = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (event) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => {
        onUpdate({ src: reader.result });
        // Reset transformations
        setRotation(0);
        setFlipH(false);
        setFlipV(false);
        setBrightness(100);
        setContrast(100);
        setSaturation(100);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle alignment
  const handleAlignment = (alignment) => {
    onUpdate({ alignment });
  };

  // Reset all transformations
  const handleReset = () => {
    setRotation(0);
    setFlipH(false);
    setFlipV(false);
    setBrightness(100);
    setContrast(100);
    setSaturation(100);
  };

  // Preset aspect ratios for cropping
  const aspectRatios = [
    { label: "Free", value: NaN },
    { label: "1:1", value: 1 },
    { label: "4:3", value: 4 / 3 },
    { label: "3:2", value: 3 / 2 },
    { label: "16:9", value: 16 / 9 },
    { label: "2:1", value: 2 },
  ];

  const setAspectRatio = (ratio) => {
    if (cropper) {
      cropper.setAspectRatio(ratio);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[95vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-[#1a1a8c]">
            Advanced Image Editor
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Mode Tabs */}
        <div className="flex items-center gap-1 p-4 border-b border-gray-200 bg-gray-50">
          {[
            { id: "resize", label: "Resize", icon: Move },
            { id: "crop", label: "Crop", icon: Crop },
            { id: "rotate", label: "Transform", icon: RotateCw },
            { id: "align", label: "Align", icon: AlignCenter },
            { id: "effects", label: "Effects", icon: Square },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setMode(id)}
              className={`flex items-center gap-2 px-4 py-2 rounded transition-colors ${
                mode === id
                  ? "bg-[#1a1a8c] text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}

          <div className="flex-1" />

          <button
            onClick={handleReplace}
            className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 rounded hover:bg-gray-100 transition-colors"
          >
            <Upload size={16} />
            Replace
          </button>

          <button
            onClick={onRemove}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            <Trash2 size={16} />
            Remove
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 overflow-auto">
          {mode === "resize" && (
            <div className="space-y-6">
              <div className="text-center">
                <img
                  src={imageElement.src}
                  alt="Preview"
                  className="max-w-full max-h-96 mx-auto border border-gray-300 rounded"
                  style={{
                    width: currentWidth,
                    height: currentHeight,
                    filter: `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`,
                  }}
                />
              </div>

              <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Width (px)
                  </label>
                  <input
                    type="number"
                    value={currentWidth}
                    onChange={(e) => {
                      const width = parseInt(e.target.value);
                      const aspectRatio =
                        imageElement.naturalWidth / imageElement.naturalHeight;
                      const height = Math.round(width / aspectRatio);
                      onUpdate({ width, height });
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#1a1a8c] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Height (px)
                  </label>
                  <input
                    type="number"
                    value={currentHeight}
                    onChange={(e) => {
                      const height = parseInt(e.target.value);
                      const aspectRatio =
                        imageElement.naturalWidth / imageElement.naturalHeight;
                      const width = Math.round(height * aspectRatio);
                      onUpdate({ width, height });
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#1a1a8c] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Scale (%)
                  </label>
                  <input
                    type="number"
                    value={Math.round(
                      (currentWidth / imageElement.naturalWidth) * 100
                    )}
                    onChange={(e) => {
                      const scale = parseInt(e.target.value) / 100;
                      const width = Math.round(
                        imageElement.naturalWidth * scale
                      );
                      const height = Math.round(
                        imageElement.naturalHeight * scale
                      );
                      onUpdate({ width, height });
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#1a1a8c] focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex justify-center gap-2">
                <button
                  onClick={() => {
                    onUpdate({
                      width: imageElement.naturalWidth,
                      height: imageElement.naturalHeight,
                    });
                  }}
                  className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                >
                  Original Size
                </button>
                <button
                  onClick={() => {
                    const maxWidth = 800;
                    const aspectRatio =
                      imageElement.naturalWidth / imageElement.naturalHeight;
                    const width = Math.min(maxWidth, imageElement.naturalWidth);
                    const height = Math.round(width / aspectRatio);
                    onUpdate({ width, height });
                  }}
                  className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                >
                  Fit to Page
                </button>
              </div>
            </div>
          )}

          {mode === "crop" && (
            <div className="space-y-4">
              <div className="flex justify-center gap-2 mb-4">
                <span className="text-sm font-medium text-gray-700">
                  Aspect Ratio:
                </span>
                {aspectRatios.map((ratio) => (
                  <button
                    key={ratio.label}
                    onClick={() => setAspectRatio(ratio.value)}
                    className="px-3 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                  >
                    {ratio.label}
                  </button>
                ))}
              </div>

              <div className="text-center">
                <img
                  ref={cropperRef}
                  src={imageElement.src}
                  alt="Crop preview"
                  className="max-w-full max-h-96"
                />
              </div>

              <div className="flex justify-center gap-3">
                <button
                  onClick={() => cropper?.reset()}
                  className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                >
                  Reset
                </button>
                <button
                  onClick={handleCrop}
                  className="flex items-center gap-2 px-4 py-2 bg-[#1a1a8c] text-white rounded hover:bg-[#141466] transition-colors"
                >
                  <Check size={16} />
                  Apply Crop
                </button>
              </div>
            </div>
          )}

          {mode === "rotate" && (
            <div className="space-y-6">
              <div className="text-center">
                <img
                  src={imageElement.src}
                  alt="Preview"
                  className="max-w-full max-h-96 mx-auto border border-gray-300 rounded"
                  style={{
                    transform: `rotate(${rotation}deg) scaleX(${
                      flipH ? -1 : 1
                    }) scaleY(${flipV ? -1 : 1})`,
                    filter: `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`,
                  }}
                />
              </div>

              <div className="space-y-4 max-w-md mx-auto">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rotation
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleRotate(-90)}
                      className="p-2 bg-white border border-gray-300 rounded hover:bg-gray-50"
                      title="Rotate 90° Left"
                    >
                      <RotateCcw size={16} />
                    </button>
                    <input
                      type="range"
                      min="-180"
                      max="180"
                      value={rotation}
                      onChange={(e) => setRotation(parseInt(e.target.value))}
                      className="flex-1"
                    />
                    <button
                      onClick={() => handleRotate(90)}
                      className="p-2 bg-white border border-gray-300 rounded hover:bg-gray-50"
                      title="Rotate 90° Right"
                    >
                      <Rotate90 size={16} />
                    </button>
                    <span className="text-sm text-gray-600 min-w-[3rem]">
                      {rotation}°
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Flip
                  </label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleFlip("horizontal")}
                      className={`flex items-center gap-2 px-3 py-2 border rounded transition-colors ${
                        flipH
                          ? "bg-[#1a1a8c] text-white border-[#1a1a8c]"
                          : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      <FlipHorizontal size={16} />
                      Horizontal
                    </button>
                    <button
                      onClick={() => handleFlip("vertical")}
                      className={`flex items-center gap-2 px-3 py-2 border rounded transition-colors ${
                        flipV
                          ? "bg-[#1a1a8c] text-white border-[#1a1a8c]"
                          : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      <FlipVertical size={16} />
                      Vertical
                    </button>
                  </div>
                </div>

                <div className="flex justify-center gap-3">
                  <button
                    onClick={handleReset}
                    className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                  >
                    Reset
                  </button>
                  <button
                    onClick={applyTransformations2}
                    className="flex items-center gap-2 px-4 py-2 bg-[#1a1a8c] text-white rounded hover:bg-[#141466] transition-colors"
                  >
                    <Check size={16} />
                    Apply Transform
                  </button>
                </div>
              </div>
            </div>
          )}

          {mode === "align" && (
            <div className="space-y-6">
              <div className="text-center">
                <img
                  src={imageElement.src}
                  alt="Preview"
                  className="max-w-full max-h-96 mx-auto border border-gray-300 rounded"
                  style={{ width: currentWidth, height: currentHeight }}
                />
              </div>

              <div className="flex justify-center gap-3">
                <button
                  onClick={() => handleAlignment("left")}
                  className={`flex items-center gap-2 px-4 py-2 border rounded transition-colors ${
                    currentAlignment === "left"
                      ? "bg-[#1a1a8c] text-white border-[#1a1a8c]"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <AlignLeft size={16} />
                  Left
                </button>

                <button
                  onClick={() => handleAlignment("center")}
                  className={`flex items-center gap-2 px-4 py-2 border rounded transition-colors ${
                    currentAlignment === "center"
                      ? "bg-[#1a1a8c] text-white border-[#1a1a8c]"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <AlignCenter size={16} />
                  Center
                </button>

                <button
                  onClick={() => handleAlignment("right")}
                  className={`flex items-center gap-2 px-4 py-2 border rounded transition-colors ${
                    currentAlignment === "right"
                      ? "bg-[#1a1a8c] text-white border-[#1a1a8c]"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <AlignRight size={16} />
                  Right
                </button>
              </div>
            </div>
          )}

          {mode === "effects" && (
            <div className="space-y-6">
              <div className="text-center">
                <img
                  src={imageElement.src}
                  alt="Preview"
                  className="max-w-full max-h-96 mx-auto border border-gray-300 rounded"
                  style={{
                    width: currentWidth,
                    height: currentHeight,
                    filter: `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`,
                  }}
                />
              </div>

              <div className="space-y-4 max-w-md mx-auto">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Brightness: {brightness}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="200"
                    value={brightness}
                    onChange={(e) => setBrightness(parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contrast: {contrast}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="200"
                    value={contrast}
                    onChange={(e) => setContrast(parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Saturation: {saturation}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="200"
                    value={saturation}
                    onChange={(e) => setSaturation(parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div className="flex justify-center gap-3">
                  <button
                    onClick={() => {
                      setBrightness(100);
                      setContrast(100);
                      setSaturation(100);
                    }}
                    className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                  >
                    Reset Effects
                  </button>
                  <button
                    onClick={() => {
                      // Apply effects by creating a new canvas with filters
                      const canvas = document.createElement("canvas");
                      const ctx = canvas.getContext("2d");
                      if (ctx) {
                        const img = new Image();
                        img.onload = () => {
                          canvas.width = img.width;
                          canvas.height = img.height;
                          ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`;
                          ctx.drawImage(img, 0, 0);
                          const dataUrl = canvas.toDataURL("image/png", 0.9);
                          onUpdate({ src: dataUrl });
                          setBrightness(100);
                          setContrast(100);
                          setSaturation(100);
                        };
                        img.src = imageElement.src;
                      }
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-[#1a1a8c] text-white rounded hover:bg-[#141466] transition-colors"
                  >
                    <Check size={16} />
                    Apply Effects
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
          >
            Done
          </button>
        </div>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
};
