import { Vector3 } from 'three';
import { PlayerAnimation, PlayerObject } from 'skinview3d';

import type {
  BedrockAnimationBone,
  BedrockAnimations,
  BedrockAnimationTransformingEntity,
  BedrockBaseAnimation,
} from './types';

export class BedrockAnimation extends PlayerAnimation {
  private readonly animation: BedrockBaseAnimation;

  constructor(animations: string | BedrockAnimations) {
    super();

    if (typeof animations === 'string') {
      animations = JSON.parse(animations) as BedrockAnimations;
    }

    this.animation = Object.values(animations.animations)[0];
  }

  protected animate(player: PlayerObject) {
    const reset = this.progress > this.animation.animation_length;

    if (reset) {
      this.progress = 0;
    }

    for (const [bone, timeState] of Object.entries(this.animation.bones)) {
      for (const [transformingEntity, state] of Object.entries(timeState)) {
        const stateKeys = Object.keys(state).sort((a, b) => parseFloat(a) - parseFloat(b));

        if (!stateKeys.length) {
          continue;
        }

        let currentStateKey = stateKeys[0];
        let nextStateKey = stateKeys[stateKeys.length - 1];

        for (const stateKey of stateKeys) {
          if (this.progress < parseFloat(stateKey)) {
            nextStateKey = stateKey;
            break;
          }

          currentStateKey = stateKey;
        }

        // @ts-ignore todo обработка number
        const currentFrame = state[currentStateKey];
        // @ts-ignore todo обработка number
        const nextFrame = state[nextStateKey];

        const currentStateProgress =
          currentStateKey !== nextStateKey
            ? (this.progress - parseFloat(currentStateKey)) / (parseFloat(nextStateKey) - parseFloat(currentStateKey))
            : 0;

        let currentVectorPost = new Vector3(...(currentFrame?.post || currentFrame));
        let nextVectorPost = new Vector3(...(nextFrame?.post || nextFrame));

        if (transformingEntity === 'rotation') {
          switch (bone) {
            case 'head':
              currentVectorPost.setY(-currentVectorPost.y);
              nextVectorPost.setY(-nextVectorPost.y);

              currentVectorPost.setZ(-currentVectorPost.z);
              nextVectorPost.setZ(-nextVectorPost.z);
              break;
            case 'leftArm':
            case 'rightArm':
              currentVectorPost.setZ(-currentVectorPost.z);
              nextVectorPost.setZ(-nextVectorPost.z);
              break;
            case 'leftLeg':
            case 'rightLeg':
              currentVectorPost.setY(-currentVectorPost.y);
              nextVectorPost.setY(-nextVectorPost.y);
              break;
          }

          currentVectorPost = currentVectorPost.multiplyScalar(Math.PI / 180);
          nextVectorPost = nextVectorPost.multiplyScalar(Math.PI / 180);
        }

        if (transformingEntity === 'position') {
          switch (bone) {
            case 'body':
              currentVectorPost.setZ(currentVectorPost.z / 2);
              nextVectorPost.setZ(nextVectorPost.z / 2);
              break;
            case 'leftArm':
            case 'rightArm':
              currentVectorPost.setY(currentVectorPost.y / 2);
              nextVectorPost.setY(nextVectorPost.y / 2);
              break;
          }
        }

        let x = 0;
        let y = 0;
        let z = 0;

        const lerpMode = nextFrame?.lerp_mode;

        switch (lerpMode) {
          case 'catmullrom': {
            const vector = this.interpolateCatmullRom(
              currentVectorPost,
              currentVectorPost,
              nextVectorPost,
              nextVectorPost,
              currentStateProgress,
            );

            x = vector.x;
            y = vector.y;
            z = vector.z;
            break;
          }
          case 'bezier':
            // Обработка для режима 'bezier', если нужно
            break;
          default: {
            const vector = currentVectorPost.lerp(nextVectorPost, currentStateProgress);

            x = vector.x;
            y = vector.y;
            z = vector.z;
            break;
          }
        }

        if (Number.isNaN(x)) {
          x = 0;
        }

        if (Number.isNaN(y)) {
          y = 0;
        }

        if (Number.isNaN(z)) {
          z = 0;
        }

        if (transformingEntity === 'position') {
          switch (bone) {
            case 'head':
              z = -z;
              break;
            case 'body':
              y -= 6;
              z = -z;
              break;
            case 'leftArm':
              x += 5;
              y -= 2;
              z = -z;
              break;
            case 'rightArm':
              x -= 5;
              y -= 2;
              z = -z;
              break;
            case 'leftLeg':
              x += 2;
              y -= 12;
              z = -z;
              break;
            case 'rightLeg':
              x -= 2;
              y -= 12;
              z = -z;
              break;
          }
        }

        // Устанавливаем новое положение или вращение кости игрока
        player.skin[bone as BedrockAnimationBone][transformingEntity as BedrockAnimationTransformingEntity].set(
          x,
          y,
          z,
        );
      }
    }
  }

  private interpolateCatmullRom(p0: Vector3, p1: Vector3, p2: Vector3, p3: Vector3, t: number): Vector3 {
    const t2 = t * t;
    const t3 = t2 * t;

    const x =
      0.5 *
      (2 * p1.x +
        (-p0.x + p2.x) * t +
        (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 +
        (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3);

    const y =
      0.5 *
      (2 * p1.y +
        (-p0.y + p2.y) * t +
        (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 +
        (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3);

    const z =
      0.5 *
      (2 * p1.z +
        (-p0.z + p2.z) * t +
        (2 * p0.z - 5 * p1.z + 4 * p2.z - p3.z) * t2 +
        (-p0.z + 3 * p1.z - 3 * p2.z + p3.z) * t3);

    return new Vector3(x, y, z);
  }
}
