import { toDataView } from "../utils";
export const GlucoseFeatureCallback = (data) => {
    const view = toDataView(data);
    const glucoseFeatureBits = view.getUint16(0, true);
    return {
        lowBatteryDetectionSupported: !!(glucoseFeatureBits & 0x1),
        sensorMalfunctionDetection: !!(glucoseFeatureBits & 0x2),
        sensorSampleSizeSupported: !!(glucoseFeatureBits & 0x4),
        sensorStripInsertionErrorDetectionSupported: !!(glucoseFeatureBits & 0x8),
        sensorStripTypeErrorDetectionSupported: !!(glucoseFeatureBits & 0x10),
        sensorResultHighLowDetectionSupported: !!(glucoseFeatureBits & 0x20),
        sensorTemperatureHighLowDetectionSupported: !!(glucoseFeatureBits & 0x40),
        sensorReadInterruptDetectionSupported: !!(glucoseFeatureBits & 0x80),
        generalDeviceFaultSupported: !!(glucoseFeatureBits & 0x100),
        timeFaultSupported: !!(glucoseFeatureBits & 0x200),
        multipleBondSupported: !!(glucoseFeatureBits & 0x400)
    };
};
//# sourceMappingURL=glucose-feature.js.map