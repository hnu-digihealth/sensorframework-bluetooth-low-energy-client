import { toDataView } from "../utils";
export const BodySensorLocationCallback = (data) => {
    const view = toDataView(data);
    const bodySensorLocation = view.getUint8(0);
    return bodySensorLocation;
};
export var BodySensorLocation;
(function (BodySensorLocation) {
    BodySensorLocation[BodySensorLocation["OTHER"] = 0] = "OTHER";
    BodySensorLocation[BodySensorLocation["CHEST"] = 1] = "CHEST";
    BodySensorLocation[BodySensorLocation["WRIST"] = 2] = "WRIST";
    BodySensorLocation[BodySensorLocation["FINGER"] = 3] = "FINGER";
    BodySensorLocation[BodySensorLocation["HAND"] = 4] = "HAND";
    BodySensorLocation[BodySensorLocation["EAR_LOBE"] = 5] = "EAR_LOBE";
    BodySensorLocation[BodySensorLocation["FOOT"] = 6] = "FOOT";
})(BodySensorLocation || (BodySensorLocation = {}));
//# sourceMappingURL=body-sensor-location.js.map