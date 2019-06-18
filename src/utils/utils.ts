export const get16BitUUID = (uuid: string) => {
    const prefix = "0x";
    const id = uuid.substr(4,4);
    return parseInt(prefix.concat(id));
}


