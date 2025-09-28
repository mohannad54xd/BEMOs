export interface Annotation {
  id: string;
  x: number;
  y: number;
  title: string;
  description: string;
  type: 'point' | 'area' | 'line';
  color: string;
  createdAt: Date;
  updatedAt: Date;
  layerId: string;
  date: string;
}

export interface AnnotationPoint {
  x: number;
  y: number;
}

export interface AnnotationArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface AnnotationLine {
  points: AnnotationPoint[];
}

export type AnnotationShape = AnnotationPoint | AnnotationArea | AnnotationLine;
