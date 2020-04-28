import {BluetoothGATTByteData} from "../definitions";

export * from "./base64";

export const toDataView = (value: BluetoothGATTByteData) => {

    const buffer = new ArrayBuffer(value.length);
    const view = new DataView(buffer);

    for(let index = 0;index < value.length; index++){
        view.setInt8(index, value[index]);
    }

    return view;
};

export const getSFloat = ( data: DataView, offset: number ) => {

    const value = data.getUint16(offset, true);

    if ( value == 0x07FF){
        return NaN;
    } else if (value == 0x800) {
        return NaN;
    } else if (value == 0x7FE) {
        return Infinity;
    } else if (value == 0x0802) {
        return -Infinity;
    } else if (value == 0x801) {
        return NaN;
    }

    const mantissa = unsignedToSigned(value & 0xFFF, 12);
    const exp = unsignedToSigned((value >> 12) & 0xF, 4);

    return (mantissa * Math.pow(10, exp));
};

export const getFloat32 = (data: DataView, offset: number) => {

    const value = data.getUint32(offset, true);

    const mantissa = unsignedToSigned(value & 0xFFFFFF, 24);
    const exp = unsignedToSigned((value >> 24) & 0xFF, 8);

    return (mantissa * Math.pow(10, exp));
};

const unsignedToSigned = (unsigned: number, size: number) => {

    if((unsigned & (1 << size-1)) != 0){
        unsigned = -1 * ((1 << size-1) - (unsigned & (( 1 << size-1)-1)));
    }

    return unsigned;
};

export const applyDecimalExponent = (value: number, pow: number = 0, mult: number = 1) => {
    return value * mult * Math.pow(10, pow);
};


