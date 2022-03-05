export class DbConfigMeta<ValueType, MetaType = Record<any, any>> {
    public value: ValueType;
    public meta: MetaType = {} as MetaType;

    constructor(value: ValueType, meta?: MetaType) {
        this.value = value;
        if (meta) this.meta = meta;
    }
}
