type sensorsResponse = {
  [key: string]: {
    [key: string]:
      | string[]
      | ((sensorId: string, sensorData: string[]) => void);
    subAdd(sensorId: string, sensorData: string[]): void;
  };
} & {
  add(ownerId: string, sensorId: string, sensorData: string[]): void;
};

export default sensorsResponse;
