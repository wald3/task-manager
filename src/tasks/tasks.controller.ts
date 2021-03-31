import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards, ValidationPipe } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskFilterDto } from './dto/task-filter.dto';
import { TaskStatusValidation } from './pipes/task-status-validation.pipe';
import { TaskStatus } from './enums/task-status.enum';
import { Task } from './entities/task.entity';
import { TasksService } from './tasks.service';
import { AuthGuard } from '@nestjs/passport';
import { ReqUser } from 'src/auth/decorators/get-user.decorator';
import { User } from 'src/auth/entities/user.entity';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
    constructor(private tasksService: TasksService) {}

    @Get()
    getAllTasks(
        @Query(ValidationPipe) filterDto: TaskFilterDto,
        @ReqUser() user: User,
    ): Promise<Task[]> {
        return this.tasksService.getTasks(user, filterDto);
    }

    @Get('/:id')
    getTaskById(
        @ReqUser() user: User,
        @Param('id', ParseIntPipe) id: number,
    ): Promise<Task> {
        return this.tasksService.getTaskById(user, id);
    }

    @Post()
    createTask(
        @ReqUser() user: User,
        @Body(ValidationPipe) createTaskDto: CreateTaskDto,
    ): Promise<Task> {
        return this.tasksService.createTask(user, createTaskDto);
    }

    @Patch('/:id/status')
    updateTaskStatus(
        @ReqUser() user: User,
        @Param('id', ParseIntPipe) id: number,
        @Body('status', TaskStatusValidation) status: TaskStatus,
    ): Promise<Task> {
        return this.tasksService.updateTaskStatus(user, id, status);
    }

    @Delete('/:id')
    deleteTaskById(
        @ReqUser() user: User,
        @Param('id', ParseIntPipe) id: number,
    ): Promise<void> {
        return this.tasksService.deleteTask(user, id);
    }
}
