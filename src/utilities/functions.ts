import { Event } from "@netlify/functions/src/function/event";

export const requirePOSTRequest = (event: Event): void => {
  if (event.httpMethod !== "POST") {
    throw Error("Only POST method allowed");
  }
};
