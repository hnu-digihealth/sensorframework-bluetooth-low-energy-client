import {BluetoothGATTByteData, BluetoothGATTCallback} from "../../definitions";
import {toDataView} from "../utils";

export const PLXFeaturesCallback: BluetoothGATTCallback = (data: BluetoothGATTByteData) => {

    const view = toDataView(data);

    let index = 0;


    const supportedFeatures = view.getUint16(index, true);


    let features : any = {
        measurementStorageForSpotCheckMeasurementsSupported: !!(supportedFeatures & 0x4),
        timestampForSporCheckMeasurementsSupported: !!(supportedFeatures & 0x8),
        spO2PRFastMetricSupported: !!(supportedFeatures & 0x10),
        spO2PRSlowMetricSupported: !!(supportedFeatures & 0x20),
        pulseAmplitudeIndexFieldSupported: !!(supportedFeatures & 0x40),
        multipleBondsSupported: !!(supportedFeatures & 0x80)
    };

    const measurementStatusSupportPresent = supportedFeatures & 0x1;

    if(measurementStatusSupportPresent){

        index += 2;

        /*
        * TODO: Check significance of bytes in array. If they are ordered from LSO -> MSO,
        *       no changes need to be applied, otherwise, we have to increase the index once
        *       more since 8 bits need to be skipped due to the index starting at 5
        */
        const measurementStatusSupportBits = view.getUint16(index, true);

        const measurementStatusSupport = {
            measurementOngoingBit: !!(measurementStatusSupportBits & 0x20),
            earlyEstimatedDataBit: !!(measurementStatusSupportBits & 0x40),
            validatedDataBit: !!(measurementStatusSupportBits & 0x80),
            fullyQualifiedDataBit: !!(measurementStatusSupportBits & 0x100),
            dataFromMeasurementStorageBit: !!(measurementStatusSupportBits & 0x200),
            dataForDemonstrationBit: !!(measurementStatusSupportBits & 0x400),
            dataForTestingBit: !!(measurementStatusSupportBits & 0x800),
            calibrationOngoingBit: !!(measurementStatusSupportBits & 0x1000),
            measurementUnavailableBit: !!(measurementStatusSupportBits & 0x2000),
            questionableMeasurementDetectedBit: !!(measurementStatusSupportBits & 0x4000),
            invalidMeasurementDetectedBit: !!(measurementStatusSupportBits & 0x8000)
        };

        features = {...features, measurementStatusSupport};

    }

    const deviceAndSensorStatusSupportPresent = supportedFeatures & 0x2;

    if(deviceAndSensorStatusSupportPresent) {

        index += 2;

        const deviceAndSensorStatusSupportBits = view.getUint16(index, true);

        const deviceAndSensorStatusSupport = {
            extendedDisplayUpdateOngoingBit: !!(deviceAndSensorStatusSupportBits & 0x1),
            equipmentMalfunctionDetectedBit: !!(deviceAndSensorStatusSupportBits & 0x2),
            signalProcessingIrregularityDetectedBit: !!(deviceAndSensorStatusSupportBits & 0x4),
            inadequateSignalDetectedBit: !!(deviceAndSensorStatusSupportBits & 0x8),
            poorSignalDetectedBit: !!(deviceAndSensorStatusSupportBits & 0x10),
            lowPerfusionDetectedBit: !!(deviceAndSensorStatusSupportBits & 0x20),
            erraticSignalDetectedBit: !!(deviceAndSensorStatusSupportBits & 0x40),
            nonpulsatileSignalDetectedBit: !!(deviceAndSensorStatusSupportBits & 0x80),
            questionablePulseDetectedBit: !!(deviceAndSensorStatusSupportBits & 0x100),
            signalAnalysisOngoingBit: !!(deviceAndSensorStatusSupportBits & 0x200),
            sensorInterfaceDetectedBit: !!(deviceAndSensorStatusSupportBits & 0x400),
            sensorUnconnectedToUserBit: !!(deviceAndSensorStatusSupportBits & 0x800),
            unknownSensorConnectedBit: !!(deviceAndSensorStatusSupportBits & 0x1000),
            sensorDisplacedBit: !!(deviceAndSensorStatusSupportBits & 0x2000),
            sensorMalfunctioningBit: !!(deviceAndSensorStatusSupportBits & 0x4000),
            sensorDisconnectedBit: !!(deviceAndSensorStatusSupportBits & 0x8000)
        } ;

        features = {...features, deviceAndSensorStatusSupport};

    }

    return features;

};
