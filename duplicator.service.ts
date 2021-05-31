import { Injectable } from '@angular/core';
import { RequestContext, TransactionalConnection, Product, ID, EntityNotFoundError, ProductVariantService, ProductService } from '@vendure/core';

@Injectable()
export class DuplicatorService {
    private readonly relations = ['featuredAsset', 'assets', 'channels', 'facetValues', 'facetValues.facet'];
    constructor(
        private connection: TransactionalConnection,
        private productVariantsSvc: ProductVariantService,
        private productSvc: ProductService
        ) {}

    async duplicate(ctx: RequestContext, productId: ID) {
        const product = await this.connection.getRepository(Product).findOne( productId, { relations: this.relations } );
        const productVariants = (await this.productVariantsSvc.getVariantsByProductId(ctx, productId)).items;
        if (!product) {
            throw new EntityNotFoundError('Product', productId);
        }
        const translations = product.translations.map(translation => {
            return {
                name: translation.name + ' Copy',
                slug: translation.slug + '-copy',
                description: translation.description,
                languageCode: translation.languageCode,
                customFields: translation.customFields
            }
        });
        const candidateProduct = {
            featuredAssetId: product.featuredAsset.id,
            enabled: false,
            assetIds: product.assets.map(value => value.assetId),
            facetValueIds: product.facetValues.map(value => value.id),
            translations: translations,
            customFields: product.customFields
        }
        const duplicatedProduct = await this.productSvc.create(ctx, candidateProduct);
        const duplicatedProductVariants = await this.productVariantsSvc.create(ctx, productVariants.map((variant, i) => {
            return {
                productId: duplicatedProduct.id,
                price: variant.price,
                sku: variant.sku + '-' + i,
                stockOnHand: variant.stockOnHand,
                translations: variant.translations.map(translation => {
                    return {
                        languageCode: translation.languageCode,
                        name: translation.name + ' Copy'
                    };
                }),
                optionIds: []
            }
        }));
        duplicatedProduct.variants = duplicatedProductVariants;
        return duplicatedProduct;
    }
}
