import React, { useState } from "react";
import { Button } from "react-bootstrap";
import "./upload-component.scss";
import { toast } from "react-toastify";

const UploadComponent = (props) => {
    const { index, handleFileSelect, className } = props;
    const [selectedFile, setSelectedFile] = useState(null);
    const [dragging, setDragging] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);

    const handleDragOver = (event) => {
        event.preventDefault();
        setDragging(true);
    };

    const handleDragLeave = () => {
        setDragging(false);
    };

    const handleDrop = (event) => {
        event.preventDefault();
        setDragging(false);
        const file = event.dataTransfer.files[0];
        if (file.type.startsWith("image/")) {
            setSelectedFile(file);
            setPreviewImage(URL.createObjectURL(file));
            handleFileSelect(index, file);
        } else {
            toast.error("Invalid File type")
        }
    };

    const handleFileSelection = (event) => {
        const file = event.target.files[0];
        if (file.type.startsWith("image/")) {
            setSelectedFile(file);
            setPreviewImage(URL.createObjectURL(file));
            handleFileSelect(index, file);
        } else {
            toast.error("Invalid File type")
        }
    };

    return (
        <div
            className={`drag-and-drop ${dragging ? "dragging" : ""} ${className ?? ""}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            <input
                type="file"
                id={`fileInput-${index}`}
                style={{ display: "none" }}
                onChange={handleFileSelection}
                accept="image/*"
            />
            <label className="file-input-label" htmlFor={`fileInput-${index}`}>
                {previewImage ? (
                    <img src={previewImage} alt="Selected" height="100%" />
                ) : (
                    selectedFile ? selectedFile.name : "Drag and Drop or Click to Upload"
                )}
            </label>
            {/* <Button variant="primary" onClick={handleUpload} disabled={!selectedFile}>
                Upload
            </Button> */}
        </div>
    );
};

export default UploadComponent;