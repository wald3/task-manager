import { Injectable } from '@nestjs/common';
import { TaskStatus } from './enums/task-status.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskFilterDto } from './dto/task-filter.dto';
import { NotFoundException } from '@nestjs/common';
import { TaskRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { User } from 'src/auth/entities/user.entity';

@Injectable()
export class TasksService {
    constructor(
        @InjectRepository(TaskRepository)
        private taskRepository: TaskRepository,
    ) {}

    
    getTasks(user: User, filterDto: TaskFilterDto): Promise<Task[]> {
        return this.taskRepository.getTasks(user, filterDto);
    }

    async getTaskById(user: User, id: number): Promise<Task> {
        let found = await this.taskRepository.findOne({ where: { id, userId: user.id } });
        
        if (!found) {
            throw new NotFoundException(`Task with Id: ${id} not found!`);
        }

        return found;
    }

    async createTask(user: User, createTaskDto: CreateTaskDto): Promise<Task> {
        return this.taskRepository.createTask(user, createTaskDto);
    }

    async updateTaskStatus(user: User, id: number, status: TaskStatus): Promise<Task>  {
        const task = await this.getTaskById(user, id);
        task.status = status;
        await task.save();

        return task;
    }

    async deleteTask(user: User, id: number): Promise<void> {
        const result = await this.taskRepository.deleteTask(user, id);

        // affected is not defined in sqlite driver 
        // if (result.affected === 0) { }
        // if (result.raw.length === 0) {
        //     throw new NotFoundException(`Task with Id: ${id} not found!`);
        // }
    }
}
