// Функція відкриття та закриття індивідуального вікна налаштувань

// import { simpleSorting } from "./sorting";
import { SavedSettings } from "./settings.types";

const SAVED_NEW_SETTINGS: SavedSettings =
  JSON.parse(localStorage.getItem("SAVED_NEW_SETTINGS") as string) ?? {};
const nameSettingsInput = document.querySelector("[data-current-name]");
const highSettingsInput = document.querySelector("[data-current-high]");
const lowSettingsInput = document.querySelector("[data-current-low]");
const timeSettingsInput = document.querySelector("[data-current-time]");
export const modalWindow = document.querySelector(
  "[data-modal]"
) as HTMLDialogElement;

export function openAndCloseIndividualSettings(event: Event): void {
  const sensorId = (event.target as HTMLElement)?.dataset.id;
  const currentName = (event.target as HTMLElement)?.dataset.name;
  if (!sensorId) return;

  // if (!modalWindow) return;
  const settingsForm = document.querySelector(
    "[data-settings-form]"
  ) as HTMLElement;

  settingsForm.dataset.target = sensorId;
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

export function applySettings(event: Event): void {
  // Застосування введенних налаштувань

  const sensorId = (event.target as HTMLElement)?.dataset.target;

  if (sensorId == undefined) return;

  const currentSensor = document.querySelector(
    `[data-id=${sensorId}]`
  ) as HTMLElement;
  // const ownerId = (currentSensor.closest(".control-area") as HTMLDivElement).id;
  const paragraphWithName =
    (currentSensor.querySelector(
      "[data-sensor-name]"
    ) as HTMLParagraphElement) ??
    (currentSensor.querySelector("[data-boiler-name]") as HTMLParagraphElement);
  const newSettings = {
    newName: (nameSettingsInput as HTMLInputElement).value,
    newHighLimit: (highSettingsInput as HTMLInputElement).value,
    newLowLimit: (lowSettingsInput as HTMLInputElement).value,
    newAlarmTime: (timeSettingsInput as HTMLInputElement).value,
    ownerId: (currentSensor.closest(".control-area") as HTMLDivElement).id,
    sensorId,
  };

  currentSensor.dataset.name = newSettings.newName;
  paragraphWithName.innerText = newSettings.newName;
  currentSensor.dataset.high = newSettings.newHighLimit;
  currentSensor.dataset.low = newSettings.newLowLimit;
  currentSensor.dataset.alarmtime = newSettings.newAlarmTime;

  saveSettings(newSettings);

  modalWindow?.close();
}

function saveSettings({
  ownerId,
  sensorId,

  newName,
  newHighLimit,
  newLowLimit,
  newAlarmTime,
}: {
  ownerId: string;
  sensorId: string;

  newName: string;
  newHighLimit: string;
  newLowLimit: string;
  newAlarmTime: string;
}) {
  if (SAVED_NEW_SETTINGS[ownerId]?.[sensorId] == undefined) {
    SAVED_NEW_SETTINGS[ownerId] = {
      ...SAVED_NEW_SETTINGS[ownerId],
      [sensorId]: {
        newName,
        newHighLimit,
        newLowLimit,
        newAlarmTime,
      },
    };
  }
  if (SAVED_NEW_SETTINGS[ownerId] != undefined) {
    SAVED_NEW_SETTINGS[ownerId][sensorId] = {
      newName,
      newHighLimit,
      newLowLimit,
      newAlarmTime,
    };
  }
  localStorage.setItem(
    "SAVED_NEW_SETTINGS",
    JSON.stringify(SAVED_NEW_SETTINGS)
  );
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
