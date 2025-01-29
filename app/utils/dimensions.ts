import { Dimensions, PixelRatio } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Base dimensions that we use for scaling (based on a standard device)
const baseWidth = 375;
const baseHeight = 812;

// Scaling factors
const widthScale = SCREEN_WIDTH / baseWidth;
const heightScale = SCREEN_HEIGHT / baseHeight;

export const scale = (size: number): number => {
  return PixelRatio.roundToNearestPixel(size * widthScale);
};

export const verticalScale = (size: number): number => {
  return PixelRatio.roundToNearestPixel(size * heightScale);
};

// For elements that should scale moderately (like text)
export const moderateScale = (size: number, factor = 0.5): number => {
  return PixelRatio.roundToNearestPixel(size + (scale(size) - size) * factor);
};

// For padding and margins
export const spacing = {
  xs: scale(4),
  sm: scale(8),
  md: scale(16),
  lg: scale(24),
  xl: scale(32),
};

// For font sizes
export const typography = {
  caption: moderateScale(12),
  body: moderateScale(14),
  title: moderateScale(16),
  header: moderateScale(18),
  large: moderateScale(24),
};

// For responsive layout calculations
export const getResponsiveWidth = (percent: number): number => {
  return (SCREEN_WIDTH * percent) / 100;
};

export const getResponsiveHeight = (percent: number): number => {
  return (SCREEN_HEIGHT * percent) / 100;
};

// Device type detection
export const isSmallDevice = SCREEN_WIDTH < 375;
export const isTablet = SCREEN_WIDTH >= 768;