import React from 'react';
import classNames from 'classnames';

const Marks = ({
  className,
  vertical,
  marks,
  included,
  upperBound,
  lowerBound,
  max, min,
  scalable,
  rangeArray,
}) => {
  const marksKeys = scalable ? rangeArray.slice(1, rangeArray.length - 1) : Object.keys(marks);
  const marksCount = marksKeys.length;
  const unit = 100 / (marksCount);
  const markWidth = unit * 0.9;

  const range = max - min;
  const elements = marksKeys.map(parseFloat).sort((a, b) => a - b).map((point, i) => {
    const isActive = (!included && point === upperBound) ||
            (included && point <= upperBound && point >= lowerBound);
    const markClassName = classNames({
      [`${className}-text`]: true,
      [`${className}-text-active`]: isActive,
    });

    const bottomStyle = {
      marginBottom: '-50%',
      bottom: scalable ?
          `${(i + 1) * (100 / (marksCount + 1))}%`
        :
          `${(point - min) / range * 100}%`,
    };

    const leftStyle = {
      width: `${markWidth}%`,
      marginLeft: `${-markWidth / 2}%`,
      left: scalable ? `${(i + 1) * (100 / (marksCount + 1))}%` : `${(point - min) / range * 100}%`,
    };

    const style = vertical ? bottomStyle : leftStyle;

    const markPoint = scalable ? point : marks[point];
    const markPointIsObject = typeof markPoint === 'object' &&
            !React.isValidElement(markPoint);
    const markLabel = markPointIsObject ? markPoint.label : markPoint;
    const markStyle = markPointIsObject ?
            { ...style, ...markPoint.style } : style;
    return (
      <span
        className={markClassName}
        style={markStyle}
        key={point}
      >
        {markLabel}
      </span>
    );
  });

  return <div className={className}>{elements}</div>;
};

export default Marks;
