import React from 'react'
import { Table } from 'react-bootstrap'
import {
  JournalTableCell,
  JournalTableCellInput,
  JournalTableRow
} from './TableWrapper/TableComponents'

const MonthlyBudgetComponent = (props) => {
  return (
    props.monthlyTransaction?.length > 0 && (
      <Table bordered hover style={{ marginBottom: 0 }}>
        {props.monthlyTransaction?.map((cell, index) => {
          return (
            <>
              {index === 0 && (
                <thead>
                  <JournalTableRow>
                    {cell.transactionType === 'monthly_fixed_expense' &&
                      'Monthly Fixed Expenses'}
                    {cell.transactionType === 'monthly_variable_expense' &&
                      'Monthly Variable Expenses'}
                    {cell.transactionType === 'monthly_income' &&
                      'Monthly Income Table'}
                  </JournalTableRow>
                  {cell.transactionType === 'monthly_fixed_expense' && (
                    <JournalTableRow>
                      <JournalTableCell isGray>Source</JournalTableCell>
                      <JournalTableCell isGray>Amount</JournalTableCell>
                    </JournalTableRow>
                  )}
                </thead>
              )}
            </>
          )
        })}
        {props.monthlyTransaction?.map((cell, index) => {
          return (
            <tbody>
              <JournalTableRow key={cell.transactionName}>
                <JournalTableCell isGray>
                  {cell.transactionName}
                </JournalTableCell>
                <JournalTableCell>
                  {cell.userFinancialSnapshot ? (
                    <JournalTableCellInput
                      type={'number'}
                      value={cell.userFinancialSnapshot?.amount}
                      handleChange={(value) => {
                        const isEdit = cell.userFinancialSnapshot
                        return props.handleChangeAmount(
                          cell.userFinancialSnapshot,
                          value,
                          isEdit,
                          index,
                          props.financialType
                        )
                      }}
                    />
                  ) : (
                    <JournalTableCellInput
                      type={'number'}
                      handleChange={(value) => {
                        const isEdit = cell.userFinancialSnapshot
                        return props.handleChangeAmount(
                          cell,
                          value,
                          isEdit,
                          index,
                          props.financialType
                        )
                      }}
                    />
                  )}
                </JournalTableCell>
              </JournalTableRow>
            </tbody>
          )
        })}
      </Table>
    )
  )
}

export default MonthlyBudgetComponent
