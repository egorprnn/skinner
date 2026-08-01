import { ForbiddenException } from '@nestjs/common';

export class AuthMinecraftSyncException extends ForbiddenException {
  constructor() {
    super({
      error: 'minecraft_sync',
      message:
        'Minecraft account information is unavailable, probably because the Microsoft account does not have a Minecraft license',
    });
  }
}
