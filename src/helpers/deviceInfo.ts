import { Device, DeviceInfo } from "@capacitor/device";

// This abstraction ensures that await Device.getInfo() only runs one time.
let deviceInfo: DeviceInfo | undefined = undefined;

export default async function getDeviceInfo(): Promise<DeviceInfo> {
  if (deviceInfo === undefined) deviceInfo = await Device.getInfo();
  return deviceInfo;
}
export async function isNative(): Promise<boolean> {
  if (deviceInfo === undefined) deviceInfo = await Device.getInfo();
  return deviceInfo.platform !== "web";
}
