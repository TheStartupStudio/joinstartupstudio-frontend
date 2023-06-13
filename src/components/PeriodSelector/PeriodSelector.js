import { FormattedMessage } from 'react-intl'
import React, { useEffect, useState } from 'react'

const PeriodSelector = (props) => {
  const [periods, setPeriods] = useState(props.periods)
  const [selectPeriod, setSelectedPeriod] = useState(props.period)
  const handleChangePeriod = (value) => {
    setSelectedPeriod(value)
  }
  const selectedPeriod = props.periods?.find(
    (period) => period.name === selectPeriod
  )

  useEffect(() => {
    setPeriods(props.periods)
  }, [props.periods])
  useEffect(() => {
    const newSelectedPeriod = {
      name: selectedPeriod?.name,
      id: selectedPeriod?.id,
    }
    setSelectedPeriod(newSelectedPeriod.name)
    props.handleChangePeriod(newSelectedPeriod)
  }, [selectPeriod])

  return (
    <div className="col-md-12">
      <label
        htmlFor="chooseClasses"
        style={{ fontSize: '14px', fontWeight: 'bold' }}
      >
        <FormattedMessage id="calendar_task-events.choose_classes" />
      </label>
      <select
        style={{ outline: 'none' }}
        className="form-select form-select-md mb-3  shadow-none"
        onChange={(e) => handleChangePeriod(e.target.value)}
        value={selectPeriod}
        name="chooseClasses"
      >
        {periods &&
          periods.length > 0 &&
          periods.map((period) => {
            return (
              <option value={period.name} key={period.id}>
                {period.name}
              </option>
            )
          })}
      </select>
    </div>
  )
}
export default PeriodSelector
