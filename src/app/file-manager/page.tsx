'use client'
import React, { useEffect, useState } from 'react'
import NextImage from 'next/image'
import axios from 'axios'
import Button from '@mui/material/Button';
import {
    EditOutlined,
    DeleteOutlined
} from "@mui/icons-material";
import { Box, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Modal, Typography } from '@mui/material';
import Style from '../styles/style';

function FileManager() {
    const [fileList, setFileList] = useState([])
    const [fileName, setFileName] = useState('');
    const [api, setApi] = useState(process.env.NEXT_PUBLIC_API)
    const [openConfirm, setOpenConfirm] = useState(false);
    const [openSuccessModal, setOpenSuccessModal] = useState(false);
    const [deleteMessage, setDeleteMessage] = useState('')

    const list = () => {
        axios
            .get(`${api}/medias`)
            .then((response) => {
                // console.log(response.data);
                setFileList(response.data);
            })
            .catch((error) => {
                console.log(error);
                setFileList([])
            });
    }

    useEffect(() => {
        list();
    }, []);

    const deleteImage = (fileName: string) => {
        setOpenConfirm(true)
        setFileName(fileName);
    }

    const handleOk = () => {
        setOpenConfirm(false)
        axios
            .delete(`${api}/delete/${fileName}`)
            .then((response) => {
                // console.log(response.data);
                const message = response?.data?.message || 'Delete successfully.'
                setDeleteMessage(message)
                setOpenSuccessModal(true)
                list();
            })
            .catch((error) => {
                console.log(error);
                alert('Can not delete this image.')
            })
            .finally(() => {
                setFileName('');
            });
    };

    const handleClose = () => {
        setOpenSuccessModal(false)
    };

    return (
        <main className='MuiContainer-root MuiContainer-maxWidthSm upload-form'>
            <Grid sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap', gap: 1 }}>
                {fileList.map((item: any) => {
                    const filePath = `${api}${item.path}`
                    return (
                        <Box key={item.fileName} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
                            <a href={filePath} target="_blank">
                                <NextImage
                                    src={filePath}
                                    width={184}
                                    height={100}
                                    style={{
                                        objectFit: 'cover',
                                    }}
                                    alt={item.fileName}
                                    priority={true}
                                />
                            </a>
                            <Grid sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: 0.5 }}>
                                <Button variant="contained" size='small' sx={{ display: 'flex', gap: 0.5 }} disabled><EditOutlined />Edit</Button>
                                <Button variant="contained" color="error" size='small' sx={{ display: 'flex', gap: 0.5 }} onClick={() => deleteImage(item.fileName)}><DeleteOutlined />Delete</Button>
                            </Grid>
                        </Box>
                    )
                })}
            </Grid>

            <Dialog
                sx={{ '& .MuiDialog-paper': { width: '80%', maxHeight: 435 } }}
                maxWidth="xs"
                open={openConfirm}
            >
                <DialogTitle>Confirm delete</DialogTitle>
                <DialogContent dividers>Do you want to delete this image?</DialogContent>
                <DialogActions>
                    <Button autoFocus onClick={() => setOpenConfirm(false)}>Cancel</Button>
                    <Button onClick={handleOk}>Ok</Button>
                </DialogActions>
            </Dialog>

            <Modal
                open={openSuccessModal}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={Style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        {deleteMessage}
                    </Typography>
                    <DialogActions>
                        <Button autoFocus onClick={handleClose}>Ok</Button>
                    </DialogActions>
                </Box>
            </Modal>
        </main>
    )
}

export default FileManager