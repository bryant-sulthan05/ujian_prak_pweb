import React, { useState } from 'react';
import {
    Box, TextField, Typography, Button, Container, Alert
} from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ForgotPass = () => {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confPassword, setConfPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleSendOtp = async () => {
        try {
            setError('');
            const res = await axios.post('http://localhost:5000/forgot-password', { email });
            setSuccess(res.data.msg);
            setStep(2);
        } catch (err) {
            setError(err.response?.data?.msg || 'Gagal mengirim OTP');
        }
    };

    const handleVerifyOtp = async () => {
        try {
            setError('');
            const res = await axios.post('http://localhost:5000/verify-otp', { email, otp });
            setSuccess(res.data.msg);
            setStep(3);
        } catch (err) {
            setError(err.response?.data?.msg || 'OTP salah');
        }
    };

    const handleResetPassword = async () => {
        try {
            setError('');
            const res = await axios.post('http://localhost:5000/reset-password', {
                email,
                password: newPassword,
                confPassword
            });
            setSuccess(res.data.msg);
            setStep(4);
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.msg || 'Gagal reset password');
        }
    };

    return (
        <Container maxWidth="sm">
            <Box sx={{ mt: 10, p: 4, boxShadow: 3, borderRadius: 2 }}>
                <Typography variant="h5" sx={{ mb: 3, textAlign: 'center', fontWeight: 'bold' }}>
                    {step === 1 && 'Lupa Password'}
                    {step === 2 && 'Masukkan OTP'}
                    {step === 3 && 'Buat Password Baru'}
                    {step === 4 && 'Berhasil!'}
                </Typography>

                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

                {step === 1 && (
                    <>
                        <TextField
                            label="Email"
                            fullWidth
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            sx={{ mb: 2 }}
                        />
                        <Button fullWidth variant="contained" onClick={handleSendOtp}>
                            Kirim OTP
                        </Button>
                    </>
                )}

                {step === 2 && (
                    <>
                        <Typography variant="body1" sx={{ mb: 2 }}>
                            Kode OTP telah dikirim ke email: <strong>{email}</strong>
                        </Typography>
                        <TextField
                            label="OTP"
                            fullWidth
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            sx={{ mb: 2 }}
                        />
                        <Button fullWidth variant="contained" onClick={handleVerifyOtp}>
                            Verifikasi OTP
                        </Button>
                    </>
                )}

                {step === 3 && (
                    <>
                        <TextField
                            label="Password Baru"
                            type="password"
                            fullWidth
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            label="Konfirmasi Password"
                            type="password"
                            fullWidth
                            value={confPassword}
                            onChange={(e) => setConfPassword(e.target.value)}
                            sx={{ mb: 2 }}
                        />
                        <Button fullWidth variant="contained" onClick={handleResetPassword}>
                            Reset Password
                        </Button>
                    </>
                )}

                {step === 4 && (
                    <Typography align="center" sx={{ mt: 2 }}>
                        Password berhasil direset. Silakan login kembali.
                    </Typography>
                )}
            </Box>
        </Container>
    );
};

export default ForgotPass;