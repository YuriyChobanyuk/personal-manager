import { TaskStatus } from '../task-status.enum';

export class GetTaskFilterDTO {
  status: TaskStatus;
  search: string;
}
