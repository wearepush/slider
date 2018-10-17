import React from 'react';
import classNames from 'classnames';
import warning from 'warning';

const calcPoints = (vertical, marks, dots, step, min, max, scalable, rangeArray) => {
  warning(
    dots ? step > 0 : true,
    '`Slider[step]` should be a positive number in order to make Slider[dots] work.'
  );
  const points = scalable ?
      rangeArray.slice(1, rangeArray.length - 1).map(parseFloat)
    :
      Object.keys(marks).map(parseFloat);
  if (dots) {
    for (let i = min; i <= max; i = i + step) {
      if (points.indexOf(i) >= 0) continue;
      points.push(i);
    }
  }
  return points;
};

const Steps = ({ prefixCls, vertical, marks, dots, step, included,
                lowerBound, upperBound, max, min, scalable, rangeArray, dotStyle, activeDotStyle }) => {
  const range = max - min;
  const points = calcPoints(vertical, marks, dots, step, min, max, scalable, rangeArray);
  const elements = points.map((point, i) => {
    const offset = scalable ?
        `${(i + 1) * (100 / (points.length + 1))}%`
      :
        `${Math.abs(point - min) / range * 100}%`;
    const style = vertical ? { bottom: offset } : { left: offset };

    const isActived = (!included && point === upperBound) ||
            (included && point <= upperBound && point >= lowerBound);
    let style = vertical ? { bottom: offset, ...dotStyle } : { left: offset, ...dotStyle };
    if (isActived) {
      style = { ...style, ...activeDotStyle };
    }

    const pointClassName = classNames({
      [`${prefixCls}-dot`]: true,
      [`${prefixCls}-dot-active`]: isActived,
    });

    return <span className={pointClassName} style={style} key={point} />;
  });

  return <div className={`${prefixCls}-step`}>{elements}</div>;
};

export default Steps;
