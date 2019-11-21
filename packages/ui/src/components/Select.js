import React from "react";
import ReactSelect, { components as selectComponents } from "react-select";
import Icon from "./Icon";

const DropdownIndicator = props => {
  return (
    selectComponents.DropdownIndicator && (
      <selectComponents.DropdownIndicator {...props}>
        <Icon name="dropdown" />
      </selectComponents.DropdownIndicator>
    )
  );
};

const customStyles = height => ({
  container: (provided, { selectProps }) => ({
    ...provided,
    boxShadow: selectProps.menuIsOpen
      ? "0px 3px 7px 0 rgba(0, 0, 0, 0.35)"
      : "",
    borderRadius: "4px"
  }),
  control: (provided, state) => ({
    ...provided,
    minHeight: height,
    border: "1px solid #cfcfcf",
    borderBottomColor: state.selectProps.menuIsOpen ? "#e4e4e4" : "#cfcfcf",
    backgroundColor: "white",
    boxShadow: "none",
    cursor: "pointer",
    borderRadius: state.selectProps.menuIsOpen ? "4px 4px 0px 0px" : "4px",
    "&:hover": {
      borderColor: "#cfcfcf"
    },
    paddingLeft: "12px",
    "&:hover": {
      borderColor: "#cfcfcf"
    }
  }),
  dropdownIndicator: provided => ({
    ...provided,
    padding: "0 10px"
  }),

  indicatorSeparator: () => ({
    display: "none"
  }),
  menu: provided => ({
    ...provided,
    borderRadius: "0px 0px 4px 4px",
    margin: "0px 0px 8px 1px",
    boxShadow: "0px 3px 7px 0 rgba(0, 0, 0, 0.35)",
    width: "calc(100% - 2px)"
  }),
  menuList: provided => ({
    ...provided,
    padding: 0,
    borderRadius: "0px 0px 4px 4px"
  }),
  option: provided => ({
    ...provided,
    backgroundColor: "white",
    color: "inherit",
    cursor: "pointer",
    "&:hover": {
      backgroundColor: "#e4e4e4"
    }
  }),
  singleValue: provided => ({
    ...provided,
    alignItems: "center",
    color: "#3b3e45",
    display: "flex",
    fontSize: "14px",
    minHeight: "16px",
    margin: "0"
  })
});

class Select extends React.Component {
  render() {
    const {
      options,
      value,
      onChange,
      onFocus,
      onBlur,
      onMouseDown,
      selectConfig,
      components = {},
      className,
      height = "35px"
    } = this.props;

    return (
      <div onMouseDown={onMouseDown} className={className}>
        <ReactSelect
          {...selectConfig}
          components={{ ...components, DropdownIndicator }}
          defaultValue={options[0]}
          value={options.find(o => o.value === value)}
          options={options}
          styles={customStyles(height)}
          onChange={({ value }) => onChange && onChange(value)}
          onFocus={onFocus}
          onBlur={onBlur}
        />
      </div>
    );
  }
}

Select.components = selectComponents;

export default Select;
