import { PipeTransform, BadRequestException } from '@nestjs/common';

import { TaskStatus } from '../task-status.enum';

export class TaskStatusValidationPipe implements PipeTransform {
  readonly allowedStatuses: TaskStatus[] = [
    TaskStatus.DONE,
    TaskStatus.IN_PROGRESS,
    TaskStatus.OPEN,
  ];

  transform(value: TaskStatus): TaskStatus {
    const formattedValue = value.toUpperCase() as TaskStatus;

    if (!this.isValidStatus(formattedValue)) {
      throw new BadRequestException(`Invalid value of status ${value}`);
    }

    return value;
  }

  isValidStatus(value: TaskStatus): boolean {
    return this.allowedStatuses.includes(value);
  }
}
