import { Table } from 'react-bootstrap'
import {
  JournalTableCell,
  JournalTableCellInput,
  JournalTableRow
} from '../../TableWrapper/TableComponents'
import TableWrapper from '../../TableWrapper/index'
import React from 'react'

const MentorMeetingTable = ({
  handleChangeMentorMeeting,
  mentorMeetings,
  selectedArchive,
  handleOpenDeleteArchiveModal
}) => {
  return (
    <TableWrapper
      title={selectedArchive.title}
      isDelete={mentorMeetings?.length > 1}
      onDelete={() => handleOpenDeleteArchiveModal()}
    >
      <Table bordered hover style={{ marginBottom: 0 }}>
        <tbody>
          <JournalTableRow>
            <JournalTableCell isGray colSpan={2}>
              <JournalTableCellInput
                title={'Meeting date:'}
                type={'date'}
                value={new Date(selectedArchive.meetingDate).toLocaleDateString(
                  'en-CA'
                )}
                handleChange={(value) =>
                  handleChangeMentorMeeting('meetingDate', value)
                }
              />
            </JournalTableCell>
          </JournalTableRow>
          <JournalTableRow>
            <JournalTableCell
              isGray
              additionalStyling={{
                borderRightColor: '#f0f0f0',
                borderWidth: 2
              }}
            >
              <JournalTableCellInput
                title={'Mentor name:'}
                type={'text'}
                value={selectedArchive.mentorName}
                handleChange={(value) =>
                  handleChangeMentorMeeting('mentorName', value)
                }
              />
            </JournalTableCell>
            <JournalTableCell isGray>
              <JournalTableCellInput
                title={'Area of expertise:'}
                type={'text'}
                value={selectedArchive.expertiseArea}
                handleChange={(value) =>
                  handleChangeMentorMeeting('expertiseArea', value)
                }
              />
            </JournalTableCell>
          </JournalTableRow>

          <JournalTableRow>
            <JournalTableCell colSpan={2}>
              <JournalTableCellInput
                isBold={true}
                title={'Pre-meeting:'}
                type={'text'}
                value={selectedArchive.preMeeting1}
                handleChange={(value) =>
                  handleChangeMentorMeeting('preMeeting1', value)
                }
              />
            </JournalTableCell>
          </JournalTableRow>
          <JournalTableRow>
            <JournalTableCell colSpan={2}>
              <JournalTableCellInput
                isBold={true}
                title={'Pre-meeting:'}
                type={'text'}
                value={selectedArchive.preMeeting2}
                handleChange={(value) =>
                  handleChangeMentorMeeting('preMeeting2', value)
                }
              />
            </JournalTableCell>
          </JournalTableRow>
          <JournalTableRow>
            <JournalTableCell colSpan={2}>
              <JournalTableCellInput
                isBold={true}
                title={'During the meeting:'}
                type={'text'}
                value={selectedArchive.duringMeeting}
                handleChange={(value) =>
                  handleChangeMentorMeeting('duringMeeting', value)
                }
              />
            </JournalTableCell>
          </JournalTableRow>
          <JournalTableRow>
            <JournalTableCell colSpan={2}>
              <JournalTableCellInput
                isBold={true}
                title={'Post-meeting:'}
                type={'text'}
                value={selectedArchive.postMeeting}
                handleChange={(value) =>
                  handleChangeMentorMeeting('postMeeting', value)
                }
              />
            </JournalTableCell>
          </JournalTableRow>
        </tbody>
      </Table>
    </TableWrapper>
  )
}

export default MentorMeetingTable
