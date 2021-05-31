import { take } from 'rxjs/operators';
import { NgModule } from '@angular/core';
import { SharedModule, addActionBarItem  } from '@vendure/admin-ui/core';
import { DUPLICATE_PRODUCT } from './duplicator.graphql';

@NgModule({
  imports: [SharedModule],
  providers: [
    addActionBarItem({
       id: 'product-duplication',
       label: 'duplicator.duplicate',
       locationId: 'product-detail',
       buttonStyle: 'outline',
       onClick: (event, context) => {
        context.dataService.mutate(DUPLICATE_PRODUCT, {id: context.route.snapshot.params.id}).pipe(take(1)).subscribe((result: any) => {
          window.open('/admin/catalog/products/' + result.duplicateProduct.id, '_blank');
        });
       },
       requiresPermission: 'SuperAdmin'
    }),
  ],
})
export class DuplicatorModule {

}