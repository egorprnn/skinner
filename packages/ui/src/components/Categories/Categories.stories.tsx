import { useState } from 'react';
import { Icon36Add } from '@vkontakte/icons';
import type { Meta } from '@storybook/react';

import { Categories, type CategoriesProps } from './Categories';
import { createArray, noop } from '@vkontakte/vkjs';

const story: Meta<CategoriesProps> = {
  id: 'Categories',
  component: Categories,
  args: {
    size: '200px',
    segment: 180,
  },
};

export default story;

export const Base = (props: CategoriesProps) => {
  const [category, setCategory] = useState();

  return (
    <Categories {...props}>
      {createArray(12).map((key) => (
        <Categories.Item key={key} onClick={noop}>
          <Icon36Add />
        </Categories.Item>
      ))}
      <Categories {...props}>
        {createArray(12).map((key) => (
          <Categories.Item key={key} onClick={noop}>
            <Icon36Add />
          </Categories.Item>
        ))}
      </Categories>
    </Categories>
  );
};
