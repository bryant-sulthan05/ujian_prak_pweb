import React, { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom';
import { Box, Container, Typography } from '@mui/material'
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

import axios from 'axios'

const QuestionMenu = ({ searchTerm }) => {
    const [questions, setQuestions] = useState([]);
    const [cAnswer, setCanswer] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const filteredQuestions = useMemo(() => {
        if (!searchTerm) return questions.slice(0, 10);

        return questions.filter(question =>
            question.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [questions, searchTerm]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const [answersRes, questionsRes] = await Promise.all([
                    axios.get('http://localhost:5000/count-answer'),
                    axios.get('http://localhost:5000/')
                ]);

                setCanswer(answersRes.data);
                setQuestions(questionsRes.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const Answer = async (questionId) => {
        await axios.get(`http://localhost:5000/question/${questionId}`);
        navigate(`/Answers/${questionId}`);
    }

    const Profile = async (userId) => {
        await axios.get(`http://localhost:5000/profile/${userId}`);
        navigate(`/Profile/${userId}`);
    }

    const colors = ['#FFDB00', '#F9A826', '#6BCB77', '#4D96FF', '#FF6B6B', '#A66DD4'];

    const getRandomColor = () => colors[Math.floor(Math.random() * colors.length)];
    return (
        <Container maxWidth="lg" sx={{ marginTop: '8rem' }}>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    textAlign: 'center',
                    gap: 3,
                }}
            >
                <Typography
                    variant="h4"
                    color="#070F2B"
                    sx={{ fontFamily: 'Cal Sans', fontWeight: 400 }}
                >
                    Pertanyaan Terbaru
                </Typography>
                <Box
                    sx={{
                        width: '150px',
                        height: '4px',
                        backgroundColor: '#FFDB00',
                    }}
                />
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignContent: 'center', mt: 5 }}>
                <Box sx={{ flexGrow: 1 }}>
                    {isLoading ? (
                        <Typography>Memuat pertanyaan...</Typography>
                    ) : filteredQuestions.length === 0 ? (
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignContent: 'center',
                        }}>
                            <Typography variant='h6' sx={{ fontFamily: 'Cal sans', fontWeight: 400 }}>Tidak ada pertanyaan yang cocok</Typography>
                        </Box>
                    ) : (
                        <Grid container spacing={2}>
                            {filteredQuestions.map((questions, index) => {
                                const borderColor = getRandomColor();
                                const answerCount = cAnswer[questions.id] || 0;
                                return (
                                    <Grid size={{ xs: 12, md: 6 }}>
                                        <Card key={index} sx={{
                                            borderLeft: `4px solid ${borderColor}`,
                                            borderRadius: '10px',
                                            mb: 2
                                        }}>
                                            <CardContent>
                                                <Typography variant="h5" sx={{ fontFamily: 'Cal Sans', fontWeight: 400 }}>
                                                    {questions.title}
                                                </Typography>
                                                <Typography variant="subtitle2" sx={{ fontFamily: 'Cal Sans', fontWeight: 400, cursor: 'pointer' }} onClick={() => Profile(questions.user.id)}>
                                                    Pertanyaan oleh <span style={{ color: borderColor }}>{questions.user.username}</span>
                                                </Typography>
                                                <Typography variant="h6" color="text.secondary" sx={{ fontFamily: 'PT Sans', fontWeight: 400 }}>
                                                    {questions.question?.split(' ').slice(0, 5).join(' ') + (questions.question?.split(' ').length > 5 ? '...' : '')}
                                                </Typography>
                                                <Box sx={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                }}>
                                                    <Typography variant='body2' sx={{
                                                        color: '#070F2B',
                                                        fontFamily: 'PT Sans',
                                                        fontWeight: 700,
                                                        marginTop: '1rem',
                                                        cursor: 'pointer'
                                                    }}
                                                        onClick={() => Answer(questions.id)}
                                                    >
                                                        Lihat Jawaban
                                                    </Typography>
                                                    <Typography variant='body2' sx={{
                                                        color: '#070F2B',
                                                        fontFamily: 'PT Sans',
                                                        fontWeight: 700,
                                                        marginTop: '1rem',
                                                        width: 'cover',
                                                        padding: '5px',
                                                        borderRadius: '100%',
                                                        background: '#FFDB00'
                                                    }}>
                                                        {answerCount}
                                                    </Typography>
                                                </Box>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                );
                            })}
                        </Grid>
                    )}
                </Box>
            </Box>
        </Container>
    )
}

export default QuestionMenu