export enum AppView {
  MOCKUP = 'MOCKUP',
  EDITOR = 'EDITOR',
  GENERATOR = 'GENERATOR'
}

export interface GeneratedImage {
  url: string;
  prompt: string;
  timestamp: number;
}

export type AspectRatio = '1:1' | '3:4' | '4:3' | '9:16' | '16:9';
