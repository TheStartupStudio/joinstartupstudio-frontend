const OptionSelector = ({
  label,
  value,
  options,
  onChange,
  defaultValue,
  width,
  align
}) => {
  return (
    <div
      className={`d-flex justify-content-${
        align ? align : 'center'
      } col-md-12 `}
    >
      <select
        style={{ width, padding: 8, border: '2px solid #dfdfdf' }}
        value={value}
        onChange={onChange}
      >
        {options?.map((option, index) => (
          <option
            value={option.value}
            key={index}
            // disabled={option.disabled ?? false}
          >
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}

export default OptionSelector
