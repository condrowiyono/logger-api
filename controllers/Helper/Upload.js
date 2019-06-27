import multer from 'multer';
const fileSize = 5 * 1024 * 1024;

function generalUploadDashboard(directory) {
	var storage = multer.diskStorage({
		destination: function (req, file, cb) {
			cb(null, `./uploads/${directory}/`);
		},
		filename: function (req, file, cb) {
			let extArray = file.mimetype.split("/");
			let extension = extArray[extArray.length - 1];
			cb(null, file.originalname.replace(/[|&;$%@"<>()+,.-\s]/g, "_") + '_' + Math.random().toString(36).substr(2, 9)+ '.' +extension);
		}
	});

	var option = {
		limits: {
			files: 1,
			fileSize,
		},
		storage: storage 
	};
	var upload =  multer(option);
	var type = upload.single('file');
	
	function middleware (req, res, next) {
		type(req, res, (err) => {
		  	req.uploadError = err;
			if (err) {
				if (err.code === 'LIMIT_FILE_SIZE') {
					res.status(413).json({error: 'File too large'});
				} else {
					var result = {
						'status': 'Fail',
						'error': err
					};
					res.end(result);
				}
			}
		  	next();
		});
	  }
	
	return middleware;
}

export default {generalUploadDashboard};