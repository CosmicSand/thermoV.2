import SensorsResponse from "./login.types";

//  Функція для індикації заряду батареї

export function currentBatteryLevelShow(sensorsResponses: SensorsResponse) {
  // Зроблено для перегляду всіх користувачів. Працює і для одного. Якщо суто для одного робити - то масив ти цикл зайві

  const ownersNamesArray = Object.keys(sensorsResponses);

  for (let ownerName of ownersNamesArray) {
    const sensorsArray = Object.keys(sensorsResponses[ownerName]);
    for (let sensor of sensorsArray) {
      const battery = document.querySelector<HTMLDivElement>(
        `.battery[data-id=${sensor}]`
      );
      const batteryLevel = Number(battery?.dataset.battery);

      const redLevel = document.querySelector<HTMLDivElement>(
        `[data-red='${sensor}']`
      );

      const yellowLevel = document.querySelector<HTMLDivElement>(
        `[data-yellow='${sensor}']`
      );
      const greenLevel = document.querySelector<HTMLDivElement>(
        `[data-green='${sensor}']`
      );
      document.querySelector<HTMLDivElement>(".medium-level");

      if (batteryLevel !== 0) {
        battery?.classList.remove("empty");
      }

      if (batteryLevel === 0) {
        redLevel?.classList.add("drained");
        yellowLevel?.classList.add("drained");
        greenLevel?.classList.add("drained");
        battery?.classList.add("empty");
      } else if (batteryLevel <= 20) {
        redLevel?.classList.remove("drained");
        yellowLevel?.classList.add("drained");
        greenLevel?.classList.add("drained");
      } else if (batteryLevel >= 20 && batteryLevel <= 70) {
        redLevel?.classList.remove("drained");
        redLevel?.classList.add("medium-level");
        yellowLevel?.classList.remove("drained");
        greenLevel?.classList.add("drained");
      } else if (batteryLevel > 70) {
        redLevel?.classList.remove("drained");
        redLevel?.classList.add("is-full");
        yellowLevel?.classList.remove("drained");
        yellowLevel?.classList.add("is-full");
        greenLevel?.classList.remove("drained");
      } else {
        console.log("dfdfdfdf");
      }
    }
  }
}

//   Функція конвертації напруги батареї у відсотки. За замовчанням в якості аргументів передаються значення  fullBattery = 4.5, emptyBattery= 3.2  - що справедливо для всіх сенсорів окрім gateway, для якого потрібно передавати під час виклику значення fullBattery = 4.2, emptyBattery= 3.6

export function batteryLevel(
  sensorParameters: string[],
  fullBattery: number = 4.5,
  emptyBattery: number = 3.2
) {
  const currentBatteryLevel = (
    100 -
    ((fullBattery - Number(sensorParameters[0])) * 100) /
      (fullBattery - emptyBattery)
  ).toFixed(0);
  if (!currentBatteryLevel.includes("-")) {
    return Number(currentBatteryLevel) > 100
      ? 100
      : Number(currentBatteryLevel);
  } else {
    return 0;
  }
}
