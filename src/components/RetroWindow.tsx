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
      <View style={styles.innerFrame}>
        <View style={[styles.inner, contentStyle]}>{children}</View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  window: {
    backgroundColor: '#f7e3d5',
    borderWidth: 3,
    borderColor: '#3a2c2a',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.22,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 10,
    elevation: 8,
  },
  titleBar: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#f2cfc1',
    borderBottomWidth: 2,
    borderBottomColor: '#3a2c2a',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  dot: {
    width: 11,
    height: 11,
    borderRadius: 6,
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
  innerFrame: {
    margin: 10,
    borderWidth: 2,
    borderColor: '#3a2c2a',
    borderRadius: 12,
    backgroundColor: '#fbeee4',
    padding: 4,
  },
  inner: {
    borderWidth: 2,
    borderColor: '#b88f80',
    borderRadius: 8,
    padding: 16,
    backgroundColor: '#fdf5ef',
  },
});
