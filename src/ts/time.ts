const intObj: { [key: string]: NodeJS.Timeout } = {};

// export function timeSinceLastUpd(sensorsResponses: SensorsResponse) {
//   const ownersNamesArray = Object.keys(sensorsResponses);

//   for (let ownerName of ownersNamesArray) {
//     const ownersSensors = sensorsResponses[ownerName];
//     const sensorsArray = Object.keys(sensorsResponses[ownerName]);

//     for (let sensor of sensorsArray) {
//       const sensorsParams = ownersSensors[sensor] as string[];
//       const updateTime = Number(sensorsParams[8]);
//       const currentSensor = document.getElementById(sensor);
//       const currentTauBtn = document.querySelector(`#${sensor} .tau`);
//       const alarm = currentSensor?.dataset.alarmtime;

//       if (intObj[sensor]) {
//         clearInterval(intObj[sensor]);
//       }

//       const int = setInterval(() => {
//         const timeLeft = (Date.now() - updateTime) / (1000 * 60);
//         if (alarm && timeLeft > Number(alarm)) {
//           (currentTauBtn as HTMLElement).innerText = (timeLeft - 0.5).toFixed(
//             0
//           );
//           (currentTauBtn as HTMLElement).dataset.tau = (timeLeft - 0.5).toFixed(
//             1
//           );
//           currentTauBtn?.classList.remove("hidden");
//           currentSensor.classList.add("sensor-time-alarm");
//         } else {
//           currentTauBtn?.classList.add("hidden");
//           currentSensor?.classList.remove("sensor-time-alarm");
//         }
//       }, 1000);

//       intObj[sensor] = int;
//     }
//   }
// }

export function timeSinceLastUpd(sensorId: string, timeStamp: string) {
  // const updateTime = Number(arrayOfParameters[8]);
  const currentSensor = document.getElementById(sensorId);
  const currentTauBtn = document.querySelector(`#${sensorId} .tau`);
  const alarm = currentSensor?.dataset.alarmtime;

  if (intObj[sensorId]) {
    clearInterval(intObj[sensorId]);
  }

  const int = setInterval(() => {
    const timeLeft = (Date.now() - Number(timeStamp)) / (1000 * 60);
    if (alarm && timeLeft > Number(alarm)) {
      (currentTauBtn as HTMLElement).innerText = (timeLeft - 0.5).toFixed(0);
      (currentTauBtn as HTMLElement).dataset.tau = (timeLeft - 0.5).toFixed(1);
      currentTauBtn?.classList.remove("hidden");
      currentSensor.classList.add("sensor-time-alarm");
    } else {
      currentTauBtn?.classList.add("hidden");
      currentSensor?.classList.remove("sensor-time-alarm");
    }
  }, 60000);

  intObj[sensorId] = int;
}
