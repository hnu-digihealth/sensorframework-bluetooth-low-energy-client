import { toDataView } from "../utils";
export const TemperatureTypeCallback = (data) => {
    const view = toDataView(data);
    const type = view.getUint8(0);
    return type;
};
export var TemperatureLocation;
(function (TemperatureLocation) {
    TemperatureLocation[TemperatureLocation["ARMPIT"] = 1] = "ARMPIT";
    TemperatureLocation[TemperatureLocation["BODY"] = 2] = "BODY";
    TemperatureLocation[TemperatureLocation["EAR_LOBE"] = 3] = "EAR_LOBE";
    TemperatureLocation[TemperatureLocation["FINGER"] = 4] = "FINGER";
    TemperatureLocation[TemperatureLocation["GASTRO_INTESTINAL_TRACT"] = 5] = "GASTRO_INTESTINAL_TRACT";
    TemperatureLocation[TemperatureLocation["MOUTH"] = 6] = "MOUTH";
    TemperatureLocation[TemperatureLocation["RECTUM"] = 7] = "RECTUM";
    TemperatureLocation[TemperatureLocation["TOE"] = 8] = "TOE";
    TemperatureLocation[TemperatureLocation["TYMPANUM"] = 9] = "TYMPANUM";
})(TemperatureLocation || (TemperatureLocation = {}));
//# sourceMappingURL=temperature-type.js.map