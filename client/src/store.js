import { writable } from "svelte/store";
import { browser } from "$app/environment";

export const isLoggedIn = writable(
  (browser && localStorage.getItem("isLoggedIn")) || false
);

isLoggedIn.subscribe((value) => {
  if (browser) {
    localStorage.setItem("isLoggedIn", value ? "true" : "false");
  }
});
