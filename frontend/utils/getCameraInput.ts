import { Capacitor } from "@capacitor/core";
import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";

export async function getCameraInput(): Promise<MediaStream | string | null> {
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
      const photo = await Camera.getPhoto({
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera,
        quality: 90,
        width: 720,
        height: 720,
      });

      return photo.dataUrl || null;
    } catch (err) {
      console.error("Mobile camera error:", err);
      return null;
    }
  }
}
