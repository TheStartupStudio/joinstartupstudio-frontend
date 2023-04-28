import React from 'react';
import { SingleB } from './SingleB';
import Accordion from 'react-bootstrap/Accordion';
import Infographics from '../../assets/images/infographics.png';

export const SingleC = ({ title, index }) => {
  const data = [
    {
      title: 'Step 1: Choose a Skill',
      content:
        'There are 20 market-ready skills in total. You must earn Market-Ready Certification 1, consisting of the first 15 skills, before you can prove the skills for Market-Ready Certification 2. Start by choosing any skill within Market-Ready Certification 1 - you do not need to go in the order the skills are listed. You must prove each skill in three different ways. Read through the instructions and skill breakdown to determine the three ways you want to prove that you have this skill. You can use the system to ask your instructor questions specific to the skill you choose.',
    },
    {
      title:
        'Step 2: Use Your Portfolio Content to Prove Your Skill Proficiency',
      content:
        'You are building a portfolio filled with content that proves who you are, what you can do, and most importantly to this process, how you prove it. Therefore, your portfolio provides you with the proof you need to certify in each of the market-ready employability skills. After reading through the skill breakdown, look at your portfolio. Which items prove your proficiency in this specific skill? Upload this piece of content and explain how it proves your proficiency.',
    },
    {
      title: 'Step 3: Receive Feedback from Your Instructor',
      content:
        'Once you have proven your chosen skill in at least one way, you can submit for feedback from your instructor. They will be able to provide you additional guidance if you have yet to meet the criteria for proficiency. Feedback is vital to this process, so embrace it and use it to help you meet your goals.',
    },
    {
      title: 'Step 4: Earn Proficiency',
      content:
        'Before you can earn the official certification from The Startup Studio, you need to earn proficiency in each skill from your instructor. You can work on one skill at a time or multiple skills at a time. Once you earn proficiency in one skill, it will automatically be added to the skills section of your portfolio and you can confidently claim it.',
    },
    {
      title: 'Step 5: Submit to The Startup Studio for Certification',
      content:
        'When you have earned proficiency in each of the fifteen or twenty market-ready skills, your instructor will give you access through the platform to submit to The Startup Studio for either Market-Ready Certification 1 or Market-Ready Certification 2. The Startup Studio will either confirm your instructor’s evaluation and provide you with the certification, or you will be notified as to which skills need further development. Your instructor will also receive notification and additional guidance to help you officially earn proficiency and then certification.',
    },
  ];

  return (
    <div className="mt-2">
      <div className="accordion-item">
        <h2 className="accordion-header" id={`heading-${1}`}>
          <button
            className="accordion-button collapsed accordion-outter button-accordion"
            type="button"
            eventKey={`${index}`}
            data-bs-toggle="collapse"
            data-bs-target={`#collapse_outer${index}`}
            aria-expanded="false"
            aria-controls={`collapse_outer${index}`}
          >
            {title}
          </button>
        </h2>
        <div
          id={`collapse_outer${index}`}
          eventKey={`${index}`}
          class={`accordion-collapse collapse `}
          aria-labelledby={`heading-${index}`}
          data-bs-parent={`#accordionExample`}
        >
          <div className="accordion-body py-4" eventKey={`${index}`}>
            <div className="accordion-outter-body px-2">
              <img className="w-100 h-100" src={Infographics} alt="" />
            </div>
            <div
              className="accordion-outter-body px-2"
              //   dangerouslySetInnerHTML={{ __html: data?.content }}
            >
              {data.map((item, index) => (
                <div className="w-100 row" key={index}>
                  <p>
                    <span className="item-title text-start pe-2">
                      {item.title}
                    </span>
                    <br />
                    <span className="item-content ">{item.content}</span>
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
