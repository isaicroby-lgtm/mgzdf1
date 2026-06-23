import React, { useState, useEffect } from "react";
import { Checkbox as CheckboxStyle } from "antd";

export const CheckboxGroup = CheckboxStyle.Group;

const Checkbox = (props) => {
  const {
    item,
    defaultSelect,
    checked,
    multiple,
    onChange,
    onChangeTriger,
    defaultChecked,
    disabled,
    children,
  } = props;

  const plainOptions = item;

  const [state, setState] = useState({
    checkedList: defaultSelect,
    indeterminate: true,
    checkAll: false,
  });

  const onMultiChange = (checkedList) => {
    setState({
      checkedList,
      indeterminate:
        !!checkedList.length && checkedList.length < plainOptions.length,
      checkAll: checkedList.length === plainOptions.length,
    });
  };

  useEffect(() => {
    if (onChangeTriger) {
      onChangeTriger(state.checkedList);
    }
    // eslint-disable-next-line
  }, [state]);

  const onCheckAllChange = (e) => {
    setState({
      checkedList: e.target.checked ? plainOptions : [],
      indeterminate: false,
      checkAll: e.target.checked,
    });
  };

  const onChecked = (e) => {
    return onChange(e.target.checked, e.target.value);
  };

  return !multiple ? (
    <CheckboxStyle
      checked={checked}
      onChange={onChecked}
      defaultChecked={defaultChecked}
      disabled={disabled}
    >
      {children}
    </CheckboxStyle>
  ) : (
    <div>
      <div style={{ borderBottom: "1px solid #E9E9E9" }}>
        <CheckboxStyle
          indeterminate={state.indeterminate}
          onChange={onCheckAllChange}
          checked={state.checkAll}
        >
          Check all
        </CheckboxStyle>
      </div>
      <br />
      <CheckboxGroup
        options={plainOptions}
        value={state.checkedList}
        onChange={onMultiChange}
      />
    </div>
  );
};

export default Checkbox;
