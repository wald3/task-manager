import { ArgumentMetadata, BadRequestException, PipeTransform } from "@nestjs/common";
import { TaskStatus } from "../enums/task-status.enum";

export class TaskStatusValidation implements PipeTransform {
    readonly allowedSatuses = [
        TaskStatus.OPEN,
        TaskStatus.IN_PROGRESS,
        TaskStatus.DONE,
    ];

    transform(value: any, metadata: ArgumentMetadata) {
        value = value.toUpperCase();
        // console.log('[pipe] status: ' + value);
        if (!this.isValidStatus(value)) {
            throw new BadRequestException(`${value} is an invalid value of Status`);
        }

        return value;
    }

    private isValidStatus(status: any): boolean {
        return this.allowedSatuses.indexOf(status) !== -1;
    }
}
