import React, { ReactElement, useState, useCallback } from 'react';
import { StyleSheet, View, LayoutChangeEvent } from 'react-native';

import dimensions from 'styles/dimensions';
import { H2 } from './typography';

interface Styles {
  style?: StyleSheet.NamedStyles<{}>;
}

const styles = StyleSheet.create({
  section: {
    margin: 10,
  },
  row: {
    flexDirection: 'row',
    flex: 1,
  },
  item: {
    flex: 1,
    margin: 10,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sidebar: {
    flex: 1,
    minWidth: 80,
    maxWidth: 300,
    borderRightWidth: 3,
    borderRightColor: '#E5E6EC',
  },
  sidebarHeading: {
    paddingHorizontal: dimensions.spacing * 3,
  },
  fluidGrid: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});

export const FormSection: React.FC = ({ children }) => (
  <View style={styles.section}>
    {children}
  </View>
);

export const Row: React.FC<Styles> = ({ children, style }) => (
  <View style={[styles.row, style]}>
    {children}
  </View>
);

export const RowItem: React.FC<Styles & { flex?: number }> = ({
  children, flex, style,
}) => (
  <View
    style={[
      {
        margin: dimensions.spacing,
        flex: flex !== undefined ? flex : 1,
      },
      style,
    ]}
  >
    {children}
  </View>
);

export const CenterContainer: React.FC = (props) => <View style={styles.center} {...props} />;

export const Sidebar: React.FC<{ heading: string }> = ({ children, heading }) => (
  <View style={styles.sidebar}>
    <View style={styles.sidebarHeading}>
      <H2>{heading}</H2>
    </View>
    {children}
  </View>
);

interface FluidGridProps {
  children: (width: number) => ReactElement | ReactElement[];
  itemMinWidth: number;
}

export const FluidGrid: React.FC<FluidGridProps & Styles> = ({ children, itemMinWidth, style }) => {
  const [contentWidth, setContentWidth] = useState<number>(0);

  const onLayout = useCallback((event: LayoutChangeEvent) => {
    setContentWidth(event.nativeEvent.layout.width);
  }, []);

  const cols = contentWidth > 0
    ? Math.floor(contentWidth / itemMinWidth)
    : 1;
  const width = Math.floor(contentWidth / cols);

  return (
    <View style={[styles.fluidGrid, style]} onLayout={onLayout}>
      {contentWidth > 0 && children(width)}
    </View>
  );
};
