export type Config = {
  defaultEstimation: {
    amount: number;
    unit: string;
  };
  baseExp: number;
};

export const DEFAULT_CONFIG: Config = {
  defaultEstimation: {
    amount: 25,
    unit: "minute",
  },
  baseExp: 100,
};
