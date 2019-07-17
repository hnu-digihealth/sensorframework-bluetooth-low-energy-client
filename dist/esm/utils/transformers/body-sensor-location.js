import { toDataView } from "../utils";
export const BodySensorLocationCallback = (data) => {
    const view = toDataView(data);
    const bodySensorLocation = view.getUint8(0);
    return bodySensorLocation;
};
//# sourceMappingURL=body-sensor-location.js.map