export type DBConfiguration = Array<{
  config: Record<string, any>;
  group?: string;
  autoload?: boolean;
}>;
