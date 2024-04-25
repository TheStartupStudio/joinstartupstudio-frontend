import React from 'react'

const TextHelper = ({ strongText, normalText }) => {
  return (
    <p>
      <strong>{strongText}</strong> {normalText}
    </p>
  )
}

// const TableHelper = ({ headColumns, bodyColumns }) => {
//   return (
//     <table class="table table-striped ">
//       <thead>
//         <tr className="p-1">
//           {headColumns.map((head) => (
//             <th className="pe-4" scope="col w-100">
//               {head}
//             </th>
//           ))}
//         </tr>
//       </thead>
//       <tbody>
//         {bodyColumns.map((body) => (
//           <tr>
//             {body.map((item) => (
//               <td className="text-center">{item}</td>
//             ))}
//           </tr>
//         ))}
//       </tbody>
//     </table>
//   )
// }
const TableHelper = ({ headColumns, bodyColumns }) => {
  return (
    <>
      <table className="table table-striped table-helper">
        <thead>
          <tr className="p-1">
            {headColumns.map((head, index) => (
              <th scope="col" key={`head-${index}`}>
                <div
                  className="d-flex align-items-center"
                  style={{ height: '100%' }}
                >
                  {head}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {bodyColumns.map((body, rowIndex) => (
            <tr key={`row-${rowIndex}`}>
              {body.map((item, itemIndex) => (
                <td key={`item-${rowIndex}-${itemIndex}`} className="">
                  <div
                    className={`d-flex align-items-center pe-2 ${
                      itemIndex === 0 ? '' : 'justify-content-end'
                    }`}
                    style={{ height: '100%' }}
                  >
                    {item}
                  </div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ background: '#fff', padding: '1%' }}>
        <p className="">1{''} Data for Army are estimates.</p>
        <p>2 Data for total enlisted personnel are estimates.</p>
        <p>SOURCE: U.S. Department of Defense, Defense Manpower Data Center</p>
      </div>
    </>
  )
}

const MilitaryOccupation = () => {
  return (
    <div style={{ fontSize: '13px' }}>
      <h4>What they do</h4>
      <p>
        Members of the U.S. military service maintain the U.S. national defense.
        Although some service members work in occupations specific to the
        military, such as fighter pilots or infantrymen, many work in
        occupations that also exist in the civilian workplace, such as nurses,
        doctors, and lawyers. Members serve in the Army, Navy, Air Force, Space
        Force, Marine Corps, or Coast Guard, or in the Reserve components of
        these branches, and in the Air National Guard and Army National Guard.
        (The Coast Guard, which is included in this profile, is part of the
        Department of Homeland Security.)
      </p>
      <h6>Duties</h6>
      <hr />
      <p>
        The military distinguishes between enlisted and officer careers.
        Enlisted personnel make up about 82 percent of the Armed Forces and
        carry out military operations. The remaining 18 percent are
        officers—military leaders who manage operations and enlisted personnel.
        About 8 percent of officers are warrant officers, who are technical and
        tactical experts in a specific area. Army aviators, for example, make up
        one group of warrant officers
      </p>
      <p>
        <strong>Enlisted personnel</strong> typically do the following:
      </p>
      <div className="d-flex flex-column">
        <li>
          Participate in, or support, military operations, such as combat or
          training operations, or humanitarian or disaster relief
        </li>
        <li>Operate, maintain, and repair equipment</li>
        <li>Perform technical and support activities</li>
        <li>Supervise junior enlisted personnel</li>
      </div>
      <p className="pt-2">
        <strong>Officers </strong> typically do the following:
      </p>
      <div className="d-flex flex-column pb-3">
        <li>
          Plan, organize, and lead troops and activities in military operations
        </li>
        <li>Manage enlisted personnel</li>
        <li>Operate and command aircraft, ships, or armored vehicles</li>
        <li>
          Provide medical, legal, engineering, and other services to military
          personnel
        </li>
      </div>
      <h6>Types of Enlisted Personnel</h6>
      <hr className="m-0 p-0" />
      <p>
        The following are examples of types of occupations for enlisted
        personnel:
      </p>
      <TextHelper
        strongText={'Administrative personnel'}
        normalText={
          'maintain information on personnel, equipment, funds, and other military-related activities. They work in support areas, such as finance, accounting, legal affairs, maintenance, supply, and transportation.'
        }
      />
      <TextHelper
        strongText={'Combat specialty personnel'}
        normalText={
          'train and work in combat units, such as the infantry, artillery, or Special Forces. For example, infantry specialists conduct ground combat operations, armored vehicle specialists operate battle tanks, and seamanship specialists maintain ships. Combat specialty personnel may maneuver against enemy forces and fire artillery, guns, mortars, or missiles to neutralize them. They may also operate various types of combat vehicles, such as amphibious assault vehicles, tanks, or small boats. Members of elite Special Forces teams are trained to perform specialized missions anywhere in the world on a moment’s notice.        '
        }
      />
      <TextHelper
        strongText={'Construction personnel'}
        normalText={
          'build or repair buildings, airfields, bridges, and other structures. They also may operate heavy equipment, such as bulldozers or cranes. They work with engineers and other building specialists as part of military construction teams. Some construction personnel specialize in an area such as plumbing, electrical wiring, or water purification.'
        }
      />
      <TextHelper
        strongText={'Electronic and electrical equipment repair personnel'}
        normalText={
          'maintain and repair electronic equipment used by the military. Repairers specialize in an area such as aircraft electrical systems, computers, optical equipment, communications, or weapons systems. For example, weapons electronic maintenance technicians maintain and repair electronic components and systems that help locate targets and help aim and fire weapons.'
        }
      />
      <TextHelper
        strongText={'Engineering, science, and technical personnel'}
        normalText={
          'perform a variety of tasks, such as operating technical equipment, solving problems, and collecting and interpreting information. They perform technical tasks in information technology, environmental health and safety, or intelligence:'
        }
      />
      <div className="pb-3">
        <li>
          Environmental health and safety specialists inspect military
          facilities and food supplies to ensure that they are safe for use and
          consumption.
        </li>
        <li>
          Information technology specialists manage and maintain computer and
          network systems.
        </li>
        <li>
          Intelligence specialists gather information and prepare reports for
          military planning and operations.
        </li>
      </div>
      <TextHelper
        strongText={'Healthcare personnel'}
        normalText={
          'provide medical services to military personnel and their family members. They may work as part of a patient-service team with doctors, nurses, or other healthcare professionals. Some specialize in providing emergency medical treatment in combat or remote areas. Others specialize in laboratory testing of tissue and blood samples; maintaining pharmacy supplies or patients’ records; assisting with dental procedures; operating diagnostic tools, such as x-ray and ultrasound machines; or other healthcare tasks.'
        }
      />
      <TextHelper
        strongText={'Human resources development personnel'}
        normalText={
          'recruit qualified people into the military, place them in suitable occupations, and provide training programs:'
        }
      />
      <div className="pb-3">
        <li>
          Personnel specialists maintain information about military personnel
          and their training, job assignments, promotions, and health.
        </li>
        <li>
          Recruiting specialists provide information about military careers;
          explain pay, benefits, and military life; and recruit individuals into
          the military.
        </li>
        <li>
          Training specialists and instructors teach military personnel how to
          perform their jobs.
        </li>
      </div>
      <TextHelper
        strongText={'Machine operator and repair personnel'}
        normalText={
          'operate industrial equipment and machinery to make and repair parts for a variety of equipment and structures. They may operate engines, nuclear reactors, or water pumps, usually performing a specific job. Welders and metalworkers, for example, work with various types of metals to repair or form the structural parts of ships, buildings, or equipment. Survival equipment specialists inspect, maintain, and repair survival equipment, such as parachutes and aircraft life-support equipment.        '
        }
      />
      <TextHelper
        strongText={'Media and public affairs personnel'}
        normalText={
          'prepare and present information about military activities to the military and the public. They take photographs, make video programs, present news and music programs, or conduct interviews.        '
        }
      />
      <TextHelper
        strongText={'Protective service personnel'}
        normalText={
          'enforce military laws and regulations and provide emergency responses to disasters:'
        }
      />
      <div className="pb-3">
        <li>
          Firefighters prevent and extinguish fires in buildings, on aircraft,
          and aboard ships.
        </li>
        <li>
          Military police responsibilities include controlling traffic,
          preventing crime, and responding to emergencies.
        </li>
        <li>
          Other law enforcement and security specialists investigate crimes
          committed on military property and guard inmates in military
          correctional facilities.
        </li>
      </div>
      <TextHelper
        strongText={'Support service personnel'}
        normalText={
          'provide services that support the morale and well-being of military personnel and their families:'
        }
      />
      <div className="pb-3">
        <li>
          Food service specialists prepare food in dining halls, hospitals, and
          ships.
        </li>

        <li>
          Religious program specialists assist chaplains with religious
          services, religious education programs, and related administrative
          duties.
        </li>
      </div>
      <TextHelper
        strongText={'Transportation and material-handling personnel'}
        normalText={
          'transport military personnel and cargo. Most personnel within this occupational group are classified according to the mode of transportation, such as aircraft, motor vehicle, or ship:'
        }
      />
      <div className="pb-3">
        <li>Aircrew members operate equipment on aircraft.</li>
        <li>
          Cargo specialists load and unload military supplies, using forklifts
          and cranes.
        </li>
        <li>
          Quartermasters and boat operators navigate and pilot many types of
          small watercraft, including tugboats, gunboats, and barges.
        </li>
        <li>
          Vehicle drivers operate various military vehicles, including fuel or
          water tank trucks.
        </li>
      </div>
      <TextHelper
        strongText={'Vehicle and machinery mechanical personnel'}
        normalText={
          'conduct preventive and corrective maintenance on aircraft, automotive and heavy equipment, and powerhouse station equipment. These workers specialize by the type of equipment that they maintain:        '
        }
      />
      <div className="pb-3">
        <li>
          Aircraft mechanics inspect and service various types of aircraft.
        </li>
        <li>
          Automotive and heavy-equipment mechanics maintain and repair vehicles,
          such as Humvees, trucks, tanks, and other combat vehicles. They also
          repair bulldozers and other construction equipment.
        </li>
        <li>
          Heating and cooling mechanics install and repair air-conditioning,
          refrigeration, and heating equipment.
        </li>
        <li>
          Marine engine mechanics repair and maintain engines on ships, boats,
          and other watercraft.
        </li>
        <li>
          Powerhouse mechanics install, maintain, and repair electrical and
          mechanical equipment in power-generating stations.
        </li>
      </div>
      <h6>
        Table 1. Active-duty enlisted personnel by broad occupational group and
        branch of military, and Coast Guard, February 2023
      </h6>
      <TableHelper
        headColumns={[
          'Enlisted',
          'Army 1',
          'Air Force',
          'Space Force',
          'Coast Guard',
          'Marine Corps',
          'Navy',
          'Total enlisted personnel in each occupational group'
        ]}
        bodyColumns={[
          ['Occupational group', '', '', '', '', '', '', ''],
          [
            'Administrative',
            '4,990',
            '13,252',
            '1',
            '--',
            '11,247',
            '20,250',
            '--'
          ],
          [
            'Combat Specialty ',
            '106,335',
            '764',
            '--',
            '--',
            '36,545',
            '9,077',
            '--'
          ],
          [
            'Construction ',
            '14,209',
            '4,959',
            '--',
            '--',
            '5,861',
            '3,772',
            '--'
          ],
          [
            'Electronic and Electrical Equipment Repair',
            '20,992',
            '28,201',
            '1',
            '--',
            '14,120',
            '49,520',
            '--'
          ],
          [
            'Engineering, Science, and Technical',
            '48,557',
            '55,058',
            '18',
            '--',
            '27,276',
            '46,167',
            '--'
          ],
          ['Healthcare ', '25,319', '14,682', '--', '--', '--', '23,515', '--'],
          [
            'Human Resource Development',
            '14,853',
            '8,538',
            '3',
            '--',
            '2,333',
            '4,532',
            '--'
          ],
          [
            'Machine Operator and Production',
            '4,080',
            '6,502',
            '--',
            '--',
            '2,334',
            '9,267',
            '--'
          ],
          [
            'Media and Public Affairs',
            '5,119',
            '6,571',
            '1',
            '--',
            '1,416',
            '3,677',
            '--'
          ],
          [
            'Protective Service ',
            '19,107',
            '34,098',
            '--',
            '--',
            '4,795',
            '13,160',
            '--'
          ],
          [
            'Support Service',
            '8,272',
            '5,510',
            '--',
            '--',
            '1,921',
            '8,805',
            '--'
          ],
          [
            'Transportation and Material Handling',
            '45,785',
            '28,552',
            '--',
            '--',
            '23,219',
            '36,110',
            '--'
          ],
          [
            'Vehicle and Machinery Mechanic',
            '43,536',
            '46,770',
            '--',
            '--',
            '17,315',
            '47,720',
            '--'
          ],
          [
            'Non-occupation or unspecified coded personnel',
            '4,378',
            '4,706',
            '4,018',
            '--',
            '1,684',
            '1,600',
            '--'
          ],
          [
            'Total enlisted personnel for each military branch and Coast Guard',
            '365,532',
            '258,163',
            '4,042',
            '30,087',
            '150,066',
            '277,172',
            '1,085,0622'
          ]
        ]}
      />

      <h6 className="mt-3 ">Types of Officers</h6>
      <hr className="p-0 m-0" />
      <p>The following are examples of types of officers:</p>
      <TextHelper
        strongText={'Combat specialty officers'}
        normalText={
          'plan and direct military operations, oversee combat activities, and serve as combat leaders. They may be in charge of tanks and other armored assault vehicles, artillery systems, special operations, or infantry units. This group also includes naval surface warfare and submarine warfare officers, combat pilots, and aircrews.'
        }
      />
      <TextHelper
        strongText={'Engineering, science, and technical officers’ '}
        normalText={
          'responsibilities depend on their area of expertise. They work in scientific and professional occupations, such as atmospheric scientists, meteorologists, physical scientists, biological scientists, social scientists, attorneys, and other types of scientists or professionals. For example, meteorologists in the military may study the weather to assist in planning flight paths for aircraft.'
        }
      />
      <TextHelper
        strongText={'Executive, administrative, and managerial officers'}
        normalText={
          ' manage administrative functions in the Armed Forces, such as human resources management, training, personnel, information, police, or other support services. Officers who oversee military bands are included in this category.'
        }
      />
      <TextHelper
        strongText={'Healthcare officers'}
        normalText={
          ' provide medical services to military personnel in order to maintain or improve their health and physical readiness. Officers such as physicians, physician assistants, nurses, and dentists examine, diagnose, and treat patients. Other healthcare officers provide therapy, rehabilitative treatment, and additional healthcare for patients:'
        }
      />
      <div className="mb-3">
        <li>Dentists treat diseases, disorders, and injuries of the mouth.</li>
        <li>
          Nurses provide and coordinate patient care in military hospitals and
          clinics.
        </li>
        <li>
          Optometrists treat vision problems and prescribe glasses, contact
          lenses, or medications.
        </li>
        <li>Pharmacists purchase, store, and dispense drugs and medicines.</li>
        <li>
          Physical therapists and occupational therapists plan and administer
          therapy to help patients adjust to injuries, regain independence, and
          return to work.
        </li>

        <li>
          Physicians, surgeons, and physician assistants examine patients,
          diagnose injuries and illnesses, and provide treatment to military and
          their families.
        </li>
        <li>
          Psychologists provide mental healthcare and also may conduct research
          on behavior and emotions.
        </li>
      </div>
      <TextHelper
        strongText={'Human resource'}
        normalText={
          ' development officers manage recruitment, placement, and training programs in the military:'
        }
      />
      <div class="mb-3">
        <li>
          Personnel managers direct and oversee military personnel functions,
          such as job assignments, staff promotions, and career counseling.
        </li>
        <li>
          Recruiting managers direct and oversee recruiting personnel and
          recruiting activities.
        </li>
        <li>
          Training and education directors identify training needs and develop
          and manage educational programs.
        </li>
      </div>
      <TextHelper
        strongText={'Media and public affairs officers'}
        normalText={
          ' oversee the development, production, and presentation of information or events for the military and the public. They manage the production of videos and television and radio broadcasts that are used for training, news, and entertainment. Some plan, develop, and direct the activities of military bands. Public affairs officers respond to public inquiries about military activities and prepare news releases.'
        }
      />
      <TextHelper
        strongText={'Protective service officers'}
        normalText={
          ' are responsible for the safety and protection of individuals and property on military bases and vessels. Emergency management officers plan and prepare for all types of disasters. They develop warning, evacuation, and response procedures in preparation for disasters. Law enforcement and security officers enforce all applicable laws on military bases and oversee investigations of crimes.'
        }
      />
      <TextHelper
        strongText={'Support services officers'}
        normalText={
          ' manage military activities in key functional areas, such as logistics, transportation, and supply. They may oversee the transportation and distribution of materials by ground vehicles, aircraft, or ships. They also direct food service facilities and other support activities. Purchasing and contracting managers negotiate and monitor contracts for equipment, supplies, and services that the military buys from the private sector.'
        }
      />
      <TextHelper
        strongText={'Transportation officers'}
        normalText={
          ' manage and perform activities related to the safe transport of military personnel and equipment by air, ground, and water. They operate and command an aircraft or a ship:'
        }
      />
      <div class="mb-3">
        <li>
          Navigators use radar, radio, and other navigation equipment to
          determine their position and plan their route of travel.
        </li>
        <li>
          Pilots in the military fly various types of military airplanes and
          helicopters to carry troops and equipment.
        </li>
        <li>
          Ships’ engineers direct engineering departments, including engine
          operations, maintenance, and power generation, aboard ships.
        </li>
      </div>
      <h6>
        Table 2. Active-duty officer personnel by broad occupational group and
        branch of military, and Coast Guard, February 2023
      </h6>
      <TableHelper
        headColumns={[
          'Officer',
          'Army 1',
          'Air Force',
          'Space Force',
          'Coast Guard',
          'Marine Corps',
          'Navy',
          'Total officer personnel in each occupational group'
        ]}
        bodyColumns={[
          ['Occupational group', '', '', '', '', '', '', ''],
          [
            'Combat Specialty',
            '22,021',
            '3,821',
            '57',
            '--',
            '4,254',
            '6,340',
            '--'
          ],
          [
            'Engineering, Science, and Technical',
            '24,978',
            '13,285',
            '3,238',
            '--',
            '4,816',
            '11,360',
            '--'
          ],
          [
            'Executive, Administrative, and Managerial',
            '13,499',
            '6,825',
            '904',
            '--',
            '2,662',
            '6,770',
            '--'
          ],
          ['Healthcare ', '10,934', '9,073', '--', '--', 'none', '6,452', '--'],
          [
            'Human Resource Development',
            '3,096',
            '1,666',
            '16',
            '--',
            '729',
            '3,397',
            '--'
          ],
          [
            'Media and Public Affairs',
            '361',
            '349',
            '1',
            '--',
            '332',
            '270',
            '--'
          ],
          [
            'Protective Service ',
            '3,248',
            '1,070',
            '--',
            '--',
            '340',
            '1,231',
            '--'
          ],
          ['Support Service', '1,713', '838', '--', '--', '31', '1,041', '--'],
          [
            'Transportation',
            '10,620',
            '19,003',
            '5',
            '--',
            '5,067',
            '10,088',
            '--'
          ],
          [
            'Non-occupation or unspecified coded personnel',
            '3,124',
            '4,240',
            '23',
            '--',
            '3,225',
            '8,830',
            '--'
          ],
          [
            'Total officer personnel for each military branch and Coast Guard',
            '93,594',
            '60,170',
            '4,245',
            '8,659',
            '21,456',
            '55,779',
            '243,903 '
          ]
        ]}
      />
    </div>
  )
}

export default MilitaryOccupation
