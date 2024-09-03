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
  handleOpenDeleteArchiveModal,
  isEditable,
  setLoading
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
                isDisabled={!isEditable}
                setLoading={setLoading}
                inputType={'date'}
                inputTag={'input'}
                inputName={'meetingDate'}
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
                inputTag={'input'}
                handleChange={(value) =>
                  handleChangeTeamMeeting('purpose', value)
                }
                isDisabled={!isEditable}
                setLoading={setLoading}
              />
            </JournalTableCell>
            <JournalTableCell isGray>
              <JournalTableCellInput
                title={'Attendance:'}
                type={'text'}
                inputTag={'input'}
                value={selectedArchive?.attendance}
                handleChange={(value) =>
                  handleChangeTeamMeeting('attendance', value)
                }
                isDisabled={!isEditable}
                setLoading={setLoading}
              />
            </JournalTableCell>
          </JournalTableRow>

          <JournalTableRow>
            <JournalTableCell colSpan={2}>
              <JournalTableCellInput
                isBold={true}
                title={'Meeting agenda:'}
                type={'text'}
                inputTag={'input'}
                value={selectedArchive?.meetingAgenda}
                handleChange={(value) =>
                  handleChangeTeamMeeting('meetingAgenda', value)
                }
                isDisabled={!isEditable}
                setLoading={setLoading}
              />
            </JournalTableCell>
          </JournalTableRow>
          <JournalTableRow>
            <JournalTableCell colSpan={2}>
              <JournalTableCellInput
                isBold={true}
                title={'Notes:'}
                type={'text'}
                inputTag={'input'}
                value={selectedArchive?.notes}
                handleChange={(value) =>
                  handleChangeTeamMeeting('notes', value)
                }
                isDisabled={!isEditable}
                setLoading={setLoading}
              />
            </JournalTableCell>
          </JournalTableRow>
          <JournalTableRow>
            <JournalTableCell colSpan={2}>
              <JournalTableCellInput
                isBold={true}
                title={'Results of Meeting:'}
                type={'text'}
                inputTag={'input'}
                value={selectedArchive?.resultsOfMeeting}
                handleChange={(value) =>
                  handleChangeTeamMeeting('resultsOfMeeting', value)
                }
                isDisabled={!isEditable}
                setLoading={setLoading}
              />
            </JournalTableCell>
          </JournalTableRow>
        </tbody>
      </Table>
    </TableWrapper>
  )
}

export default MeetingTable
