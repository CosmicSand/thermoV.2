import SensorsResponse from "./login.types";
import StatesForSorting from "./sorting.types";

function sorting(
  sensorsResponses: SensorsResponse,
  statesForSorting: StatesForSorting
) {
  //   const allSensors: NodeListOf<Element> = document.querySelectorAll(
  //     "[data-sensor='true']"
  //   );
  // if (allSensors.length === sensorsResponses) {
  // }
  //   console.log(statesForSorting);

  const ownersNamesArray = Object.keys(sensorsResponses).toSorted((a, b) =>
    a.localeCompare(b)
  );
  for (let ownerName of ownersNamesArray) {
    //   Array of all sensors inluding boilers and gateways
    // const arrayOfAllSensors = Object.keys(sensorsResponses[ownerName]).toSorted(
    //   (a, b) => a.localeCompare(b)
    // );
    //   Array of all sensors excluding boilers and gateways
    // let arrayOfSensors: string[] = [];
    // for (let sensor of arrayOfAllSensors) {
    //   const numberStartPoint = sensor.indexOf("_") + 1;
    //   const number = sensor.slice(numberStartPoint);
    //   if (!number.includes("0")) {
    //     arrayOfSensors.push(number);
    //   }
    // }
    // Array of NodeElements of sensors except boilers and gateways
    if (!statesForSorting[ownerName]) continue;

    const allSensors: NodeListOf<Element> = document.querySelectorAll(
      `[data-sensor=${ownerName}] > [data-sensor='true']`
    );

    //  Condition to run sorting
    // if (arrayOfSensors.length === allSensors.length || allSensors.length === 0)
    //   continue;

    // True array of sensors from NodeElements array
    const trueArrayOfAllSensors = [...allSensors].toSorted((a, b) =>
      a.id.localeCompare(b.id)
    );
    const ownersControlAreaForSensors = document.querySelector(
      `[data-sensor=${ownerName}]`
    ) as HTMLDivElement;

    // Clear the container before appending new elements
    // console.log(ownersControlAreaForSensors);

    // if (!ownersControlAreaForSensors) continue;
    ownersControlAreaForSensors.innerHTML = "";

    // Append each sensor element to the container
    trueArrayOfAllSensors.forEach((el) => {
      const element = el as HTMLDivElement;
      ownersControlAreaForSensors.appendChild(element);
    });
  }

  //   const arrayOfAllSensors = [...allSensors].toSorted((a, b) =>
  //     a.id.localeCompare(b.id)
  //   );
  //   const ownersControlAreaForSensors = document.querySelector(
  //     `[data-sensor=${import.meta.env.VITE_USER}]`
  //   ) as HTMLDivElement;

  // Clear the container before appending new elements
  //   ownersControlAreaForSensors.innerHTML = "";

  //   // Append each sensor element to the container
  //   arrayOfAllSensors.forEach((el) => {
  //     const element = el as HTMLDivElement;
  //     ownersControlAreaForSensors.appendChild(element);
  //   });
}

export default sorting;
