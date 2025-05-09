import React, { useEffect, useState } from 'react'
import Select from 'react-select'
import { useLocation, useParams } from 'react-router-dom'

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
  const { journalId } = useParams();
  const isRootPath = location.pathname === '/my-course-in-entrepreneurship/journal';
  const [currentPlaceholder, setCurrentPlaceholder] = useState('');

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

  // Function to find lesson title by redirectId
  const getLessonTitleByRedirectId = (redirectId) => {
    if (!redirectId) return null;

    if (activeLevel === 2) {
      // For Level 3's nested structure
      for (const section of options) {
        if (section.children) {
          const found = section.children.find(child => child.redirectId === redirectId);
          if (found) return found.label;
        }
      }
    } else {
      // For Level 1 and 2
      const found = options.find(option => option.redirectId === redirectId);
      if (found) return found.label;
    }
    return null;
  };

  // Update placeholder when route/level/course/redirectId changes
  useEffect(() => {
    if (isRootPath) {
      setCurrentPlaceholder(getLevelPlaceholder());
    } else if (journalId) {
      const numericId = parseInt(journalId);
      const lessonTitle = getLessonTitleByRedirectId(numericId);
      if (lessonTitle) {
        setCurrentPlaceholder(lessonTitle);
      } else if (selectedCourse?.label) {
        setCurrentPlaceholder(selectedCourse.label);
      } else if (placeholder) {
        setCurrentPlaceholder(placeholder);
      } else {
        setCurrentPlaceholder(getLevelPlaceholder());
      }
    }
  }, [isRootPath, selectedCourse, placeholder, activeLevel, journalId]);

  // Handle saved selection
  useEffect(() => {
    const savedSelection = localStorage.getItem('selectedLesson');
    if (savedSelection && !selectedCourse) {
      try {
        const parsedSelection = JSON.parse(savedSelection);
        if (parsedSelection.activeLevel === activeLevel) {
          setSelectedCourse(parsedSelection.course);
          setCurrentPlaceholder(parsedSelection.course.label);
        }
      } catch (error) {
        console.error('Error parsing saved selection:', error);
      }
    }
  }, [activeLevel, selectedCourse, setSelectedCourse]);

  const handleChange = (selectedOption) => {
    if (selectedOption?.disabled) {
      setLockModalMessage('This lesson is currently locked. You must complete the lesson before it to gain access to this lesson.');
      setShowLockModal(true);
      return;
    }
    setSelectedCourse(selectedOption);
    setCurrentPlaceholder(selectedOption.label);
    
    localStorage.setItem('selectedLesson', JSON.stringify({
      course: selectedOption,
      activeLevel: activeLevel
    }));
  };

  const currentSelection = options?.find(option => {
    if (journalId) {
      const numericId = parseInt(journalId);
      return option.redirectId === numericId;
    }
    return option.value === selectedCourse?.value;
  });

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
        placeholder={currentPlaceholder}
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
