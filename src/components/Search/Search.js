import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import PropTypes from "prop-types";
import "./Search.css";

class Search extends Component {
  constructor(props) {
    super(props);
    this.change = this.change.bind(this);
  }

  change(e) {
    const { onChange } = this.props;

    onChange(e.target.value);
  }

  render() {
    const { placeholder } = this.props;
    return (
      <div className="Search">
        <FontAwesomeIcon className="icon" icon={faSearch} />
        <input
          className="input"
          placeholder={placeholder}
          onChange={this.change}
        />
      </div>
    );
  }
}

Search.propTypes = {
  placeholder: "",
  onChange: () => {},
};

Search.defaultProps = {
  placeholder: PropTypes.string,
  onChange: PropTypes.func,
};

export default Search;
