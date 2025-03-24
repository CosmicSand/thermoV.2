import loginToMqtt from "./ts/login";

const loginForm = document.querySelector<HTMLFormElement>(".login-form");
loginForm?.addEventListener("submit", loginToMqtt);
