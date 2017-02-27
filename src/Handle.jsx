import React, { PropTypes } from 'react';

export default class Handle extends React.Component {
  render() {
    const { className, vertical, offset, withLabel, value, ...restProps } = this.props;
    const style = vertical ? { bottom: `${offset}%` } : { left: `${offset}%` };
    return (
      <div {...restProps} className={className} style={style}>
        {withLabel && <div className={`${className}-label`}>{value}</div>}
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
