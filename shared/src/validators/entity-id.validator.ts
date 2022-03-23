import { IsInt, IsNotEmpty, IsOptional, Min } from 'class-validator';
import { ComposeValidators } from './compose.validator';

export const EntityID = ComposeValidators(IsOptional(), IsInt(), Min(0));
export const EntityIDRequired = ComposeValidators(IsNotEmpty(), IsInt(), Min(0));
