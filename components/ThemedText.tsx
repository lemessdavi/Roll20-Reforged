import { Text, type TextProps, StyleSheet } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'subtitle' | 'caption' | 'link' | 'semiBold' | 'bold';
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'default',
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  return (
    <Text
      style={[
        { color },
        type === 'default' ? styles.default : undefined,
        type === 'title' ? styles.title : undefined,
        type === 'subtitle' ? styles.subtitle : undefined,
        type === 'caption' ? styles.caption : undefined,
        type === 'link' ? styles.link : undefined,
        type === 'semiBold' ? styles.semiBold : undefined,
        type === 'bold' ? styles.bold : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: 'Inter-Regular',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    lineHeight: 36,
    fontFamily: 'Inter-Bold',
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 28,
    fontFamily: 'Inter-SemiBold',
  },
  caption: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: 'Inter-Regular',
  },
  link: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: 'Inter-Medium',
    color: '#7C3AED',
  },
  semiBold: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: 'Inter-SemiBold',
  },
  bold: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: 'Inter-Bold',
  },
});