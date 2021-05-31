import gql from 'graphql-tag';
import { HttpModule } from '@nestjs/common';
import { PluginCommonModule, VendurePlugin } from '@vendure/core';
import { DuplicatorResolver } from './duplicator.resolver';
import { DuplicatorService } from './duplicator.service';

const schemaExtension = gql`
    extend type Mutation {
        duplicateProduct(id: ID!): Product!
    }
`;

@VendurePlugin({
    entities: [],
    imports: [PluginCommonModule, HttpModule],
    providers: [DuplicatorService],
    adminApiExtensions: {
        schema: schemaExtension,
        resolvers: [DuplicatorResolver],
    },
})
export class DuplicatorPlugin {
    constructor() {}
}
