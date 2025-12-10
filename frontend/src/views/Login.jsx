import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { LoginUser, reset, getMe } from "../features/authSlice";

// Material UI
import {
    Container, FormGroup, TextField,
    Card, CardContent, Button, Typography, Box
} from '@mui/material';

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user, isSuccess, isLoading } = useSelector((state) => state.auth);

    useEffect(() => {
        if (user || isSuccess) {
            dispatch(getMe());
            navigate("/");
        }
        dispatch(reset());
    }, [user, isSuccess, dispatch, navigate]);

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(LoginUser({ email, password }));
    };

    return (
        <div style={{
            background: 'linear-gradient(to bottom, #0C0950 0%, #2A5298 100%)',
            minHeight: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            <Container maxWidth="xs">
                <Card sx={{
                    borderRadius: '8px',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)',
                    padding: '2rem'
                }}>
                    <CardContent>
                        <Typography variant="h4" align="center" sx={{
                            color: '#070F2B',
                            fontWeight: 'bold',
                            mb: 3
                        }}>
                            Login
                        </Typography>
                        <form onSubmit={handleSubmit}>
                            <FormGroup sx={{ mb: 3 }}>
                                <TextField
                                    variant="outlined"
                                    type="email"
                                    size="medium"
                                    fullWidth
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Email"
                                    required
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: '4px',
                                            '& fieldset': {
                                                borderColor: '#E0E0E0',
                                            },
                                        },
                                    }}
                                />
                            </FormGroup>
                            <FormGroup sx={{ mb: 2 }}>
                                <TextField
                                    variant="outlined"
                                    type="password"
                                    size="medium"
                                    fullWidth
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Password"
                                    required
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: '4px',
                                            '& fieldset': {
                                                borderColor: '#E0E0E0',
                                            },
                                        },
                                    }}
                                />
                            </FormGroup>
                            <Button
                                type="submit"
                                variant="contained"
                                fullWidth
                                disabled={isLoading}
                                sx={{
                                    backgroundColor: '#070F2B',
                                    color: 'white',
                                    padding: '12px',
                                    borderRadius: '4px',
                                    fontWeight: 'bold',
                                    mb: 2,
                                    '&:hover': {
                                        backgroundColor: '#0C0950',
                                    }
                                }}
                            >
                                {isLoading ? 'Loading...' : 'LOGIN'}
                            </Button>
                        </form>
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: '.6rem' }}>
                            <Typography
                                variant="body1"
                                component="a"
                                href="/Register"
                                sx={{
                                    fontFamily: 'PT Sans',
                                    textDecoration: 'none',
                                    color: '#000'
                                }}
                            >
                                Belum punya akun? Daftar di sini!
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: '.6rem' }}>
                            <Typography
                                variant="body1"
                                component="a"
                                href="/ForgotPass"
                                sx={{
                                    fontFamily: 'PT Sans',
                                    textDecoration: 'none',
                                    color: '#000',
                                }}
                            >
                                Lupa Password
                            </Typography>
                        </Box>
                    </CardContent>
                </Card>
            </Container>
        </div>
    );
};

export default Login;