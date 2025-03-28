// Функція відкриття та закриття індивідуального вікна налаштувань

function openAndCloseIndividualSettings(event: Event): void {
  const sensorNumber = (event.target as HTMLElement)?.dataset.name;

  if (!sensorNumber) return;

  const modalWindow = document.querySelector(
    ".modal"
  ) as HTMLDialogElement | null;
  if (!modalWindow) return;
  const nameSettingsInput = document.querySelector("[data-current-name]");
  const highSettingsInput = document.querySelector("[data-current-high]");
  const lowSettingsInput = document.querySelector("[data-current-low]");
  const timeSettingsInput = document.querySelector("[data-current-time]");

  modalWindow.dataset.target = sensorNumber;
  (nameSettingsInput as HTMLInputElement).value =
    (event.target as HTMLElement)?.dataset.name || "";
  (highSettingsInput as HTMLInputElement).value =
    (event.target as HTMLElement)?.dataset.high || "dd";
  (lowSettingsInput as HTMLInputElement).value =
    (event.target as HTMLElement)?.dataset.low || "";
  (timeSettingsInput as HTMLInputElement).value =
    (event.target as HTMLElement)?.dataset.alarmtime || "";

  (modalWindow as HTMLDialogElement)?.showModal();
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
