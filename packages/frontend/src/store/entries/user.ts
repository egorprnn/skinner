import type { User } from '@skinner/backend';

export class UserContext {
  #user: User;

  constructor(user: User) {
    this.#user = user;
  }

  get activeSkin() {
    this.#user.minecraft_skins.find({});
  }
}
