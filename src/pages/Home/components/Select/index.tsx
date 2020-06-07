import React, { Component } from 'react';
import { Dropdown } from 'react-native-material-dropdown';

interface SelectProps{
  value: string,
  onChangeText: any,
  data: {
    value: string
  }[]
}

export const Select: React.FC<SelectProps> = (props) => {
    return (
      <Dropdown
        value={props.value}
        onChangeText={props.onChangeText}
        data={props.data}
      />
    );
};