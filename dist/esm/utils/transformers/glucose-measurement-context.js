import { getSFloat, toDataView } from "../utils";
export const GlucoseMeasurementContextCallback = (data) => {
    const view = toDataView(data);
    const flags = view.getUint8(0);
    let index = 1;
    let context = {};
    const sequenceNumber = view.getUint16(index, true);
    index += 2;
    context = Object.assign({}, context, { sequenceNumber });
    const extendedFlagsPresent = flags & 0x80;
    if (extendedFlagsPresent) {
        //No definition for extended flags given by now
        index += 1;
    }
    const carbohydrateIdAndCarbohydratePresent = flags & 0x1;
    if (carbohydrateIdAndCarbohydratePresent) {
        const carbohydrateId = view.getUint8(index);
        index += 1;
        const carbohydrate = getSFloat(view, index);
        index += 2;
        const carbohydrateUnit = "g";
        context = Object.assign({}, context, { carbohydrateId, carbohydrate, carbohydrateUnit });
    }
    const mealPresent = flags & 0x2;
    if (mealPresent) {
        const meal = view.getUint8(index);
        index += 1;
        context = Object.assign({}, context, { meal });
    }
    const testerPresent = flags & 0x4;
    if (testerPresent) {
        const testerHealthByte = view.getUint8(index);
        index += 1;
        const tester = testerHealthByte & 0xF;
        const health = (testerHealthByte >> 4) & 0xF;
        context = Object.assign({}, context, { tester, health });
    }
    const exerciseDurationAndIntensityPresent = flags & 0x8;
    if (exerciseDurationAndIntensityPresent) {
        const exerciseDuration = view.getUint16(index, true);
        index += 2;
        const exerciseIntensity = view.getUint8(index);
        index += 1;
        context = Object.assign({}, context, { exerciseDuration, exerciseIntensity });
    }
    const medicationIdAndMedicationPresent = flags & 0x10;
    if (medicationIdAndMedicationPresent) {
        const medicationId = view.getUint8(index);
        index += 1;
        const medicationUnit = (flags & 0x20) ? "ml" : "mg";
        const medication = getSFloat(view, index);
        index += 2;
        context = Object.assign({}, context, { medicationId, medication, medicationUnit });
    }
    const hbA1cPresent = flags & 0x40;
    if (hbA1cPresent) {
        const hbA1c = view.getUint16(index, true);
        index += 2;
        context = Object.assign({}, context, { hbA1c });
    }
    return context;
};
//# sourceMappingURL=glucose-measurement-context.js.map