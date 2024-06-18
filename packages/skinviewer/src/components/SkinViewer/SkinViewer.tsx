import {
  SkinViewer as SkinViewerBase,
  IdleAnimation,
  WalkingAnimation,
  FlyingAnimation,
  RunningAnimation,
  type SkinViewerOptions,
} from 'skinview3d';
import { useEffect, useRef, type HTMLAttributes, type Ref } from 'react';

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
  skin: SkinViewerOptions['skin'];
  /**
   * Use slim skin model, auto-detect skin mode by default
   */
  slim?: boolean;
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
  animation?: Animation;
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
  slim,
  cape,
  height,
  width,
  enableZoom,
  enableRotate,
  enablePan,
  animation,
  animationSpeed = 0.5,
  paused,
  style,
  ...restProps
}: SkinViewerProps) {
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

  useEffect(() => {
    if (skin) {
      viewerRef?.current?.loadSkin(skin, {
        model: typeof slim !== 'undefined' ? (slim ? 'slim' : 'default') : 'auto-detect',
      });

      return;
    }

    viewerRef?.current?.resetSkin();
  }, [skin, slim]);

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

    viewer.animation = new animationTemplates[animation]();
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
