import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {
    Box, Container, Typography, InputBase, Button, Tooltip,
    TextField, useMediaQuery, useTheme, Modal
} from '@mui/material';
import { styled } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import Layout from './Layout/Layout';
import Navbar from './Layout/Navbar';
import QuestionMenu from './Components/QuestionMenu';
import Footer from './Layout/Footer';
import axios from 'axios';

const Dashboard = () => {
    const [title, setTitle] = useState('')
    const [question, setQuestion] = useState('')
    const [file, setFile] = useState('');
    const [preview, setPreview] = useState('');
    const [open, setOpen] = useState(false);
    const [setMsg] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const { user } = useSelector(state => state.auth);

    const uploadQuestion = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/add-question', {
                userId: user.id,
                title: title,
                question: question,
                file: file
            }, {
                headers: {
                    "Content-Type": 'multipart/form-data'
                }
            });
            window.location.reload();
        } catch (error) {
            if (error.response) {
                setMsg(error.response.data.msg);
            }
        }
    }
    const loadImage = (e) => {
        const media = e.target.files[0];
        setFile(media);
        setPreview(URL.createObjectURL(media));
    };

    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: isSmallScreen ? '90%' : 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    };

    const Search = styled('div')(({ theme }) => ({
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: '#F6F1DE',
        width: '100%',
        maxWidth: '800px',
        [theme.breakpoints.up('sm')]: { width: '90ch' },
    }));

    const SearchIconWrapper = styled('div')(({ theme }) => ({
        padding: theme.spacing(0, 2),
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    }));

    const StyledInputBase = styled(InputBase)(({ theme }) => ({
        '& .MuiInputBase-input': {
            padding: theme.spacing(1, 1, 1, 0),
            paddingLeft: `calc(1em + ${theme.spacing(4)})`,
            transition: theme.transitions.create('width'),
            width: '100%',
            [theme.breakpoints.up('sm')]: { width: '90ch' },
            color: '#070F2B',
            fontFamily: 'Cal Sans',
            '&::placeholder': {
                color: '#070F2B',
                fontFamily: 'Cal Sans',
                opacity: 0.5,
            },
        },
    }));

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <Layout>
            <Box
                sx={{
                    minHeight: '80vh',
                    backgroundImage: `
                    linear-gradient(to bottom, #0C0950 0%, #2A5298 100%),
                    url("/template2.png")
                    `,
                    width: '100%',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                    backgroundSize: 'cover',
                    backgroundBlendMode: 'overlay'
                }}
            >
                <Navbar />
                <Container maxWidth="lg">
                    <Box
                        sx={{
                            display: 'flex', flexDirection: 'column',
                            justifyContent: 'center', alignItems: 'center',
                            minHeight: '80vh', textAlign: 'center', gap: 3,
                        }}
                    >
                        <Typography
                            variant={isSmallScreen ? 'h5' : 'h3'}
                            color="#F6F1DE"
                            sx={{ fontFamily: 'Cal Sans', fontWeight: 400 }}
                        >
                            Selamat Datang di Forum Tanya Jawab! <span style={{ color: '#FFDB00' }}>{user?.username || ''}</span>
                        </Typography>

                        <Box sx={{ width: '150px', height: '4px', backgroundColor: '#FFDB00' }} />

                        <Typography
                            variant="h6"
                            color="#F6F1DE"
                            sx={{ fontFamily: 'Cal Sans', fontWeight: 400 }}
                        >
                            Platform untuk belajar dan berbagi ilmu pengetahuan
                        </Typography>

                        <Box
                            sx={{
                                display: 'flex', flexDirection: isSmallScreen ? 'column' : 'row',
                                gap: 2, alignItems: 'center', justifyContent: 'center', width: '100%',
                            }}
                        >
                            <Search>
                                <SearchIconWrapper>
                                    <SearchIcon sx={{ color: '#070F2B' }} />
                                </SearchIconWrapper>
                                <StyledInputBase
                                    placeholder="Apa yang ingin anda ketahui? Cari disini..."
                                    value={searchTerm}
                                    onChange={(e) => {
                                        setSearchTerm(e.target.value);
                                    }}
                                />
                            </Search>
                            {user ? (
                                <Tooltip title="Buat Pertanyaan" placement="bottom" arrow>
                                    <Button
                                        onClick={handleOpen}
                                        sx={{
                                            backgroundColor: '#FFDB00', color: '#070F2B',
                                            fontFamily: 'Cal Sans', fontWeight: 400,
                                            borderRadius: '10px', padding: '10px 20px',
                                            '&:hover': { backgroundColor: '#FFDB00', opacity: 0.8 },
                                        }}
                                    >
                                        <AddIcon sx={{ mr: 1 }} />
                                        Buat Pertanyaan
                                    </Button>
                                </Tooltip>
                            ) :
                                ''
                            }
                        </Box>
                        <Modal open={open} onClose={handleClose}>
                            <Box sx={style}>
                                <Typography id="modal-title" variant="h6" sx={{ fontFamily: 'Cal Sans', mb: 2 }}>
                                    Buat Pertanyaan
                                </Typography>
                                <form onSubmit={uploadQuestion}>
                                    <TextField
                                        label="Judul Pertanyaan"
                                        name="title"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        fullWidth
                                        required
                                        variant="outlined"
                                        sx={{ mb: 2 }}
                                    />
                                    <TextField
                                        label="Deskripsi Pertanyaan"
                                        name="question"
                                        value={question}
                                        onChange={(e) => setQuestion(e.target.value)}
                                        fullWidth
                                        required
                                        multiline
                                        rows={4}
                                        variant="outlined"
                                        sx={{ mb: 2 }}
                                    />
                                    <Box sx={{ mb: 2 }}>
                                        <Typography variant="subtitle1" sx={{ fontFamily: 'Cal Sans', mb: 1 }}>
                                            Unggah Gambar (Opsional)
                                        </Typography>
                                        {preview ? (
                                            <Box sx={{ position: 'relative' }}>
                                                <img
                                                    src={preview}
                                                    alt="preview"
                                                    loading='lazy'
                                                    style={{
                                                        width: '100%',
                                                        maxHeight: '320px',
                                                        objectFit: 'contain',
                                                        border: '1px dashed #ccc',
                                                        borderRadius: '4px'
                                                    }}
                                                />
                                                <Button
                                                    onClick={() => {
                                                        setPreview('');
                                                        setFile('');
                                                    }}
                                                    sx={{
                                                        position: 'absolute',
                                                        top: 8,
                                                        right: 8,
                                                        backgroundColor: 'error.main',
                                                        color: 'white',
                                                        minWidth: 'unset',
                                                        width: '24px',
                                                        height: '24px',
                                                        borderRadius: '50%',
                                                        '&:hover': {
                                                            backgroundColor: 'error.dark'
                                                        }
                                                    }}
                                                >
                                                    ×
                                                </Button>
                                            </Box>
                                        ) : (
                                            <label htmlFor="quest-img" style={{ cursor: 'pointer' }}>
                                                <Box
                                                    sx={{
                                                        border: '2px dashed #ccc',
                                                        borderRadius: '4px',
                                                        padding: 3,
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        '&:hover': {
                                                            borderColor: 'primary.main',
                                                            backgroundColor: 'action.hover'
                                                        }
                                                    }}
                                                >
                                                    <AddIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
                                                    <Typography sx={{ color: 'text.secondary', textAlign: 'center' }}>
                                                        Klik untuk memilih gambar atau seret ke sini
                                                    </Typography>
                                                    <Typography variant="caption" sx={{ color: 'text.disabled', mt: 1 }}>
                                                        Format yang didukung: JPEG, PNG
                                                    </Typography>
                                                </Box>
                                            </label>
                                        )}
                                        <input
                                            type="file"
                                            id="quest-img"
                                            onChange={loadImage}
                                            accept="image/jpeg, image/png"
                                            style={{ display: 'none' }}
                                        />
                                    </Box>
                                    <Box sx={{ display: 'flex', gap: 2 }}>
                                        <Button
                                            onClick={handleClose}
                                            variant="outlined"
                                            fullWidth
                                            sx={{
                                                fontFamily: 'Cal Sans',
                                                color: 'text.primary',
                                                borderColor: 'text.primary'
                                            }}
                                        >
                                            Batal
                                        </Button>
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            fullWidth
                                            sx={{
                                                backgroundColor: '#FFDB00',
                                                color: '#070F2B',
                                                fontFamily: 'Cal Sans',
                                                fontWeight: 'bold',
                                                '&:hover': {
                                                    backgroundColor: '#FFDB00',
                                                    opacity: 0.9
                                                }
                                            }}
                                        >
                                            Kirim Pertanyaan
                                        </Button>
                                    </Box>
                                </form>
                            </Box>
                        </Modal>
                    </Box>
                </Container>
            </Box>
            <section className="QuestionMenu" style={{ minHeight: '80vh' }}>
                <QuestionMenu searchTerm={searchTerm} />
            </section>
            <section className="Footer">
                <Footer />
            </section>
        </Layout>
    );
};

export default Dashboard;