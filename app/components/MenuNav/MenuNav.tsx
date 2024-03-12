'use client'
import * as React from 'react'
import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import Button from '@mui/material/Button'
import List from '@mui/material/List'
import Divider from '@mui/material/Divider'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'

import MenuOpenIcon from '@mui/icons-material/MenuOpen'
import DashboardIcon from '@mui/icons-material/Dashboard'
import ApartmentIcon from '@mui/icons-material/Apartment'
/* import LocationCityIcon from '@mui/icons-material/LocationCity'
import AddBusinessIcon from '@mui/icons-material/AddBusiness'
import ArticleIcon from '@mui/icons-material/Article'
import GroupAddIcon from '@mui/icons-material/GroupAdd'
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts' */

export default function TemporaryDrawer() {
  const [open, setOpen] = React.useState(false)
  /*  const drawerIconSmallScreen = useMediaQuery('(max-width:600px)'); */

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen)
  }

  const DrawerList = (
    <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
      <List>
        {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                {index % 2 === 0 ? <DashboardIcon /> : <ApartmentIcon />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {['All mail', 'Trash', 'Spam'].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                {index % 2 === 0 ? <DashboardIcon /> : <ApartmentIcon />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  )

  return (
    <div>
      <Button sx={{ marginLeft: 0 }} onClick={toggleDrawer(true)}>
        <MenuOpenIcon />
      </Button>
      <Drawer open={open} onClose={toggleDrawer(false)}>
        {DrawerList}
      </Drawer>
    </div>
  )
}
