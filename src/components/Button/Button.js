import React, { Component } from "react";
import PropTypes from "prop-types";

import "./Button.css";

class Button extends Component {
  constructor(props) {
    super(props);

    this.click = this.click.bind(this);
  }

  click() {
    const { onClick } = this.props;
    onClick();
  }

  render() {
    const { label } = this.props;
    return (
      <button className="Button" onClick={this.click} type="button">
        {label}
      </button>
    );
  }
}

Button.propTypes = {
  label: PropTypes.string,
  onClick: PropTypes.func,
};

Button.defaultProps = {
  label: {},
  onClick: () => {},
};

export default Button;
