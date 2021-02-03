"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { Schema, model } = require("mongoose");
const fileSchema = new Schema({
    filename: String,
    mimetype: String,
    path: String
});
exports.default = model("File", fileSchema);
//# sourceMappingURL=UploadedImage.js.map