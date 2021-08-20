import { useDispatch, useSelector } from "react-redux"
import { asyncFetch } from '../../store/index';
import "./style.css";

function InnerListItem({ child, parentIndex }) {
    let { selectedFilter } = useSelector((state) => state);
    
    return (<ol type="a" className="ol-list-inner" onClick={(e) => e.stopPropagation()}>
        {child.map((element, index) => (selectedFilter === 'All' || element.category === selectedFilter) &&
            <li className={`list-item ${(parentIndex + index) % 2 ? 'odd-color' : 'even-color'}`} key={element.id}>{element.title}</li>)}
    </ol>)
}

export default function List() {

    let dispatch = useDispatch();
    let { closedSectionSet, diffCategory, selectedFilter, loading } = useSelector((state) => state);
    let okrData = useSelector((state) => Object.values(state.okrData));

    return <div style={{ width: '100%' }}>
        <button className={'btn'} onClick={() => dispatch(asyncFetch)} disabled={loading}>
            {!loading ? 'Fetch ORKs Data' : 'Loading...'}
        </button>

        {okrData.length > 0 && <>
            <label htmlFor="category_filter">Filter by Category</label>
            <select name="category_filter" id="category_filter" value={selectedFilter} onChange={(e) => dispatch({ type: 'SET_VISIBILITY_FILTER', filter: e.target.value })}>
                {diffCategory.map((ele, index) => {
                    return <option value={ele} key={index}> {ele}</option>
                })}
            </select>
        </>}


        {okrData.length > 0 && <div className="list-wrap">
            <ol className="ol-list">
                {okrData && okrData.map((element, index) => {
                    return (selectedFilter === 'All' || element.category === selectedFilter) &&
                        <>
                            <li onClick={() => dispatch({ type: 'TOGGLE_SECTION', id: element.id })} className={`list-item ${index % 2 ? 'odd-color' : 'even-color'}`} key={element.id}>
                                <div className="list">
                                    {element.children.length > 0 && <div className={closedSectionSet.includes(element.id) === false ? 'down' : 'up'}></div>}
                                    {element.title}
                                </div>
                            </li>
                            {closedSectionSet.includes(element.id) === false && <InnerListItem child={element.children} parentIndex={index + 1} />}
                        </>
                })}
            </ol>
        </div>}

    </div >
}