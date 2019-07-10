export declare const get16BitUUID: (uuid: string) => number;
export declare const toDataView: (value: number[]) => DataView;
export declare const getSFloat: (data: DataView, offset: number) => number;
export declare const getFloat32: (data: DataView, offset: number) => number;
export declare const applyDecimalExponent: (value: number, pow?: number, mult?: number) => number;
