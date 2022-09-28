import React, {useState} from 'react';
import Range from 'react-range-progress';



function ProgressSlider({defaultValue, handleSlider}){
    const DEFAULT_VALUE = defaultValue;
    const [state, setState] = useState({
    value: DEFAULT_VALUE
  })
    const styles = {
  fontFamily: 'sans-serif',
  textAlign: 'center',
}

  const onRangeChanged = (value) => {
    console.log('-----value----->', value);
    setState({value})
    handleSlider(value);
  }

  
    return (
      <div style={styles}>

        <Range
          value={state.value}
          fillColor={{
            r: 253,
            g: 253,
            b: 253,
            a: 1,
          }}
          trackColor={{
            r: 78,
            g: 43,
            b: 95,
            a: 1,
          }}
          height={6}
          width="100%"
          onChange={onRangeChanged}
        />
      </div>
    );
  }
export default ProgressSlider;

