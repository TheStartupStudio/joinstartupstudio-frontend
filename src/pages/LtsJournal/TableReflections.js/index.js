import moment from "moment";
import './index.css'
import { faPencilAlt, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const TableReflections = (props) => {
    console.log(props, 'TableReflections')
    return (
        <div className="table-reflections">
            <div className="table-reflections__dates">
                <div className="row">
                    <div className="col-6">
                        <div className="table-reflections__date"><b>Start date:</b> {moment(props.start).format('DD-MM-YYYY')}</div>
                    </div>
                    <div className="col-6">
                        <div className="table-reflections__date"><b>End date:</b> {moment(props.end).format('DD-MM-YYYY')}</div>
                    </div>
                </div>
            </div>
            <div className="table-reflections__entries">
                {props.reflectionTableEntries && props.reflectionTableEntries.length ? props.reflectionTableEntries.map(entry => (
                    <div className="table-reflections__entry" key={entry.id}>
                        <p><b>{entry.title}</b></p>
                        <span className="table-reflections__entry-icon">
                            <FontAwesomeIcon icon={faPencilAlt} />
                        </span>
                    </div>
                )) : null}
                <div className="table-reflections__entry">
                    <p><b>Add another team member to this table</b></p>
                    <span className="table-reflections__entry-icon">
                        <FontAwesomeIcon icon={faPlus} />
                    </span>
                </div>
            </div>
        </div>
    );
}

export default TableReflections