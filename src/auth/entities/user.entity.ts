import { Task } from "src/tasks/entities/task.entity";
import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity()
@Unique(['username'])
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username: string;

    @Column()
    password: string;

    @Column({ type: 'datetime' })
    registration_date: number = Date.now();

    @OneToMany(() => Task, task => task.user, { eager: true })
    tasks: Task[];
}