import { HorizontalScroll, Tabs, TabsItem } from '@vkontakte/vkui';

import styles from './SectionsTabs.module.css';

export const SectionsTabs = () => {
  const sections = [
    'dsdds',
    'dsdds',
    'dsdds',
    'dsdds',
    'dsdds',
    'dsdds',
    'dsdds',
    'dsdds',
    'dsdds',
    'dsdds',
    'dsdds',
    'dsdds',
    'dsdds',
    'dsdds',
    'dsdds',
    'dsdds',
    'dsdds',
    'dsdds',
    'dsdds',
    'dsdds',
    'dsdds',
    'dsdds',
    'dsdds',
    'dsdds',
  ];

  return (
    <Tabs
      className={styles.root}
      mode="secondary"
      layoutFillMode="stretched"
      scrollBehaviorToSelectedTab="center"
      withScrollToSelectedTab
    >
      <HorizontalScroll arrowSize="m">
        {sections.map((section, index) => (
          <TabsItem key={section} selected={index === 1} onClick={() => {}}>
            {section}
          </TabsItem>
        ))}
      </HorizontalScroll>
    </Tabs>
  );
};
