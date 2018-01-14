/* eslint react/style-prop-object: 0 */
import PropTypes from 'prop-types';
import React from 'react';
import { FormattedNumber } from 'react-intl';
import styled from 'styled-components';

import theme from '../config/theme';
import ArrowUp from '../assets/icons/arrow_up.svg';
import ArrowDown from '../assets/icons/arrow_down.svg';

const Container = styled.div`
  display: flex;
  color: ${props => (props.class === 'negative' ? theme.changeNegative : theme.changePositive)};
`;

function FormattedPercent(props) {
  const arrow = props.class === 'negative' ? ArrowDown : ArrowUp;
  return (
    <Container class={props.class}>
      <FormattedNumber
        style="percent"
        value={props.value}
      />
      <img src={arrow} alt="" />
    </Container>
  );
}

FormattedPercent.propTypes = {
  value: PropTypes.number.isRequired,
  class: PropTypes.string.isRequired,
};

export default FormattedPercent;
