import type { Annotation } from '../types/annotation';

export class AnnotationService {
  private static STORAGE_KEY = 'nasa-space-apps-annotations';

  static saveAnnotations(annotations: Annotation[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(annotations));
    } catch (error) {
      console.error('Failed to save annotations:', error);
    }
  }

  static loadAnnotations(): Annotation[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (!stored) return [];
      
      const annotations = JSON.parse(stored);
      // Convert date strings back to Date objects
      return annotations.map((annotation: any) => ({
        ...annotation,
        createdAt: new Date(annotation.createdAt),
        updatedAt: new Date(annotation.updatedAt)
      }));
    } catch (error) {
      console.error('Failed to load annotations:', error);
      return [];
    }
  }

  static addAnnotation(annotation: Omit<Annotation, 'id' | 'createdAt' | 'updatedAt'>): Annotation {
    const newAnnotation: Annotation = {
      ...annotation,
      id: this.generateId(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const annotations = this.loadAnnotations();
    annotations.push(newAnnotation);
    this.saveAnnotations(annotations);

    return newAnnotation;
  }

  static updateAnnotation(id: string, updates: Partial<Annotation>): Annotation | null {
    const annotations = this.loadAnnotations();
    const index = annotations.findIndex(a => a.id === id);
    
    if (index === -1) return null;

    annotations[index] = {
      ...annotations[index],
      ...updates,
      updatedAt: new Date()
    };

    this.saveAnnotations(annotations);
    return annotations[index];
  }

  static deleteAnnotation(id: string): boolean {
    const annotations = this.loadAnnotations();
    const filtered = annotations.filter(a => a.id !== id);
    
    if (filtered.length === annotations.length) return false;

    this.saveAnnotations(filtered);
    return true;
  }

  static getAnnotationsForLayer(layerId: string, date: string): Annotation[] {
    const annotations = this.loadAnnotations();
    return annotations.filter(a => a.layerId === layerId && a.date === date);
  }

  static exportAnnotations(): string {
    const annotations = this.loadAnnotations();
    return JSON.stringify(annotations, null, 2);
  }

  static importAnnotations(jsonData: string): boolean {
    try {
      const annotations = JSON.parse(jsonData);
      if (!Array.isArray(annotations)) return false;

      // Validate annotation structure
      const isValid = annotations.every(annotation => 
        annotation.id && 
        typeof annotation.x === 'number' && 
        typeof annotation.y === 'number' &&
        annotation.title
      );

      if (!isValid) return false;

      this.saveAnnotations(annotations);
      return true;
    } catch (error) {
      console.error('Failed to import annotations:', error);
      return false;
    }
  }

  private static generateId(): string {
    return `annotation_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
