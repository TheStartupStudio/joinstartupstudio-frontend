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
  activeLevel,
  setCurrentPlaceholder
}) {
  const location = useLocation();
  const { journalId } = useParams();
  const isRootPath = location.pathname === '/my-course-in-entrepreneurship/journal';
   const firstLesson = location.pathname === '/my-course-in-entrepreneurship/journal/51';

  const getLessonTitleByRedirectId = (redirectId) => {
    if (!redirectId) return null;

    if (activeLevel === 2) {
      for (const section of options) {
        if (section.children) {
          const found = section.children.find(child => child.redirectId === redirectId);
          if (found) return found.label;
        }
      }
    } else {
      const found = options.find(option => option.redirectId === redirectId);
      if (found) return found.label;
    }
    return null;
  };

  useEffect(() => {
    if (isRootPath) {
      setCurrentPlaceholder("Welcome to Level 1");
    }else if(firstLesson){
      setCurrentPlaceholder("The Myths of Entrepreneurship");
    } else if (journalId) {
      const numericId = parseInt(journalId);

      switch (numericId) {
        case 51:
          setCurrentPlaceholder("The Myths of Entrepreneurship");
          break;
        case 60:
          setCurrentPlaceholder("The Journey of Entrepreneurship");
          break;
        case 70:
          setCurrentPlaceholder("Business Story");
          break;
        default: {
          const lessonTitle = getLessonTitleByRedirectId(numericId);
          if (lessonTitle) {
            setCurrentPlaceholder(lessonTitle);
          } else {
            setCurrentPlaceholder(placeholder);
          }
        }
      }
    }
  }, [isRootPath, journalId, placeholder, activeLevel, setCurrentPlaceholder]);

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
        placeholder={placeholder}
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