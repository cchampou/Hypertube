import * as actionTypes from './actionTypes'

export const processComment = (comment, videoId) => ({
	type : actionTypes.PROCESS_COMMENT,
	comment,
	videoId
})

export const resetComment = () => ({
	type : actionTypes.RESET_COMMENT
})
