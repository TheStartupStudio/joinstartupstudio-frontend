import React, { useEffect } from 'react'
import Select from 'react-select'
import { useLocation } from 'react-router-dom'

function SelectLessons({
  options,
  selectedCourse,
  setSelectedCourse,
  setShowLockModal,
  setLockModalMessage,
  placeholder,
  activeLevel
}) {
  const location = useLocation();
  const isRootPath = location.pathname === '/my-course-in-entrepreneurship/journal';

  const getLevelPlaceholder = () => {
    switch (activeLevel) {
      case 0:
        return "Welcome to Level 1";
      case 1:
        return "Understanding Learn to Start";
      case 2:
        return "The Journey of Entrepreneurship";
      default:
        return "Select a Lesson";
    }
  };

  useEffect(() => {
    const savedSelection = localStorage.getItem('selectedLesson');
    if (savedSelection && !selectedCourse) {
      try {
        const parsedSelection = JSON.parse(savedSelection);
        if (parsedSelection.activeLevel === activeLevel) {
          setSelectedCourse(parsedSelection.course);
        }
      } catch (error) {
        console.error('Error parsing saved selection:', error);
      }
    }
  }, [activeLevel, selectedCourse, setSelectedCourse]);

  const displayPlaceholder = isRootPath || !selectedCourse?.label
    ? getLevelPlaceholder()
    : selectedCourse.label;

  const handleChange = (selectedOption) => {
    if (selectedOption?.disabled) {
      setLockModalMessage('This lesson is currently locked. You must complete the lesson before it to gain access to this lesson.');
      setShowLockModal(true);
      return;
    }
    setSelectedCourse(selectedOption);
    // Save selection to localStorage
    if (selectedOption) {
      localStorage.setItem('selectedLesson', JSON.stringify({
        course: selectedOption,
        activeLevel: activeLevel
      }));
    }
  };

  const currentSelection = options?.find(option =>
    option.redirectId === selectedCourse?.redirectId ||
    option.value === selectedCourse?.value
  );

  const CustomOption = ({ data, innerRef, innerProps }) => (
    <div
      ref={innerRef}
      {...innerProps}
      style={{
        cursor: data.disabled ? 'not-allowed' : 'pointer',
        padding: '8px',
        opacity: data.disabled ? 0.6 : 1
      }}
    >
      <div className='d-flex align-items-center gap-2'>
        {data.icon && <img className='accordion-icons' src={data.icon} alt='icon' />}
        <span className={`accordion-content-modal ${data.textColor}`}>
          {data.label}
        </span>
      </div>
    </div>
  );

  const CustomSingleValue = ({ data }) => (
    <div className='custom-select-course' style={{ alignContent: 'end' }}>
      {data.label}
    </div>
  );

  return (
    <div className='select-lessons'>
      <Select
        options={options}
        value={currentSelection || selectedCourse}
        onChange={handleChange}
        isOptionDisabled={(option) => option.disabled}
        placeholder={displayPlaceholder}
        menuPortalTarget={document.body}
        isSearchable={false}
        styles={{
          menuPortal: (base) => ({ ...base, zIndex: 9999 }),
          control: (base) => ({
            ...base,
            minHeight: '40px',
            overflow: 'hidden',
            borderRadius: '6px',
            border: 'none',
            boxShadow: 'rgba(0, 0, 0, 0.25) 0px 4px 10px 0px',
            cursor: 'pointer'
          }),
          singleValue: (base) => ({
            ...base,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }),
          placeholder: (base) => ({
            ...base,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          })
        }}
        components={{
          IndicatorSeparator: () => null,
          Option: CustomOption,
          SingleValue: CustomSingleValue
        }}
      />
    </div>
  );
}

export default SelectLessons;
