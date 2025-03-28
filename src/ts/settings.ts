// Функція відкриття та закриття індивідуального вікна налаштувань

import { simpleSorting } from "./sorting";

const nameSettingsInput = document.querySelector("[data-current-name]");
const highSettingsInput = document.querySelector("[data-current-high]");
const lowSettingsInput = document.querySelector("[data-current-low]");
const timeSettingsInput = document.querySelector("[data-current-time]");

function openAndCloseIndividualSettings(event: Event): void {
  const sensorNumber = (event.target as HTMLElement)?.dataset.id;
  const currentName = (event.target as HTMLElement)?.dataset.name;
  if (!sensorNumber) return;
  const modalWindow = document.querySelector(
    "[data-modal]"
  ) as HTMLDialogElement;
  if (!modalWindow) return;
  const settingsForm = document.querySelector(
    "[data-settings-form]"
  ) as HTMLElement;

  settingsForm.dataset.target = sensorNumber;
  settingsForm.dataset.currentName = currentName;

  (nameSettingsInput as HTMLInputElement).value =
    (event.target as HTMLElement)?.dataset.name || "";
  (highSettingsInput as HTMLInputElement).value =
    (event.target as HTMLElement)?.dataset.high || "";
  (lowSettingsInput as HTMLInputElement).value =
    (event.target as HTMLElement)?.dataset.low || "";
  (timeSettingsInput as HTMLInputElement).value =
    (event.target as HTMLElement)?.dataset.alarmtime || "";

  (modalWindow as HTMLDialogElement)?.showModal();
}

// Застосування налаштувань

export function applySettings(event: Event) {
  // Застосування введенних налаштувань
  const modalWindow = document.querySelector(
    "[data-modal]"
  ) as HTMLDialogElement;
  const sensorNumber = (event.target as HTMLElement)?.dataset.target;
  const currentSensor = document.querySelector(
    `[data-id=${sensorNumber}]`
  ) as HTMLElement;
  const paragraphWithName = currentSensor.querySelector(
    "[data-sensor-name]"
  ) as HTMLParagraphElement;

  currentSensor.dataset.name = (nameSettingsInput as HTMLInputElement).value;
  paragraphWithName.innerText = (nameSettingsInput as HTMLInputElement).value;
  currentSensor.dataset.high = (highSettingsInput as HTMLInputElement).value;
  currentSensor.dataset.low = (lowSettingsInput as HTMLInputElement).value;
  currentSensor.dataset.alarmtime = (
    timeSettingsInput as HTMLInputElement
  ).value;

  modalWindow?.close();
}

// function openAndCloseIndividualSettings(event: Event): void {
//   const sensorNumber =
//     (event.target as HTMLElement)?.dataset.name ||
//     (event.target as HTMLElement)?.dataset.close;

//   if (!sensorNumber) return;

//   const settingsWindow = document.querySelector(
//     `[data-settings-window="${sensorNumber}"]`
//   );
//   settingsWindow?.classList.toggle("hidden");
// }

export default openAndCloseIndividualSettings;
