import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import Layout from './Layout/Layout'
import Navbar from './Layout/Navbar'
import {
    Box,
    Container,
    Avatar,
    TextField,
    Typography,
    Modal,
    Card,
    Tabs,
    Tab,
    Button,
    useMediaQuery,
    useTheme,
    CardContent
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import Footer from './Layout/Footer';
const TestProfile = () => {
    const [title, setTitle] = useState('')
    const [question, setQuestion] = useState('')
    const [file, setFile] = useState('');
    const [preview, setPreview] = useState('');
    const [open, setOpen] = React.useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState([]);
    const [answerCounts, setAnswerCounts] = useState({});
    const { user } = useSelector(state => state.auth);
    const [dataUser, setdataUser] = useState({});
    const [tab, setTab] = useState(0);
    const [setMsg] = useState('');
    const [editData, setEditData] = useState(null);
    const [editProfile, setEditProfile] = useState({
        name: '',
        username: '',
        password: '',
        confPassword: '',
        mail: '',
        phone: '',
        file: null,
        previewUrl: ''
    });
    const [form, setForm] = useState({
        title: '',
        body: '',
        image: null,
        previewImage: null
    });
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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

    const fetchData = useCallback(async () => {
        try {
            const [questionsRes, answersRes, countsRes] = await Promise.all([
                axios.get('http://localhost:5000/'),
                axios.get('http://localhost:5000/my-answers'),
                axios.get('http://localhost:5000/count-answer')
            ]);
            setQuestions(questionsRes.data);
            setAnswers(answersRes.data);
            setAnswerCounts(countsRes.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }, [setQuestions, setAnswers, setAnswerCounts]);

    useEffect(() => {
        fetchData();
        getdataUser();
    }, [fetchData]);

    const openEditModal = (item) => {
        setEditData(item);
        setForm({
            title: item.title || '',
            body: item.question || item.answer || '',
            previewImage: item.url || null,
            image: null
        });
        setOpenModal(true);
    };

    const handleImageChange = (e) => {
        if (e.target.files[0]) {
            setForm({
                ...form,
                image: e.target.files[0],
                previewImage: URL.createObjectURL(e.target.files[0])
            });
        }
    };

    const handleEditSave = async () => {
        const formData = new FormData();
        formData.append('title', form.title);
        formData.append(tab === 0 ? 'question' : 'answer', form.body);
        if (form.image) {
            formData.append('file', form.image);
        }

        try {
            const endpoint = tab === 0 ? 'edit-question' : 'update-answer';
            await axios.patch(`http://localhost:5000/${endpoint}/${editData.id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setOpenModal(false);
            fetchData();
        } catch (error) {
            console.error("Error saving changes:", error);
        }
    };

    const handleDelete = async (id, type) => {
        if (window.confirm("Apakah kamu yakin ingin menghapus?")) {
            const endpoint = type === 'question' ? 'delete-question' : 'delete-answer';
            await axios.delete(`http://localhost:5000/${endpoint}/${id}`);
            fetchData();
        }
    };

    const getdataUser = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5000/me', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setdataUser(response.data);
            setEditProfile({
                name: response.data.name || '',
                username: response.data.username || '',
                password: '',
                confPassword: '',
                mail: response.data.email || '',
                phone: response.data.tlp || '',
                file: null,
                previewUrl: response.data.url || ''
            });
        } catch (err) {
            if (err.response?.status === 401) {
                alert("Sesi login kamu sudah habis. Silakan login ulang.");
                window.location.href = "/login";
            }
            console.error("Gagal ambil data user:", err);
        }
    };

    const handleTabChange = (event, newValue) => {
        setTab(newValue);
    };

    const handleEditProfileChange = (e) => {
        const { name, value, files } = e.target;
        if (files) {
            setEditProfile(prev => ({
                ...prev,
                file: files[0],
                previewUrl: URL.createObjectURL(files[0])
            }));
        } else {
            setEditProfile(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSaveProfile = async () => {
        const formData = new FormData();
        formData.append('name', editProfile.name);
        formData.append('username', editProfile.username);
        if (editProfile.password) {
            formData.append('password', editProfile.password);
            formData.append('confPassword', editProfile.confPassword);
        }
        formData.append('email', editProfile.mail);
        formData.append('tlp', editProfile.phone);
        if (editProfile.file !== 0) {
            formData.append('file', editProfile.file);
        } else {
            formData.append(editProfile.file)
        }

        try {
            await axios.patch('http://localhost:5000/edit-profile', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            alert('Profil berhasil diperbarui');
            setEditProfile(prev => ({
                ...prev,
                password: '',
                confPassword: '',
                file: null
            }));
            getdataUser();
        } catch (err) {
            alert(err.response?.data?.msg || 'Gagal memperbarui profil');
            console.error(err);
        }
    };
    const borderColors = ['#FF6B6B', '#A66DD4', '#F9A826', '#6BCB77', '#4D96FF'];

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: { xs: '90%', sm: '80%', md: 400 },
        maxWidth: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        bgcolor: 'background.paper',
        borderRadius: '8px',
        boxShadow: 24,
        p: 3,
    };
    return (
        <Layout>
            <Box sx={{
                minHeight: '80vh',
                mb: '5rem'
            }}>
                <Box sx={{
                    minHeight: { xs: '25vh', md: '30vh' },
                    backgroundImage: `
                    linear-gradient(to bottom, #0C0950 0%, #2A5298 100%),
                    url("/template2.png")
                    `,
                    width: 'cover',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                    backgroundSize: 'cover',
                    backgroundBlendMode: 'overlay'
                }}>
                    <Navbar />
                    <Container maxWidth="lg">
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'left',
                            alignContent: 'center',
                        }}>
                            <Avatar
                                src={editProfile.previewUrl}
                                alt={editProfile.name}
                                sx={{ width: { xs: 130, md: 200 }, height: { xs: 130, md: 200 }, top: { xs: 155, md: 200 }, backgroundBlendMode: 'overlay' }}>
                                {!editProfile.previewUrl && (editProfile.username || 'A')[0]?.toUpperCase()}
                            </Avatar>
                        </Box>
                    </Container>
                </Box>
                <Container maxWidth="lg">
                    <Box sx={{
                        display: { xs: 'grid', md: 'flex' },
                        justifyContent: 'space-between',
                        mt: '5rem'
                    }}>
                        <Typography variant="h4" color="initial" sx={{
                            mt: { xs: '0rem', md: '1.8rem' },
                            mb: { xs: '1rem', md: 0 }
                        }}>
                            {dataUser.name}
                            <Typography variant="h6" color="initial">
                                {dataUser.username}
                            </Typography>
                        </Typography>
                        <Card sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            padding: '.6rem',
                            background: 'linear-gradient(to bottom, #0C0950 0%, #2A5298 100%)',
                            borderRadius: '8px',
                            height: '55px'
                        }}>
                            <Avatar
                                src={editProfile.previewUrl}
                                alt={editProfile.name}
                                sx={{ width: 50, height: 50, display: { xs: 'none', md: 'grid' } }}>
                                {!editProfile.previewUrl && (editProfile.username || 'A')[0]?.toUpperCase()}
                            </Avatar>
                            <TextField
                                placeholder='Apa yang ingin anda tanyakan?'
                                slotProps={{
                                    input: {
                                        readOnly: true,
                                    },
                                }}
                                onClick={handleOpen}
                                sx={{
                                    width: '600px',
                                    ml: { xs: 0, md: '2rem' },
                                    background: '#fff',
                                    color: '#fff',
                                    borderRadius: '8px'
                                }}
                            />
                        </Card>
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
                    <Box sx={{ flex: 1, mt: { xs: 0, md: '3rem' } }}>
                        <Tabs value={tab} onChange={handleTabChange}>
                            <Tab label="Pertanyaan" />
                            <Tab label="Jawaban" />
                            <Tab label="Edit Profil" />
                        </Tabs>
                        {tab === 0 && (
                            <Box sx={{ mt: 2 }}>
                                {questions.filter(q => q.userId === user.id).map((item, index) => (
                                    <Card
                                        key={item.id}
                                        sx={{
                                            mb: 2,
                                            borderLeft: `6px solid ${borderColors[index % borderColors.length]}`,
                                            backgroundColor: '#f5f5f5',
                                            borderRadius: 2
                                        }}
                                    >
                                        <CardContent>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <Typography
                                                    variant={isMobile ? 'subtitle1' : 'h6'}
                                                    sx={{ fontFamily: 'Cal Sans', fontWeight: 'bold' }}
                                                >
                                                    {item.title}
                                                </Typography>
                                                <Box>
                                                    <IconButton
                                                        size={isMobile ? 'small' : 'medium'}
                                                        onClick={() => handleDelete(item.id, 'question')}
                                                    >
                                                        <DeleteIcon sx={{ color: 'red' }} />
                                                    </IconButton>
                                                    <IconButton
                                                        size={isMobile ? 'small' : 'medium'}
                                                        onClick={() => openEditModal(item)}
                                                    >
                                                        <EditIcon sx={{ color: 'blue' }} />
                                                    </IconButton>
                                                </Box>
                                            </Box>
                                            <Typography sx={{ fontFamily: 'PT Sans', fontSize: isMobile ? 14 : 16 }}>
                                                {item.question}
                                            </Typography>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                                                <Typography variant="caption" sx={{ color: 'gray', fontSize: isMobile ? 12 : 14 }}>
                                                    {new Date(item.createdAt).toLocaleDateString()}
                                                </Typography>
                                                <Typography variant="caption" sx={{ color: 'gray', fontSize: isMobile ? 12 : 14 }}>
                                                    Terjawab: {answerCounts[item.id] || 0}
                                                </Typography>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                ))}
                            </Box>
                        )}
                        {tab === 1 && (
                            <Box sx={{ mt: 2 }}>
                                {answers.filter(a => a.userId === user.id).map((item, index) => (
                                    <Card
                                        key={item.id}
                                        sx={{
                                            mb: 2,
                                            borderLeft: `6px solid ${borderColors[index % borderColors.length]}`,
                                            backgroundColor: '#f5f5f5',
                                            borderRadius: 2
                                        }}
                                    >
                                        <CardContent>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <Typography
                                                    variant={isMobile ? 'subtitle1' : 'h6'}
                                                    sx={{ fontFamily: 'Cal Sans', fontWeight: 'bold' }}
                                                >
                                                    {item.question?.title || 'Pertanyaan'}
                                                </Typography>
                                                <Box>
                                                    <IconButton
                                                        size={isMobile ? 'small' : 'medium'}
                                                        onClick={() => handleDelete(item.id, 'answer')}
                                                    >
                                                        <DeleteIcon sx={{ color: 'red' }} />
                                                    </IconButton>
                                                    <IconButton
                                                        size={isMobile ? 'small' : 'medium'}
                                                        onClick={() => openEditModal(item)}
                                                    >
                                                        <EditIcon sx={{ color: 'blue' }} />
                                                    </IconButton>
                                                </Box>
                                            </Box>
                                            <Typography sx={{ fontFamily: 'PT Sans', fontSize: isMobile ? 14 : 16 }}>
                                                {item.answer}
                                            </Typography>
                                            <Typography
                                                variant="caption"
                                                sx={{
                                                    color: 'gray',
                                                    mt: 1,
                                                    display: 'block',
                                                    fontSize: isMobile ? 12 : 14
                                                }}
                                            >
                                                {new Date(item.createdAt).toLocaleDateString()}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                ))}
                            </Box>
                        )}
                        {tab === 2 && (
                            <Box sx={{ mt: 3, maxWidth: 600 }}>
                                <TextField name="name" label="Nama" fullWidth sx={{ mb: 2 }} value={editProfile.name} onChange={handleEditProfileChange} />
                                <TextField name="username" label="Username" fullWidth sx={{ mb: 2 }} value={editProfile.username} onChange={handleEditProfileChange} />
                                <TextField
                                    name="password"
                                    label="Password Baru (kosongkan jika tidak ingin mengubah)"
                                    type="password"
                                    fullWidth
                                    sx={{ mb: 2 }}
                                    value={editProfile.password}
                                    onChange={handleEditProfileChange}
                                />
                                <TextField
                                    name="confPassword"
                                    label="Konfirmasi Password Baru"
                                    type="password"
                                    fullWidth
                                    sx={{ mb: 2 }}
                                    value={editProfile.confPassword}
                                    onChange={handleEditProfileChange}
                                />
                                <TextField name="mail" label="Email" fullWidth sx={{ mb: 2 }} value={editProfile.mail} onChange={handleEditProfileChange} />
                                <TextField name="phone" label="No. HP" fullWidth sx={{ mb: 2 }} value={editProfile.phone} onChange={handleEditProfileChange} />
                                <Box sx={{ mb: 2 }}>
                                    <Button variant="contained" component="label">
                                        Upload Foto (Opsional)
                                        <input type="file" hidden name="file" onChange={handleEditProfileChange} accept="image/*" />
                                    </Button>
                                </Box>
                                <Button
                                    variant="contained"
                                    onClick={handleSaveProfile}
                                    sx={{ bgcolor: '#2A5298', '&:hover': { bgcolor: '#1A3E7A' } }}
                                >
                                    Simpan Perubahan
                                </Button>
                            </Box>
                        )}
                        <Modal open={openModal} onClose={() => setOpenModal(false)}>
                            <Box sx={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                width: isMobile ? '90%' : 400,
                                bgcolor: 'background.paper',
                                boxShadow: 24,
                                p: isMobile ? 2 : 4,
                                borderRadius: 2
                            }}>
                                <Typography variant="h6" sx={{ mb: 2, fontFamily: 'Cal Sans' }}>
                                    Edit {tab === 0 ? 'Pertanyaan' : 'Jawaban'}
                                </Typography>

                                {tab === 0 && (
                                    <TextField
                                        label="Judul"
                                        fullWidth
                                        sx={{ mb: 2 }}
                                        value={form.title}
                                        onChange={(e) => setForm({ ...form, title: e.target.value })}
                                        size={isMobile ? 'small' : 'medium'}
                                    />
                                )}

                                <TextField
                                    label={tab === 0 ? "Isi Pertanyaan" : "Jawaban"}
                                    fullWidth
                                    multiline
                                    rows={isMobile ? 3 : 4}
                                    value={form.body}
                                    onChange={(e) => setForm({ ...form, body: e.target.value })}
                                    sx={{ mb: 2 }}
                                    size={isMobile ? 'small' : 'medium'}
                                />

                                {form.previewImage && (
                                    <Box sx={{ mb: 2 }}>
                                        <Typography variant="body2" sx={{ mb: 1 }}>Gambar saat ini:</Typography>
                                        <img
                                            src={form.previewImage}
                                            alt="Preview"
                                            style={{
                                                maxWidth: '100%',
                                                maxHeight: isMobile ? '100px' : '150px',
                                                borderRadius: '8px'
                                            }}
                                        />
                                    </Box>
                                )}

                                <Button
                                    variant="contained"
                                    component="label"
                                    sx={{ mb: 2 }}
                                    size={isMobile ? 'small' : 'medium'}
                                >
                                    {form.previewImage ? 'Ganti Gambar' : 'Tambah Gambar'}
                                    <input
                                        type="file"
                                        hidden
                                        onChange={handleImageChange}
                                        accept="image/*"
                                    />
                                </Button>

                                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                                    <Button
                                        variant="contained"
                                        onClick={handleEditSave}
                                        sx={{ backgroundColor: '#00E3A5', color: 'white' }}
                                        size={isMobile ? 'small' : 'medium'}
                                    >
                                        Simpan
                                    </Button>
                                </Box>
                            </Box>
                        </Modal>
                    </Box>
                </Container>
            </Box>
            <Footer />
        </Layout >
    )
}

export default TestProfile