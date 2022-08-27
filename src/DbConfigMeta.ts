export type kindOfValues =
    | "number"
    | "string"
    | "boolean"
    | "object"
    | "array"
    | "symbol"
    | "date"
    | "undefined"
    | "null";

export class DbConfigMeta<ValueType, MetaType = Record<any, any>> {
    public value: ValueType;
    public meta: MetaType = {} as MetaType;
    public customContext: { type?: kindOfValues[] };

    constructor(value: ValueType, meta?: MetaType) {
        this.value = value;
        if (meta) this.meta = meta;
        this.customContext = {};
    }

    // set type accepts typeof result of kind of value
    type(type: kindOfValues | kindOfValues[]) {
        if (typeof type === "string") type = [type];
        this.customContext.type = type;

        return this;
    }
}
