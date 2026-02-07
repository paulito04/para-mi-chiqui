import { PropsWithChildren } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';

type RetroWindowProps = PropsWithChildren<{
  style?: ViewStyle;
  contentStyle?: ViewStyle;
}>;

export function RetroWindow({ children, style, contentStyle }: RetroWindowProps) {
  return (
    <View style={[styles.window, style]}>
      <View style={styles.titleBar}>
        <View style={[styles.dot, styles.dotRed]} />
        <View style={[styles.dot, styles.dotYellow]} />
        <View style={[styles.dot, styles.dotGreen]} />
      </View>
      <View style={[styles.inner, contentStyle]}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  window: {
    borderRadius: 18,
    backgroundColor: '#f7e3d5',
    borderWidth: 3,
    borderColor: '#3a2c2a',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowOffset: { width: 4, height: 6 },
    shadowRadius: 6,
    elevation: 6,
  },
  titleBar: {
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 2,
    borderColor: '#3a2c2a',
    backgroundColor: '#f1cfc2',
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#3a2c2a',
  },
  dotRed: {
    backgroundColor: '#ef6b6b',
  },
  dotYellow: {
    backgroundColor: '#f2c94c',
  },
  dotGreen: {
    backgroundColor: '#7bd389',
  },
  inner: {
    borderWidth: 2,
    borderColor: '#b88f80',
    margin: 10,
    borderRadius: 12,
    padding: 16,
    backgroundColor: '#fbeee4',
  },
});
