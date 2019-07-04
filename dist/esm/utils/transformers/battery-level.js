import { toDataView } from "../utils";
export const BatteryLevelCallback = (data) => {
    const view = toDataView(data);
    const batteryLevel = view.getUint8(0);
    return batteryLevel;
};
//# sourceMappingURL=battery-level.js.map