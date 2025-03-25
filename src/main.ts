// import loginToMqtt from "./ts/login";

// const loginForm = document.querySelector<HTMLFormElement>(".login-form");
// loginForm?.addEventListener("submit", loginToMqtt);

import fetch from "./ts/login";
fetch(import.meta.env.VITE_USERNAME, import.meta.env.VITE_PASSWORD);
