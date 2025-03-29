// import { NodeArray } from "typescript";
// import { sensorsResponses } from "./mqtt";
import SensorsResponse from "./login.types";
import { temperatureUpdate } from "./temperature";
import { temperatureAlarm } from "./alarm";
import { timeSinceLastUpd } from "./time";
import { currentBatteryLevelShow, batteryLevel } from "./battery";

// const intObj: { [key: string]: NodeJS.Timeout } = {};
const monitor = document.querySelector<HTMLDivElement>(".monitor");

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
      const idCheckEl = document.getElementById(sensorId);
      const idNumber = sensorId.split("_")[1];
      const arrayOfParameters = sensorsResponses[ownerId][sensorId] as string[];

      // Під індексом 7 - тип облабнання: isBoiler тощо

      const typeOfEquipment = arrayOfParameters[7];
      const temperature = Number(arrayOfParameters[1]).toFixed(1);
      const isSensor = typeOfEquipment === "isSensor";
      const isBoiler = typeOfEquipment === "isBoiler";
      const isGateway = typeOfEquipment === "isGateway";

      // const isSensor = !isBoiler && !isGateway;

      if (!ownersControlArea.contains(idCheckEl) && isSensor) {
        const ownersControlAreaForSensors = document.querySelector(
          `[data-sensor=${ownerId}]`
        ) as HTMLDivElement;

        const sensorElement = `<div class="sensor" data-sensor="true" data-id='${sensorId}' data-name=${idNumber} id='${sensorId}'  data-alarmtime="1"  data-high="60" data-low="15" data-current=${temperature}>
            <p class="parameter"  data-temp='${sensorId}'>${temperature}</p>
            <p class="sensor-name" data-sensor-name>${idNumber}</p>

            <div class="battery" data-id='${sensorId}' data-battery=${batteryLevel(
          arrayOfParameters
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

        const outTemperature = Number(Number(arrayOfParameters[1]).toFixed(1));
        const inTemperature = Number(Number(arrayOfParameters[2]).toFixed(1));
        // !outTemperature.toString().includes("-")
        let delta: string;
        if (outTemperature > 0 && inTemperature > 0) {
          delta = `${(outTemperature - inTemperature).toFixed(1)}`;
        } else {
          delta = "";
        }

        const sensorBoilerElement = `<div class="sensor boiler" id=${sensorId} data-boiler=${sensorId} data-in=${
          inTemperature > 0 ? inTemperature : "-"
        } data-out=${
          outTemperature > 0 ? outTemperature : "-"
        } data-active=${boilerIsActive(
          inTemperature,
          outTemperature
        )} data-alarmtime="180" data-high="80" data-low="15">
                        <p class="parameter"><span class='delta'>&#916;</span>${delta}</p>
                        <p class="parameter" data-time='${sensorId}'>0</p>
            <p class="sensor-name">
              
              Boiler
            </p>

            <div class="battery" data-id='${sensorId}' data-battery=${batteryLevel(
          arrayOfParameters
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
        const accuLevel = Number(Number(sensorParameters[0]).toFixed(1));
        const isGrid = Number(Number(sensorParameters[1]) > 4);

        const sensorGatewayElement = `<div class="padding"><div class="gateway-element" id='${sensorId}' data-accu=${accuLevel} data-grid=${isGrid}>
                        <p class="parameter">${accuLevel}</p>
                        <p class="parameter">${isGrid}</p>
          

            <div class="battery" data-id='${sensorId}' data-battery=${batteryLevel(
          sensorParameters,
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
      temperatureUpdate(sensorId, temperature);
      temperatureAlarm(sensorId, arrayOfParameters);
      currentBatteryLevelShow(sensorId);
      timeSinceLastUpd(sensorId, arrayOfParameters);
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
