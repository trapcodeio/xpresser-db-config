import type { DbConfigMeta } from "./DbConfigMeta";

export type DBConfiguration = Array<{
    config: Record<string, any>;
    group?: string;
    autoload?: boolean;
}>;

export type DBConfigurationFnContext<M = any> = {
    v: <V>(value: V, meta?: M) => DbConfigMeta<V, M>;
};

export type DBConfigurationFn<M> = (ctx: DBConfigurationFnContext<M>) => DBConfiguration;

export type ConfigData = {
    group?: string;
    key: string;
    value: any;
};

export type DbData<M = any> = ConfigData & {
    type: string[];
    autoload?: boolean;
    meta?: M;
};

export type DbDataArray<M = any> = Array<DbData<M>>;
