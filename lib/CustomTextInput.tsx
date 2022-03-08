import React from 'react';
import {StyleSheet, View, ViewPropTypes, TextInput, TextPropTypes} from 'react-native';
import PropTypes from 'prop-types';
import colors from '../common/colors';
import {GenericStyles} from '../styles/GenericStyles';


const CustomTextInput = function(props) {
  const {
    containerStyle,
    style,
    LeftComponent,
    RightComponent,
    refCallback,
    ...remainingProps
  } = props;

  return (
    <View style={[styles.containerStyle, containerStyle]}>
      {LeftComponent}
      <TextInput
        {...remainingProps}
        style={[styles.textInputStyle, GenericStyles.fill, style]}
        ref={refCallback}
      />
      {RightComponent}
    </View>
  );
};

const styles = StyleSheet.create({
  containerStyle: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#074A74",
    borderRadius: 4,
    padding: 8,
  },
  textInputStyle: {
    padding: 0,
    color: "#074A74",
    fontSize: 18,
    width: "100%",
    textAlign: "center",
  },
});

CustomTextInput.defaultProps = {
  LeftComponent: <></>,
  RightComponent: <></>,
};

CustomTextInput.propTypes = {
  containerStyle: ViewPropTypes.style,
  style: PropTypes.array,
  LeftComponent: PropTypes.object,
  RightComponent: PropTypes.object,
  refCallback: PropTypes.func,
};

export default CustomTextInput;