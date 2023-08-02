import './index.css'

const TableWrapper = ({title, children}) => {

    return (
        <div className="table-wrapper">
            <div className="table-wrapper__title">
                <h5>{title}</h5>
            </div>
            <div className="table-wrapper__content">
                {children}
            </div>
        </div>
    );
}

export default TableWrapper