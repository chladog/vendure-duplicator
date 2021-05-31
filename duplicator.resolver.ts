import { DuplicatorService } from './duplicator.service';
import { Resolver, Args, Mutation } from '@nestjs/graphql';
import { Ctx, RequestContext, Transaction, Product, ID } from '@vendure/core';

@Resolver('Duplicator')
export class DuplicatorResolver {
    constructor(private duplicatorService: DuplicatorService) {}

    @Transaction()
    @Mutation()
    async duplicateProduct(@Ctx() ctx: RequestContext, @Args() args: { id: ID }): Promise<Product> {
        return this.duplicatorService.duplicate(ctx, args.id);
    }
}
