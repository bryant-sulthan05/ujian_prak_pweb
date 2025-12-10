import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Grid,
    Avatar,
    Divider,
    Button,
    Alert,
    TextField,
    Collapse
} from '@mui/material';

const AnswerQuestion = () => {
    const [question, setQuestion] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [Answer, setAnswer] = useState('');
    const [file, setFile] = useState('');
    const [preview, setPreview] = useState('');
    const [setMsg] = useState('');
    const { id } = useParams();
    const { user } = useSelector(state => state.auth);

    const colors = ['#FFDB00', '#F9A826', '#6BCB77', '#4D96FF', '#FF6B6B', '#A66DD4'];
    const getUserColor = (userId) => {
        const hash = userId ? userId.toString().split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) : 0;
        return colors[hash % colors.length];
    };
    const loadImage = (e) => {
        const media = e.target.files[0];
        setFile(media);
        setPreview(URL.createObjectURL(media));
    };
    useEffect(() => {
        const fetchQuestion = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`http://localhost:5000/question/${id}`);
                setQuestion(response.data);
            } catch (err) {
                console.error("Error fetching question:", err);
                setError(err.response?.data?.message || 'Gagal memuat pertanyaan');
            } finally {
                setLoading(false);
            }
        };

        fetchQuestion();
    }, [id]);

    const AnswerQuest = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`http://localhost:5000/post-answer/${id}`, {
                userId: user.id,
                questionId: question.id,
                answer: Answer,
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

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <Typography>Memuat pertanyaan...</Typography>
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            </Box>
        );
    }

    if (!question) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <Typography>Pertanyaan tidak ditemukan</Typography>
            </Box>
        );
    }

    return (
        <Box>
            {user && user.id !== question.userId ? (
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignContent: 'center'
                }}>
                    <form onSubmit={AnswerQuest} style={{ width: '100%' }}>
                        <Card sx={{ p: 2, mb: 4, backgroundColor: '#fff6f6', borderRadius: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                                <TextField
                                    multiline
                                    fullWidth
                                    rows={preview ? 8 : 4}
                                    label="Tulis Jawaban anda"
                                    value={Answer}
                                    onChange={(e) => setAnswer(e.target.value)}
                                    variant="outlined"
                                    sx={{ flex: 1 }}
                                />
                                <Box>
                                    <input type="file" id="upload-image" onChange={loadImage} style={{ display: 'none' }} />
                                    <label htmlFor="upload-image">
                                        <Box
                                            sx={{
                                                backgroundColor: '#fff6f6',
                                                borderRadius: 2,
                                                p: 1,
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                border: '1px solid #ccc',
                                                cursor: 'pointer',
                                                transition: 'all 0.3s ease-in-out'
                                            }}
                                        >
                                            <CloudUploadIcon />
                                        </Box>
                                    </label>
                                </Box>
                            </Box>
                            <Collapse in={!!preview} timeout={400}>
                                {preview && (
                                    <Box
                                        sx={{
                                            mt: 2,
                                            display: 'flex',
                                            justifyContent: 'left',
                                            alignItems: 'center',
                                            borderRadius: 2,
                                            overflow: 'hidden',
                                        }}
                                    >
                                        <img
                                            src={preview}
                                            alt="Preview"
                                            style={{
                                                width: '100%',
                                                maxWidth: 500,
                                                maxHeight: 300,
                                                borderRadius: 8,
                                                objectFit: 'cover'
                                            }}
                                        />
                                    </Box>
                                )}
                            </Collapse>
                            <Button
                                type="submit"
                                variant="contained"
                                sx={{
                                    mt: 2,
                                    backgroundColor: '#FFDB00',
                                    color: '#070F2B',
                                    '&:hover': {
                                        backgroundColor: '#070F2B',
                                        color: '#FFDB00'
                                    },
                                    fontWeight: 'bold'
                                }}
                            >
                                Kirim Jawaban
                            </Button>
                        </Card>
                    </form>
                </Box>
            ) : (
                ''
            )}
            <Box sx={{
                display: 'flex',
                justifyContent: 'left'
            }}>
                <Typography variant="h5" sx={{
                    fontFamily: 'Cal Sans',
                    fontWeight: 400,
                }}>
                    Jawaban
                </Typography>
            </Box>
            <Grid container spacing={4} sx={{
                display: 'flex',
                justifyContent: 'center',
                alignContent: 'center',
                mb: '3rem',
                maxWidth: '1200px'
            }}>
                <Grid item xs={12} md={question.media ? 8 : 12}>
                    <Box sx={{ mt: 4 }}>
                        {question.answers?.length > 0 ? (
                            question.answers.map((answer, index) => {
                                const userColor = getUserColor(answer.user?.id);
                                return (
                                    <Card
                                        key={index}
                                        sx={{
                                            borderLeft: `4px solid ${userColor}`,
                                            borderRadius: '10px',
                                            height: '100%',
                                            mb: 3
                                        }}
                                    >
                                        <CardContent>
                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                                <Avatar sx={{ bgcolor: userColor, mr: 2 }}>
                                                    {answer.user?.username?.charAt(0) || '?'}
                                                </Avatar>
                                                <Typography variant="subtitle1" sx={{ fontFamily: 'Cal Sans', fontWeight: 400 }}>
                                                    {answer.user?.username || 'Anonim'}
                                                </Typography>
                                            </Box>
                                            <Divider sx={{ mb: 2 }} />
                                            <Typography
                                                variant="body1"
                                                sx={{
                                                    fontFamily: 'PT Sans',
                                                    whiteSpace: 'pre-line',
                                                    mb: 2
                                                }}
                                            >
                                                {answer.answer}
                                            </Typography>
                                            {answer.url && (
                                                <img
                                                    src={answer.url}
                                                    alt="Jawaban"
                                                    style={{
                                                        maxWidth: '100%',
                                                        maxHeight: '500px',
                                                        borderRadius: '8px'
                                                    }}
                                                />
                                            )}
                                            <Typography
                                                variant="caption"
                                                sx={{
                                                    display: 'block',
                                                    mt: 1,
                                                    color: 'text.secondary'
                                                }}
                                            >
                                                Dijawab pada: {new Date(answer.createdAt).toLocaleString()}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                );
                            })
                        ) : (
                            <Box sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignContent: 'center'
                            }}>
                                <Typography variant="h5" color="initial" sx={{ fontWeight: 'bold' }}>Belum ada jawaban. Jadilah yang pertama menjawab!</Typography>
                            </Box>
                        )}
                    </Box>
                </Grid>
            </Grid>
        </Box >
    );
};

export default AnswerQuestion;