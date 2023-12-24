'use client'
import { useState } from 'react'
import { styled } from '@mui/material/styles';
import { Button, Box, Modal, Typography } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Folder from '@mui/icons-material/Folder';
import NextImage from 'next/image'

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function Home() {
  const [file, setFile] = useState<File>()
  const [previewAvatar, setPreviewAvatar] = useState<Blob | MediaSource | null>();
  const [openSuccessModal, setOpenSuccessModal] = useState(false);

  const handleOpen = () => setOpenSuccessModal(true);
  const handleClose = () => {
    setOpenSuccessModal(false)
    setPreviewAvatar(null);
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!file) return

    try {
      const data = new FormData()
      data.set('file', file)

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: data
      })
      if (!res.ok) throw new Error(await res.text())

      handleOpen();
    } catch (e: any) {
      console.error(e)
    }
  }

  const onSelectFile = (event: any) => {
    const fileObject = event.target.files?.[0] || null;
    console.log(fileObject);
    if (fileObject) {
      const imgName = fileObject.name;
      // console.log(imgName);

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
    <Box>
      <form onSubmit={onSubmit}>
        <Box>
          <Button component="label" variant="contained" startIcon={<Folder />} onChange={onSelectFile}>
            Browse file
            <VisuallyHiddenInput type="file" />
          </Button>

          <Box sx={{ mt: 2, mb: 2 }}>
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
          </Box>

          <Box>
            <Button
              type="submit"
              variant="contained"
              startIcon={<CloudUploadIcon />}
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
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Upload successfully.
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Your file in [root]/public/uploads directory.
          </Typography>
        </Box>
      </Modal>
    </Box>
  )
}
