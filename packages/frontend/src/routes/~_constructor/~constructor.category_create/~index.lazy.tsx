import { observer } from 'mobx-react-lite';
import { createLazyFileRoute } from '@tanstack/react-router';

import { ModalPage } from '../../~__root/components';

const ConstructorCategoryCreate = observer(() => <ModalPage size="m" dynamicContentHeight></ModalPage>);
ConstructorCategoryCreate.displayName = 'ConstructorCategoryCreate';

export const Route = createLazyFileRoute('/_constructor/constructor/category_create/')({
  component: () => (
    <>
      <ConstructorCategoryCreate />
    </>
  ),
});
