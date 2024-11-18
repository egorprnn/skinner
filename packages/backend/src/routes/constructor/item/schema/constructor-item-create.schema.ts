import i18next from 'i18next';
import { z } from 'zod';
import { zfd } from 'zod-form-data';
import { getPNGDimensions } from '@skinner/utils';
import { isSupportedSkinSize, SKIN_SUPPORTED_SIZES } from '@skinner/skinviewer/src/utils/isSupportedSkinSize';

import { ConstructorItemSchema } from './constructor-item.schema';
import { ConstructorCategorySchema } from '../../category/schema/constructor-category.schema';

const MAX_FILE_SIZE = 1 * 1_024 * 1_024; // 1MB

export const ConstructorItemCreateSchema = zfd.formData(
  ConstructorItemSchema.omit({
    id: true,
  }).extend({
    category: ConstructorCategorySchema.shape.id.describe('Item category id'),
    file: zfd.file().superRefine(async (blob, context) => {
      if (!blob?.size) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: i18next.t('shared.db.schema.constructor_item:file_invalid_empty'),
        });

        return z.NEVER;
      }

      if (blob.type !== 'image/png') {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: i18next.t('shared.db.schema.constructor_item:file_invalid_format'),
        });
      }

      if (blob.size > MAX_FILE_SIZE) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: i18next.t('shared.db.schema.constructor_item:file_invalid_size'),
        });
      }

      const dimensions = await getPNGDimensions(await blob.arrayBuffer());

      if (!isSupportedSkinSize(dimensions)) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: i18next.t('shared.db.schema.constructor_item:file_invalid_dimensions', {
            dimensions: String(SKIN_SUPPORTED_SIZES),
          }),
        });
      }

      return z.NEVER;
    }),
  }),
);
