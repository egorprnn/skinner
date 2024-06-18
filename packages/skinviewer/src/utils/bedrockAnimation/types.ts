export interface BedrockAnimations {
  format_version: string;
  animations: Record<string, BedrockBaseAnimation>;
}

export interface BedrockBaseAnimation {
  animation_length: number;
  bones: Partial<Record<BedrockAnimationBone, BedrockAnimationBoneTimeState>>;
}

export type BedrockAnimationBone = 'head' | 'body' | 'rightArm' | 'leftArm' | 'rightLeg' | 'leftLeg';
export type BedrockAnimationTransformingEntity = 'position' | 'rotation' | 'scale';

type BedrockAnimationBoneTimeState = Partial<
  Record<BedrockAnimationTransformingEntity, BedrockAnimationBoneTimeStateValue>
>;

type BedrockAnimationBoneTimeStateValue = number | Record<string, BedrockAnimationBoneState>;

export type BedrockAnimationLerpMode = 'catmullrom' | 'bezier';
export type BedrockAnimationBoneStateValue = number | [number] | [number, number, number];

type BedrockAnimationBoneState =
  | BedrockAnimationBoneStateValue
  | {
      pre?: BedrockAnimationBoneStateValue;
      post?: BedrockAnimationBoneStateValue;
      lerp_mode?: BedrockAnimationLerpMode;
    };
