import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Logout, reset } from '../../features/authSlice';

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Container from '@mui/material/Container';
import { Divider } from '@mui/material';

import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/LoginOutlined';
import RegIcon from '@mui/icons-material/AppRegistrationOutlined';

export default function Navbar() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [dataUser, setdataUser] = useState([]);
    const user = useSelector((state) => state.auth.user);

    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const isScrolled = window.scrollY > 795;
            setScrolled(isScrolled);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        if (user) {
            getdataUser();
        }
    }, [user]);

    const getdataUser = async () => {
        try {
            const response = await axios.get('http://localhost:5000/me');
            setdataUser(response.data);
        } catch (error) {
            console.error('Error fetching user data:', error.message);
        }
    };

    const logout = () => {
        dispatch(Logout());
        dispatch(reset());
        navigate('/')
    };

    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null);

    return (
        <AppBar
            position="fixed"
            sx={{
                backgroundColor: scrolled ? '#0F1158' : 'transparent',
                boxShadow: scrolled ? 2 : 'none',
                padding: '10px',
                transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
            }}>
            <Container maxWidth="xl">
                <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography
                        variant="h6"
                        sx={{ fontFamily: 'Cal Sans', fontWeight: 400, color: '#F6F1DE', cursor: 'pointer' }}
                        onClick={() => navigate('/')}
                    >
                        Forum Tanya Jawab
                    </Typography>
                    <Box>
                        <Tooltip title="Account settings">
                            <IconButton onClick={handleClick} size="small">
                                {dataUser.image ? (
                                    <Avatar
                                        alt={dataUser.image}
                                        src={dataUser.url}
                                    />
                                ) : (
                                    <Avatar sx={{
                                        bgcolor: '#FFDB00',
                                    }}>
                                        {dataUser?.username?.[0]?.toUpperCase() || 'A'}
                                    </Avatar>
                                )}
                            </IconButton>
                        </Tooltip>
                        <Menu
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleClose}
                            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                            PaperProps={{
                                elevation: 4,
                                sx: {
                                    mt: 1.5,
                                    borderRadius: 2,
                                    minWidth: 180,
                                    filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                                    bgcolor: '#fff',
                                    '& .MuiMenuItem-root': {
                                        px: 2,
                                        py: 1.5,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1,
                                        fontFamily: 'PT Sans',
                                        fontWeight: 500,
                                        color: '#61677A',
                                        '&:hover': {
                                            bgcolor: '#f0f0f0',
                                        }
                                    },
                                    '&:before': {
                                        content: '""',
                                        display: 'block',
                                        position: 'absolute',
                                        top: 0,
                                        right: 14,
                                        width: 10,
                                        height: 10,
                                        bgcolor: '#fff',
                                        transform: 'translateY(-50%) rotate(45deg)',
                                        zIndex: 0,
                                    },
                                },
                            }}
                        >
                            {user ? (
                                <>
                                    <MenuItem onClick={handleClose} component="a" href="/Profile">
                                        <Avatar sx={{ width: 24, height: 24 }} />
                                        <Typography variant="body1" color="initial" sx={{ fontFamily: 'Cal Sans' }}>Profil</Typography>
                                    </MenuItem>
                                    <Divider sx={{ my: 1 }} />
                                    <MenuItem onClick={() => { handleClose(); logout(); }}>
                                        <LogoutIcon sx={{ fontSize: 20 }} />
                                        <Typography variant="body1" color="initial" sx={{ fontFamily: 'Cal Sans' }}>Logout</Typography>
                                    </MenuItem>
                                </>
                            ) : (
                                <>
                                    <MenuItem onClick={handleClose} component="a" href="/Login">
                                        <LoginIcon sx={{ fontSize: 20 }} />
                                        <Typography variant="body1" color="initial" sx={{ fontFamily: 'Cal Sans' }}>Login</Typography>
                                    </MenuItem>
                                    <MenuItem onClick={handleClose} component="a" href="/Register">
                                        <RegIcon sx={{ fontSize: 20 }} />
                                        <Typography variant="body1" color="initial" sx={{ fontFamily: 'Cal Sans' }}>Register</Typography>
                                    </MenuItem>
                                </>
                            )}
                        </Menu>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
}
