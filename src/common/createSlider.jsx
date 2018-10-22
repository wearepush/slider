import React from 'react';
import PropTypes from 'prop-types';
import addEventListener from 'rc-util/lib/Dom/addEventListener';
import classNames from 'classnames';
import warning from 'warning';
import Steps from './Steps';
import Marks from './Marks';
import Handle from '../Handle';
import * as utils from '../utils';

function noop() {}

export default function createSlider(Component) {
  return class ComponentEnhancer extends Component {
    static displayName = `ComponentEnhancer(${Component.displayName})`;
    static propTypes = {
      ...Component.propTypes,
      min: PropTypes.number,
      max: PropTypes.number,
      step: PropTypes.number,
      marks: PropTypes.object,
      included: PropTypes.bool,
      className: PropTypes.string,
      prefixCls: PropTypes.string,
      disabled: PropTypes.bool,
      children: PropTypes.any,
      onBeforeChange: PropTypes.func,
      onChange: PropTypes.func,
      onAfterChange: PropTypes.func,
      handle: PropTypes.func,
      dots: PropTypes.bool,
      vertical: PropTypes.bool,
      style: PropTypes.object,
      scalable: PropTypes.bool,
      withLabel: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
      rangeArray: PropTypes.array,
      minimumTrackStyle: PropTypes.object, // just for compatibility, will be deperecate
      maximumTrackStyle: PropTypes.object, // just for compatibility, will be deperecate
      handleStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.arrayOf(PropTypes.object)]),
      trackStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.arrayOf(PropTypes.object)]),
      railStyle: PropTypes.object,
      dotStyle: PropTypes.object,
      activeDotStyle: PropTypes.object,
      withMarks: PropTypes.bool,
    };

    static defaultProps = {
      ...Component.defaultProps,
      prefixCls: 'rc-slider',
      className: '',
      min: 0,
      max: 100,
      step: 1,
      marks: {},
      handle({ index, ...restProps }) {
        delete restProps.dragging;
        return <Handle {...restProps} key={index} />;
      },
      onBeforeChange: noop,
      onChange: noop,
      onAfterChange: noop,
      included: true,
      disabled: false,
      dots: false,
      vertical: false,
      scalable: false,
      withLabel: false,
      rangeArray: [],
      trackStyle: [{}],
      handleStyle: [{}],
      railStyle: {},
      dotStyle: {},
      activeDotStyle: {},
      withMarks: true,
    };

    constructor(props) {
      super(props);

      this.sectionsState = {
        sections: 1,
        section: 1,
        sectionMin: props.min,
        sectionMax: props.max,
      };

      const setRangeArray = () => {
        const { rangeArray, min, max } = props;
        let tempArray = [...rangeArray];
        if (parseFloat(tempArray[0]) !== parseFloat(min)) {
          tempArray = [min, ...tempArray];
        }
        if (parseFloat(tempArray[tempArray.length - 1]) !== parseFloat(max)) {
          tempArray = [...tempArray, max];
        }
        return tempArray;
      };

      this.rangeArray = setRangeArray();

      if (process.env.NODE_ENV !== 'production') {
        const { step, max, min } = props;
        warning(
          step && Math.floor(step) === step ? (max - min) % step === 0 : true,
          'Slider[max] - Slider[min] (%s) should be a multiple of Slider[step] (%s)',
          max - min,
          step
        );
      }
      this.handlesRefs = {};
    }

    componentWillMount() {
      const { value } = this.state;
      const { scalable, min, max } = this.props;
      if (scalable && this.rangeArray && this.rangeArray.length > 1) {
        let section = undefined;
        for (let i = 1; i < this.rangeArray.length; i++) {
          if (value >= this.rangeArray[i - 1] && value < this.rangeArray[i]) section = i;
        }
        this.sectionsState = {
          ...this.sectionsState,
          section: section || 1,
          sections: this.rangeArray.length - 1,
          sectionMin: this.rangeArray[section - 1] || min,
          sectionMax: this.rangeArray[section] || max,
        };
      }
      if (super.componentWillMount) super.componentWillMount();
    }

    componentWillUnmount() {
      if (super.componentWillUnmount) super.componentWillUnmount();
      this.removeDocumentEvents();
    }

    onMouseDown = (e) => {
      if (e.button !== 0) { return; }

      const isVertical = this.props.vertical;
      let position = utils.getMousePosition(isVertical, e);
      if (!utils.isEventFromHandle(e, this.handlesRefs)) {
        this.dragOffset = 0;
      } else {
        const handlePosition = utils.getHandleCenterPosition(isVertical, e.target);
        this.dragOffset = position - handlePosition;
        position = handlePosition;
      }
      this.onStart(position);
      this.addDocumentMouseEvents();
      utils.pauseEvent(e);
    }

    onTouchStart = (e) => {
      if (utils.isNotTouchEvent(e)) return;

      const isVertical = this.props.vertical;
      let position = utils.getTouchPosition(isVertical, e);
      if (!utils.isEventFromHandle(e, this.handlesRefs)) {
        this.dragOffset = 0;
      } else {
        const handlePosition = utils.getHandleCenterPosition(isVertical, e.target);
        this.dragOffset = position - handlePosition;
        position = handlePosition;
      }
      this.onStart(position);
      this.addDocumentTouchEvents();
      utils.pauseEvent(e);
    }

    onFocus = (e) => {
      const isVertical = this.props.vertical;

      if (utils.isEventFromHandle(e, this.handlesRefs)) {
        const handlePosition = utils.getHandleCenterPosition(isVertical, e.target);

        this.dragOffset = 0;
        this.onStart(handlePosition);
        utils.pauseEvent(e);
      }
    }

    onBlur = (e) => {
      this.onEnd(e);
    };

    addDocumentTouchEvents() {
      // just work for Chrome iOS Safari and Android Browser
      this.onTouchMoveListener = addEventListener(document, 'touchmove', this.onTouchMove);
      this.onTouchUpListener = addEventListener(document, 'touchend', this.onEnd);
    }

    addDocumentMouseEvents() {
      this.onMouseMoveListener = addEventListener(document, 'mousemove', this.onMouseMove);
      this.onMouseUpListener = addEventListener(document, 'mouseup', this.onEnd);
    }

    removeDocumentEvents() {
      /* eslint-disable no-unused-expressions */
      this.onTouchMoveListener && this.onTouchMoveListener.remove();
      this.onTouchUpListener && this.onTouchUpListener.remove();

      this.onMouseMoveListener && this.onMouseMoveListener.remove();
      this.onMouseUpListener && this.onMouseUpListener.remove();
      /* eslint-enable no-unused-expressions */
    }

    onMouseMove = (e) => {
      if (!this.sliderRef) {
        this.onEnd();
        return;
      }
      const position = utils.getMousePosition(this.props.vertical, e);
      this.onMove(e, position - this.dragOffset);
    }

    onTouchMove = (e) => {
      if (utils.isNotTouchEvent(e) || !this.sliderRef) {
        this.onEnd();
        return;
      }

      const position = utils.getTouchPosition(this.props.vertical, e);
      this.onMove(e, position - this.dragOffset);
    }

    onKeyDown = (e) => {
      if (this.sliderRef && utils.isEventFromHandle(e, this.handlesRefs)) {
        this.onKeyboard(e);
      }
    }

    getSliderStart() {
      const slider = this.sliderRef;
      const rect = slider.getBoundingClientRect();

      return this.props.vertical ? rect.top : rect.left;
    }

    getSliderLength() {
      const slider = this.sliderRef;
      if (!slider) {
        return 0;
      }

      const coords = slider.getBoundingClientRect();
      return this.props.vertical ? coords.height : coords.width;
    }

    selectSection(ratio, sections) {
      ratio = ratio >= 1 ? 1 : ratio;
      return sections > 1 ? Math.ceil(ratio / (1 / sections)) || 1 : 1;
    }

    calcValue(offset) {
      const { vertical, min, max, scalable } = this.props;
      const ratio = Math.abs(Math.max(offset, 0) / this.getSliderLength());
      const sections = scalable ? this.rangeArray.length - 1 : 1;
      const section = this.selectSection(ratio, sections);
      const sectionMin = scalable ? this.rangeArray[section - 1] : min;
      const sectionMax = scalable ? this.rangeArray[section] : max;
      this.sectionsState = { ...this.sectionsState, section, sections, sectionMin, sectionMax };
      // const section_r = ratio * ((sections + 1) - section);
      const sectionRatio = (ratio - ((1 / sections) * (section - 1))) * sections;
      const value = vertical ?
          (1 - sectionRatio) * (sectionMax - sectionMin) + sectionMin
        :
          sectionRatio * (sectionMax - sectionMin) + sectionMin;
      return value;
    }

    calcValueByPos(position) {
      const pixelOffset = position - this.getSliderStart();
      const nextValue = this.trimAlignValue(this.calcValue(pixelOffset));
      return nextValue;
    }

    calcOffset(value) {
      const { sections } = this.sectionsState;

      const rangeLength = this.rangeArray.length;
      let nextSection = 0;
      for (let i = 0; i < rangeLength - 1; i++) {
        if (value < this.rangeArray[i]) {
          break;
        }
        nextSection++;
      }

      const sectionSize = 100 / sections;
      const offset = (nextSection - 1) * sectionSize;
      const nextSectionMin = this.rangeArray[nextSection - 1];
      const nextSectionMax = this.rangeArray[nextSection];

      const ratio = (value - nextSectionMin) / (nextSectionMax - nextSectionMin);
      return (ratio * sectionSize) + offset;
    }

    saveSlider = (slider) => {
      this.sliderRef = slider;
    }

    saveHandle(index, handle) {
      this.handlesRefs[index] = handle;
    }

    render() {
      const {
        prefixCls,
        className,
        marks,
        dots,
        step,
        included,
        disabled,
        vertical,
        min,
        max,
        children,
        maximumTrackStyle,
        style,
        scalable,
        railStyle,
        dotStyle,
        activeDotStyle,
        withMarks,
      } = this.props;
      const { tracks, handles } = super.render();

      const sliderClassName = classNames(prefixCls, {
        [`${prefixCls}-with-marks`]: Object.keys(marks).length,
        [`${prefixCls}-disabled`]: disabled,
        [`${prefixCls}-vertical`]: vertical,
        [className]: className,
      });

      return (
        <div
          ref={this.saveSlider}
          className={sliderClassName}
          onTouchStart={disabled ? noop : this.onTouchStart}
          onMouseDown={disabled ? noop : this.onMouseDown}
          onKeyDown={disabled ? noop : this.onKeyDown}
          onFocus={disabled ? noop : this.onFocus}
          onBlur={disabled ? noop : this.onBlur}
          style={style}
        >
          <div
            className={`${prefixCls}-rail`}
            style={{
              ...maximumTrackStyle,
              ...railStyle,
            }}
          />
          {tracks}
          <Steps
            prefixCls={prefixCls}
            vertical={vertical}
            marks={marks}
            dots={dots}
            step={step}
            included={included}
            lowerBound={this.getLowerBound()}
            upperBound={this.getUpperBound()}
            max={max}
            min={min}
            scalable={scalable}
            rangeArray={this.rangeArray}
            dotStyle={dotStyle}
            activeDotStyle={activeDotStyle}
          />
          {handles}
          {
            withMarks &&
            <Marks
              className={`${prefixCls}-mark`}
              vertical={vertical}
              marks={marks}
              included={included}
              lowerBound={this.getLowerBound()}
              upperBound={this.getUpperBound()}
              max={max}
              min={min}
              scalable={scalable}
              rangeArray={this.rangeArray}
            />
          }
          {children}
        </div>
      );
    }
  };
}
