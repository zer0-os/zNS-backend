import { Event } from "@netlify/functions/src/function/event";
import { responses } from ".";

export const requirePOSTRequest = (event: Event) => {
  if (event.httpMethod !== "POST") {
    throw Error("Only POST method allowed");
  }
}