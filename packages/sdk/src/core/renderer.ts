import { Label, TextItem, BarcodeItem, GraphicBoxItem, ImageItem } from "../types/types";
import { zebraEncode } from "./encoding";
import type { RenderOptions } from "@bwip-js/browser";

interface RendererOptions {
  dpi?: string;
  dimensions?: string;
  orientation?: string;
  scale?: number;
  backgroundColor?: string;
  foregroundColor?: string;
}

export class ZPLRenderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private options: Required<RendererOptions>;

  constructor(canvas: HTMLCanvasElement, options: RendererOptions = {}) {
    this.canvas = canvas;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      throw new Error("Failed to get 2D context from canvas");
    }
    this.ctx = ctx;

    // Default options
    this.options = {
      dpi: options.dpi ?? "203",
      dimensions: options.dimensions ?? "4x6",
      orientation: options.orientation ?? "portrait",
      scale: options.scale ?? 1,
      backgroundColor: options.backgroundColor ?? "#FFFFFF",
      foregroundColor: options.foregroundColor ?? "#000000",
    };
  }

  public async render(label: Label): Promise<void> {
    console.groupCollapsed("Rendering label");
    const labelWidthInches = parseInt(this.options.dimensions.split("x")[0]);
    const labelHeightInches = parseInt(this.options.dimensions.split("x")[1]);

    // Get the device pixel ratio
    const dpr = window.devicePixelRatio || 1;

    const width =
      this.options.orientation === "portrait"
        ? labelWidthInches
        : labelHeightInches;
    const height =
      this.options.orientation === "portrait"
        ? labelHeightInches
        : labelWidthInches;

    // Adjust canvas size for the device pixel ratio
    const rect = {
      width: width * 100,
      height: height * 100,
    };

    this.canvas.width = rect.width * dpr;
    this.canvas.height = rect.height * dpr;

    // Scale all canvas operations to account for the DPR and DPI setting
    this.ctx.scale(
      (2.8 * dpr * 72) / parseInt(this.options.dpi),
      (2.8 * dpr * 72) / parseInt(this.options.dpi)
    );

    // Set the CSS size
    this.canvas.style.width = `${rect.width}px`;
    this.canvas.style.height = `${rect.height}px`;

    // Clear canvas
    this.ctx.fillStyle = this.options.backgroundColor;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.scale(0.5, 0.5);

    // Set default styles
    this.ctx.fillStyle = this.options.foregroundColor;
    this.ctx.strokeStyle = this.options.foregroundColor;

    // Render each item
    for (const item of label.items) {
      console.log("Rendering item", item);
      if (item.type === "Text") {
        this.renderText(item as TextItem);
      } else if (item.type === "Barcode") {
        await this.renderBarcode(item as BarcodeItem, label);
      } else if (item.type === "GraphicBox") {
        this.renderGraphicBox(item as GraphicBoxItem);
      } else if (item.type === "Image") {
        this.renderImage(item as ImageItem);
      }
    }

    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    console.groupEnd();
  }

  private renderText(item: TextItem): void {
    const { x, y, font, blockFormat, fieldHex, orientation } = item;
    let { data } = item;
    data = zebraEncode(data, fieldHex);
    const scaledX = this.scaleValue(x);
    const scaledY = this.scaleValue(y);

    // Save context if rotation is needed
    if (orientation && orientation !== 'N') {
      this.ctx.save();
      this.applyRotation(scaledX, scaledY, orientation);
    }

    // Configure font
    const fontSize = this.scaleValue(font.height ?? 20);
    const fontFamily =
      font.fontName === "0"
        ? "'Roboto Condensed', Arial, sans-serif"
        : "'JetBrains Mono', monospace";
    this.ctx.font = `${fontSize}px ${fontFamily}`;
    if (fontFamily === "'Roboto Condensed', Arial, sans-serif") {
      this.ctx.font = `bold ${this.ctx.font}`;
      data = data.replace("-", " – ");
    }
    this.ctx.textBaseline = "top";

    if (blockFormat) {
      // Handle text blocks with line breaks
      const lines = data.split("\n");
      const lineHeight = fontSize * 1.2;
      const scaledWidth = this.scaleValue(blockFormat.width);

      lines.forEach((line, index) => {
        if (index < blockFormat.maxLines) {
          this.ctx.fillText(
            line,
            scaledX,
            scaledY + lineHeight * index,
            scaledWidth
          );
        }
      });
    } else {
      // Regular text
      //this.ctx.scale(0.8, 1);
      this.ctx.fillText(data, scaledX, scaledY);
      //this.ctx.scale(1.2, 1);
    }

    // Restore context if rotation was applied
    if (orientation && orientation !== 'N') {
      this.ctx.restore();
    }
  }

  private async renderBarcode(item: BarcodeItem, label: Label): Promise<void> {
    const scaledX = this.scaleValue(item.x);
    const scaledY = this.scaleValue(item.y);
    const processedData = zebraEncode(item.getProcessedData(), item.fieldHex);

    // Create a temporary canvas for the barcode
    const tempCanvas = document.createElement("canvas");

    // Set initial dimensions for the temporary canvas
    tempCanvas.width = this.scaleValue(400); // Give it enough width
    tempCanvas.height = this.scaleValue(200); // Give it enough height

    // Configure bwip-js options based on barcode type and settings
    const barcodeOptions: RenderOptions = {
      bcid: item.barcodeType,
      text: processedData,
      scale:
        item.renderOptions?.moduleWidth ||
        label.barcodeDefaults?.moduleWidth ||
        2,
      height:
        (item.options?.height || label.barcodeDefaults?.height || 100) / 15,
      includetext: true,
      textfont: "Arial",
    };

    // Log the processed data and options
    console.log("Barcode item", item);
    console.log("Rendering barcode with data:", processedData);
    console.log("Barcode options:", barcodeOptions);

    try {
      // Generate the barcode
      const bwipjs = (await import("@bwip-js/browser")).default;
      bwipjs.toCanvas(tempCanvas, barcodeOptions);

      // Log the temporary canvas dimensions
      console.log("Temp canvas dimensions:", {
        width: tempCanvas.width,
        height: tempCanvas.height,
      });

      // Save the current context state
      this.ctx.save();

      // Apply rotation if specified
      const orientation = item.getOrientation();
      if (orientation && orientation !== 'N') {
        this.applyRotation(scaledX, scaledY, orientation);
      }

      // Calculate the rendered barcode dimensions
      const renderedWidth = tempCanvas.width;
      const renderedHeight = tempCanvas.height;

      console.log("Rendering at:", {
        x: scaledX,
        y: scaledY,
        width: renderedWidth,
        height: renderedHeight,
      });

      // Draw the barcode on the main canvas
      this.ctx.drawImage(
        tempCanvas,
        scaledX,
        scaledY,
        renderedWidth,
        renderedHeight
      );

      // Restore the context state
      this.ctx.restore();
    } catch (error) {
      console.error("Failed to render barcode:", error);

      // Fallback: draw error text
      this.ctx.fillStyle = "red"; // Make error more visible
      this.ctx.font = "14px Arial";
      this.ctx.fillText(`Invalid barcode: ${processedData}`, scaledX, scaledY);
      // @ts-expect-error No stack on unknown
      console.error("Stack:", error.stack);
    }
  }

  private scaleValue(value: number): number {
    return value * this.options.scale;
  }

  /**
   * Apply rotation transformation around a point (field origin)
   * @param x - The x coordinate of the rotation point
   * @param y - The y coordinate of the rotation point
   * @param orientation - The rotation orientation (N, R, I, or B)
   */
  private applyRotation(x: number, y: number, orientation: string): void {
    // Translate to the rotation point
    this.ctx.translate(x, y);

    // Apply rotation based on orientation
    switch(orientation) {
      case 'R': // Rotate 90 degrees clockwise
        this.ctx.rotate(Math.PI / 2);
        break;
      case 'I': // Inverted - 180 degrees
        this.ctx.rotate(Math.PI);
        break;
      case 'B': // Bottom up - 90 degrees counter-clockwise
        this.ctx.rotate(-Math.PI / 2);
        break;
      case 'N': // Normal - no rotation
      default:
        // No rotation needed
        break;
    }

    // Translate back from rotation point
    this.ctx.translate(-x, -y);
  }

  private renderGraphicBox(item: GraphicBoxItem): void {
    const scaledX = this.scaleValue(item.x);
    const scaledY = this.scaleValue(item.y);
    const scaledWidth = this.scaleValue(item.width);
    const scaledHeight = this.scaleValue(item.height);
    const scaledThickness = this.scaleValue(item.thickness);

    // Calculate corner radius if roundedness is specified
    let radius = 0;
    if (item.roundedness > 0) {
      const shorterSide = Math.min(scaledWidth, scaledHeight);
      radius = (item.roundedness / 8) * (shorterSide / 2);
    }

    // Save current canvas state
    this.ctx.save();

    // Apply rotation if specified
    if (item.orientation && item.orientation !== 'N') {
      this.applyRotation(scaledX, scaledY, item.orientation);
    }

    // Draw rounded rectangle path
    this.ctx.beginPath();
    this.ctx.moveTo(scaledX + radius, scaledY);
    this.ctx.lineTo(scaledX + scaledWidth - radius, scaledY);
    this.ctx.quadraticCurveTo(
      scaledX + scaledWidth,
      scaledY,
      scaledX + scaledWidth,
      scaledY + radius
    );
    this.ctx.lineTo(scaledX + scaledWidth, scaledY + scaledHeight - radius);
    this.ctx.quadraticCurveTo(
      scaledX + scaledWidth,
      scaledY + scaledHeight,
      scaledX + scaledWidth - radius,
      scaledY + scaledHeight
    );
    this.ctx.lineTo(scaledX + radius, scaledY + scaledHeight);
    this.ctx.quadraticCurveTo(
      scaledX,
      scaledY + scaledHeight,
      scaledX,
      scaledY + scaledHeight - radius
    );
    this.ctx.lineTo(scaledX, scaledY + radius);
    this.ctx.quadraticCurveTo(scaledX, scaledY, scaledX + radius, scaledY);
    this.ctx.closePath();

    if (item.fieldReversed) {
      // Create color inversion effect
      this.ctx.globalCompositeOperation = "difference";
      this.ctx.fillStyle = "#FFFFFF";
      this.ctx.fill();
    } else {
      // Set color
      const color =
        item.color === "B"
          ? this.options.foregroundColor
          : this.options.backgroundColor;
      this.ctx.fillStyle = color;
      this.ctx.strokeStyle = this.ctx.fillStyle;

      if (scaledThickness === scaledWidth && scaledThickness === scaledHeight) {
        // Solid box
        this.ctx.fill();
      } else {
        // Hollow box
        this.ctx.lineWidth = scaledThickness;
        this.ctx.stroke();
      }
    }

    // Restore canvas state
    this.ctx.restore();
  }

  private renderImage(item: ImageItem): void {
    const scaledX = this.scaleValue(item.x);
    const scaledY = this.scaleValue(item.y);

    // Decompress and decode the hex data
    const bitmap = this.hexToBitmap(item.data);

    // Create ImageData
    const imageData = new ImageData(item.width, item.height);

    // Convert bitmap to RGBA
    for (let y = 0; y < item.height; y++) {
      for (let x = 0; x < item.width; x++) {
        const byteIndex = y * item.bytesPerRow + Math.floor(x / 8);
        const bitIndex = 7 - (x % 8);

        const isBlack = (bitmap[byteIndex] & (1 << bitIndex)) !== 0;

        const pixelIndex = (y * item.width + x) * 4;
        if (isBlack) {
          imageData.data[pixelIndex] = 0;     // R
          imageData.data[pixelIndex + 1] = 0; // G
          imageData.data[pixelIndex + 2] = 0; // B
          imageData.data[pixelIndex + 3] = 255; // A
        } else {
          imageData.data[pixelIndex] = 255;   // R
          imageData.data[pixelIndex + 1] = 255; // G
          imageData.data[pixelIndex + 2] = 255; // B
          imageData.data[pixelIndex + 3] = 255; // A
        }
      }
    }

    // Create a temporary canvas to hold the image
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = item.width;
    tempCanvas.height = item.height;
    const tempCtx = tempCanvas.getContext('2d')!;
    tempCtx.putImageData(imageData, 0, 0);

    // Save context and apply rotation if needed
    if (item.orientation && item.orientation !== 'N') {
      this.ctx.save();
      this.applyRotation(scaledX, scaledY, item.orientation);
    }

    // Draw to target context with proper scaling
    this.ctx.drawImage(
      tempCanvas,
      scaledX,
      scaledY,
      this.scaleValue(item.width),
      this.scaleValue(item.height)
    );

    // Restore context if rotation was applied
    if (item.orientation && item.orientation !== 'N') {
      this.ctx.restore();
    }
  }

  private hexToBitmap(hex: string): Uint8Array {
    const bytes = new Uint8Array(hex.length / 2);
    for (let i = 0; i < hex.length; i += 2) {
      bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
    }
    return bytes;
  }
}
