import moment from "moment";
import './index.css'
import { faPencilAlt, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useState } from "react";
import { TableReflectionModal } from "../../../components/Modals/TableReflectionModal";
import { useDispatch, useSelector } from "react-redux";
import * as actions from '../../../redux/reflectionsTable/Actions'
import axiosInstance from "../../../utils/AxiosInstance";

const TableReflections = (props) => {
    const [showModal, setShowModal] = useState(false)
    const dispatch = useDispatch()
    const reflectionsTable = useSelector(state => state.reflectionsTable)

    const onSave = () => {
        let url;
        const data = {
            reflectionsTableId: props.reflectionTable.id
        };

        if(reflectionsTable.isEdit){
            url = `/LtsJournals/user-reflections-table-entry/${reflectionsTable.activeItem ? reflectionsTable.activeItem.id : 0 }`;
            data['reflectionsTableEntriesId'] = reflectionsTable.reflectionsTableEntry.id;
            data['content'] = reflectionsTable.content;
        }else{
            data['title']= reflectionsTable.content;
            url = '/LtsJournals/reflections-table-entry';
        }

        const method = reflectionsTable.isEdit ? 'patch' : 'post';
        
        axiosInstance[method](url, data).then((data) => {
            props.loadData();
            setShowModal(false);
        })
    }
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
                        <span className="table-reflections__entry-icon"
                        onClick={() => {
                            const userReflection = props.userReflectionTableEntries.find(item => item.reflectionsTableEntriesId == entry.id && item.reflectionsTableId == props.reflectionTable.id);
                            
                            dispatch(actions.setActiveItem(userReflection))
                            dispatch(actions.setIsEdit(true))
                            dispatch(actions.setContent(userReflection ? userReflection.content : ''))
                            dispatch(actions.setSubtitle(entry.title))
                            dispatch(actions.setReflectionsTableEntry(entry))

                            setShowModal(true);
                        }}
                    >
                            <FontAwesomeIcon icon={faPencilAlt} />
                        </span>
                    </div>
                )) : null}
                <div className="table-reflections__entry">
                    <p><b>Add another team member to this table</b></p>
                    <span className="table-reflections__entry-icon"
                        onClick={() => {
                            dispatch(actions.setActiveItem(null))
                            dispatch(actions.setReflectionsTableEntry(null))
                            dispatch(actions.setIsEdit(false))
                            dispatch(actions.setContent(''))
                            dispatch(actions.setSubtitle('Title'))
                            setShowModal(true);
                        }}
                    >
                        <FontAwesomeIcon icon={faPlus} />
                    </span>
                </div>
            </div>
            <TableReflectionModal
                show={showModal}
                title={props.reflectionTable.FontAwesomeIcontitle}
                onSave={() => onSave()}
                onHide={() => setShowModal(false)}
            />
        </div>
    );
}

export default TableReflections