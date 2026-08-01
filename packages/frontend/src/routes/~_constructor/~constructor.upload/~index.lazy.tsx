import { z } from 'zod';
import { observer } from 'mobx-react-lite';
import { useBeforeUnload } from 'react-use';
import { Icon16Add } from '@vkontakte/icons';
import { useForm } from '@tanstack/react-form';
import { useTranslation } from 'react-i18next';
import { SkinViewerLazy } from '@skinner/skinviewer';
import { zodValidator } from '@tanstack/zod-form-adapter';
import { createLazyFileRoute, useNavigate } from '@tanstack/react-router';
import { MinecraftTextureVariant } from '@skinner/minecraft-auth';
import { InnerHTML, ModalFooter, DragAndDropInput } from '@skinner/ui';
import {
  Flex,
  Input,
  Button,
  Spacing,
  Tappable,
  Textarea,
  FormItem,
  ViewWidth,
  ButtonGroup,
  Placeholder,
  CustomSelect,
  ModalPageHeader,
  FormLayoutGroup,
  SegmentedControl,
  CustomScrollView,
  CustomSelectOption,
  useAdaptivityWithJSMediaQueries,
} from '@vkontakte/vkui';
import { ConstructorItemCreateSchema } from '@skinner/backend/src/routes/constructor/item/schema/constructor-item-create.schema';

import { ModalPage } from '../../__root/components';

import { ConstructorUploadViewModelProvider, useConstructorUploadViewModelProvider } from './models';

import styles from './index.module.css';

