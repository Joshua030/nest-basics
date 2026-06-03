import { Injectable, NotFoundException } from '@nestjs/common';
import { type Task, TaskStatus } from './task.model';
import { v4 as uuid } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskStatusDto } from './dto/upadate-task-status.dto';
import { GetTaskFilterDto } from './dto/get-tasks-filter.dto';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  getAllTasks(): Task[] {
    return this.tasks;
  }

  getTasksWithFilters(filterDto: GetTaskFilterDto): Task[] {
    const { status, search } = filterDto;
    const normalizedSearch = search?.trim().toLowerCase();

    return this.getAllTasks().filter((task) => {
      if (status && task.status !== status) return false;

      if (
        normalizedSearch &&
        !task.title.toLowerCase().includes(normalizedSearch) &&
        !task.description.toLowerCase().includes(normalizedSearch)
      ) {
        return false;
      }

      return true;
    });
  }

  createTask(createTaskDto: CreateTaskDto): Task {
    const { title, description } = createTaskDto;
    const task: Task = {
      id: uuid(),
      title: title ?? 'Untitled Task',
      description: description ?? '',
      status: TaskStatus.OPEN,
    };

    this.tasks.push(task);

    return task;
  }

  getTaskById(id: string): Task | undefined {
    const found = this.tasks.find((task) => task.id === id);

    if (!found) throw new NotFoundException(`Task with ID ${id} not found`);

    return found;
  }

  deleteTask(id: string): void {
    this.tasks = this.tasks.filter((task) => task.id !== id);
  }

  updateTaskStatus(
    id: string,
    updateTaskStatusDto: UpdateTaskStatusDto,
  ): Task | undefined {
    const task = this.getTaskById(id);
    if (task && updateTaskStatusDto.status) {
      task.status = updateTaskStatusDto.status;
    }
    return task;
  }
}
