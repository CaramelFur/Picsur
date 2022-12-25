import { z } from 'zod';

export enum TrackingState {
  Disabled = 'disabled',
  Normal = 'normal',
  Detailed = 'detailed',
}

export const TrackingStateSchema = z.nativeEnum(TrackingState);
