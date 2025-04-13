// Функція оновлення значення сигналу

export function updateSignalLevel(sensorId: string, signal: string) {
  const signalDiv = document.querySelector(
    `.signal[data-signal-id=${sensorId}]`
  ) as HTMLDivElement;
  if (signalDiv?.dataset.signalLevel == null) return;
  const currentSignalLevel = parseInt(signalDiv.dataset.signalLevel);
  if (currentSignalLevel === signalLevel(signal)) return;
  signalDiv.dataset.signalLevel = signalLevel(signal).toString();
}

//  Функція для індикації сигналу батареї

export function signalLevelShow(sensorId: string) {
  const signal = document.querySelector(
    `[data-signal-id=${sensorId}]`
  ) as HTMLDivElement;
  const signalLevel = Number(signal?.dataset.signalLevel);
  if (!signalLevel) return;
  if (signalLevel < 20) {
    signal.classList.add("poor-signal");
    signal.classList.remove("average-signal");
    return;
  }
  if (signalLevel >= 20 && signalLevel <= 70) {
    signal.classList.add("average-signal");
    signal.classList.remove("poor-signal");
    return;
  }
  if (signalLevel > 70) {
    signal.classList.remove("average-signal");
    signal.classList.remove("poor-signal");
    return;
  }
}

// Розрахунок сигналу передавання даних. Сигнал змінюється в діапазоні від -30 (поганий сигнал) до -120 (максимальний)

export function signalLevel(
  signal: string,
  highSignal: number = -120,
  lowSignal: number = -30
) {
  const currentBatteryLevel = (
    100 -
    ((highSignal - parseInt(signal)) * 100) / (highSignal - lowSignal)
  ).toFixed(0);
  return parseInt(currentBatteryLevel);
}
