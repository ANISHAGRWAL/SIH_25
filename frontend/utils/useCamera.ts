import { Capacitor } from "@capacitor/core";
import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";

export const getCameraStream = async (): Promise<
  MediaStream | string | null
> => {
  if (Capacitor.getPlatform() === "web") {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      return stream;
    } catch (err) {
      console.error("Web camera error:", err);
      return null;
    }
  } else {
    try {
      const image = await Camera.getPhoto({
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera,
        quality: 90,
        width: 720,
        height: 720,
      });
      if (!image.dataUrl) {
        return null;
      }

      return image.dataUrl; // You can create an HTMLImageElement with this
    } catch (err) {
      console.error("Mobile camera error:", err);
      return null;
    }
  }
};
