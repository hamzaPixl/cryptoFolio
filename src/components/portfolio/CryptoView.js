/* eslint react/style-prop-object: 0 */
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styled from 'styled-components';
import Select from 'react-select';
import 'react-select/dist/react-select.css';

import { FormattedPercentage, FormattedCurrency, FormattedCoin } from '../formatted';
import theme from '../../utils/theme';
import { searchCoin, listCoins } from '../../infrastructure';

const CardContainer = styled.div`
  border-radius: 4px;
  background-color: ${props => theme[props.theme].backgroundColor};
  box-shadow: 0 2px 4px 0 rgba(91,114,137,0.2);
  padding: 25px;
`;

const Container = styled.div`
  font-size: 20px;
  font-family: ${props => theme[props.theme].fontFamily}, sans-serif;
`;

const Name = styled.div`
  padding-bottom: 2%;
`;

const CoinInformation = styled.div`
  display: flex;
  justify-content: space-between;
  padding-bottom: 2%;
`;

const Symbol = styled.div``;

const PriceBTC = styled.div``;

const MarketInformation = styled.div`
  font-size: 11px;
  display: flex;
  flex-direction: column;
`;

const Capitalisation = styled.div`
  display: flex;
  justify-content: space-between;
  padding-bottom: 1%;
  > div {
    padding-left: 5px;
  }
`;

const Volume = styled.div`
  display: flex;
  justify-content: space-between;
  > div {
    padding-left: 5px;
  }
`;

const PriceUSD = styled.div``;

const IconCointainer = styled.div``;

const Percent = styled.div`
  font-size: 19px;
  > div {
    padding: 0;
  }
`;

const SymbolContainer = styled.div`
  display: flex;
  text-align: left;
  padding-bottom: 2%;
`;

const CoinNameCointainer = styled.div`
  text-transform: uppercase;
  flex-direction: column;
  padding-left: 10%;
  padding-top: 6%;
`;

const PriceContainer = styled.div`
  text-align: right;
  font-size: 16px;
`;

const SearchContainer = styled.div`
  padding-top: 10%;
  padding-bottom: 10%;
`;

class CryptoView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      coin: {},
      list: [],
      selectValue: 'bitcoin',
    };
  }

  componentWillMount() {
    listCoins()
      .then((list) => {
        const mapped = list.map(c => ({ value: c.slug, label: c.slug, id: c.id }));
        this.setState({ list: mapped });
        searchCoin(this.state.list[0])
          .then(coin => this.setState({ coin }));
      });
  }

  render() {
    const change24 = this.state.coin.percent_change_24h / 100;
    const percentageClass = this.state.coin.percent_change_24h < 0 ? 'negative' : 'positive';
    return (
      <Container theme={this.props.theme}>
        <SearchContainer>
          <Select
            name="form-field-name"
            options={this.state.list}
            onBlurResetsInput={false}
            onSelectResetsInput={false}
            value={this.state.selectValue}
            autoFocus
            simpleValue
            clearable
            onChange={(value) => {
              if (value) {
                const tmp = this.state.list.find(c => c.value === value);
                searchCoin(tmp)
                .then(coin => this.setState({ coin, selectValue: value }));
              }
            }}
            searchable
          />
        </SearchContainer>

        <CardContainer theme={this.props.theme}>

          <CoinInformation>

            <SymbolContainer>
              <IconCointainer>
                <img src={this.state.coin.icon} alt="coin icon" />
              </IconCointainer>
              <CoinNameCointainer>
                <Name>{this.state.coin.name}</Name>
                <Symbol>{this.state.coin.symbol}</Symbol>
              </CoinNameCointainer>
            </SymbolContainer>

            <PriceContainer>
              <PriceBTC>
                <FormattedCoin
                  symbol="฿"
                  value={this.state.coin.price_btc}
                />
              </PriceBTC>
              <PriceUSD>
                <FormattedCurrency
                  class={percentageClass}
                  value={this.state.coin.price_usd}
                />
              </PriceUSD>
              <Percent>
                <FormattedPercentage
                  value={change24}
                  class={percentageClass}
                />
              </Percent>
            </PriceContainer>

          </CoinInformation>
          <MarketInformation>
            <Capitalisation>
              MARKET CAPITALIZATION
              <FormattedCurrency
                value={this.state.coin.market_cap_usd}
              />
            </Capitalisation>
            <Volume>
              24 HOUR TRADING VOLUME
              <FormattedCurrency
                value={this.state.coin['24h_volume_usd']}
              />
            </Volume>
          </MarketInformation>

        </CardContainer>
      </Container>
    );
  }
}

CryptoView.propTypes = {
  theme: PropTypes.string,
};

CryptoView.defaultProps = {
  theme: 'light',
};

export default CryptoView;
