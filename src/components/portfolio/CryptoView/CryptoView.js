/* eslint react/style-prop-object: 0 */
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Select from 'react-select';
import 'react-select/dist/react-select.css';

import { FormattedPercentage, FormattedCurrency, FormattedCoin } from '../../formatted';
import { searchCoin, listCoins } from '../../../infrastructure';
import { Capitalisation, CardContainer, CoinInformation,
  CoinNameCointainer, Container, MarketInformation,
  Name, Percent, PriceBTC, PriceContainer, PriceUSD,
  SearchContainer, Symbol, SymbolContainer, Volume } from './CryptoView.style';

class CryptoView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      coin: {},
      list: [],
      selectValue: 'Bitcoin',
    };
  }

  componentWillMount() {
    listCoins()
      .then((list) => {
        const mapped = list.map(c => ({ value: c.id, label: c.name, id: c.id }));
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
