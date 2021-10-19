export type DBConfiguration = Array<{
    config: Record<string, any>;
    group?: string;
    autoload?: boolean;
}>;

export type DbData = {
    group?: string;
    key: string;
    value: any;
    type: string;
    autoload?: boolean;
};

export type DbDataArray = Array<DbData>;
