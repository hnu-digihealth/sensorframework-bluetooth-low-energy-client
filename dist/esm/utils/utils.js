export const get16BitUUID = (uuid) => {
    const prefix = "0x";
    const id = uuid.substr(4, 4);
    return parseInt(prefix.concat(id));
};
export const toDataView = (value) => {
    const buffer = new ArrayBuffer(value.length);
    const view = new DataView(buffer);
    for (let index = 0; index < value.length; index++) {
        view.setInt8(index, value[index]);
    }
    return view;
};
export const getSFloat = (data, offset) => {
    const value = data.getUint16(offset, true);
    if (value == 0x07FF) {
        return NaN;
    }
    else if (value == 0x800) {
        return NaN;
    }
    else if (value == 0x7FE) {
        return Infinity;
    }
    else if (value == 0x0802) {
        return -Infinity;
    }
    else if (value == 0x801) {
        return NaN;
    }
    const mantissa = unsignedToSigned(value & 0xFFF, 12);
    const exp = unsignedToSigned((value >> 12) & 0xF, 4);
    return (mantissa * Math.pow(10.0, exp));
};
const unsignedToSigned = (unsigned, size) => {
    if ((unsigned & (1 << size - 1)) != 0) {
        unsigned = -1 * ((1 << size - 1) - (unsigned & ((1 << size - 1) - 1)));
    }
    return unsigned;
};
//# sourceMappingURL=utils.js.map