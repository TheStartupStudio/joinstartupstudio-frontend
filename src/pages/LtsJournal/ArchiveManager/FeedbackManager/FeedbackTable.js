import { Table } from 'react-bootstrap'
import {
  JournalTableCell,
  JournalTableCellInput,
  JournalTableRow
} from '../../TableWrapper/TableComponents'
import TableWrapper from '../../TableWrapper/index'

const FeedbackTable = ({
  handleChangeFeedback,
  feedbacks,
  selectedArchive,
  handleOpenDeleteArchiveModal
}) => {
  return (
    <TableWrapper
      title={selectedArchive?.title}
      isDelete={feedbacks?.length > 1}
      onDelete={() => handleOpenDeleteArchiveModal()}
    >
      <Table bordered hover style={{ marginBottom: 0 }}>
        <tbody>
          <JournalTableRow>
            <JournalTableCell isGray>
              <JournalTableCellInput
                title={'Feedback date:'}
                type={'date'}
                value={new Date(
                  selectedArchive?.feedbackDate
                ).toLocaleDateString('en-CA')}
                handleChange={(value) =>
                  handleChangeFeedback('feedbackDate', value)
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
                title={'Who gave you feedback:'}
                type={'text'}
                value={selectedArchive?.feedbackGiver}
                handleChange={(value) =>
                  handleChangeFeedback('feedbackGiver', value)
                }
              />
            </JournalTableCell>
          </JournalTableRow>
          <JournalTableRow>
            <JournalTableCell colSpan={2}>
              <JournalTableCellInput
                isBold={true}
                title={'Feedback you received:'}
                type={'text'}
                value={selectedArchive?.receivedFeedback}
                handleChange={(value) =>
                  handleChangeFeedback('receivedFeedback', value)
                }
              />
            </JournalTableCell>
          </JournalTableRow>
          <JournalTableRow>
            <JournalTableCell colSpan={2}>
              <JournalTableCellInput
                isBold={true}
                title={'Which feedback is relevant:'}
                type={'text'}
                value={selectedArchive?.relevantFeedback}
                handleChange={(value) =>
                  handleChangeFeedback('relevantFeedback', value)
                }
              />
            </JournalTableCell>
          </JournalTableRow>
          <JournalTableRow>
            <JournalTableCell colSpan={2}>
              <JournalTableCellInput
                isBold={true}
                title={'How will you act on this relevant feedback:'}
                type={'text'}
                value={selectedArchive?.relevantFeedbackAct}
                handleChange={(value) =>
                  handleChangeFeedback('relevantFeedbackAct', value)
                }
              />
            </JournalTableCell>
          </JournalTableRow>
        </tbody>
      </Table>
    </TableWrapper>
  )
}

export default FeedbackTable
