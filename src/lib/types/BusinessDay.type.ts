import { WithStringId } from "./WithStringId.type";
import { Day } from "./Day.type";
import { TimeRange } from "./TimeRange.type";

export type BusinessDay = {
  closed: boolean;
  days: Day[];
  timeRanges: WithStringId<TimeRange>[] | TimeRange[];
}
