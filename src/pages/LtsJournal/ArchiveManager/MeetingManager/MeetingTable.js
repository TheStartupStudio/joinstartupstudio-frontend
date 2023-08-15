import { Table } from 'react-bootstrap'
import {
  JournalTableCell,
  JournalTableCellInput,
  JournalTableRow
} from '../../TableWrapper/TableComponents'
import TableWrapper from '../../TableWrapper/index'

const MeetingTable = ({
  handleChangeTeamMeeting,
  teamMeetings,
  selectedArchive,
  handleOpenDeleteArchiveModal
}) => {
  return (
    <TableWrapper
      title={selectedArchive?.title}
      isDelete={teamMeetings?.length > 1}
      onDelete={() => handleOpenDeleteArchiveModal()}
    >
      <Table bordered hover style={{ marginBottom: 0 }}>
        <tbody>
          <JournalTableRow>
            <JournalTableCell isGray colSpan={2}>
              <JournalTableCellInput
                title={'Meeting date:'}
                type={'date'}
                value={new Date(
                  selectedArchive?.meetingDate
                ).toLocaleDateString('en-CA')}
                handleChange={(value) =>
                  handleChangeTeamMeeting('meetingDate', value)
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
                title={'Purpose:'}
                type={'text'}
                value={selectedArchive?.purpose}
                handleChange={(value) =>
                  handleChangeTeamMeeting('purpose', value)
                }
              />
            </JournalTableCell>
            <JournalTableCell isGray>
              <JournalTableCellInput
                title={'Attendance:'}
                type={'text'}
                value={selectedArchive?.attendance}
                handleChange={(value) =>
                  handleChangeTeamMeeting('attendance', value)
                }
              />
            </JournalTableCell>
          </JournalTableRow>

          <JournalTableRow>
            <JournalTableCell colSpan={2}>
              <JournalTableCellInput
                isBold={true}
                title={'Meeting agenda:'}
                type={'text'}
                value={selectedArchive?.meetingAgenda}
                handleChange={(value) =>
                  handleChangeTeamMeeting('meetingAgenda', value)
                }
              />
            </JournalTableCell>
          </JournalTableRow>
          <JournalTableRow>
            <JournalTableCell colSpan={2}>
              <JournalTableCellInput
                isBold={true}
                title={'Notes:'}
                type={'text'}
                value={selectedArchive?.notes}
                handleChange={(value) =>
                  handleChangeTeamMeeting('notes', value)
                }
              />
            </JournalTableCell>
          </JournalTableRow>
          <JournalTableRow>
            <JournalTableCell colSpan={2}>
              <JournalTableCellInput
                isBold={true}
                title={'Results of Meeting:'}
                type={'text'}
                value={selectedArchive?.resultsOfMeeting}
                handleChange={(value) =>
                  handleChangeTeamMeeting('resultsOfMeeting', value)
                }
              />
            </JournalTableCell>
          </JournalTableRow>
        </tbody>
      </Table>
    </TableWrapper>
  )
}

export default MeetingTable
