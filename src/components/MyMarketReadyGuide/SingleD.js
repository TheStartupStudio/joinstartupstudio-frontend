import React, { useEffect, useState } from 'react';
import { SingleB } from './SingleB';
import Accordion from 'react-bootstrap/Accordion';
import Dropdown from '../IAMR/customComponents/dropdown';
import { faBox } from '@fortawesome/free-solid-svg-icons';
import './index.css'

export const SingleD = ({ title, index }) => {
  const [evaluationDropdown, setEvaluationDropdown] = useState(false);
  const [activePage, setActivePage] = useState('')

  useEffect(() => console.log(activePage), [activePage])
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
          className={`accordion-collapse collapse `}
          aria-labelledby={`heading-${index}`}
          data-bs-parent={`#accordionExample`}
        >
          <div
            className="accordion-body py-4"
            style={{ height: 'auto' }}
            eventKey={`${index}`}
          >
            <select onChange={(e) => setActivePage(e.target.value)} className="w-100 p-2" id="activePage">
              <option value="">Choose the Certification Skill</option>
              <option value="Time Management">Time Management</option>
              <option value="Structured Problem-Solving">Structured Problem-Solving</option>
              <option value="Public Speaking">Public Speaking</option>
              <option value="Adaptability">Adaptability</option>
              <option value="Learning Agility">Learning Agility</option>
              <option value="Research Literacy">Research Literacy</option>
              <option value="Comprehension">Comprehension</option>
              <option value="Innovation">Innovation</option>
              <option value="Project Management">Project Management</option>
              <option value="Self-Discipline">Self-Discipline</option>
              <option value="Risk-Taking">Risk-Taking</option>
              <option value="Influence and Collaboration">Influence and Collaboration</option>
              <option value="Digital Etiquette">Digital Etiquette</option>
              <option value="Communication Across Mediums">Communication Across Mediums</option>
              <option value="Proactivity">Proactivity</option>
              <option value="Data Analysis">Data Analysis</option>
              <option value="Digital Literacy">Digital Literacy</option>
              <option value="Conflict Management">Conflict Management</option>
              <option value="Financial Literacy">Financial Literacy</option>
              <option value="Modeling">Modeling</option>
            </select>
            
            {activePage == 'Time Management' && <div className="skills-box">
              <div className="skill-box">
                <h5>Demonstrate efficient use of time.</h5>
                <p>Appropriate content to upload:</p>
                <ul>
                    <li>Project Timeline</li>
                    <li>Sprint Template</li>
                </ul>
              </div>
              <div className="skill-box">
                <h5>Develop knowledge and skills according to a timeline of steps.</h5>
                <p>Appropriate content to upload:</p>
                <ul>
                    <li>Sprint Template</li>
                    <li>Project Timeline</li>
                </ul>
              </div>
              <div className="skill-box">
                <h5>Ensure reliability in creating outcomes.</h5>
                <p>Appropriate content to upload:</p>
                <ul>
                    <li>Prototype/Test</li>
                    <li>Sprint Template</li>
                </ul>
              </div>
              <div className="skill-box">
                <h5>Respect the time of others and their schedules.</h5>
                <p>Appropriate content to upload:</p>
                <ul>
                    <li>Project Timeline</li>
                    <li>Sprint Template</li>
                </ul>
              </div>
              <div className="skill-box">
                <h5>Plan for the short and long-term based on data.</h5>
                <p>Appropriate content to upload:</p>
                <ul>
                    <li>Budget</li>
                    <li>Project Timeline</li>
                </ul>
              </div>
              <div className="skill-box">
                <h5>Organize time allowing for the ability to pivot and redirect.</h5>
                <p>Appropriate content to upload:</p>
                <ul>
                    <li>Project Timeline</li>
                    <li>Sprint Template</li>
                </ul>
              </div>
              <div className="skill-box">
                <h5>Turn concept into execution using a rational timeline.</h5>
                <p>Appropriate content to upload:</p>
                <ul>
                    <li>Business Plan</li>
                    <li>Project Timeline</li>
                </ul>
              </div>
              <div className="skill-box">
                <h5>Actively demonstrate value in a given amount of time.</h5>
                <p>Appropriate content to upload:</p>
                <ul>
                    <li>Pitch Video</li>
                    <li>Brand Video</li>
                </ul>
              </div>
            </div>}

            {activePage == 'Structured Problem-Solving' && <div className='skills-box'>
              <div className="skill-box">
                <h5>Determine the appropriate method of thinking for solving a particular problem.</h5>
                <p>Appropriate content to upload:</p>
                <ul>
                    <li>Model</li>
                    <li>Concept Plan</li>
                    <li>Business Plan</li>
                    <li>Market Analysis</li>
                    <li>Industry Analysis</li>
                </ul>
              </div>
              <div className="skill-box">
                <h5>Synthesize observations, experiences, and reasoning to determine actions.</h5>
                <p>Appropriate content to upload:</p>
                <ul>
                    <li>Article</li>
                    <li>Market Analysis</li>
                    <li>Concept Plan</li>
                    <li>Business Plan</li>
                    <li>Industry Analysis</li>
                </ul>
              </div>
              <div className="skill-box">
                <h5>Try untested hypotheses to gather data.</h5>
                <p>Appropriate content to upload:</p>
                <ul>
                    <li>Focus Group Agenda and Results</li>
                    <li>Prototype/Test</li>
                </ul>
              </div>
              <div className="skill-box">
                <h5>Exert control over the different environmental factors resulting in specific outcomes.</h5>
                <p>Appropriate content to upload:</p>
                <ul>
                    <li>Prototype/Test</li>
                    <li>Sprint Template</li>
                    <li>Form of Communication</li>
                    <li>Social Media Content</li>
                </ul>
              </div>
              <div className="skill-box">
                <h5>Analyze market behavior affecting problems and solutions.</h5>
                <p>Appropriate content to upload:</p>
                <ul>
                    <li>Market Analysis</li>
                    <li>Survey</li>
                    <li>Focus Group Agenda and Results</li>
                    <li>Concept Plan</li>
                    <li>Business Plan</li>
                </ul>
              </div>
              <div className="skill-box">
                <h5>Analyze industry trends affecting problems and solutions.</h5>
                <p>Appropriate content to upload:</p>
                <ul>
                    <li>Industry Analysis</li>
                    <li>Article</li>
                    <li>Concept Plan</li>
                    <li>Business Plan</li>
                </ul>
              </div>
              <div className="skill-box">
                <h5>Create a solution to a problem.</h5>
                <p>Appropriate content to upload:</p>
                <ul>
                    <li>Prototype/Test</li>
                    <li>Piece of Art/Code/Music</li>
                    <li>Brand Video</li>
                    <li>Pitch Video</li>
                    <li>Website</li>
                </ul>
              </div>
              <div className="skill-box">
                <h5>Iterate on the solution process using failure points.</h5>
                <p>Appropriate content to upload:</p>
                <ul>
                    <li>Sprint Template</li>
                    <li>Prototype/Test</li>
                    <li>Project Timeline</li>
                </ul>
              </div>
            </div>}
            
            {activePage == 'Public Speaking' && <div className='skills-box'>
              <div className="skill-box">
                <h5>Control the narrative of the story being told.</h5>
                <p>Appropriate content to upload:</p>
                <ul>
                    <li>Pitch Video</li>
                    <li>Podcast</li>
                    <li>Brand Video</li>
                    <li>I Am Video</li>
                    <li>Form of Communication</li>
                    <li>Social Media Content</li>
                    <li>Website</li>
                </ul>
              </div>
              <div className="skill-box">
                <h5>Approach audiences with specific intentions.</h5>
                <p>Appropriate content to upload:</p>
                <ul>
                    <li>Pitch Video</li>
                    <li>Social Media Content</li>
                    <li>Brand Video</li>
                    <li>I Am Video</li>
                    <li>Form of Communication</li>
                    <li>Website</li>
                    <li>Focus Group Agenda and Results</li>
                    <li>Podcast</li>
                </ul>
              </div>
              <div className="skill-box">
                <h5>Confidently voice thoughts and ideas in group environments.</h5>
                <p>Appropriate content to upload:</p>
                <ul>
                    <li>Form of Communication</li>
                    <li>Meeting Agenda</li>
                    <li>Journal Entry</li>
                    <li>Pitch Video</li>
                </ul>
              </div>
              <div className="skill-box">
                <h5>Translate vision so it is accessible.</h5>
                <p>Appropriate content to upload:</p>
                <ul>
                    <li>Form of Communication</li>
                    <li>Meeting Agenda</li>
                    <li>Podcast</li>
                    <li>Social Media Content</li>
                    <li>Pitch Video</li>
                    <li>Brand Video</li>
                </ul>
              </div>
              <div className="skill-box">
                <h5>Embrace the necessary vulnerabilities of public speaking.</h5>
                <p>Appropriate content to upload:</p>
                <ul>
                    <li>Pitch Video</li>
                    <li>Form of Communication</li>
                    <li>Journal Entry</li>
                    <li>Social Media Content</li>
                    <li>Podcast</li>
                </ul>
              </div>
              <div className="skill-box">
                <h5>Discern valuable data from the context and reactions of audiences.</h5>
                <p>Appropriate content to upload:</p>
                <ul>
                    <li>Survey</li>
                    <li>Form of Communication</li>
                </ul>
              </div>
              <div className="skill-box">
                <h5>Act as the direct messenger of solutions and value.</h5>
                <p>Appropriate content to upload:</p>
                <ul>
                    <li>Pitch Video</li>
                    <li>Form of Communication</li>
                    <li>Journal Entry</li>
                    <li>Podcast</li>
                </ul>
              </div>
              <div className="skill-box">
                <h5>Utilize a myriad of language and visual tools.</h5>
                <p>Appropriate content to upload:</p>
                <ul>
                    <li>Pitch Video</li>
                    <li>Form of Communication</li>
                    <li>Journal Entry</li>
                    <li>Podcast</li>
                </ul>
              </div>
            </div>}
            
            {activePage == 'Adaptability' && <div className='skills-box'>
              <div className="skill-box">
                <h5>Engage with new contexts and perspectives.</h5>
                <p>Appropriate content to upload:</p>
                <ul>
                    <li>Interview Template</li>
                    <li>Survey</li>
                    <li>Meeting Agenda</li>
                    <li>Focus Group</li>
                    <li>Form of Communication</li>
                    <li>Article</li>
                    <li>Market Analysis</li>
                    <li>Industry Analysis</li>
                </ul>
              </div>
              <div className="skill-box">
                <h5>Pivot as new information is discovered.</h5>
                <p>Appropriate content to upload:</p>
                <ul>
                    <li>Sprint Template</li>
                    <li>Project Timeline</li>
                    <li>Article</li>
                    <li>Industry Analysis</li>
                    <li>Market Analysis</li>
                    <li>Concept Plan</li>
                    <li>Business Plan</li>
                    <li>Form of Communication</li>
                    <li>Journal Entry</li>
                </ul>
              </div>
              <div className="skill-box">
                <h5>Respond flexibly to new ideas.</h5>
                <p>Appropriate content to upload:</p>
                <ul>
                    <li>Form of Communication</li>
                    <li>Sprint Template</li>
                    <li>Journal Entry</li>
                    <li>Meeting Agenda</li>
                </ul>
              </div>
              <div className="skill-box">
                <h5>Evaluate the needs and problems of the team and project.</h5>
                <p>Appropriate content to upload:</p>
                <ul>
                    <li>Project Timeline</li>
                    <li>Meeting Agenda</li>
                    <li>Sprint Template</li>
                    <li>Concept Plan</li>
                    <li>Business Plan</li>
                    <li>Form of Communication</li>
                    <li>Journal Entry</li>
                </ul>
              </div>
              <div className="skill-box">
                <h5>View the problem and solution in new ways.</h5>
                <p>Appropriate content to upload:</p>
                <ul>
                    <li>Prototype/Test</li>
                    <li>Concept Plan</li>
                    <li>Industry Analysis</li>
                    <li>Market Analysis</li>
                    <li>Business Plan</li>
                    <li>Form of Communication</li>
                    <li>Journal Entry</li>
                    <li>Article</li>
                </ul>
              </div>
              <div className="skill-box">
                <h5>Alter strategies and approaches in response to obstacles.</h5>
                <p>Appropriate content to upload:</p>
                <ul>
                    <li>Model</li>
                    <li>Business Plan</li>
                    <li>Concept Plan</li>
                    <li>Industry Analysis</li>
                    <li>Market Analysis</li>
                    <li>Article</li>
                    <li>Form of Communication</li>
                    <li>Journal Entry</li>
                </ul>
              </div>
              <div className="skill-box">
                <h5>Use evidence to justify new directions.</h5>
                <p>Appropriate content to upload:</p>
                <ul>
                    <li>Sprint Template</li>
                    <li>Concept Plan</li>
                    <li>Business Plan</li>
                    <li>Project Timeline</li>
                    <li>Prototype/Test</li>
                    <li>Meeting Agenda</li>
                </ul>
              </div>
              <div className="skill-box">
                <h5>Relate story and solutions to specific audiences.</h5>
                <p>Appropriate content to upload:</p>
                <ul>
                    <li>Brand Video</li>
                    <li>Website</li>
                    <li>Article</li>
                    <li>I Am Video</li>
                    <li>Pitch Video</li>
                    <li>Social Media Content</li>
                    <li>Form of Communication</li>
                    <li>Slide Deck</li>
                </ul>
              </div>
            </div>}
            
            {activePage == 'Learning Agility' && <div className='skills-box'>
              <div className="skill-box">
                <h5>Apply lessons learned from experiences.</h5>
                <p>Appropriate content to upload:</p>
                <ul>
                    <li>Article</li>
                    <li>Concept Plan</li>
                    <li>Business Plan</li>
                    <li>Form of Communication</li>
                    <li>Journal Entry</li>
                    <li>Prototype/Test</li>
                    <li>Sprint Template</li>
                    <li>Project Timeline</li>
                </ul>
              </div>
              <div className="skill-box">
                <h5>Make informed decisions by utilizing gathered data.</h5>
                <p>Appropriate content to upload:</p>
                <ul>
                    <li>Concept Plan</li>
                    <li>Business Plan</li>
                    <li>Financial Document</li>
                    <li>Form of Communication</li>
                    <li>Journal Entry</li>
                    <li>Meeting Agenda</li>
                </ul>
              </div>
              <div className="skill-box">
                <h5>Translate knowledge into different contexts.</h5>
                <p>Appropriate content to upload:</p>
                <ul>
                    <li>Article</li>
                    <li>Brand Charter</li>
                    <li>Brand Guidelines Booklet</li>
                    <li>Concept Plan</li>
                    <li>Business Plan</li>
                    <li>Course Certification</li>
                    <li>Journal Entry</li>
                    <li>Model</li>
                    <li>Piece of Art/Code/Music</li>
                    <li>Prototype/Test</li>
                    <li>Slide Deck</li>
                    <li>Social Media Content</li>
                    <li>Website</li>
                    <li>Podcast</li>
                </ul>
              </div>
              <div className="skill-box">
                <h5>Engage in mentorship to gain access to others’ expertise.</h5>
                <p>Appropriate content to upload:</p>
                <ul>
                    <li>Meeting Agenda</li>
                    <li>Interview Template</li>
                    <li>Form of Communication</li>
                    <li>Journal Entry</li>
                </ul>
              </div>
              <div className="skill-box">
                <h5>Lead a team into new knowledge areas.</h5>
                <p>Appropriate content to upload:</p>
                <ul>
                    <li>Project Timeline</li>
                    <li>Sprint Template</li>
                    <li>Meeting Agenda</li>
                </ul>
              </div>
              <div className="skill-box">
                <h5>Add value to a solution.</h5>
                <p>Appropriate content to upload:</p>
                <ul>
                    <li>Prototype/Test</li>
                    <li>Piece of Art/Code/Music</li>
                    <li>Website</li>
                    <li>Business Plan</li>
                </ul>
              </div>
              <div className="skill-box">
                <h5>Demonstrate self-awareness of strengths and weaknesses.</h5>
                <p>Appropriate content to upload:</p>
                <ul>
                    <li>Article</li>
                    <li>Journal Entry</li>
                    <li>Form of Communication</li>
                    <li>Social Media Content</li>
                    <li>Podcast</li>
                    <li>Meeting Agenda</li>
                </ul>
              </div>
              <div className="skill-box">
                <h5>Develop collaborative relationships that add value to a solution.</h5>
                <p>Appropriate content to upload:</p>
                <ul>
                    <li>Meeting Agenda</li>
                    <li>Interview Template</li>
                    <li>Project Timeline</li>
                    <li>Sprint Template</li>
                    <li>Form of Communication</li>
                    <li>Journal Entry</li>
                </ul>
              </div>
            </div>}
            
            {activePage == 'Research Literacy' && <div className='skills-box'>
              <div className="skill-box">
                <h5>Understand and engage with the stories of others in appropriate contexts.</h5>
                <p>Appropriate content to upload:</p>
                <ul>
                    <li>Survey</li>
                    <li>Focus Group Agenda and Results</li>
                    <li>Meeting Agenda</li>
                    <li>Interview Template</li>
                    <li>Form of Communication</li>
                    <li>Journal Entry</li>
                </ul>
              </div>
              <div className="skill-box">
                <h5>Utilize verified sources of information.</h5>
                <p>Appropriate content to upload:</p>
                <ul>
                    <li>Article</li>
                    <li>Concept Plan</li>
                    <li>Business Plan</li>
                    <li>Industry Analysis</li>
                    <li>Market Analysis</li>
                    <li>Website</li>
                    <li>Social Media Content</li>
                    <li>Podcast</li>
                </ul>
              </div>
              <div className="skill-box">
                <h5>Demonstrate credibility in a field of work.</h5>
                <p>Appropriate content to upload:</p>
                <ul>
                    <li>Article</li>
                    <li>Industry Analysis</li>
                    <li>Market Analysis</li>
                    <li>Concept Plan</li>
                    <li>Business Plan</li>
                    <li>Slide Deck</li>
                    <li>Website</li>
                    <li>Social Media Content</li>
                    <li>Brand Video</li>
                </ul>
              </div>
              <div className="skill-box">
                <h5>Justify conclusions and outcomes based on the origins of information.</h5>
                <p>Appropriate content to upload:</p>
                <ul>
                    <li>Article</li>
                    <li>Concept Plan</li>
                    <li>Business Plan</li>
                    <li>Industry Analysis</li>
                    <li>Market Analysis</li>
                    <li>Financial Document</li>
                    <li>Slide Deck</li>
                    <li>Website</li>
                    <li>Journal Entry</li>
                </ul>
              </div>
              <div className="skill-box">
                <h5>Recognize bias in certain hypotheses and redirect.</h5>
                <p>Appropriate content to upload:</p>
                <ul>
                    <li>Survey</li>
                    <li>Focus Group</li>
                    <li>Sprint Template</li>
                    <li>Project Timeline</li>
                    <li>Industry Analysis</li>
                    <li>Market Analysis</li>
                </ul>
              </div>
              <div className="skill-box">
                <h5>Recognize the inherent bias in a given data set to recognize worth and limitations of the data.</h5>
                <p>Appropriate content to upload:</p>
                <ul>
                    <li>Industry Analysis</li>
                    <li>Market Analysis</li>
                    <li>Financial Document</li>
                    <li>Business Plan</li>
                </ul>
              </div>
              <div className="skill-box">
                <h5>Provide clarity and relevance to solutions and value in the market.</h5>
                <p>Appropriate content to upload:</p>
                <ul>
                    <li>Article</li>
                    <li>Brand Charter</li>
                    <li>Brand Video</li>
                    <li>Concept Plan</li>
                    <li>Business Plan</li>
                    <li>Piece of Art/Code/Music</li>
                    <li>Prototype/Test</li>
                    <li>Slide Deck</li>
                    <li>Social Media Content</li>
                    <li>Website</li>
                    <li>Pitch Video</li>
                </ul>
              </div>
              <div className="skill-box">
                <h5>Cite all sources in an appropriate manner.</h5>
                <p>Appropriate content to upload:</p>
                <ul>
                    <li>Article</li>
                    <li>Concept Plan</li>
                    <li>Business Plan</li>
                    <li>Market Analysis</li>
                    <li>Industry Analysis</li>
                    <li>Website</li>
                    <li>Social Media Content</li>
                    <li>Slide Deck</li>
                    <li>Podcast</li>
                </ul>
              </div>
            </div>}
            
            {activePage == 'Comprehension' && <div className='skills-box'>
              <div className="skill-box">
                <h5>Determine the causes of a problem.</h5>
                <p>Appropriate content to upload:</p>
                <ul>
                    <li>Article</li>
                    <li>Brand Video</li>
                    <li>Business Plan</li>
                    <li>Concept Plan</li>
                    <li>Form of Communication</li>
                    <li>Industry Analysis</li>
                    <li>Journal Entry</li>
                    <li>Market Analysis</li>
                    <li>Slide Deck</li>
                    <li>Social Media Content</li>
                    <li>Website</li>
                    <li>Pitch Video</li>
                </ul>
              </div>
              <div className="skill-box">
                <h5>Determine the motivations of market behavior.</h5>
                <p>Appropriate content to upload:</p>
                <ul>
                    <li>Article</li>
                    <li>Brand Guidelines Booklet</li>
                    <li>Business Plan</li>
                    <li>Concept Plan</li>
                    <li>Form of Communication</li>
                    <li>Journal Entry</li>
                    <li>Market Analysis</li>
                    <li>Slide Deck</li>
                    <li>Social Media Content</li>
                    <li>Website</li>
                    <li>Survey</li>
                    <li>Focus Group Agenda and Results</li>
                    <li>Interview Template</li>
                </ul>
              </div>
              <div className="skill-box">
                <h5>Connect with the stories of others.</h5>
                <p>Appropriate content to upload:</p>
                <ul>
                    <li>Brand Guidelines Booklet</li>
                    <li>Branded Material</li>
                    <li>Brand Video</li>
                    <li>Form of Communication</li>
                    <li>Journal Entry</li>
                    <li>Market Analysis</li>
                    <li>Piece of Art/Music</li>
                    <li>Social Media Content</li>
                    <li>Website</li>
                    <li>Focus Group</li>
                    <li>Interview Template</li>
                </ul>
              </div>
              <div className="skill-box">
                <h5>Recognize the nuance of context when approaching different markets.</h5>
                <p>Appropriate content to upload:</p>
                <ul>
                    <li>Article</li>
                    <li>Brand Guidelines Booklet</li>
                    <li>Brand Charter</li>
                    <li>Branded Material</li>
                    <li>Brand Video</li>
                    <li>Concept Plan</li>
                    <li>Business Plan</li>
                    <li>Form of Communication</li>
                    <li>I Am Video</li>
                    <li>Journal Entry</li>
                    <li>Industry Analysis</li>
                    <li>Market Analysis</li>
                    <li>Model</li>
                    <li>Social Media Content</li>
                    <li>Website</li>
                    <li>Podcast</li>
                    <li>Interview Template</li>
                </ul>
              </div>
              <div className="skill-box">
                <h5>Recognize and utilize the relationships between data points.</h5>
                <p>Appropriate content to upload:</p>
                <ul>
                    <li>Article</li>
                    <li>Business Plan</li>
                    <li>Concept Plan</li>
                    <li>Financial Document</li>
                    <li>Industry Analysis</li>
                    <li>Market Analysis</li>
                </ul>
              </div>
              <div className="skill-box">
                <h5>Create hypotheses to test out based on understanding of data.</h5>
                <p>Appropriate content to upload:</p>
                <ul>
                    <li>Sprint Template</li>
                    <li>Project Timeline</li>
                    <li>Survey</li>
                    <li>Focus Group Agenda and Results</li>
                    <li>Meeting Agenda</li>
                    <li>Interview Template</li>
                    <li>Industry Analysis</li>
                    <li>Market Analysis</li>
                    <li>Article</li>
                </ul>
              </div>
              <div className="skill-box">
                <h5>Connect new knowledge with what is already known.</h5>
                <p>Appropriate content to upload:</p>
                <ul>
                    <li>Article</li>
                    <li>Business Plan</li>
                    <li>Concept Plan</li>
                    <li>Industry Analysis</li>
                    <li>Market Analysis</li>
                    <li>Journal Entry</li>
                    <li>Form of Communication</li>
                    <li>Slide Deck</li>
                    <li>Social Media Content</li>
                    <li>Website</li>
                </ul>
              </div>
              <div className="skill-box">
                <h5>Take action based on the interpretation of data.</h5>
                <p>Appropriate content to upload:</p>
                <ul>
                    <li>Article</li>
                    <li>Brand Charter</li>
                    <li>Brand Guidelines Booklet</li>
                    <li>Branded Material</li>
                    <li>Brand Video</li>
                    <li>Business Plan</li>
                    <li>Concept Plan</li>
                    <li>Form of Communication</li>
                    <li>I Am Video</li>
                    <li>Model</li>
                    <li>Piece of Art/Code/Music</li>
                    <li>Prototype/Test</li>
                    <li>Social Media Content</li>
                    <li>Website</li>
                    <li>Pitch Video</li>
                    <li>Podcast</li>
                    <li>Meeting Agenda</li>
                </ul>
              </div>
            </div>}
            
            {activePage == 'Innovation' && <div className='skills-box'>
              <div className="skill-box">
                <h5>Change the lens through which a problem is viewed.</h5>
                <p>Appropriate content to upload:</p>
                <ul>
                    <li>Article</li>
                    <li>Business Plan</li>
                    <li>Concept Plan</li>
                    <li>Brand Video</li>
                    <li>Industry Analysis</li>
                    <li>Market Analysis</li>
                    <li>Model</li>
                    <li>Slide Deck</li>
                    <li>Social Media Content</li>
                    <li>Website</li>
                    <li>Podcast</li>
                </ul>
              </div>
              <div className="skill-box">
                <h5>Bring something new, unique, or yet to be considered into existence.</h5>
                <p>Appropriate content to upload:</p>
                <ul>
                    <li>Model</li>
                    <li>Piece of Art/Code/Music</li>
                    <li>Prototype/Test</li>
                    <li>Slide Deck</li>
                    <li>Social Media Content</li>
                    <li>Website</li>
                    <li>Podcast</li>
                </ul>
              </div>
              <div className="skill-box">
                <h5>Seize opportunities to change approaches to different target populations.</h5>
                <p>Appropriate content to upload:</p>
                <ul>
                    <li>Industry Analysis</li>
                    <li>Market Analysis</li>
                    <li>Sprint Template</li>
                    <li>Project Timeline</li>
                    <li>Survey</li>
                    <li>Focus Group Agenda and Results</li>
                    <li>Interview Template</li>
                </ul>
              </div>
              <div className="skill-box">
                <h5>Allow for the convergence of different perspectives when iterating on a solution.</h5>
                <p>Appropriate content to upload:</p>
                <ul>
                    <li>Business Plan</li>
                    <li>Concept Plan</li>
                    <li>Industry Analysis</li>
                    <li>Market Analysis</li>
                    <li>Survey</li>
                    <li>Focus Group Agenda and Results</li>
                    <li>Interview Template</li>
                </ul>
              </div>
              <div className="skill-box">
                <h5>Explore new curiosities.</h5>
                <p>Appropriate content to upload:</p>
                <ul>
                    <li>Article</li>
                    <li>Course Certification</li>
                    <li>Form of Communication</li>
                    <li>Journal Entry</li>
                    <li>Model</li>
                    <li>Survey</li>
                    <li>Focus Group Agenda and Results</li>
                    <li>Interview Template</li>
                </ul>
              </div>
              <div className="skill-box">
                <h5>Utilize new tools in the process of solution iteration.</h5>
                <p>Appropriate content to upload:</p>
                <ul>
                    <li>Business Plan</li>
                    <li>Concept Plan</li>
                    <li>Journal Entry</li>
                    <li>Model</li>
                    <li>Piece of Art/Code/Music</li>
                    <li>Prototype/Test</li>
                </ul>
              </div>
              <div className="skill-box">
                <h5>Take risks in pursuit of alternative solutions.</h5>
                <p>Appropriate content to upload:</p>
                <ul>
                    <li>Sprint Template</li>
                    <li>Project Timeline</li>
                    <li>Business Plan</li>
                    <li>Concept Plan</li>
                    <li>Piece of Art/Code/Music</li>
                    <li>Prototype/Test</li>
                </ul>
              </div>
              <div className="skill-box">
                <h5>Change the delivery of solutions.</h5>
                <p>Appropriate content to upload:</p>
                <ul>
                    <li>Brand Video</li>
                    <li>Financial Document</li>
                    <li>Model</li>
                    <li>Journal Entry</li>
                    <li>Piece of Art/Code/Music</li>
                    <li>Prototype/Test</li>
                    <li>Slide Deck</li>
                    <li>Social Media Content</li>
                    <li>Website</li>
                    <li>Project Timeline</li>
                </ul>
              </div>
            </div>}
            
            {activePage == 'Project Management' && <div className='skills-box'>
              <div className="skill-box">
                <h5>Create and execute a project timeline.</h5>
                <p>Appropriate content to upload:</p>
                <ul>
                    <li>Project Timeline</li>
                    <li>Sprint Template</li>
                </ul>
              </div>
              <div className="skill-box">
                <h5>Structure and reinforce the framework of a project.</h5>
                <p>Appropriate content to upload:</p>
                <ul>
                    <li>Project Timeline</li>
                    <li>Sprint Template</li>
                    <li>Meeting Agenda</li>
                    <li>Form of Communication</li>
                </ul>
              </div>
              <div className="skill-box">
                <h5>Delegate responsibilities efficiently and appropriately based on a team’s strengths and weaknesses.</h5>
                <p>Appropriate content to upload:</p>
                <ul>
                    <li>Project Timeline</li>
                    <li>Sprint Template</li>
                    <li>Meeting Agenda</li>
                    <li>Form of Communication</li>
                    <li>Journal Entry</li>
                </ul>
              </div>
              <div className="skill-box">
                <h5>Evaluate the progress of a project.</h5>
                <p>Appropriate content to upload:</p>
                <ul>
                    <li>Project Timeline</li>
                    <li>Sprint Template</li>
                    <li>Form of Communication</li>
                    <li>Journal Entry</li>
                    <li>Meeting Agenda</li>
                </ul>
              </div>
              <div className="skill-box">
                <h5>Institute different approaches to different project needs.</h5>
                <p>Appropriate content to upload:</p>
                <ul>
                    <li>Project Timeline</li>
                    <li>Sprint Template</li>
                    <li>Form of Communication</li>
                    <li>Journal Entry</li>
                    <li>Meeting Agenda</li>
                </ul>
              </div>
              <div className="skill-box">
                <h5>Isolate problems to prevent them from affecting the entire project or team.</h5>
                <p>Appropriate content to upload:</p>
                <ul>
                    <li>Project Timeline</li>
                    <li>Sprint Template</li>
                    <li>Form of Communication</li>
                    <li>Journal Entry</li>
                    <li>Meeting Agenda</li>
                </ul>
              </div>
              <div className="skill-box">
                <h5>Track how a failure point might reverberate and affect different aspects of a project.</h5>
                <p>Appropriate content to upload:</p>
                <ul>
                    <li>Project Timeline</li>
                    <li>Sprint Template</li>
                    <li>Form of Communication</li>
                    <li>Journal Entry</li>
                    <li>Meeting Agenda</li>
                </ul>
              </div>
              <div className="skill-box">
                <h5>Maintain consistency of value throughout a project’s execution.</h5>
                <p>Appropriate content to upload:</p>
                <ul>
                    <li>Project Timeline</li>
                    <li>Sprint Template</li>
                    <li>Form of Communication</li>
                    <li>Journal Entry</li>
                    <li>Meeting Agenda</li>
                    <li>Brand Charter</li>
                    <li>Brand Guidelines Booklet</li>
                </ul>
              </div>
            </div>}
            
            {activePage == 'Self-Discipline' && <div className='skills-box'>
              <div className="skill-box">
                <h5>Exercise self-awareness in order to reflect and make appropriate decisions and pivots.</h5>
                <p>Appropriate content to upload:</p>
                <ul>
                    <li>Project Timeline</li>
                    <li>Sprint Template</li>
                    <li>Journal Entry</li>
                </ul>
              </div>
              <div className="skill-box">
                <h5>Exercise social-awareness to prevent failure points.</h5>
                <p>Appropriate content to upload:</p>
                <ul>
                    <li>Journal Entry</li>
                    <li>Market Analysis</li>
                    <li>Survey</li>
                    <li>Focus Group Agenda and Results</li>
                    <li>Interview Template</li>
                    <li>Brand Video</li>
                    <li>I Am Video</li>
                    <li>Brand Charter</li>
                    <li>Brand Guidelines Booklet</li>
                </ul>
              </div>
              <div className="skill-box">
                <h5>Model an appropriate work ethic.</h5>
                <p>Appropriate content to upload:</p>
                <ul>
                    <li>Project Timeline</li>
                    <li>Sprint Template</li>
                    <li>Journal Entry</li>
                    <li>Meeting Agenda</li>
                </ul>
              </div>
              <div className="skill-box">
                <h5>Solve problems when they arise.</h5>
                <p>Appropriate content to upload:</p>
                <ul>
                    <li>Meeting Agenda</li>
                    <li>Project Timeline</li>
                    <li>Sprint Template</li>
                    <li>Journal Entry</li>
                    <li>Form of Communication</li>
                </ul>
              </div>
              <div className="skill-box">
                <h5>Take responsibility for failure points.</h5>
                <p>Appropriate content to upload:</p>
                <ul>
                    <li>Form of Communication</li>
                    <li>Journal Entry</li>
                    <li>Meeting Agenda</li>
                </ul>
              </div>
              <div className="skill-box">
                <h5>Evaluate actions based on evidence and data.</h5>
                <p>Appropriate content to upload:</p>
                <ul>
                    <li>Journal Entry</li>
                    <li>Form of Communication</li>
                    <li>Meeting Agenda</li>
                    <li>Project Timeline</li>
                    <li>Sprint Template</li>
                </ul>
              </div>
              <div className="skill-box">
                <h5>Create a timeline of self-development.</h5>
                <p>Appropriate content to upload:</p>
                <ul>
                    <li>Project Timeline</li>
                    <li>Sprint Template</li>
                    <li>Journal Entry</li>
                </ul>
              </div>
              <div className="skill-box">
                <h5>Demonstrate both confidence and humility when presenting value and solutions.</h5>
                <p>Appropriate content to upload:</p>
                <ul>
                    <li>Pitch Video</li>
                    <li>I Am Video</li>
                </ul>
              </div>
            </div>}
            
            {activePage == 'Risk-Taking' && <div className='skills-box'>
              <div className="skill-box">
                <h5>Assign value to and take advantage of opportunities.</h5>
                <p>Appropriate content to upload:</p>
                <ul>
                    <li>Journal Entry</li>
                    <li>Form of Communication</li>
                    <li>Meeting Agenda</li>
                    <li>Concept Plan</li>
                    <li>Business Plan</li>
                </ul>
              </div>
              <div className="skill-box">
                <h5>Lead teams through obstacles and into opportunities.</h5>
                <p>Appropriate content to upload:</p>
                <ul>
                    <li>Project Timeline</li>
                    <li>Sprint Template</li>
                    <li>Meeting Agenda</li>
                    <li>Form of Communication</li>
                </ul>
              </div>
              <div className="skill-box">
                <h5>Be open to influence and mentorship.</h5>
                <p>Appropriate content to upload:</p>
                <ul>
                    <li>Interview Template</li>
                    <li>Meeting Agenda</li>
                    <li>Form of Communication</li>
                    <li>Journal Entry</li>
                </ul>
              </div>
              <div className="skill-box">
                <h5>Identify the possible outcomes of a particular risk.</h5>
                <p>Appropriate content to upload:</p>
                <ul>
                    <li>Concept Plan</li>
                    <li>Business Plan</li>
                    <li>Article</li>
                    <li>Industry Analysis</li>
                    <li>Market Analysis</li>
                </ul>
              </div>
              <div className="skill-box">
                <h5>Create a system for evaluating and assessing possible risks.</h5>
                <p>Appropriate content to upload:</p>
                <ul>
                    <li>Model</li>
                    <li>Concept Plan</li>
                    <li>Business Plan</li>
                    <li>Journal Entry</li>
                </ul>
              </div>
              <div className="skill-box">
                <h5>Enter solutions into the market.</h5>
                <p>Appropriate content to upload:</p>
                <ul>
                    <li>Brand Video</li>
                    <li>Pitch Video</li>
                    <li>Slide Deck</li>
                    <li>Piece of Art/Code/Music</li>
                    <li>Prototype/Test</li>
                </ul>
              </div>
              <div className="skill-box">
                <h5>Accept failure as an outcome and utilize the data from failure.</h5>
                <p>Appropriate content to upload:</p>
                <ul>
                    <li>Journal Entry</li>
                    <li>Market Analysis</li>
                    <li>Business Plan</li>
                </ul>
              </div>
              <div className="skill-box">
                <h5>Decrease the level of failure associated with a specific risk.</h5>
                <p>Appropriate content to upload:</p>
                <ul>
                    <li>Concept Plan</li>
                    <li>Business Plan</li>
                    <li>Journal Entry</li>
                    <li>Meeting Agenda</li>
                </ul>
              </div>
            </div>}
            
            {activePage == 'Influence and Collaboration' && <div className='skills-box'>
              <div className="skill-box">
                <h5>Spread new ideas to new populations.</h5>
                <p>Appropriate content to upload:</p>
                <ul>
                    <li>Brand Video</li>
                    <li>Branded Material</li>
                    <li>Slide Deck</li>
                    <li>I Am Video</li>
                    <li>Pitch Video</li>
                    <li>Social Media Content</li>
                    <li>Website</li>
                    <li>Podcast</li>
                </ul>
              </div>
              <div className="skill-box">
                <h5>Evaluate the barriers in reaching a specific market.</h5>
                <p>Appropriate content to upload:</p>
                <ul>
                    <li>Market Analysis</li>
                    <li>Survey</li>
                    <li>Focus Group</li>
                    <li>Business Plan</li>
                </ul>
              </div>
              <div className="skill-box">
                <h5>Improve the experience of others.</h5>
                <p>Appropriate content to upload:</p>
                <ul>
                    <li>Piece of Art/Code/Music</li>
                    <li>Prototype/Test</li>
                    <li>Website</li>
                    <li>Social Media Content</li>
                </ul>
              </div>
              <div className="skill-box">
                <h5>Push a market towards new behaviors.</h5>
                <p>Appropriate content to upload:</p>
                <ul>
                    <li>Brand Video</li>
                    <li>Pitch Video</li>
                    <li>Piece of Art/Code/Music</li>
                    <li>Prototype/Test</li>
                    <li>Social Media Content</li>
                    <li>Website</li>
                </ul>
              </div>
              <div className="skill-box">
                <h5>Tell a particular story using data points.</h5>
                <p>Appropriate content to upload:</p>
                <ul>
                    <li>Brand Video</li>
                    <li>Pitch Video</li>
                    <li>Piece of Art/Code/Music</li>
                    <li>Prototype/Test</li>
                    <li>Social Media Content</li>
                    <li>Website</li>
                    <li>I Am Video</li>
                </ul>
              </div>
              <div className="skill-box">
                <h5>Purposefully affect outcomes.</h5>
                <p>Appropriate content to upload:</p>
                <ul>
                    <li>Concept Plan</li>
                    <li>Business Plan</li>
                    <li>Project Timeline</li>
                    <li>Sprint Template</li>
                    <li>Journal Entry</li>
                </ul>
              </div>
              <div className="skill-box">
                <h5>Control the perception of solutions and value.</h5>
                <p>Appropriate content to upload:</p>
                <ul>
                    <li>Brand Video</li>
                    <li>Pitch Video</li>
                    <li>Piece of Art/Code/Music</li>
                    <li>Prototype/Test</li>
                    <li>Social Media Content</li>
                    <li>Website</li>
                    <li>I Am Video</li>
                    <li>Brand Charter</li>
                    <li>Brand Guidelines Booklet</li>
                    <li>Brand Vehicle</li>
                </ul>
              </div>
              <div className="skill-box">
                <h5>Redirect a team after experiencing failure.</h5>
                <p>Appropriate content to upload:</p>
                <ul>
                    <li>Project Timeline</li>
                    <li>Sprint Template</li>
                    <li>Meeting Agenda</li>
                    <li>Form of Communication</li>
                </ul>
              </div>
            </div>}
            
            {activePage == 'Digital Etiquette' && <div className='skills-box'>
              <div className="skill-box">
                <h5>Take control over any digital presence.</h5>
                <p>Appropriate content to upload:</p>
                <ul>
                    <li>Brand Charter</li>
                    <li>Brand Guidelines Booklet</li>
                    <li>Branded Material</li>
                    <li>Brand Vehicle</li>
                    <li>Brand Video</li>
                    <li>Form of Communication</li>
                    <li>I Am Video</li>
                    <li>Social Media Content</li>
                    <li>Website</li>
                    <li>Podcast</li>
                </ul>
              </div>
              <div className="skill-box">
                <h5>Exercise caution in online communications.</h5>
                <p>Appropriate content to upload:</p>
                <ul>
                    <li>Form of Communication</li>
                    <li>Website</li>
                    <li>Social Media Content</li>
                </ul>
              </div>
              <div className="skill-box">
                <h5>Demonstrate the difference between social and professional communications.</h5>
                <p>Appropriate content to upload:</p>
                <ul>
                    <li>Form of Communication</li>
                    <li>Website</li>
                    <li>Social Media Content</li>
                    <li>Brand Guidelines Booklet</li>
                </ul>
              </div>
              <div className="skill-box">
                <h5>Craft solutions appropriate for a user population within a specific medium.</h5>
                <p>Appropriate content to upload:</p>
                <ul>
                    <li>Brand Charter</li>
                    <li>Brand Guidelines Booklet</li>
                    <li>Branded Material</li>
                    <li>Brand Vehicle</li>
                    <li>Brand Video</li>
                    <li>I Am Video</li>
                    <li>Piece of Art/Code/Music</li>
                    <li>Prototype/Test</li>
                    <li>Social Media Content</li>
                    <li>Website</li>
                    <li>Podcast</li>
                </ul>
              </div>
              <div className="skill-box">
                <h5>Ensure all cross-team communications reflect the values of the team culture.</h5>
                <p>Appropriate content to upload:</p>
                <ul>
                    <li>Brand Charter</li>
                    <li>Culture Charter</li>
                    <li>Form of Communication</li>
                    <li>Meeting Agenda</li>
                </ul>
              </div>
              <div className="skill-box">
                <h5>Cite sources and derive all data from ethical sources.</h5>
                <p>Appropriate content to upload:</p>
                <ul>
                    <li>Article</li>
                    <li>Business Plan</li>
                    <li>Concept Plan</li>
                    <li>Industry Analysis</li>
                    <li>Market Analysis</li>
                    <li>Slide Deck</li>
                    <li>Social Media Content</li>
                    <li>Website</li>
                    <li>Podcast</li>
                </ul>
              </div>
              <div className="skill-box">
                <h5>Use digital tools appropriately.</h5>
                <p>Appropriate content to upload:</p>
                <ul>
                    <li>Website</li>
                    <li>Social Media Content</li>
                    <li>Podcast</li>
                </ul>
              </div>
              <div className="skill-box">
                <h5>Carefully curate all language and visual choices in digital mediums.</h5>
                <p>Appropriate content to upload:</p>
                <ul>
                    <li>Brand Charter</li>
                    <li>Brand Guidelines Booklet</li>
                    <li>Branded Material</li>
                    <li>Brand Vehicle</li>
                    <li>Brand Video</li>
                    <li>I Am Video</li>
                    <li>Piece of Art/Code/Music</li>
                    <li>Prototype/Test</li>
                    <li>Slide Deck</li>
                    <li>Social Media Content</li>
                    <li>Website</li>
                    <li>Podcast</li>
                </ul>
              </div>
            </div>}
            
            {activePage == 'Communication Across Mediums' && <div className='skills-box'>
              <div className="skill-box">
                <h5>Recognize that individuals and groups need different levels and types of communication.</h5>
                <p>Appropriate content to upload:</p>
                <ul>
                    <li>Culture Charter</li>
                    <li>Meeting Agenda</li>
                    <li>Journal Entry</li>
                    <li>Form of Communication</li>
                </ul>
              </div>
              <div className="skill-box">
                <h5>Engage with industry experts while solving a problem.</h5>
                <p>Appropriate content to upload:</p>
                <ul>
                    <li>Interview Template</li>
                    <li>Meeting Agenda</li>
                </ul>
              </div>
              <div className="skill-box">
                <h5>Expand methods of connecting with markets.</h5>
                <p>Appropriate content to upload:</p>
                <ul>
                    <li>Business Plan</li>
                    <li>Market Analysis</li>
                    <li>Project Timeline</li>
                    <li>Social Media Content</li>
                    <li>Website</li>
                    <li>Survey</li>
                    <li>Focus Group Agenda and Results</li>
                    <li>Interview Template</li>
                </ul>
              </div>
              <div className="skill-box">
                <h5>Use data to support the messaging of communications.</h5>
                <p>Appropriate content to upload:</p>
                <ul>
                    <li>Industry Analysis</li>
                    <li>Market Analysis</li>
                    <li>Form of Communication</li>
                    <li>Data Set</li>
                </ul>
              </div>
              <div className="skill-box">
                <h5>Communicate failure points honestly.</h5>
                <p>Appropriate content to upload:</p>
                <ul>
                    <li>Form of Communication</li>
                    <li>Meeting Agenda</li>
                    <li>Journal Entry</li>
                </ul>
              </div>
              <div className="skill-box">
                <h5>Establish a meaningful work culture within a team by creating a communication system.</h5>
                <p>Appropriate content to upload:</p>
                <ul>
                    <li>Culture Charter</li>
                    <li>Model</li>
                    <li>Meeting Agenda</li>
                    <li>Form of Communication</li>
                </ul>
              </div>
              <div className="skill-box">
                <h5>Use appropriate language when communicating with others.</h5>
                <p>Appropriate content to upload:</p>
                <ul>
                    <li>Form of Communication</li>
                    <li>Social Media Content</li>
                    <li>Meeting Agenda</li>
                    <li>Culture Charter</li>
                </ul>
              </div>
              <div className="skill-box">
                <h5>Reach different audiences in different contexts with specific value propositions.</h5>
                <p>Appropriate content to upload:</p>
                <ul>
                    <li>Brand Video</li>
                    <li>Business Plan</li>
                    <li>Piece of Art/Code/Music</li>
                    <li>Prototype/Test</li>
                    <li>Social Media Content</li>
                    <li>Website</li>
                    <li>Podcast</li>
                </ul>
              </div>
            </div>}
            
            {activePage == 'Proactivity' && <div className='skills-box'>
              <div className="skill-box">
                <h5>Set goals and create timelines for achieving them.</h5>
                <p>Appropriate content to upload:</p>
                <ul>
                    <li>Project Timeline</li>
                    <li>Sprint Template</li>
                    <li>Meeting Agenda</li>
                    <li>Journal Entry</li>
                </ul>
              </div>
              <div className="skill-box">
                <h5>Discard unnecessary and disproven hypotheses.</h5>
                <p>Appropriate content to upload:</p>
                <ul>
                    <li>Data Set</li>
                    <li>Business Plan</li>
                    <li>Journal Entry</li>
                    <li>Survey</li>
                    <li>Focus Group</li>
                </ul>
              </div>
              <div className="skill-box">
                <h5>Engage and question different solution iterations.</h5>
                <p>Appropriate content to upload:</p>
                <ul>
                    <li>Model</li>
                    <li>Prototype/Test</li>
                    <li>Piece of Art/Code/Music</li>
                    <li>Sprint Template</li>
                    <li>Project Timeline</li>
                </ul>
              </div>
              <div className="skill-box">
                <h5>Plan for potential failure experiences.</h5>
                <p>Appropriate content to upload:</p>
                <ul>
                    <li>Project Timeline</li>
                    <li>Concept Plan</li>
                    <li>Business Plan</li>
                </ul>
              </div>
              <div className="skill-box">
                <h5>Widen the lens through which data is viewed.</h5>
                <p>Appropriate content to upload:</p>
                <ul>
                    <li>Data Set</li>
                    <li>Article</li>
                    <li>Industry Analysis</li>
                    <li>Market Analysis</li>
                    <li>Interview Template</li>
                </ul>
              </div>
              <div className="skill-box">
                <h5>Recognize the nuances of different contexts prior to engagement.</h5>
                <p>Appropriate content to upload:</p>
                <ul>
                    <li>Industry Analysis</li>
                    <li>Market Analysis</li>
                    <li>Survey</li>
                    <li>Focus Group Agenda and Results</li>
                    <li>Interview Template</li>
                </ul>
              </div>
              <div className="skill-box">
                <h5>Exert control in unpredictable situations.</h5>
                <p>Appropriate content to upload:</p>
                <ul>
                    <li>Project Timeline</li>
                    <li>Sprint Template</li>
                    <li>Journal Entry</li>
                    <li>Form of Communication</li>
                    <li>Meeting Agenda</li>
                </ul>
              </div>
              <div className="skill-box">
                <h5>Communicate with all interested parties when a problem arises.</h5>
                <p>Appropriate content to upload:</p>
                <ul>
                    <li>Form of Communication</li>
                    <li>Culture Charter</li>
                    <li>Meeting Agenda</li>
                </ul>
              </div>
            </div>}
            
            {activePage == 'Data Analysis' && <div className='skills-box'>
              <div className="skill-box">
                <h5>Use an evidence-based approach to problem-solving.</h5>
                <p>Appropriate content to upload:</p>
                <ul>
                    <li>Model</li>
                    <li>Data Set</li>
                    <li>Industry Analysis</li>
                    <li>Market Analysis</li>
                    <li>Concept Plan</li>
                    <li>Business Plan</li>
                </ul>
              </div>
              <div className="skill-box">
                <h5>Collect an appropriate sample size before evaluating data and making inferences.</h5>
                <p>Appropriate content to upload:</p>
                <ul>
                    <li>Data Set</li>
                    <li>Survey</li>
                    <li>Focus Group Agenda and Results</li>
                    <li>Interview Template</li>
                </ul>
              </div>
              <div className="skill-box">
                <h5>Test a hypothesis before taking action.</h5>
                <p>Appropriate content to upload:</p>
                <ul>
                    <li>Data Set</li>
                    <li>Sprint Template</li>
                    <li>Project Timeline</li>
                    <li>Survey</li>
                    <li>Focus Group Agenda and Results</li>
                    <li>Model</li>
                </ul>
              </div>
              <div className="skill-box">
                <h5>Discern the relevance of data.</h5>
                <p>Appropriate content to upload:</p>
                <ul>
                    <li>Data Set</li>
                    <li>Industry Analysis</li>
                    <li>Market Analysis</li>
                    <li>Article</li>
                    <li>Business Plan</li>
                    <li>Concept Plan</li>
                </ul>
              </div>
              <div className="skill-box">
                <h5>Compare data sets before taking action.</h5>
                <p>Appropriate content to upload:</p>
                <ul>
                    <li>Data Set</li>
                    <li>Industry Analysis</li>
                    <li>Market Analysis</li>
                    <li>Sprint Template</li>
                    <li>Project Timeline</li>
                </ul>
              </div>
              <div className="skill-box">
                <h5>Respond to the wants and needs of a target market.</h5>
                <p>Appropriate content to upload:</p>
                <ul>
                    <li>Market Analysis</li>
                    <li>Survey</li>
                    <li>Focus Group Agenda and Results</li>
                    <li>Prototype/Test</li>
                </ul>
              </div>
              <div className="skill-box">
                <h5>Utilize data to prove a solution’s value.</h5>
                <p>Appropriate content to upload:</p>
                <ul>
                    <li>Prototype/Test</li>
                    <li>Survey</li>
                    <li>Focus Group Agenda and Results</li>
                    <li>Data Sets</li>
                </ul>
              </div>
              <div className="skill-box">
                <h5>Communicate data and interpretations through visual aids.</h5>
                <p>Appropriate content to upload:</p>
                <ul>
                    <li>Slide Deck</li>
                    <li>Website</li>
                    <li>Brand Video</li>
                    <li>Branded Material</li>
                    <li>Social Media Content</li>
                </ul>
              </div>
            </div>}
            
            {activePage == 'Digital Literacy' && <div className='skills-box'>
              <div className="skill-box">
                <h5>Increase the means of navigation, solution creation, and communication.</h5>
                <p>Appropriate content to upload:</p>
                <ul>
                    <li>Prototype/Test</li>
                    <li>Branded Material</li>
                    <li>Piece of Art/Code/Music</li>
                    <li>Social Media Content</li>
                    <li>Website</li>
                    <li>Podcast</li>
                </ul>
              </div>
              <div className="skill-box">
                <h5>Expand the level of creativity used in solution iteration.</h5>
                <p>Appropriate content to upload:</p>
                <ul>
                    <li>Prototype/Test</li>
                    <li>Piece of Art/Code/Music</li>
                    <li>Social Media Content</li>
                    <li>Website</li>
                    <li>Podcast</li>
                </ul>
              </div>
              <div className="skill-box">
                <h5>Reach more people through the use of technology.</h5>
                <p>Appropriate content to upload:</p>
                <ul>
                    <li>Website</li>
                    <li>Social Media Content</li>
                    <li>Brand Video</li>
                    <li>Branded Material</li>
                    <li>Brand Vehicle</li>
                </ul>
              </div>
              <div className="skill-box">
                <h5>Work and communicate more efficiently with a team.</h5>
                <p>Appropriate content to upload:</p>
                <ul>
                    <li>Form of Communication</li>
                    <li>Meeting Agenda</li>
                </ul>
              </div>
              <div className="skill-box">
                <h5>Engage with new digital tools to solve problems.</h5>
                <p>Appropriate content to upload:</p>
                <ul>
                    <li>Business Plan</li>
                    <li>Concept Plan</li>
                    <li>Piece of Art/Code/Music</li>
                    <li>Prototype/Test</li>
                </ul>
              </div>
              <div className="skill-box">
                <h5>Use digital tools to enhance the communication of solutions.</h5>
                <p>Appropriate content to upload:</p>
                <ul>
                    <li>Branded Material</li>
                    <li>Brand Vehicle</li>
                    <li>Brand Video</li>
                    <li>I Am Video</li>
                    <li>Pitch Video</li>
                    <li>Slide Deck</li>
                    <li>Social Media Content</li>
                    <li>Website</li>
                </ul>
              </div>
              <div className="skill-box">
                <h5>Create digital content for specific audiences.</h5>
                <p>Appropriate content to upload:</p>
                <ul>
                    <li>Branded Material</li>
                    <li>Brand Guidelines Booklet</li>
                    <li>Brand Charter</li>
                    <li>Brand Vehicle</li>
                    <li>Brand Video</li>
                    <li>I Am Video</li>
                    <li>Pitch Video</li>
                    <li>Slide Deck</li>
                    <li>Social Media Content</li>
                    <li>Website</li>
                </ul>
              </div>
              <div className="skill-box">
                <h5>Increase the market’s engagement with the team’s digital content.</h5>
                <p>Appropriate content to upload:</p>
                <ul>
                    <li>Website</li>
                    <li>Social Media Content</li>
                    <li>Brand Video</li>
                    <li>Podcast</li>
                </ul>
              </div>
            </div>}
            
            {activePage == 'Conflict Management' && <div className='skills-box'>
              <div className="skill-box">
                <h5>Cross cultural, social and political divisions.</h5>
                <p>Appropriate content to upload:</p>
                <ul>
                    <li>Meeting Agenda</li>
                    <li>Form of Communication</li>
                    <li>Culture Charter</li>
                </ul>
              </div>
              <div className="skill-box">
                <h5>Strengthen the collaborative culture of a team.</h5>
                <p>Appropriate content to upload:</p>
                <ul>
                    <li>Meeting Agenda</li>
                    <li>Form of Communication</li>
                    <li>Culture Charter</li>
                </ul>
              </div>
              <div className="skill-box">
                <h5>Problem-solve in working relationships.</h5>
                <p>Appropriate content to upload:</p>
                <ul>
                    <li>Meeting Agenda</li>
                    <li>Form of Communication</li>
                    <li>Culture Charter</li>
                </ul>
              </div>
              <div className="skill-box">
                <h5>Create a working environment that remains open to new ideas.</h5>
                <p>Appropriate content to upload:</p>
                <ul>
                    <li>Meeting Agenda</li>
                    <li>Form of Communication</li>
                    <li>Culture Charter</li>
                </ul>
              </div>
              <div className="skill-box">
                <h5>Take responsibility for problems within a team or project.</h5>
                <p>Appropriate content to upload:</p>
                <ul>
                    <li>Meeting Agenda</li>
                    <li>Form of Communication</li>
                    <li>Culture Charter</li>
                </ul>
              </div>
              <div className="skill-box">
                <h5>Encourage open debate regarding the results and use of data.</h5>
                <p>Appropriate content to upload:</p>
                <ul>
                    <li>Meeting Agenda</li>
                    <li>Form of Communication</li>
                    <li>Culture Charter</li>
                </ul>
              </div>
              <div className="skill-box">
                <h5>Actively listen and utilize critical feedback.</h5>
                <p>Appropriate content to upload:</p>
                <ul>
                    <li>Meeting Agenda</li>
                    <li>Form of Communication</li>
                    <li>Culture Charter</li>
                </ul>
              </div>
              <div className="skill-box">
                <h5>Keep projects moving forward in the face of obstacles.</h5>
                <p>Appropriate content to upload:</p>
                <ul>
                    <li>Meeting Agenda</li>
                    <li>Form of Communication</li>
                    <li>Culture Charter</li>
                    <li>Project Timeline</li>
                    <li>Sprint Template</li>
                </ul>
              </div>
            </div>}
            
            {activePage == 'Financial Literacy' && <div className='skills-box'>
              <div className="skill-box">
                <h5>Engage in new levels of personal and professional independence.</h5>
                <p>Appropriate content to upload:</p>
                <ul>
                    <li>Financial Document</li>
                    <li>Business Plan</li>
                    <li>Concept Plan</li>
                    <li>Project Timeline</li>
                </ul>
              </div>
              <div className="skill-box">
                <h5>Understand the economic contexts of different markets.</h5>
                <p>Appropriate content to upload:</p>
                <ul>
                    <li>Industry Analysis</li>
                    <li>Market Analysis</li>
                    <li>Survey</li>
                    <li>Focus Group Agenda and Results</li>
                    <li>Data Set</li>
                </ul>
              </div>
              <div className="skill-box">
                <h5>Efficiently utilize resources when solving a problem.</h5>
                <p>Appropriate content to upload:</p>
                <ul>
                    <li>Project Timeline</li>
                    <li>Sprint Template</li>
                    <li>Financial Document</li>
                </ul>
              </div>
              <div className="skill-box">
                <h5>Recognize the financial implications of project decisions.</h5>
                <p>Appropriate content to upload:</p>
                <ul>
                    <li>Project Timeline</li>
                    <li>Financial Document</li>
                    <li>Business Plan</li>
                    <li>Concept Plan</li>
                </ul>
              </div>
              <div className="skill-box">
                <h5>Lead a financially responsible team.</h5>
                <p>Appropriate content to upload:</p>
                <ul>
                    <li>Business Plan</li>
                    <li>Concept Plan</li>
                    <li>Financial Document</li>
                    <li>Project Timeline</li>
                </ul>
              </div>
              <div className="skill-box">
                <h5>Use an evidence-based approach to the allocation of resources.</h5>
                <p>Appropriate content to upload:</p>
                <ul>
                    <li>Business Plan</li>
                    <li>Concept Plan</li>
                    <li>Financial Document</li>
                    <li>Data Set</li>
                </ul>
              </div>
              <div className="skill-box">
                <h5>Choose efficient means of communicating solutions and value.</h5>
                <p>Appropriate content to upload:</p>
                <ul>
                    <li>Project Timeline</li>
                    <li>Business Plan</li>
                </ul>
              </div>
              <div className="skill-box">
                <h5>Plan for the loss of resources.</h5>
                <p>Appropriate content to upload:</p>
                <ul>
                    <li>Project Timeline</li>
                    <li>Business Plan</li>
                    <li>Financial Document</li>
                </ul>
              </div>
            </div>}
            
            {activePage == 'Modeling' && <div className='skills-box'>
              <div className="skill-box">
                <h5>Institute processes for problem-solving.</h5>
                <p>Appropriate content to upload:</p>
                <ul>
                    <li>Model</li>
                    <li>Culture Charter</li>
                    <li>Project Timeline</li>
                    <li>Sprint Template</li>
                </ul>
              </div>
              <div className="skill-box">
                <h5>Clearly communicate the process of ideation to execution.</h5>
                <p>Appropriate content to upload:</p>
                <ul>
                    <li>Model</li>
                    <li>Business Plan</li>
                    <li>Concept Plan</li>
                    <li>Project Timeline</li>
                </ul>
              </div>
              <div className="skill-box">
                <h5>Visualize the process of solution creation.</h5>
                <p>Appropriate content to upload:</p>
                <ul>
                    <li>Model</li>
                    <li>Business Plan</li>
                    <li>Concept Plan</li>
                    <li>Project Timeline</li>
                </ul>
              </div>
              <div className="skill-box">
                <h5>Allow relevant data to influence any model.</h5>
                <p>Appropriate content to upload:</p>
                <ul>
                    <li>Data Set</li>
                    <li>Survey</li>
                    <li>Focus Group Agenda and Results</li>
                    <li>Business Plan</li>
                </ul>
              </div>
              <div className="skill-box">
                <h5>Institute the processes used by the team to create solutions.</h5>
                <p>Appropriate content to upload:</p>
                <ul>
                    <li>Model</li>
                    <li>Culture Charter</li>
                    <li>Project Timeline</li>
                    <li>Business Plan</li>
                </ul>
              </div>
              <div className="skill-box">
                <h5>Identify weaknesses in all models used by the team.</h5>
                <p>Appropriate content to upload:</p>
                <ul>
                    <li>Model</li>
                    <li>Business Plan</li>
                    <li>Form of Communication</li>
                    <li>Meeting Agenda</li>
                </ul>
              </div>
              <div className="skill-box">
                <h5>Iterate on thinking, business, and financial models.</h5>
                <p>Appropriate content to upload:</p>
                <ul>
                    <li>Model</li>
                    <li>Form of Communication</li>
                    <li>Meeting Agenda</li>
                    <li>Project Timeline</li>
                </ul>
              </div>
              <div className="skill-box">
                <h5>Effectively position a solution in the market.</h5>
                <p>Appropriate content to upload:</p>
                <ul>
                    <li>Business Plan</li>
                    <li>Concept Plan</li>
                    <li>Financial Document</li>
                </ul>
              </div>
            </div>}
          </div>
        </div>
      </div>
    </div>
  );
};
