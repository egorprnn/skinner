import i18next from 'i18next';
import { z } from 'zod';
import { getPNGDimensions } from '@skinner/utils';
import { MinecraftTextureVariant } from '@skinner/minecraft-auth';
import { isSupportedSkinSize, SKIN_SUPPORTED_SIZES } from '@skinner/skinviewer/src/utils/isSupportedSkinSize';

const MAX_FILE_SIZE = 1 * 1_024 * 1_024; // 1MB

export const constructorItemSchema = z.object({
  id: z
    .string({
      description: 'ID',
    })
    .min(1)
    .max(64),
  title: z
    .string({
      description: 'Title',
    })
    .min(1)
    .max(64),
  description: z
    .string({
      description: 'Description',
    })
    .min(0)
    .max(256),
  variant: z.enum([MinecraftTextureVariant.CLASSIC, MinecraftTextureVariant.SLIM], {
    description: 'Variant',
  }),
  file: z.custom<Blob>().superRefine(async (blob, context) => {
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
});
