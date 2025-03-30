// import { NodeArray } from "typescript";
// import { sensorsResponses } from "./mqtt";
import { SensorsResponse } from "./login.types";
import { temperatureUpdate } from "./temperature";
import { temperatureAlarm } from "./alarm";
import { timeSinceLastUpd } from "./time";
import { batteryLevelShow, batteryLevel } from "./battery";

// const intObj: { [key: string]: NodeJS.Timeout } = {};
const monitor = document.querySelector(".monitor") as HTMLDivElement;

export function cardCreation(sensorsResponses: SensorsResponse) {
  const ownersIdArray = Object.keys(sensorsResponses);

  // Створюємо контейнери для сенсорів

  for (let ownerId of ownersIdArray) {
    const divIdExistence = document.getElementById(ownerId);

    if (!divIdExistence) {
      monitor?.insertAdjacentHTML(
        "afterbegin",
        `<div class='control-area' id=${ownerId}><h2>${ownerId}</h2><div class="gateway" data-gateway=${ownerId}></div><div class="for-boilers" data-boiler=${ownerId}></div><div class="for-sensors" data-sensor=${ownerId}></div></div></div>`
      );
    }

    // Малюємо сенсори

    const sensorsIdArray = Object.keys(sensorsResponses[ownerId]);

    for (let sensorId of sensorsIdArray) {
      const ownersControlArea = document.getElementById(
        ownerId
      ) as HTMLDivElement;
      const [
        name,
        chargingLevel,
        temperatureOut,
        temperatureIn,
        signal,
        typeOfSignal,
        typeOfSensor,
        timeStamp,
      ] = sensorsResponses[ownerId][sensorId];

      // const arrayOfParameters = sensorsResponses[ownerId][sensorId] as string[];
      const idCheckEl = document.getElementById(sensorId);
      const idNumber = sensorId.split("_")[1];
      // const temperature = Number(arrayOfParameters[1]).toFixed(1);
      const isSensor = typeOfSensor.includes("sensor");
      const isBoiler = typeOfSensor.includes("boiler");
      const isGateway = typeOfSensor.includes("gateway");

      if (!ownersControlArea.contains(idCheckEl) && isSensor) {
        const ownersControlAreaForSensors = document.querySelector(
          `[data-sensor=${ownerId}]`
        ) as HTMLDivElement;

        const sensorElement = `<div class="sensor" data-sensor="true" data-id='${sensorId}' data-name=${name} id='${sensorId}'  data-alarmtime="1"  data-high="60" data-low="15" data-current=${temperatureOut}>
            <p class="parameter"  data-temp='${sensorId}'>${temperatureOut}</p>
            <p class="sensor-name" data-sensor-name>${idNumber}</p>

            <div class="battery" data-id='${sensorId}' data-battery=${batteryLevel(
          chargingLevel
        )}>
             <div class="low-level" data-red=${sensorId}></div>
              <div class="medium-level drained" data-yellow=${sensorId}></div>
              <div class="full-level drained" data-green=${sensorId}></div>
            </div>
              <button class="tau hidden" data-tau="">
               &#120533;
            </button>
          </div>`;
        ownersControlAreaForSensors.insertAdjacentHTML(
          "beforeend",
          sensorElement
        );
      } else if (!ownersControlArea.contains(idCheckEl) && isBoiler) {
        const ownersControlAreaForBoilers = document.querySelector(
          `[data-boiler=${ownerId}]`
        ) as HTMLDivElement;

        const temperatureAfter = parseFloat(temperatureOut);
        const temperatureBefore = parseFloat(temperatureIn);
        // !outTemperature.toString().includes("-")
        let delta: string;
        if (temperatureAfter > 0 && temperatureBefore > 0) {
          delta = (temperatureAfter - temperatureBefore).toFixed(1);
        } else {
          delta = "";
        }

        const sensorBoilerElement = `<div class="sensor boiler" id=${sensorId} data-boiler=${sensorId} data-in=${
          temperatureBefore > 0 ? temperatureBefore : "-"
        } data-out=${
          temperatureAfter > 0 ? temperatureAfter : "-"
        } data-active=${boilerIsActive(
          temperatureBefore,
          temperatureAfter
        )} data-alarmtime="180" data-high="80" data-low="15">
                        <p class="parameter"><span class='delta'>&#916;</span>${delta}</p>
                        <p class="parameter" data-time='${sensorId}'>0</p>
            <p class="sensor-name">
              
              Boiler
            </p>

            <div class="battery" data-id='${sensorId}' data-battery=${batteryLevel(
          chargingLevel
        )}>
              <div class="low-level" data-red=${sensorId}></div>
              <div class="medium-level drained" data-yellow=${sensorId}></div>
              <div class="full-level drained" data-green=${sensorId}></div>
            </div>
          </div>
          <div class="settings hidden">
              <form class="settings-form" method="post">
                <label for="sensorsname">Sensor's name</label>
                <input id="sensorsname" type="text" class="sensorsname" />
                <h3 class="limits-title">Limits</h3>
                <div class="limits-inputs">
                  <label for="high-temp" class="high-temp-lbl"
                    >Up
                    <input id="high-temp" class="high-temp-limit" type="number"
                  /></label>

                  <label for="low-temp" class="low-temp-lbl"
                    >Down<input
                      id="low-temp"
                      class="low-temp-limit"
                      type="number"
                  /></label>

                  <label for="time" class="time-lbl"
                    >Time<input id="time" class="time-limit" type="number"
                  /></label>
                </div>

                <button type="submit" class="apply-btn">Apply</button>
                <button type="button" class="reset-btn">Reset</button>
              </form>
            </div>
          `;
        ownersControlAreaForBoilers.insertAdjacentHTML(
          "beforeend",
          sensorBoilerElement
        );
      } else if (!ownersControlArea.contains(idCheckEl) && isGateway) {
        const ownersControlAreaForGateway = document.querySelector(
          `[data-gateway=${ownerId}]`
        ) as HTMLDivElement;
        const sensorParameters = sensorsResponses[ownerId][
          sensorId
        ] as string[];
        const accuLevel = Number(chargingLevel);
        const isGrid = Number(sensorParameters[2]) > 4 ? 1 : 0;

        const sensorGatewayElement = `<div class="padding"><div class="gateway-element" id='${sensorId}' data-accu=${accuLevel} data-grid=${isGrid}>
                        <p class="parameter">${accuLevel}</p>
                        <p class="parameter">${isGrid}</p>
          

            <div class="battery" data-id='${sensorId}' data-battery=${batteryLevel(
          chargingLevel,
          4.2,
          3.6
        )}>
              <div class="low-level" data-red=${sensorId}></div>
              <div class="medium-level drained" data-yellow=${sensorId}></div>
              <div class="full-level drained" data-green=${sensorId}></div>
            </div>
          </div>
          </div>`;
        ownersControlAreaForGateway.insertAdjacentHTML(
          "beforeend",
          sensorGatewayElement
        );
      }
      temperatureUpdate(sensorId, temperatureOut);
      temperatureAlarm(sensorId, temperatureOut, typeOfSensor);
      batteryLevelShow(sensorId);
      timeSinceLastUpd(sensorId, timeStamp);
    }
  }
}

// Застосування класу isActive для котла, який знаходиться в роботі

function boilerIsActive(inTemperature: number, outTemperature: number) {
  if (outTemperature - inTemperature > 5 && outTemperature > 40) {
    return true;
  } else {
    return false;
  }
}
