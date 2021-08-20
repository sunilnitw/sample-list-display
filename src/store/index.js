import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";

const TOGGLE_SECTION = 'TOGGLE_SECTION';
const SET_VISIBILITY_FILTER = 'SET_VISIBILITY_FILTER';
const LOADING = 'LOADING';
const SET_OKRS_DATA = 'SET_OKRS_DATA';
const SAMPLE_ORKS_API = 'https://okrcentral.github.io/sample-okrs/db.json';

const initialState = {
    okrData: {},
    diffCategory: [],
    selectedFilter: 'All',
    loading: false,
    closedSectionSet: []
}

function reducer(state = initialState, action) {
    switch (action.type) {
        case LOADING:
            return { ...state, loading: action.value };
        case SET_OKRS_DATA:
            return { ...state, okrData: action.value, diffCategory: action.category };
        case SET_VISIBILITY_FILTER:
            return { ...state, selectedFilter: action.filter };
        case TOGGLE_SECTION:
            if (state.closedSectionSet.includes(action.id) === false) {
                return { ...state, closedSectionSet: [...state.closedSectionSet, action.id] };
            } else {
                let index = state.closedSectionSet.indexOf(action.id);
                return { ...state, closedSectionSet: [...state.closedSectionSet.slice(0, index), ...state.closedSectionSet.slice(index + 1)] }
            }
        default:
            return state;
    }
}

export const asyncFetch = function (dispatch, getState) {
    dispatch({ type: LOADING, value: true });
    fetch(SAMPLE_ORKS_API).then((res) => res.json()).then((res) => {
        let category = new Set(), orksData = {};
        res.data.forEach((curr) => {
            if (curr['parent_objective_id'] === "") {
                orksData[curr['id']] = curr;
                orksData[curr['id']]['isOpen'] = true;
                orksData[curr['id']]['children'] = [];
            } else if (orksData[curr['parent_objective_id']]) {
                orksData[curr['parent_objective_id']]['children'].push(curr);
            }
            category.add(curr['category'])
        })

        dispatch({ type: SET_OKRS_DATA, value: orksData, category: ['All', ...Array.from(category)] });
    }).finally(() => {
        dispatch({ type: LOADING, value: false });
    })
}

let store = createStore(reducer, applyMiddleware(thunk));

export default store;