import React from 'react'
import PortfolioActions from './PortfolioActions'

describe('<PortfolioActions />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<PortfolioActions />)
  })
})