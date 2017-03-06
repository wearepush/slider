import React, { PropTypes } from 'react';
import cx from 'classnames';

export default class Handle extends React.Component {
  render() {
    const { className, vertical, offset, withLabel, value, ...restProps } = this.props;
    const style = vertical ? { bottom: `${offset}%` } : { left: `${offset}%` };
    return (
      <div {...restProps} className={className} style={style}>
        {withLabel &&
          <div
            className={ cx(
              `${className}-label`,
              typeof withLabel === 'string' && `${className}-label--${withLabel}`
            ) }
          >{value}</div>}
      </div>
    );
  }
}

Handle.propTypes = {
  className: PropTypes.string,
  vertical: PropTypes.bool,
  withLabel: PropTypes.bool,
  offset: PropTypes.number,
  value: PropTypes.number,
};
