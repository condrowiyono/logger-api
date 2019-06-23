function meta(status, page, pages, total) {
	var meta = {
		status,
		page,
		pages,
		total
	};
	return meta;
}

function writeResponse(message,meta,data,err) {
	var response = {};
	if (message) {
		response.message = message;
	}
	if (meta) {
		response.meta = meta;
	}
	if (data) {
		response.data = data;
	}
	if (err) {
		response.err = err;
	}
	return response;
}

// Special for Catch error on sequalize
function writeError(err) {
	var response = {
		message: err.message
	};
	return response;
} 
export default {meta,writeResponse,writeError};