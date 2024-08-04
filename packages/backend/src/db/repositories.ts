import { dataSource } from './dataSource';

import { MinecraftCape, MinecraftSkin, User } from './entities';

export const userRepository = dataSource.getRepository(User);
export const minecraftSkinRepository = dataSource.getRepository(MinecraftSkin);
export const minecraftCapeRepository = dataSource.getRepository(MinecraftCape);

// @ts-expect-error
global.dataSource = dataSource;
// @ts-expect-error
global.userRepository = userRepository;
// @ts-expect-error
global.minecraftSkinRepository = minecraftSkinRepository;
// @ts-expect-error
global.minecraftCapeRepository = minecraftCapeRepository;
