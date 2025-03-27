// Функція відкриття та закриття індивідуального вікна налаштувань

function openAndCloseIndividualSettings(event: Event): void {
  const sensorNumber =
    (event.target as HTMLElement)?.dataset.name ||
    (event.target as HTMLElement)?.dataset.close;

  if (!sensorNumber) return;

  const settingsWindow = document.querySelector(
    `[data-settings-window="${sensorNumber}"]`
  );
  settingsWindow?.classList.toggle("hidden");
}

export default openAndCloseIndividualSettings;
