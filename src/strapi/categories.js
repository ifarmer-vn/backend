const request = require("request");

const create = category => {
    return new Promise((resolve,reject) => {
        console.log(category);
        request.post("http://localhost:1337/categories").form(category).on('response', function(response) {
            console.log(response.statusCode) // 200
            console.log(response.headers['content-type']) // 'image/png'
        });
    });
};

/*
"ca-bien" : {
    "dateCreated" : "2019-02-20T16:45:50.048Z",
        "dateModified" : "2019-02-24T11:50:06.316Z",
        "id" : "ca-bien",
        "image" : "https://firebasestorage.googleapis.com/v0/b/ifarmer-e25f1.appspot.com/o/category%2Fcai-bien.jpg?alt=media&token=29239433-b34f-4542-a200-d23827656924",
        "name" : "Cá Biển",
        "popularity" : "10",
        "shortDescription" : "Cá biến là thực phẩm giàu chất dinh dưỡng, tốt cho sức khoẻ. Cá biển chứa nhiều clo và fluo có tác dụng tốt đối với xương và răng. Ngoài ra cá còn có DHA đóng vai trò quan trọng trong quá trình sinh trưởng của tế bào não và hệ thần kinh.",
        "smallImage" : "https://firebasestorage.googleapis.com/v0/b/ifarmer-e25f1.appspot.com/o/category%2Fcai-bien.jpg?alt=media&token=29239433-b34f-4542-a200-d23827656924",
        "title" : "Danh Sách Các Loại Cá Biển"
}*/
const mapping = category => {
    return {
        url: category.id
    };
};
const uploadImage = () => {
    const image = {
        "files": "...", // Buffer or stream of file(s)
        // "path": "user/avatar", // Uploading folder of file(s).
        "refId": "5a993616b8e66660e8baf45c", // User's Id.
        "ref": "user", // Model name.
        "source": "categories", // Plugin name.
        "field": "images" // Field name in the User model.
    }
};
const revealed = {
    create,
    mapping
};
module.exports = revealed;
