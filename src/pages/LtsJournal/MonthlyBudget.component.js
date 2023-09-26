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
      <Table bordered style={{ marginBottom: 0 }}>
        {props.monthlyTransaction?.map((cell, index) => {
          return (
            <>
              {index === 0 && (
                <thead>
                  <JournalTableRow>
                    <div
                      style={{
                        height: 54,
                        display: 'flex',
                        alignItems: 'center',
                        backgroundColor: '#CFCFCF',
                        color: '#231F20',
                        width: '100%'
                      }}
                    >
                      <div
                        style={{
                          fontSize: 12,
                          textAlign: 'start',
                          padding: '4px 10px',
                          fontWeight: 500,
                          width: '100%',
                          height: '100%',
                          display: 'flex',
                          alignItems: 'center'
                        }}
                      >
                        {cell.transactionType === 'monthly_fixed_expense' &&
                          'Monthly Fixed Expenses'}
                        {cell.transactionType === 'monthly_variable_expense' &&
                          'Monthly Variable Expenses'}
                        {cell.transactionType === 'monthly_income' &&
                          'Monthly Income Table'}
                      </div>
                    </div>
                  </JournalTableRow>
                  {cell.transactionType === 'monthly_income' && (
                    <JournalTableRow>
                      <div
                        className={'d-flex p-0'}
                        style={{ height: 46, gap: 4 }}
                      >
                        <JournalTableCell
                          isGray
                          additionalStyling={{
                            width: '100%',
                            backgroundColor: '#E5E5E5'
                          }}
                        >
                          Source
                        </JournalTableCell>
                        <JournalTableCell
                          isGray
                          additionalStyling={{
                            width: '100%',
                            backgroundColor: '#E5E5E5'
                          }}
                        >
                          Amount
                        </JournalTableCell>
                      </div>
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
                <div className={'d-flex p-0'} style={{ gap: 4 }}>
                  <JournalTableCell additionalStyling={{ width: '100%' }}>
                    {cell.transactionName}
                  </JournalTableCell>
                  <JournalTableCell additionalStyling={{ width: '100%' }}>
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
                </div>
              </JournalTableRow>
            </tbody>
          )
        })}
      </Table>
    )
  )
}

export default MonthlyBudgetComponent
