// Функція сигналізації по температурі (збільшення/зменшення відносно допустимої, а також обрив)

// export function temperatureAlarm(sensorsResponses: SensorsResponse): void {
//   const ownersNamesArray = Object.keys(sensorsResponses);
//   for (let ownerName of ownersNamesArray) {
//     const ownersSensors = sensorsResponses[ownerName];
//     const sensorsArray = Object.keys(ownersSensors);
//     for (let sensor of sensorsArray) {
//       const sensorsData = sensorsResponses[ownerName][sensor];

//       if (sensorsData.includes("isGateway")) continue;

//       const currentSensor = document.getElementById(sensor);
//       const alarmHigh = Number(currentSensor?.dataset.high);
//       const alarmLow = Number(currentSensor?.dataset.low);
//       const currentTempreature = Number(currentSensor?.dataset.current);

//       if (currentSensor) {
//         if (currentSensor.dataset.stopped === "true") continue;
//         if (currentTempreature === -127) {
//           currentSensor?.classList.add("damaged");
//           continue;
//         } else {
//           currentSensor?.classList.remove("damaged");
//         }
//         if (alarmHigh < currentTempreature) {
//           currentSensor.classList.add("over-heated-alarm");
//           currentSensor.dataset.blink = "true";
//         } else if (alarmLow > currentTempreature) {
//           currentSensor?.classList.add("freezing-cold-alarm");
//           currentSensor.dataset.blink = "true";
//         } else {
//           currentSensor.dataset.stopped = "false";
//           currentSensor.dataset.blink = "false";
//           currentSensor?.classList.remove("freezing-cold-alarm");
//           currentSensor?.classList.remove("over-heated-alarm");
//         }
//       }
//     }
//   }
// }

export function temperatureAlarm(
  sensorId: string,
  temperatureOut: string,
  typeOfSensor: string
): void {
  if (typeOfSensor === "gateway" || typeOfSensor === "boiler") return;

  const currentSensor = document.getElementById(sensorId);
  const alarmHigh = Number(currentSensor?.dataset.high);
  const alarmLow = Number(currentSensor?.dataset.low);
  const currentTempreature = Number(temperatureOut);
  const monitorDiv = document.querySelector(
    "[data-is-alarm-active]"
  ) as HTMLDivElement;

  if (currentSensor) {
    if (currentTempreature === -127) {
      currentSensor?.classList.add("damaged");
      return;
    } else {
      currentSensor?.classList.remove("damaged");
    }
    if (
      alarmHigh < currentTempreature &&
      currentSensor.dataset.stopped !== "true"
    ) {
      currentSensor.classList.add("over-heated-alarm");
      currentSensor.dataset.blink = "true";
      monitorDiv.dataset.isAlarmActive = "true";
    } else if (
      alarmLow > currentTempreature &&
      currentSensor.dataset.stopped !== "true"
    ) {
      currentSensor?.classList.add("freezing-cold-alarm");
      currentSensor.dataset.blink = "true";
      monitorDiv.dataset.isAlarmActive = "true";
    } else if (
      alarmLow < currentTempreature &&
      alarmHigh > currentTempreature
    ) {
      currentSensor.dataset.stopped = "false";
      currentSensor.dataset.blink = "false";
      currentSensor?.classList.remove("freezing-cold-alarm");
      currentSensor?.classList.remove("over-heated-alarm");
      console.log(monitorDiv.querySelectorAll(".freezing-cold-alarm").length);
      if (
        !monitorDiv.querySelector(".freezing-cold-alarm") &&
        !monitorDiv.querySelector(".over-heated-alarm")
      ) {
        monitorDiv.dataset.isAlarmActive = "false";
      }
    }
  }
}

// ==== Функція припинення блимання сигналізації

export function stopAlarm(event: Event): void {
  if (!(event.target as HTMLElement)?.dataset.stopAlarm) return;

  const alarmElements = document.querySelectorAll('[data-blink="true"]');
  const monitorDiv = document.querySelector(
    "[data-is-alarm-active]"
  ) as HTMLDivElement;
  monitorDiv.dataset.isAlarmActive = "false";
  alarmElements.forEach((el) => {
    (el as HTMLElement).dataset.stopped = "true";
    (el as HTMLElement).dataset.blink = "false";
  });
}

// ==== Включення звукової сигналізації
export function soundAlarm() {
  const monitorDiv = document.querySelector(".monitor") as HTMLDivElement;
  const isAlarmActive = monitorDiv.dataset.isAlarmActive;
  const isAlarmSoundPlaying = monitorDiv.dataset.isSoundPlaying;
  const alarmSound = new Audio("../../sound/alarm.wav");
  if (isAlarmActive === "true" && isAlarmSoundPlaying === "false") {
    monitorDiv.dataset.isSoundPlaying = "true";
    alarmSound.loop = true;
    alarmSound.volume = 0.2;
    alarmSound.play();
  } else {
    alarmSound.pause();
    alarmSound.currentTime = 0;
    console.log(alarmSound.paused);
  }
}
