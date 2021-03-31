import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const ReqUser = createParamDecorator(
    (date: unknown, ctx: ExecutionContext) => {
        return ctx.switchToHttp().getRequest().user;
});