import { EntityRepository, Repository } from "typeorm"
import { CreateTaskDto } from "./dto/create-task.dto";
import { TaskFilterDto } from "./dto/task-filter.dto";
import { TaskStatus } from "./enums/task-status.enum";
import { Task } from "./entities/task.entity";
import { User } from "src/auth/entities/user.entity";

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
    async getTasks(
        user: User,
        filterDto: TaskFilterDto
    ): Promise<Task[]> {
        const { status, search } = filterDto;
        const query = this.createQueryBuilder('task');
        
        query.where('task.userId = :userId', { userId: user.id });
        
        if (status) {
            query.andWhere('task.status = :status', { status });
        }

        if (search) {
            query.andWhere('(task.title LIKE :search OR task.description LIKE :search)', { search: `%${ search }%` });
        }

        const tasks = await query.getMany();
        
        return tasks;
    }

    async createTask(user: User, createTaskDto: CreateTaskDto): Promise<Task> {
        const { title, description } = createTaskDto;
        
        const task = new Task();
        task.title = title;
        task.description = description;
        task.status = TaskStatus.OPEN;
        task.user = user;

        await task.save();
        delete task.user;

        return task;
    }

    async deleteTask(user: User, taskId: number) {
        const query = this.createQueryBuilder('task').delete();

        console.log(`${user.id}[${user.tasks.length}] -  ${taskId}`);

        query.where('task.userId = :userId', { userId: user.id });
        query.andWhere("task.id = :id", { id: taskId });
        const result = await query.execute();

        // const result = await query.delete().where('task.userId = :userId', { userId: user.id }).andWhere("task.id = :id", { id: taskId }).execute();

        console.log('delete result: ', result);
        return result;
    }
}