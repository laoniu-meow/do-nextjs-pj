/* eslint-disable security/detect-object-injection */
import { useMemo } from 'react';

interface ShadowOptions {
  none: string;
  light: string;
  medium: string;
  strong: string;
}

interface ShapeOptions {
  rounded: string;
  circle: string;
  square: string;
}

export const useStyling = () => {
  const shadows: ShadowOptions = useMemo(() => ({
    none: 'none',
    light: '0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.06)',
    medium: '0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.08)',
    strong: '0 10px 15px rgba(0, 0, 0, 0.15), 0 4px 6px rgba(0, 0, 0, 0.1)',
  }), []);

  const shapes: ShapeOptions = useMemo(() => ({
    rounded: 'rounded-lg',
    circle: 'rounded-full',
    square: 'rounded-none',
  }), []);

  const getShadow = (shadowOption: keyof ShadowOptions): string => {
    return shadows[shadowOption] || shadows.light;
  };

  const getShape = (shapeOption: keyof ShapeOptions): string => {
    return shapes[shapeOption] || shapes.rounded;
  };

  return {
    shadows,
    shapes,
    getShadow,
    getShape,
  };
};
