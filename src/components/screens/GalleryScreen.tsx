import React, { Component } from 'react';
import {
  StyleSheet, View, Image, TouchableOpacity, Text, GestureResponderEvent, ScrollView,
} from 'react-native';
import { withNavigation, NavigationInjectedProps } from 'react-navigation';
import { connect } from 'react-redux';

import routeNames from 'constants/routeNames';
import { sectionNames, sectionList } from 'constants/sectionNames';

import { selectors } from 'ducks/inspection';
import GalleryImage from 'types/galleryImage';
import dimensions from 'styles/dimensions';
import colors from 'styles/colors';

import { ButtonPrimary } from 'components/elements/buttons';
import { H2, H3, Comment } from 'components/elements/typography';
import { Sidebar, FluidGrid } from 'components/elements/containers';
import { filterImagesBySection } from 'helpers/images';

const { spacing } = dimensions;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  main: {
    flex: 3,
  },
  content: {
    marginHorizontal: spacing,
  },
  heading: {
    paddingHorizontal: spacing * 2,
  },
  item: {
    flex: 0,
    paddingHorizontal: spacing,
  },
  image: {
    resizeMode: 'cover',
    marginBottom: spacing,
    borderRadius: dimensions.borderRadius,
  },
  footer: {
    padding: spacing,
    alignItems: 'center',
  },
  menuItem: {
    paddingVertical: 15,
    paddingLeft: spacing * 3,
    paddingRight: spacing,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F6F8',
  },
  menuItemActive: {
    paddingLeft: (spacing * 3) - 4,
    borderLeftWidth: 4,
    borderLeftColor: colors.blue,
  },
  menuItemText: {
    color: '#1A285A',
  },
  menuItemActiveText: {
    color: colors.blue,
  },
});

interface MenuItemProps {
  onPress: ((event: GestureResponderEvent) => void);
  active: boolean;
}

const MenuItem: React.FC<MenuItemProps> = ({ children, onPress, active }) => (
  <TouchableOpacity style={[styles.menuItem, active ? styles.menuItemActive : null]} onPress={onPress}>
    <Text style={[styles.menuItemText, active ? styles.menuItemActiveText : null]}>{children}</Text>
  </TouchableOpacity>
);

interface GalleryProps {
  images: GalleryImage[];
}

interface GalleryState {
  activeMenuItem: number;
}

type Props = NavigationInjectedProps & GalleryProps;

class GalleryScreen extends Component<Props, GalleryState> {
  constructor(props: Props) {
    super(props);
    this.state = {
      activeMenuItem: 0,
    };
  }

  private onPictureSelect(image: GalleryImage): void {
    const { navigation } = this.props;
    navigation.navigate(
      routeNames.CONFIRM_PICTURE,
      {
        base64: image.value.base64,
        fieldId: image.id,
        fieldIndex: image.index,
        path: image.path,
      },
    );
  }

  private onSectionSelect(i: number): void {
    this.setState({ activeMenuItem: i });
  }

  private onHide(): void {
    const { navigation } = this.props;
    navigation.navigate(
      routeNames.INSPECTION,
    );
  }

  private renderImages = (width: number): JSX.Element[] => {
    const { images } = this.props;
    const { activeMenuItem } = this.state;
    const filteredImages = filterImagesBySection(images, sectionList[activeMenuItem]);

    return filteredImages.map(image => (
      <View key={`${image.id}${image.index}`} style={[styles.item, { width }]}>
        <H3>{image.labelText}</H3>
        <TouchableOpacity onPress={() => this.onPictureSelect(image)}>
          <Image
            style={[styles.image, { width: width - spacing * 2, height: width - spacing * 2 }]}
            source={{
              uri: `data:image/png;base64,${image.value.base64}`,
            }}
          />
        </TouchableOpacity>
        <Comment>{image.value.comments}</Comment>
      </View>
    ));
  }

  public render(): JSX.Element {
    const { activeMenuItem } = this.state;
    return (
      <View style={styles.container}>
        <Sidebar heading="Form sections">
          {sectionNames.map((section, i) => (
            <MenuItem
              key={section}
              active={i === activeMenuItem}
              onPress={() => this.onSectionSelect(i)}
            >
              {section}
            </MenuItem>
          ))}
        </Sidebar>
        <View style={styles.main}>
          <View style={styles.heading}>
            <H2>General</H2>
          </View>
          <ScrollView>
            <FluidGrid itemMinWidth={180} style={styles.content}>
              {this.renderImages}
            </FluidGrid>
          </ScrollView>
          <View style={styles.footer}>
            <ButtonPrimary title="Cancel" onPress={() => this.onHide()} />
          </View>
        </View>
      </View>
    );
  }
}

const connectedComponent = connect<{}, {}>(
  (state: any) => ({
    images: selectors.getAllImages(state),
  }),
)(GalleryScreen);


export default withNavigation(connectedComponent);
