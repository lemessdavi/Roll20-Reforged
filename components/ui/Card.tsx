import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: 'default' | 'elevated';
}

export function Card({ children, style, variant = 'default' }: CardProps) {
  const surface = useThemeColor({}, 'surface');
  const border = useThemeColor({}, 'border');

  const cardStyle: ViewStyle = {
    backgroundColor: surface,
    borderRadius: 12,
    padding: 16,
    ...(variant === 'elevated' ? {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    } : {
      borderWidth: 1,
      borderColor: border,
    }),
  };

  return (
    <View style={[cardStyle, style]}>
      {children}
    </View>
  );
}