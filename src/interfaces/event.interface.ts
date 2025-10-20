import { StatusCard, Duration, PriorityStatus, TimeZone } from "@prisma/client";

export interface EventUpdate {
  title?: string;
  notes?: string;
  date?: string | Date;
  status?: StatusCard;
  estimatedTime?: Duration;
  priority?: PriorityStatus;
  timezone?: TimeZone;
  availableTimes?: Date[];
  matchedTimes?: Date[];
  selectedTime?: Date;
  participants?: {
    name: string;
    email?: string | null;
  }[];
}
