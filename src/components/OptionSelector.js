
const OptionSelector = ({ label, value, options, onChange, defaultValue, width, align }) => {
  return (
    <div className={`d-flex justify-content-${align ? align: 'center'} col-md-12 `}>
      <select style={{width, padding: 8, border: '2px solid #dfdfdf'}} value={value} onChange={onChange}>
        <option value="">{defaultValue}</option>
        {options?.map((option) => (
          <option value={option.value}>{option.label}</option>
        ))}
      </select>
    </div>
  );
};

export default OptionSelector
