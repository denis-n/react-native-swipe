import React, { Component } from "react";
import {
  View,
  Animated,
  PanResponder,
  Dimensions,
  LayoutAnimation,
  UIManager
} from "react-native";

const ORIGINAL_SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_WIDTH = 2.5 * ORIGINAL_SCREEN_WIDTH;
const SWIPE_THRESHOLD = 0.25 * ORIGINAL_SCREEN_WIDTH;
const SWIPE_OUT_DURATION = 250;

class Deck extends Component {
  static defaultProps = {
    onSwipeRight: () => {},
    onSwipeLeft: () => {},
    renderNoMoreCards: () => {}
  };

  constructor(props) {
    super(props);

    this.position = new Animated.ValueXY();

    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (event, gesture) => {
        this.position.setValue({
          x: gesture.dx,
          y: gesture.dy
        });
      },
      onPanResponderRelease: (event, gesture) => {
        if (gesture.dx > SWIPE_THRESHOLD) {
          this.forceSwipe(true);
        } else if (gesture.dx < -SWIPE_THRESHOLD) {
          this.forceSwipe(false);
        } else {
          this.resetPosition();
        }
      }
    });

    this.state = { index: 0 };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.data !== this.props.data) {
      this.setState({
        index: 0
      });
    }
  }

  componentWillUpdate() {
    UIManager.setLayoutAnimationEnabledExperimental &&
      UIManager.setLayoutAnimationEnabledExperimental(true);

    LayoutAnimation.spring();
  }

  forceSwipe = directionRight => {
    const direction = directionRight ? 1 : -1;

    Animated.timing(this.position, {
      toValue: {
        x: direction * SCREEN_WIDTH,
        y: 0
      },
      duration: SWIPE_OUT_DURATION
    }).start(() => {
      this.onSwipeComplete(directionRight);
    });
  };

  onSwipeComplete = directionRight => {
    //
    const { onSwipeLeft, onSwipeRight, data } = this.props;
    const item = data[this.state.index];

    if (directionRight) {
      onSwipeRight(item);
    } else {
      onSwipeLeft(item);
    }

    this.position.setValue({
      x: 0,
      y: 0
    });

    this.setState({
      index: this.state.index + 1
    });
  };

  resetPosition = () => {
    Animated.spring(this.position, {
      toValue: { x: 0, y: 0 }
    }).start();
  };

  getCardsStyle = () => {
    const { position } = this;

    const rotate = position.x.interpolate({
      inputRange: [-SCREEN_WIDTH, 0, SCREEN_WIDTH],
      outputRange: ["-120deg", "0deg", "120deg"]
    });

    return {
      ...position.getLayout(),
      transform: [{ rotate }]
    };
  };

  renderCards = () => {
    const { index } = this.state;

    const { data } = this.props;

    if (index >= data.length) {
      return <View>{this.props.renderNoMoreCards()}</View>;
    }

    return data
      .map((item, i) => {
        switch (i) {
          case index:
            return (
              <Animated.View
                key={item.id}
                style={[this.getCardsStyle(), styles.cardStyle]}
                {...this.panResponder.panHandlers}
              >
                {this.props.renderCard(item)}
              </Animated.View>
            );

          default:
            if (i > index) {
              return (
                <Animated.View
                  key={item.id}
                  style={[styles.cardStyle, { top: 10 * (i - index) }]}
                >
                  {this.props.renderCard(item)}
                </Animated.View>
              );
            }
        }
      })
      .reverse();
  };

  render() {
    return this.renderCards();
  }
}

const styles = {
  cardStyle: {
    position: "absolute",
    width: ORIGINAL_SCREEN_WIDTH,
    elevation: 0
  }
};

export default Deck;
