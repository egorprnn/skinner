import { createLazyFileRoute } from '@tanstack/react-router';

import { Panel } from './__root/components';

const Index = () => <Panel>test</Panel>;

export const Route = createLazyFileRoute('/')({
  component: Index,
});