export const ConstructorUploadItem = observer(() => {
  const navigate = useNavigate();
  const { viewWidth } = useAdaptivityWithJSMediaQueries();
  const { t } = useTranslation(['constructor.upload', 'shared.zod', 'shared.db.schema.constructor_item']);

  const model = useConstructorUploadViewModelProvider();

  const form = useForm<z.infer<typeof ConstructorItemCreateSchema>, ReturnType<typeof zodValidator>>({
    onSubmit: ({ value }) => model.upload(value),
    defaultValues: model.formValues,
    validatorAdapter: zodValidator(),
  });
  const isDirty = form.useStore((state) => state.isDirty);
  const variant = form.useStore((state) => state.values.variant);

  const handleClose = () => {
    model.resetFormValue();
  };

  useBeforeUnload(isDirty, t('common:unsaved_changes'));

  return (
    <ModalPage size="m" dynamicContentHeight onClose={handleClose}>
      <CustomScrollView>
        <ModalPageHeader>{t('constructor.upload:header')}</ModalPageHeader>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            event.stopPropagation();

            form.handleSubmit();
          }}
          onChange={() => {
            model.formValues = form.state.values;
          }}
        >
          <form.Field
            name="file"
            validators={{
              onChangeAsync: ConstructorItemCreateSchema._def.schema.shape.file,
            }}
          >
            {(field) => {
              const hasErrors = Boolean(field.state.meta.errors.length);
              const hasValidPreview = Boolean(
                !hasErrors &&
                  (!field.state.meta.isValidating || field.form.state.isSubmitting) &&
                  field.state.value.size,
              );

              return (
                <FormItem status={hasErrors ? 'error' : 'default'}>
                  <Flex
                    align={viewWidth > ViewWidth.MOBILE ? 'stretch' : 'center'}
                    direction={viewWidth > ViewWidth.MOBILE ? 'row' : 'column'}
                    noWrap
                  >
                    <SkinViewerLazy
                      width={250}
                      height={270}
                      model={variant}
                      skin={(hasValidPreview && field.state.value) || undefined}
                      enableRotate
                    />
                    <Flex.Item alignSelf="stretch" flex="grow" flexBasis={0}>
                      <Flex className={styles.fileInput} direction="column" noWrap>
                        <DragAndDropInput
                          className={styles.fileInput}
                          accept={['png']}
                          onChange={([file]) => {
                            if (!file) {
                              return;
                            }

                            field.handleChange(file);
                          }}
                          stretched
                          enableInteractive
                        >
                          <Placeholder
                            title={
                              (hasValidPreview && field.state.value?.name) || t('constructor.upload:file_input_title')
                            }
                            stretched={viewWidth > ViewWidth.MOBILE}
                          >
                            <InnerHTML>
                              {String(field.state.meta.errors) || t('constructor.upload:file_input_description')}
                            </InnerHTML>
                          </Placeholder>
                        </DragAndDropInput>

                        <Spacing size="m" />

                        <form.Field name="variant">
                          {(field) => (
                            <FormItem top={t('constructor.upload:variant_input_variant')} noPadding>
                              <SegmentedControl
                                size="m"
                                value={field.state.value}
                                onChange={(value) => field.handleChange(value as MinecraftTextureVariant)}
                                options={Object.values(MinecraftTextureVariant).map((variant) => ({
                                  value: variant,
                                  label: t(`common:skin_texture_variant_${variant.toLowerCase()}`),
                                }))}
                              />
                            </FormItem>
                          )}
                        </form.Field>
                      </Flex>
                    </Flex.Item>
                  </Flex>
                </FormItem>
              );
            }}
          </form.Field>

          <form.Field
            name="title"
            validators={{
              onChange: ConstructorItemCreateSchema._def.schema.shape.title,
            }}
          >
            {(field) => (
              <FormItem
                top={t('constructor.upload:title_input_title')}
                bottom={String(field.state.meta.errors) || undefined}
                status={field.state.meta.errors.length ? 'error' : 'default'}
                required
              >
                <Input
                  value={field.state.value}
                  minLength={ConstructorItemCreateSchema._def.schema.shape.title.minLength!}
                  maxLength={ConstructorItemCreateSchema._def.schema.shape.title.maxLength!}
                  onChange={({ target: { value } }) => field.handleChange(value)}
                />
              </FormItem>
            )}
          </form.Field>

          <form.Field
            name="description"
            validators={{
              onChange: ConstructorItemCreateSchema._def.schema.shape.description,
            }}
          >
            {(field) => (
              <FormItem top={t('constructor.upload:description_input_title')}>
                <Textarea
                  value={field.state.value}
                  maxLength={ConstructorItemCreateSchema._def.schema.shape.description.maxLength!}
                  onChange={({ target: { value } }) => field.handleChange(value)}
                />
              </FormItem>
            )}
          </form.Field>

          <FormLayoutGroup mode="horizontal">
            <form.Field
              name="category"
              validators={{
                onChange: ConstructorItemCreateSchema._def.schema.shape.category,
              }}
            >
              {(field) => (
                <FormItem
                  top={t('constructor.upload:category_input_title')}
                  status={field.state.meta.errors.length ? 'error' : 'default'}
                  required
                >
                  <CustomSelect<(typeof model.categoriesOptions)[number]>
                    value={field.state.value}
                    searchable={!field.state.value}
                    options={model.categoriesOptions}
                    fetching={!model.hasCategoriesOptions}
                    renderOption={({ option: { label }, ...restProps }) => (
                      <CustomSelectOption {...restProps}>{label}</CustomSelectOption>
                    )}
                    forceDropdownPortal={false}
                    onChange={({ target: { value } }) => field.handleChange(value)}
                    before={
                      <Tappable
                        hoverMode="opacity"
                        activeMode="opacity"
                        onClick={(event) => {
                          event.stopPropagation();

                          navigate({
                            to: '/constructor/category_create',
                          });
                        }}
                      >
                        <Icon16Add />
                      </Tappable>
                    }
                    allowClearButton
                  />
                </FormItem>
              )}
            </form.Field>
          </FormLayoutGroup>

          <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
            {([canSubmit, isSubmitting]) => (
              <ModalFooter>
                <ButtonGroup>
                  <Button type="submit" loading={isSubmitting} disabled={!canSubmit}>
                    {t('constructor.upload:save')}
                  </Button>
                </ButtonGroup>
              </ModalFooter>
            )}
          </form.Subscribe>
        </form>
      </CustomScrollView>
    </ModalPage>
  );
});
ConstructorUploadItem.displayName = 'ConstructorUploadItem';

export const Route = createLazyFileRoute('/_constructor/constructor/upload/')({
  component: () => (
    <ConstructorUploadViewModelProvider>
      <ConstructorUploadItem />
    </ConstructorUploadViewModelProvider>
  ),
  pendingComponent: () => <></>,
});
