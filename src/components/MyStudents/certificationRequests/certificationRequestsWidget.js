import './certificationRequestsWidget.css'

export default function CertificationRequestsWidget(props) {
  return (
    <div className='certificationReqWidget'>
      <p className='title my-2'>CERTIFICATION REQUESTS</p>
      <p className='description my-2'>
        Students below have requested certification. Please review their I Am
        Ready page and assess each Outcome. Once all parts are saved, the
        student will be notified on their updated status and whether they may
        continue the certification process.
      </p>
      <table>
        <tr>
          <th>Student Name</th>
          <th>Scoring</th>
          <th>Status</th>
        </tr>

        <tr>
          <td>///</td>
          <td>///</td>
          <td>///</td>
        </tr>
        <tr>
          <td>///</td>
          <td>///</td>
          <td>///</td>
        </tr>
      </table>
    </div>
  )
}
