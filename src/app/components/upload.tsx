'use client'
import { useState } from 'react'
import { styled } from '@mui/material/styles';
import { Button, Box, Modal, Typography, TextField, Grid, DialogActions } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Folder from '@mui/icons-material/Folder';
import NextImage from 'next/image'
import axios from "axios"
import VisuallyHiddenInput from '../styles/visuallyHiddenInput';
import Style from '../styles/style';

function Upload() {
    const [file, setFile] = useState<File>()
    const [imageCode, setImageCode] = useState("")
    const [source, setSource] = useState("")
    const [previewAvatar, setPreviewAvatar] = useState<Blob | MediaSource | null>();
    const [openSuccessModal, setOpenSuccessModal] = useState(false);
    const [modalHeader, setModalHeader] = useState("Upload successfully.");
    const [modalContent, setModalContent] = useState("Your file on API.");
    const [active, setActive] = useState(true)

    const handleOpen = (header: string = "Upload successfully.", content: string = "Your file in API.") => {
        setOpenSuccessModal(true)
        setModalHeader(header)
        setModalContent(content)
    };
    const handleClose = () => {
        setOpenSuccessModal(false)
    };

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!file) return

        const formData = new FormData()
        formData.set('file', file)
        formData.set('image_code', imageCode);
        formData.set('source', source);
        const api = process.env.NEXT_PUBLIC_API;

        await axios
            .post(`${api}/upload`, formData)
            .then((response) => {
                // console.log(response.data);
                handleOpen('Upload successfully.', `File name: ${response.data.file_name}`);
                setActive(false)
            })
            .catch((error) => {
                let header = "Upload failed.";
                let message = "Something went wrong!";
                console.log(error);
                if (error.response) {
                    if (error.response.data) {
                        if (error.response.data.message) {
                            message = error.response.data.message
                            handleOpen(header, message);
                        }
                    }
                } else {
                    handleOpen(header, message);
                }
            });
    }

    const onSelectFile = (event: any) => {
        const fileObject = event.target.files?.[0] || null;
        // console.log(fileObject);
        if (fileObject) {
            const imgName = fileObject.name;

            const reader = new FileReader();
            reader.readAsDataURL(fileObject);
            reader.onloadend = () => {
                const img: any = new Image();

                img.src = reader.result;
                // console.log(reader.result);

                img.onload = () => {
                    const canvas = document.createElement("canvas");
                    const maxSize = Math.max(img.width, img.height);
                    canvas.width = maxSize;
                    canvas.height = maxSize;
                    const ctx = canvas.getContext("2d");
                    ctx?.drawImage(
                        img,
                        (maxSize - img.width) / 2,
                        (maxSize - img.height) / 2
                    );
                    canvas.toBlob(
                        (blob: any) => {
                            const file = new File([blob], imgName, {
                                type: "image/png",
                                lastModified: Date.now(),
                            });
                            // console.log(file);
                            setPreviewAvatar(file);

                            setFile(fileObject)
                        },
                        "image/jpeg",
                        0.8
                    );
                };
            };
        }
    };

    return (
        <main className='MuiContainer-root MuiContainer-maxWidthSm upload-form'>
            <form onSubmit={onSubmit}>
                <Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                        <div className='preview-image'>
                            {previewAvatar ? (
                                <NextImage
                                    src={URL.createObjectURL(previewAvatar)}
                                    fill
                                    style={{
                                        objectFit: 'cover',
                                    }}
                                    alt=""
                                />
                            ) : (
                                <NextImage
                                    src="/upload-placeholder.jpg"
                                    fill
                                    style={{
                                        objectFit: 'cover',
                                    }}
                                    alt=""
                                />
                            )}
                        </div>
                        <Button sx={{ mt: 1 }}
                            component="label"
                            variant="contained"
                            startIcon={<Folder />}
                            onChange={onSelectFile}
                            disabled={!active}
                        >
                            Browse file
                            <VisuallyHiddenInput type="file" />
                        </Button>
                    </Box>
                    <Grid container spacing={2} sx={{ mb: 2 }}>
                        <Grid item key="image_code" md={4} sm={4} xs={12}>
                            Image code:
                        </Grid>
                        <Grid item key="image_code_input" md={8} sm={8} xs={12}>
                            <TextField
                                label="Image code"
                                placeholder="Image code"
                                disabled={!active}
                                onChange={(e) => setImageCode(e.target.value)}
                                variant="outlined"
                                size='small'
                                fullWidth />
                        </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                        <Grid item md={4} sm={4} xs={12}>
                            <span>Source:</span>
                        </Grid>
                        <Grid item md={8} sm={8} xs={12}>
                            <TextField
                                label="Source"
                                placeholder="Source"
                                disabled={!active}
                                onChange={(e) => setSource(e.target.value)}
                                variant="outlined"
                                size='small'
                                helperText="Specify the source of the image that it was uploaded from Who/organization/agency"
                                fullWidth />
                        </Grid>
                    </Grid>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', mt: 2 }}>
                        <Button
                            type="submit"
                            variant="contained"
                            startIcon={<CloudUploadIcon />}
                            disabled={!active}
                            fullWidth
                        >
                            Upload
                        </Button>
                    </Box>
                </Box>
            </form>

            <Modal
                open={openSuccessModal}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={Style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        {modalHeader}
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        {modalContent}
                    </Typography>
                    <DialogActions>
                        <Button autoFocus onClick={handleClose}>Ok</Button>
                    </DialogActions>
                </Box>
            </Modal>
        </main>
    )
}

export default Upload