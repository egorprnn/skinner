import { z } from 'zod';
import { useBeforeUnload } from 'react-use';
import { useForm } from '@tanstack/react-form';
import { useTranslation } from 'react-i18next';
import { SkinViewerLazy } from '@skinner/skinviewer';
import { zodValidator } from '@tanstack/zod-form-adapter';
import { createLazyFileRoute } from '@tanstack/react-router';
import { MinecraftTextureVariant } from '@skinner/minecraft-auth';
import { InnerHTML, ModalFooter, DragAndDropInput } from '@skinner/ui';
import { constructorCreateSchema } from '@skinner/backend/schema/constructor/create';
import {
  Flex,
  Input,
  Button,
  Spacing,
  Textarea,
  FormItem,
  ViewWidth,
  ButtonGroup,
  Placeholder,
  ModalPageHeader,
  SegmentedControl,
  CustomScrollView,
  useAdaptivityWithJSMediaQueries,
} from '@vkontakte/vkui';

import { ModalPage } from '../../~__root/components';

import { ConstructorUploadItemViewModelProvider } from './models';

import styles from './index.module.css';

export const ConstructorUploadItem = () => {
  const { viewWidth } = useAdaptivityWithJSMediaQueries();
  const { t } = useTranslation(['constructor.upload_item', 'shared.zod', 'shared.db.schema.constructor_item']);

  const form = useForm<z.infer<typeof constructorCreateSchema>, ReturnType<typeof zodValidator>>({
    onSubmit: async ({ value }) => {
      // Do something with form data
      console.log(value, 3242343);
    },
    defaultValues: {
      title: '',
      description: '',
      variant: MinecraftTextureVariant.CLASSIC,
    },
    validatorAdapter: zodValidator(),
  });

  const isTouched = form.useStore((state) => state.isTouched);
  const variant = form.useStore((state) => state.values.variant);

  useBeforeUnload(isTouched, t('common:unsaved_changed'));

  return (
    <ModalPage size="m" dynamicContentHeight>
      <CustomScrollView autoHideScrollbar>
        <ModalPageHeader>{t('constructor.upload_item:header')}</ModalPageHeader>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            event.stopPropagation();

            form.handleSubmit();
          }}
        >
          <form.Field
            name="file"
            validators={{
              onChangeAsync: constructorCreateSchema.shape.file,
            }}
          >
            {(field) => {
              const hasErrors = Boolean(field.state.meta.errors.length);
              const hasValidPreview = Boolean(!hasErrors && !field.state.meta.isValidating && field.state.value);

              return (
                <FormItem status={hasErrors ? 'error' : 'default'}>
                  <Flex
                    align={viewWidth > ViewWidth.MOBILE ? 'stretch' : 'center'}
                    direction={viewWidth > ViewWidth.MOBILE ? 'row' : 'column'}
                    noWrap
                  >
                    <SkinViewerLazy
                      width={250}
                      height={300}
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
                            header={
                              (hasValidPreview && field.state.value?.name) ||
                              t('constructor.upload_item:file_input_title')
                            }
                            stretched={viewWidth > ViewWidth.MOBILE}
                          >
                            <InnerHTML>
                              {String(field.state.meta.errors) || t('constructor.upload_item:file_input_description')}
                            </InnerHTML>
                          </Placeholder>
                        </DragAndDropInput>

                        <Spacing size="m" />

                        <form.Field name="variant">
                          {(field) => (
                            <FormItem top={t('constructor.upload_item:variant_input_variant')} noPadding>
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
              onChange: constructorCreateSchema.shape.title,
            }}
          >
            {(field) => (
              <FormItem
                top={t('constructor.upload_item:title_input_title')}
                bottom={String(field.state.meta.errors) || undefined}
                status={field.state.meta.errors.length ? 'error' : 'default'}
                required
              >
                <Input
                  value={field.state.value}
                  minLength={constructorCreateSchema.shape.title.minLength!}
                  maxLength={constructorCreateSchema.shape.title.maxLength!}
                  onChange={({ target: { value } }) => field.handleChange(value)}
                />
              </FormItem>
            )}
          </form.Field>

          <form.Field
            name="description"
            validators={{
              onChange: constructorCreateSchema.shape.description,
            }}
          >
            {(field) => (
              <FormItem top={t('constructor.upload_item:description_input_title')}>
                <Textarea
                  value={field.state.value}
                  maxLength={constructorCreateSchema.shape.description.maxLength!}
                  onChange={({ target: { value } }) => field.handleChange(value)}
                />
              </FormItem>
            )}
          </form.Field>

          <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
            {([canSubmit, isSubmitting]) => (
              <ModalFooter>
                <ButtonGroup>
                  <Button type="submit" loading={isSubmitting} disabled={!canSubmit}>
                    {t('constructor.upload_item:save')}
                  </Button>
                </ButtonGroup>
              </ModalFooter>
            )}
          </form.Subscribe>
        </form>
      </CustomScrollView>
    </ModalPage>
  );
};

export const Route = createLazyFileRoute('/_constructor/constructor/upload/')({
  component: () => (
    <ConstructorUploadItemViewModelProvider>
      <ConstructorUploadItem />
    </ConstructorUploadItemViewModelProvider>
  ),
});
