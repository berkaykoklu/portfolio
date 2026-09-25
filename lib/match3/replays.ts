import data from "./replays.json";
import type { Replays } from "./results";

/** Server-only in practice: imported by the project page, never by a client
 *  component, so the replays are not shipped to the browser as a module. */
export const replays = data as unknown as Replays;
