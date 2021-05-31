import gql from 'graphql-tag';
import { PRODUCT_WITH_VARIANTS_FRAGMENT } from '@vendure/admin-ui/core';

export const DUPLICATE_PRODUCT = gql`
    mutation DuplicateProduct($id: ID!) {
        duplicateProduct(id: $id) {
            ...ProductWithVariants
        }
    }
    ${PRODUCT_WITH_VARIANTS_FRAGMENT}
`;