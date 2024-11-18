import { z } from 'zod';
import { ModalFooter } from '@skinner/ui';
import { observer } from 'mobx-react-lite';
import { useMaskito } from '@maskito/react';
import { useBeforeUnload } from 'react-use';
import { useForm } from '@tanstack/react-form';
import { useTranslation } from 'react-i18next';
import { zodValidator } from '@tanstack/zod-form-adapter';
import { createLazyFileRoute } from '@tanstack/react-router';
import { maskitoPrefixPostprocessorGenerator } from '@maskito/kit';
import { Button, ButtonGroup, CustomSelect, FormItem, Input, ModalPageHeader } from '@vkontakte/vkui';
import {
  ConstructorCategoryCreateSchema,
  getConstructorCategoryIdMask,
} from '@skinner/backend/src/routes/constructor/category/schema/constructor-category-create.schema';

import { ModalPage } from '../../__root/components';

import { ConstructorCategoryCreateViewModelProvider, useConstructorCategoryCreateViewModelProvider } from './models';

const ConstructorCategoryCreate = observer(() => {
  const { t } = useTranslation(['common', 'constructor.category_create']);

  const model = useConstructorCategoryCreateViewModelProvider();

  const form = useForm<z.infer<typeof ConstructorCategoryCreateSchema>, ReturnType<typeof zodValidator>>({
    onSubmit: ({ value }) => model.create(value),
    defaultValues: {
      id: '',
    },
    validators: {
      onChange: ConstructorCategoryCreateSchema,
    },
    validatorAdapter: zodValidator(),
  });
  const parent = form.useStore((state) => state.values.parent);
  const isDirty = form.useStore((state) => state.isDirty);

  const inputRef = useMaskito({
    options: {
      mask: getConstructorCategoryIdMask(parent),
      postprocessors: [maskitoPrefixPostprocessorGenerator(parent ?? '')],
    },
  });

  useBeforeUnload(isDirty, t('common:unsaved_changes'));

  return (
    <ModalPage size="m" dynamicContentHeight>
      <ModalPageHeader>{t('constructor.category_create:header')}</ModalPageHeader>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          event.stopPropagation();

          form.handleSubmit();
        }}
      >
        <form.Field
          name="parent"
          validators={{
            onChange: ConstructorCategoryCreateSchema._def.schema.shape.parent,
          }}
        >
          {(field) => (
            <FormItem
              top={t('constructor.category_create:parent_input_title')}
              bottom={t('constructor.category_create:parent_input_description')}
            >
              <CustomSelect
                value={field.state.value}
                options={model.parentCategoriesOptions}
                fetching={!model.hasParentCategoriesOptions}
                onChange={({ target }) => {
                  const value = target.value || undefined;

                  field.handleChange(value);

                  if (value) {
                    field.form.setFieldValue('id', value);
                  }
                }}
                searchable
                allowClearButton
              />
            </FormItem>
          )}
        </form.Field>
        <form.Field
          name="id"
          validators={{
            onChange: ConstructorCategoryCreateSchema._def.schema.shape.id,
          }}
        >
          {(field) => (
            <FormItem top={t('constructor.category_create:id_input_title')} required>
              <Input
                getRef={inputRef}
                value={field.state.value}
                minLength={ConstructorCategoryCreateSchema._def.schema.shape.id.minLength!}
                maxLength={ConstructorCategoryCreateSchema._def.schema.shape.id.maxLength!}
                onInput={({ target: { value } }) => field.handleChange(value)}
              />
            </FormItem>
          )}
        </form.Field>
        <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
          {([canSubmit, isSubmitting]) => (
            <ModalFooter>
              <ButtonGroup>
                <Button type="submit" loading={isSubmitting} disabled={!canSubmit}>
                  {t('constructor.category_create:save')}
                </Button>
              </ButtonGroup>
            </ModalFooter>
          )}
        </form.Subscribe>
      </form>
    </ModalPage>
  );
});
ConstructorCategoryCreate.displayName = 'ConstructorCategoryCreate';

export const Route = createLazyFileRoute('/_constructor/constructor/category_create/')({
  component: () => (
    <ConstructorCategoryCreateViewModelProvider>
      <ConstructorCategoryCreate />
    </ConstructorCategoryCreateViewModelProvider>
  ),
});
