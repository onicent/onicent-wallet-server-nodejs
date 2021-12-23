// import path from '../web.config.json';

//----------------------------------------------------//
const singleUpload = async (req, res) => {
  try {
    if (!req.files) {
      res.send({
        status: false,
        message: 'No file uploaded'
      });
    } else {
      //Use the name of the input field (i.e. "avatar") to retrieve the uploaded file
      let filename = req.files.filename;

      //Use the mv() method to place the file in upload directory (i.e. "uploads")
      filename.mv(filename.name);

      //send response
      res.send({
        status: true,
        message: 'File is uploaded',
        data: {
          name: filename.name,
          mimetype: filename.mimetype,
          size: filename.size
        }
      });
    }
  } catch (err) {
    res.status(500).send(err);
  }
}
//------------------------------------------------------//
// exports.multiUpload = async (req, res) => {
//     try {
//         if (!req.files) {
//             res.send({
//                 status: false,
//                 message: 'No file uploaded'
//             });
//         } else {
//             let data = [];

//             //loop all files
//             _.forEach(_.keysIn(req.files.filename), (key) => {
//                 let file = req.files.filename[key];

//                 //move photo to uploads directory
//                 file.mv(path.Folder_Storage + file.name);

//                 //push file details
//                 data.push({
//                     name: file.name,
//                     mimetype: file.mimetype,
//                     size: file.size
//                 });
//             });

//             //return response
//             res.send({
//                 status: true,
//                 message: 'Files are uploaded',
//                 data: data
//             });
//         }
//     } catch (err) {
//         res.status(500).send(err);
//     }
// }

export default singleUpload;