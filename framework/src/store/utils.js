// /* eslint-disable */
// export function updateObject(oldObject, newValues) {
// 	return Object.assign({}, oldObject, newValues);
// }
//
// export function updateItemInArray(array, itemId, updateItemCallback) {
// 	return array.map(item => {
// 		if (item.id !== itemId) {
// 			return item;
// 		}
//
// 		return updateItemCallback(item);
// 	});
// }
//
// export function createReducer(initialState, handlers) {
// 	return function reducer(state = initialState, action) {
// 		if (handlers.hasOwnProperty(action.type)) {
// 			return handlers[action.type](state, action)
// 		} else {
// 			return state
// 		}
// 	}
// }
