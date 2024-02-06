'use client'
import React from 'react'
import Link from '@mui/material/Link';
import { Box, Button } from '@mui/material'
import { Folder, Refresh, ViewList } from '@mui/icons-material'
import { usePathname } from 'next/navigation'

function Navbar() {
  const pathname = usePathname()

  return (
    <main className='MuiContainer-root MuiContainer-maxWidthSm upload-form'>
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Button
          sx={{ display: 'flex', gap: 1 }}
          href={pathname === '/file-manager' ? '#' : '/file-manager'}
          className={`${pathname === '/file-manager' ? 'menu-active' : ''}`}
          color='secondary'
          variant="contained"
          component={Link}>
          <ViewList />File Manager
        </Button>
        <Button
          sx={{ display: 'flex', gap: 1 }}
          href={pathname === '/' ? '#' : '/'}
          className={`${pathname === '/' ? 'menu-active' : ''}`}
          color='success'
          variant="contained"
          component={Link}>
          <Folder />Upload
        </Button>
        <Button
          sx={{ display: 'flex', gap: 1 }}
          color='primary'
          variant="contained"
          onClick={() => window.location.reload()}>
          <Refresh />Refresh
        </Button>
      </Box>
    </main>
  )
}

export default Navbar