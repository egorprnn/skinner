import {
  SkinViewer as SkinViewerBase,
  IdleAnimation,
  WalkingAnimation,
  FlyingAnimation,
  RunningAnimation,
  type SkinViewerOptions,
} from 'skinview3d';
import { MinecraftTextureVariant } from '@skinner/minecraft-auth';
import { useEffect, useRef, type HTMLAttributes, type Ref } from 'react';

import { BedrockAnimation } from '../../utils';

import skinStubAlex from '../../assets/skin_stub_alex.png?url';
import skinStubSteve from '../../assets/skin_stub_steve.png?url';

export const enum Animation {
  IDLE = 'idle',
  WALK = 'walk',
  RUN = 'run',
  FLY = 'fly',
}

const animationTemplates = {
  [Animation.IDLE]: IdleAnimation,
  [Animation.WALK]: WalkingAnimation,
  [Animation.RUN]: RunningAnimation,
  [Animation.FLY]: FlyingAnimation,
} as const;

export interface SkinViewerProps extends HTMLAttributes<HTMLDivElement> {
  getRootRef?: Ref<HTMLDivElement>;
  /**
   * Render element height
   */
  height: SkinViewerOptions['height'];
  /**
   * Render element width
   */
  width: SkinViewerOptions['width'];
  /**
   * Skin source
   */
  skin?: SkinViewerOptions['skin'] | File | Blob;
  /**
   * Skin model
   */
  model?: SkinViewerOptions['model'] | MinecraftTextureVariant | 'classic';
  /**
   * Cape source
   */
  cape?: SkinViewerOptions['cape'];
  /**
   * Allow model render zooming
   */
  enableZoom?: boolean;
  /**
   * Allow model render rotating
   */
  enableRotate?: boolean;
  /**
   * Use pan mode for model render
   */
  enablePan?: boolean;
  /**
   * Current animation name
   */
  animation?: Animation | BedrockAnimation;
  /**
   * Animation speed
   */
  animationSpeed?: number;
  /**
   * Paused status for animation
   */
  paused?: boolean;
}

export function SkinViewer({
  getRootRef,
  skin,
  cape,
  model,
  width,
  height,
  enablePan,
  enableZoom,
  enableRotate,
  animation,
  animationSpeed = 0.5,
  paused,
  style,
  ...restProps
}: SkinViewerProps) {
  switch (model) {
    case 'classic':
    case MinecraftTextureVariant.CLASSIC:
      model = 'default';
      break;
    case MinecraftTextureVariant.SLIM:
      model = 'slim';
      break;
  }

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const viewerRef = useRef<SkinViewerBase>();

  useEffect(() => {
    const viewer = new SkinViewerBase({
      canvas: canvasRef.current!,
      width,
      height,
    });

    viewerRef.current = viewer;

    return () => {
      viewer.dispose();
    };
  }, []);

  const loadSkin = async () => {
    if (!skin) {
      switch (model) {
        case 'slim':
          skin = skinStubAlex;
          break;
        default:
          skin = skinStubSteve;
      }
    }

    if (skin instanceof File || skin instanceof Blob) {
      skin = await createImageBitmap(skin);
    }

    viewerRef?.current?.loadSkin(skin, {
      model: model ?? 'auto-detect',
    });
  };

  useEffect(() => {
    loadSkin();
  }, [skin, model]);

  useEffect(() => {
    if (cape) {
      viewerRef?.current?.loadCape(cape);

      return;
    }

    viewerRef?.current?.resetCape();
  }, [cape]);

  useEffect(() => {
    if (!width || !height) {
      return;
    }

    viewerRef?.current?.setSize(width, height);
  }, [width, height]);

  useEffect(() => {
    const viewer = viewerRef?.current;

    if (!viewer) {
      return;
    }

    viewer.controls.enabled = Boolean(enableRotate) || Boolean(enableZoom) || Boolean(enablePan);
    viewer.controls.enableRotate = Boolean(enableRotate);
    viewer.controls.enableZoom = Boolean(enableZoom);
    viewer.controls.enablePan = Boolean(enablePan);

    const animation = viewer.animation;

    if (animation) {
      animation.speed = animationSpeed;
      animation.paused = Boolean(paused);
    }
  }, [enableZoom, enableRotate, enablePan, animationSpeed, paused]);

  useEffect(() => {
    const viewer = viewerRef?.current;

    if (!viewer) {
      return;
    }

    if (!animation) {
      viewer.animation = null;

      return;
    }

    if (typeof animation === 'string') {
      viewer.animation = new animationTemplates[animation]();
    } else {
      viewer.animation = animation;
    }
  }, [animation]);

  return (
    <div
      ref={getRootRef}
      style={{
        width,
        height,
        ...style,
      }}
      {...restProps}
    >
      <canvas ref={canvasRef} />
    </div>
  );
}

export { skinStubAlex, skinStubSteve };
