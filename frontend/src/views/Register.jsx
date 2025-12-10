import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { reset } from "../features/authSlice";

// Material UI
import {
    Container, FormGroup, TextField,
    Card, CardContent, Button, Typography,
    Link, Alert, AlertTitle
} from '@mui/material';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        username: '',
        email: '',
        tlp: '',
        password: '',
        confPassword: ''
    });
    const [errors, setErrors] = useState({});
    const [apiError, setApiError] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { isLoading, message } = useSelector((state) => state.auth);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const validateForm = () => {
        const newErrors = {};
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@#$!&*]).{8,}$/;

        if (!formData.name) newErrors.name = 'Nama wajib diisi';
        if (!formData.username) newErrors.username = 'Username wajib diisi';
        if (!formData.email) newErrors.email = 'Email wajib diisi';
        if (!formData.tlp) newErrors.tlp = 'Nomor HP wajib diisi';

        if (!formData.password) {
            newErrors.password = 'Password wajib diisi';
        } else if (!passwordRegex.test(formData.password)) {
            newErrors.password = 'Password harus mengandung huruf kapital, angka, simbol (@,#,$,!,&,*), dan minimal 8 karakter';
        }

        if (formData.password !== formData.confPassword) {
            newErrors.confPassword = 'Password dan konfirmasi password tidak sama';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            const response = await fetch('http://localhost:5000/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                const text = await response.text();
                throw new Error(text || 'Server returned non-JSON response');
            }

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.msg || 'Registration failed');
            }

            dispatch(reset());
            navigate('/login');
        } catch (error) {
            console.error('Registration error:', error);
            setApiError(error.message || 'Terjadi kesalahan saat registrasi');
        }
    };

    return (
        <div style={{
            background: 'linear-gradient(to bottom, #0C0950 0%, #2A5298 100%)',
            minHeight: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            <Container maxWidth="sm">
                <Card sx={{
                    borderRadius: '8px',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)',
                    padding: '2rem'
                }}>
                    {(message || apiError) && (
                        <Alert severity="error" sx={{ mb: 3 }}>
                            <AlertTitle>Error</AlertTitle>
                            <strong>{message || apiError}</strong>
                        </Alert>
                    )}

                    <CardContent>
                        <Typography variant="h4" align="center" sx={{
                            color: '#070F2B',
                            fontWeight: 'bold',
                            mb: 3
                        }}>
                            Daftar Akun Baru
                        </Typography>

                        <form onSubmit={handleSubmit}>
                            <FormGroup sx={{ mb: 2 }}>
                                <TextField
                                    variant="outlined"
                                    type="text"
                                    name="name"
                                    size="medium"
                                    fullWidth
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Nama Lengkap"
                                    error={!!errors.name}
                                    helperText={errors.name}
                                    required
                                    sx={{
                                        width: '100%',
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
                                    type="text"
                                    name="username"
                                    size="medium"
                                    fullWidth
                                    value={formData.username}
                                    onChange={handleChange}
                                    placeholder="Username"
                                    error={!!errors.username}
                                    helperText={errors.username}
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
                                    type="email"
                                    name="email"
                                    size="medium"
                                    fullWidth
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="Email"
                                    error={!!errors.email}
                                    helperText={errors.email}
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
                                    type="tel"
                                    name="tlp"
                                    size="medium"
                                    fullWidth
                                    value={formData.tlp}
                                    onChange={handleChange}
                                    placeholder="Nomor HP"
                                    error={!!errors.tlp}
                                    helperText={errors.tlp}
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
                                    name="password"
                                    size="medium"
                                    fullWidth
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Password"
                                    error={!!errors.password}
                                    helperText={errors.password}
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
                                <Typography variant="caption" sx={{ mt: 1, color: 'text.secondary' }}>
                                    Password harus mengandung huruf kapital, angka, dan simbol (@,#,$,!,&,*), minimal 8 karakter.
                                </Typography>
                            </FormGroup>

                            <FormGroup sx={{ mb: 3 }}>
                                <TextField
                                    variant="outlined"
                                    type="password"
                                    name="confPassword"
                                    size="medium"
                                    fullWidth
                                    value={formData.confPassword}
                                    onChange={handleChange}
                                    placeholder="Konfirmasi Password"
                                    error={!!errors.confPassword}
                                    helperText={errors.confPassword}
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
                                {isLoading ? 'Loading...' : 'DAFTAR'}
                            </Button>

                            <Typography align="center" sx={{ color: '#070F2B' }}>
                                Sudah punya akun?{' '}
                                <Link href="/login" sx={{
                                    color: '#070F2B',
                                    fontWeight: 'bold',
                                    textDecoration: 'none',
                                    '&:hover': {
                                        textDecoration: 'underline'
                                    }
                                }}>
                                    Login
                                </Link>
                            </Typography>
                        </form>
                    </CardContent>
                </Card>
            </Container>
        </div>
    );
};

export default Register;