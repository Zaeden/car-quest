// import { writable } from "svelte/store";

// function isLocalStorageAvailable() {
//   try {
//     const testKey = "__svelte_kit_test__";
//     localStorage.setItem(testKey, testKey);
//     localStorage.removeItem(testKey);
//     return true;
//   } catch (error) {
//     return false;
//   }
// }

// const initialLoggedInState = isLocalStorageAvailable()
//   ? localStorage.getItem("isLoggedIn") === "true"
//   : false;

// export const isLoggedIn = writable(initialLoggedInState);

// isLoggedIn.subscribe((value) => {
//   localStorage.setItem("isLoggedIn", value ? "true" : "false");
// });
