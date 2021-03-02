import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import PropTypes from "prop-types";
import styles from "./Search.module.css";

class Search extends Component {
  constructor(props) {
    super(props);
    this.change = this.change.bind(this);
    this.click = this.click.bind(this);
  }

  change(e) {
    const { value } = e.target;
    if (value.length < 3) {
      return;
    }

    const { onChange } = this.props;
    onChange(value);
  }

  click(e) {
    const { onClick, items } = this.props;
    const item = items[e.target.getAttribute("index")];
    onClick(item);
  }

  renderDropdown() {
    const { items } = this.props;

    if (!items.length) return "";

    return (
      <div className={styles.containerItems}>
        {items.map((item, index) => (
          <div
            className={styles.item}
            role="button"
            name="hello"
            index={index}
            onClick={this.click}
            onKeyDown={() => {}}
            tabIndex={index}
          >
            {item.place_name}
          </div>
        ))}
      </div>
    );
  }

  render() {
    const { placeholder } = this.props;
    return (
      <div>
        <div id="thing" className={styles.Search}>
          <FontAwesomeIcon className={styles.icon} icon={faSearch} />
          <input
            className={styles.input}
            placeholder={placeholder}
            onChange={this.change}
          />
        </div>
        {this.renderDropdown()}
      </div>
    );
  }
}

Search.propTypes = {
  placeholder: PropTypes.string,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      address: PropTypes.string,
      center: PropTypes.arrayOf(PropTypes.number),
      foursquare: PropTypes.string,
      place_name: PropTypes.string,
      wikidata: PropTypes.string,
    })
  ),
  onChange: PropTypes.func,
  onClick: PropTypes.func,
};

Search.defaultProps = {
  placeholder: "",
  items: [],
  onChange: () => {},
  onClick: () => {},
};

export default Search;
