declare module 'cropperjs' {
  export interface CropperOptions {
    aspectRatio?: number;
    viewMode?: number;
    autoCropArea?: number;
    responsive?: boolean;
    restore?: boolean;
    guides?: boolean;
    center?: boolean;
    highlight?: boolean;
    cropBoxMovable?: boolean;
    cropBoxResizable?: boolean;
    toggleDragModeOnDblclick?: boolean;
  }

  export interface CropperData {
    x: number;
    y: number;
    width: number;
    height: number;
    rotate: number;
    scaleX: number;
    scaleY: number;
  }

  export interface CanvasData {
    left: number;
    top: number;
    width: number;
    height: number;
    naturalWidth: number;
    naturalHeight: number;
  }

  export default class Cropper {
    constructor(element: HTMLImageElement, options?: CropperOptions);
    
    crop(): Cropper;
    reset(): Cropper;
    clear(): Cropper;
    replace(url: string, hasSameSize?: boolean): Cropper;
    enable(): Cropper;
    disable(): Cropper;
    destroy(): Cropper;
    move(offsetX: number, offsetY?: number): Cropper;
    moveTo(x: number, y?: number): Cropper;
    zoom(ratio: number): Cropper;
    zoomTo(ratio: number, pivot?: { x: number; y: number }): Cropper;
    rotate(degree: number): Cropper;
    rotateTo(degree: number): Cropper;
    scale(scaleX: number, scaleY?: number): Cropper;
    scaleX(scaleX: number): Cropper;
    scaleY(scaleY: number): Cropper;
    getData(rounded?: boolean): CropperData;
    setData(data: Partial<CropperData>): Cropper;
    getContainerData(): CanvasData;
    getImageData(): CanvasData;
    getCanvasData(): CanvasData;
    setCanvasData(data: Partial<CanvasData>): Cropper;
    getCropBoxData(): CropperData;
    setCropBoxData(data: Partial<CropperData>): Cropper;
    getCroppedCanvas(options?: {
      width?: number;
      height?: number;
      minWidth?: number;
      minHeight?: number;
      maxWidth?: number;
      maxHeight?: number;
      fillColor?: string;
      imageSmoothingEnabled?: boolean;
      imageSmoothingQuality?: 'low' | 'medium' | 'high';
    }): HTMLCanvasElement;
    setAspectRatio(aspectRatio: number): Cropper;
    setDragMode(mode: 'crop' | 'move' | 'none'): Cropper;
  }
}