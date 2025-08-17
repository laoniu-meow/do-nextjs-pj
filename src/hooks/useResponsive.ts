'use client'

import { useState, useEffect, useCallback } from 'react'
import { breakpoints, getDeviceType, isMobile, isTablet, isDesktop, isLargeDesktop } from '@/lib/breakpoints'

export interface ResponsiveState {
  width: number
  height: number
  deviceType: 'mobile' | 'tablet' | 'desktop' | 'largeDesktop'
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
  isLargeDesktop: boolean
  orientation: 'portrait' | 'landscape'
  isTouch: boolean
}

export function useResponsive(): ResponsiveState {
  const [state, setState] = useState<ResponsiveState>({
    width: typeof window !== 'undefined' ? window.innerWidth : 1024,
    height: typeof window !== 'undefined' ? window.innerHeight : 768,
    deviceType: 'desktop',
    isMobile: false,
    isTablet: false,
    isDesktop: false,
    isLargeDesktop: false,
    orientation: 'landscape',
    isTouch: false
  })

  const updateState = useCallback(() => {
    if (typeof window === 'undefined') return

    const width = window.innerWidth
    const height = window.innerHeight
    const deviceType = getDeviceType(width)
    const orientation = width > height ? 'landscape' : 'portrait'
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0

    setState({
      width,
      height,
      deviceType,
      isMobile: isMobile(width),
      isTablet: isTablet(width),
      isDesktop: isDesktop(width),
      isLargeDesktop: isLargeDesktop(width),
      orientation,
      isTouch
    })
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return

    updateState()

    const handleResize = () => {
      updateState()
    }

    const handleOrientationChange = () => {
      // Delay to ensure orientation change is complete
      setTimeout(updateState, 100)
    }

    window.addEventListener('resize', handleResize)
    window.addEventListener('orientationchange', handleOrientationChange)

    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('orientationchange', handleOrientationChange)
    }
  }, [updateState])

  return state
}

// Hook for specific breakpoint queries
export function useBreakpoint(breakpoint: keyof typeof breakpoints): boolean {
  const { width } = useResponsive()
  const bp = breakpoints[breakpoint]
  
  return width >= bp.min && width <= bp.max
}

// Hook for responsive values
export function useResponsiveValue<T>(
  mobileValue: T,
  tabletValue: T,
  desktopValue: T,
  largeDesktopValue?: T
): T {
  const { deviceType } = useResponsive()
  
  switch (deviceType) {
    case 'mobile':
      return mobileValue
    case 'tablet':
      return tabletValue
    case 'largeDesktop':
      return largeDesktopValue || desktopValue
    default:
      return desktopValue
  }
}

// Hook for responsive spacing
export function useResponsiveSpacing(size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl'): string {
  const { deviceType } = useResponsive()
  const spacing = {
    xs: { mobile: '4px', tablet: '6px', desktop: '8px' },
    sm: { mobile: '8px', tablet: '12px', desktop: '16px' },
    md: { mobile: '16px', tablet: '24px', desktop: '32px' },
    lg: { mobile: '24px', tablet: '32px', desktop: '48px' },
    xl: { mobile: '32px', tablet: '48px', desktop: '64px' },
    xxl: { mobile: '48px', tablet: '64px', desktop: '96px' }
  }
  
  return spacing[size][deviceType === 'largeDesktop' ? 'desktop' : deviceType]
}

// Hook for responsive typography
export function useResponsiveTypography(level: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body' | 'small'): string {
  const { deviceType } = useResponsive()
  const typography = {
    h1: { mobile: '24px', tablet: '32px', desktop: '48px' },
    h2: { mobile: '20px', tablet: '28px', desktop: '36px' },
    h3: { mobile: '18px', tablet: '24px', desktop: '28px' },
    h4: { mobile: '16px', tablet: '20px', desktop: '24px' },
    h5: { mobile: '14px', tablet: '18px', desktop: '20px' },
    h6: { mobile: '12px', tablet: '16px', desktop: '18px' },
    body: { mobile: '14px', tablet: '16px', desktop: '18px' },
    small: { mobile: '12px', tablet: '14px', desktop: '16px' }
  }
  
  return typography[level][deviceType === 'largeDesktop' ? 'desktop' : deviceType]
}
