'use client'
import React, { useEffect, useState } from 'react'
import NextImage from 'next/image'
import axios from 'axios'
import Button from '@mui/material/Button';
import {
    EditOutlined,
    DeleteOutlined
} from "@mui/icons-material";
import { Box, Grid } from '@mui/material';

function FileManager() {
    const [fileList, setFileList] = useState([])

    const list = () => {
        const apiUser = process.env.NEXT_PUBLIC_API;
        axios
            .get(`${apiUser}/medias`)
            .then((response) => {
                console.log(response.data);
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

    const deleteImage = (deleteUrl: string) => {
        // axios
        //     .get(deleteUrl)
        //     .then((response) => {
        //         list();
        //     })
        //     .catch((error) => {
        //         console.log(error);
        //         alert('Can not delete this image.')
        //     });
        window.open(deleteUrl, '_blank');
        location.reload();
    }

    return (
        <main className='MuiContainer-root MuiContainer-maxWidthSm upload-form'>
            <Grid sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap', gap: 1 }}>
                {fileList.map((item: any) => {
                    return (
                        <Box key={item.fileName} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
                            <a href={item.url} target="_blank">
                                <NextImage
                                    src={item.url}
                                    width={184}
                                    height={100}
                                    style={{
                                        objectFit: 'cover',
                                    }}
                                    alt={item.fileName}
                                />
                            </a>
                            <Grid sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: 0.5 }}>
                                <Button variant="contained" size='small' sx={{ display: 'flex', gap: 0.5 }} disabled><EditOutlined />Edit</Button>
                                <Button variant="contained" color="error" size='small' sx={{ display: 'flex', gap: 0.5 }} onClick={() => deleteImage(item.delete)}><DeleteOutlined />Delete</Button>
                            </Grid>
                        </Box>
                    )
                })}
            </Grid>
        </main>
    )
}

export default FileManager