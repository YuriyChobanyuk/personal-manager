import { GetTaskFilterDTO } from './DTO/get-tasks-filter.dto';
import { CreateTaskDTO } from './DTO/create-task.dto';
import { Repository, EntityRepository } from 'typeorm';
import Task from './task.entity';
import { TaskStatus } from './task-status.enum';
import { User } from '../auth/user.entity';

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
  async createTask(createTaskDto: CreateTaskDTO, user: User): Promise<Task> {
    const { description, title } = createTaskDto;

    const task = new Task();
    task.title = title;
    task.description = description;
    task.status = TaskStatus.OPEN;
    task.user = user;

    await task.save();

    delete task.user;

    return task;
  }

  async getTasks(filterDto: GetTaskFilterDTO, user: User): Promise<Task[]> {
    const { search, status } = filterDto;

    const query = this.createQueryBuilder('task').where('task.userId = :userId', {
      userId: user.id,
    });

    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    if (search) {
      query.andWhere('task.title LIKE :search OR task.description LIKE :search', {
        search: `%${search}%`,
      });
    }

    const tasks = await query.getMany();

    return tasks;
  }
}
