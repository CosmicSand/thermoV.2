//  Функція для індикації заряду батареї

export function signalAndBatteryLevelShow(sensorId: string) {
  // Зроблено для перегляду всіх користувачів. Працює і для одного. Якщо суто для одного робити - то масив ти цикл зайві

  const battery = document.querySelector(
    `.battery[data-id=${sensorId}]`
  ) as HTMLDivElement;
  const batteryLevel = Number(battery?.dataset.battery);

  const redLevel = document.querySelector(
    `[data-red='${sensorId}']`
  ) as HTMLDivElement;

  const yellowLevel = document.querySelector(
    `[data-yellow='${sensorId}']`
  ) as HTMLDivElement;
  const greenLevel = document.querySelector(
    `[data-green='${sensorId}']`
  ) as HTMLDivElement;
  // document.querySelector(".medium-level") as HTMLDivElement;

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
  const signal = document.querySelector(
    `[data-signai-id=${sensorId}]`
  ) as HTMLDivElement;
  const signalLevel = Number(signal?.dataset.signalLevel);
  if (!signalLevel) {
    return;
  } else if (signalLevel <= 20) {
    signal.classList.add("poor-signal");
    signal.classList.remove("average-signal");
  } else if (signalLevel >= 20 && signalLevel <= 70) {
    signal.classList.add("average-signal");
    signal.classList.remove("poor-signal");
  } else {
    signal.classList.remove("average-signal");
    signal.classList.remove("poor-signal");
  }
}

//   Функція конвертації напруги батареї у відсотки. За замовчанням в якості аргументів передаються значення  fullBattery = 4.5, emptyBattery= 3.2  - що справедливо для всіх сенсорів окрім gateway, для якого потрібно передавати під час виклику значення fullBattery = 4.2, emptyBattery= 3.6

export function batteryLevel(
  chargingLevel: string,
  fullBattery: number = 4.5,
  emptyBattery: number = 3.2
) {
  const currentBatteryLevel = (
    100 -
    ((fullBattery - Number(chargingLevel)) * 100) / (fullBattery - emptyBattery)
  ).toFixed(0);
  if (!currentBatteryLevel.includes("-")) {
    return Number(currentBatteryLevel) > 100 ? 100 : currentBatteryLevel;
  } else {
    return 0;
  }
}

// Розрахунок сигналу передавання даних

export function signalLevel(
  chargingLevel: string,
  highSignal: number = -120,
  poorSignal: number = -30
) {
  const currentBatteryLevel = (
    100 -
    ((highSignal - Number(chargingLevel)) * 100) / (highSignal - poorSignal)
  ).toFixed(0);
  return currentBatteryLevel;
}
