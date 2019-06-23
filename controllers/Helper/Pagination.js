function pagination(limit, offset , page) {
	if (isNaN(page) || page < 1) {
		page = 1;
	}
	var pagination = {
		limit: parseInt(limit, 10),
		offset:parseInt(offset, 10),
		page: parseInt(page, 10)
	};
	return pagination;
}

export default {pagination};