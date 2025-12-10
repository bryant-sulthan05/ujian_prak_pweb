import React, { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom'
import {
    Container,
    Box,
    Typography,
    Card,
    CardContent,
    Grid,
    Avatar,
    Divider
} from '@mui/material'
import Layout from './Layout/Layout'
import AnswerQuestion from './Components/AnswerQuestion'
import Navbar from './Layout/Navbar'

const Answer = () => {
    const [question, setQuestion] = useState({});
    const { id } = useParams();
    const navigate = useNavigate();

    const getQuestion = useCallback(async () => {
        try {
            const response = await axios.get(`http://localhost:5000/question/${id}`);
            setQuestion(response.data);
        } catch (error) {
            console.error("Error fetching question:", error);
            navigate('/');
        }
    }, [id, navigate]);

    useEffect(() => {
        getQuestion();
    }, [getQuestion]);


    const colors = ['#FFDB00', '#F9A826', '#6BCB77', '#4D96FF', '#FF6B6B', '#A66DD4'];
    const getRandomColor = () => colors[Math.floor(Math.random() * colors.length)];
    const borderColor = getRandomColor();

    return (
        <Layout>
            <Box sx={{
                minHeight: { xs: '20vh', md: '80vh' },
                backgroundImage: `
                linear-gradient(to bottom, #0C0950 0%, #2A5298 100%),
                url("/template2.png")
                `,
                width: '100%',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                backgroundSize: 'contain',
                backgroundBlendMode: 'overlay'
            }}>
                <Navbar />
                <Container maxWidth="lg" sx={{ py: 4, display: 'flex', justifyContent: 'center', alignContent: 'center' }}>
                    <Grid container spacing={4} sx={{ mt: '10rem', mb: '3rem' }}>
                        <Grid item xs={12} md={question.media ? 8 : 12}>
                            <Card sx={{
                                borderLeft: `4px solid ${borderColor}`,
                                borderRadius: '10px',
                                height: '100%',
                                width: { xs: 'fit', md: '700px' }
                            }}>
                                <CardContent>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                        <Avatar sx={{ bgcolor: borderColor, mr: 2 }}>
                                            {question.user?.username?.charAt(0) || '?'}
                                        </Avatar>
                                        <Typography variant="subtitle1" sx={{ fontFamily: 'Cal Sans', fontWeight: 400 }}>
                                            {question.user?.username || 'Anonim'}
                                        </Typography>
                                    </Box>
                                    <Typography
                                        variant="caption"
                                        sx={{
                                            display: 'block',
                                            mb: 1,
                                            color: 'text.secondary'
                                        }}
                                    >
                                        Ditanya pada: {new Date(question.createdAt).toLocaleString()}
                                    </Typography>
                                    <Typography variant="h4" sx={{
                                        fontFamily: 'Cal Sans',
                                        fontWeight: 400,
                                        mb: 2
                                    }}>
                                        {question.title}
                                    </Typography>
                                    <Divider sx={{ my: 2 }} />
                                    <Typography
                                        variant="body1"
                                        sx={{
                                            fontFamily: 'PT Sans',
                                            fontWeight: 400,
                                            whiteSpace: 'pre-line',
                                            mb: 2
                                        }}
                                    >
                                        {question.question}
                                    </Typography>
                                    {question.media && (
                                        <img
                                            src={question.url}
                                            alt="Pertanyaan"
                                            style={{
                                                maxWidth: '100%',
                                                maxHeight: '400px',
                                                borderRadius: '8px'
                                            }}
                                        />
                                    )}
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Container>
            </Box>
            <section>
                <Container maxWidth="lg" sx={{ py: 4 }}>
                    <AnswerQuestion />
                </Container>
            </section>
        </Layout >
    )
}

export default Answer