import { ImageBase } from '@skinner/ui';
import { useTranslation } from 'react-i18next';
import { createFileRoute } from '@tanstack/react-router';
import { Button, Div, Group, Placeholder } from '@vkontakte/vkui';

import { Panel } from './~__root/components';

import image404 from '../../assets/404.png?format=webp';

const NotFound = () => {
  const { t } = useTranslation();

  return (
    <Panel centered>
      <Group>
        <Div>
          <Placeholder
            icon={<ImageBase size={150} src={image404} objectFit="contain" withTransparentBackground noBorder />}
            header={t('common:not_found_title')}
            action={
              <Button size="m" mode="tertiary">
                {t('common:not_found_go_back')}
              </Button>
            }
            stretched
          >
            {t('common:not_found_description')}
          </Placeholder>
        </Div>
      </Group>
    </Panel>
  );
};

export const Route = createFileRoute('/*')({
  component: NotFound,
});
