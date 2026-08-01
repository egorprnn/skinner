import { observer } from 'mobx-react-lite';
import { Icon20Add } from '@vkontakte/icons';
import { useNavigate } from '@tanstack/react-router';
import { createArray, getRandomInt } from '@vkontakte/vkjs';
import { HorizontalScroll, Skeleton, Tabs, TabsItem } from '@vkontakte/vkui';

import { useSession } from '../../../../../models';
import { useConstructorServiceProvider } from '../../../models';

import styles from './SectionsTabs.module.css';

export const SectionsTabs = observer(() => {
  const session = useSession();
  const model = useConstructorServiceProvider();
  const navigate = useNavigate();

  return (
    <>
      <Tabs
        className={styles.root}
        mode="secondary"
        layoutFillMode="shrinked"
        scrollBehaviorToSelectedTab="center"
        withScrollToSelectedTab
      >
        <HorizontalScroll arrowSize="m" showArrows={model.hasCategories}>
          {session.authed && (
            <TabsItem
              onClick={() =>
                navigate({
                  to: '/constructor/upload',
                })
              }
            >
              <Icon20Add />
            </TabsItem>
          )}
          {model.categories?.map(({ id }, index) => (
            <TabsItem key={id} selected={index === model.activeCategoryIndex} onClick={() => model.selectCategory(id)}>
              {id}
            </TabsItem>
          )) ??
            createArray(10).map((key) => (
              <TabsItem key={key}>
                <Skeleton width={getRandomInt(50, 80)} />
              </TabsItem>
            ))}
        </HorizontalScroll>
      </Tabs>
      {model.activeCategoryHasChildren && (
        <Tabs
          className={styles.root}
          mode="secondary"
          layoutFillMode="shrinked"
          scrollBehaviorToSelectedTab="center"
          withScrollToSelectedTab
        >
          <HorizontalScroll arrowSize="m">
            {model.activeCategoryChildren?.map(({ id }, index) => (
              <TabsItem
                key={id}
                className={styles.children}
                selected={index === model.activeCategoryChildrenIndex}
                onClick={() => model.selectCategory(id)}
              >
                {id}
              </TabsItem>
            ))}
          </HorizontalScroll>
        </Tabs>
      )}
    </>
  );
});
SectionsTabs.displayName = 'SectionsTabs';
