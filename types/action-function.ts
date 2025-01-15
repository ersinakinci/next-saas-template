export type ActionFunction<D = Record<string, any>, E = string> = (
  ...args: any[]
) => Promise<
  (
    | {
        data: D;
        error: null;
      }
    | {
        data: null;
        error: E;
      }
    | {
        data: null;
        error: null;
      }
  ) & {
    message?: {
      title: string;
      description: string;
      variant?: "destructive" | "default";
    };
  }
>;
