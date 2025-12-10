import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Layout from './Layout/Layout'
import Navbar from './Layout/Navbar'
import {
    Box,
    Container,
    Avatar,
    Typography,
    Card,
    Tabs,
    Tab,
    CardContent
} from '@mui/material'
import Footer from './Layout/Footer';

function UsersProfile() {
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState([]);
    const [dataUser, setdataUser] = useState({});
    const [tab, setTab] = useState(0);
    const { id } = useParams();

    const fetchData = useCallback(async () => {
        try {
            const [questionsRes, answersRes, userRes] = await Promise.all([
                axios.get(`http://localhost:5000/user-questions/${id}`),
                axios.get(`http://localhost:5000/user-answers/${id}`),
                axios.get(`http://localhost:5000/profile/${id}`),
            ]);
            setQuestions(questionsRes.data);
            setAnswers(answersRes.data);
            setdataUser(userRes.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }, [setQuestions, setAnswers, setdataUser, id]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleTabChange = (event, newValue) => {
        setTab(newValue);
    };

    const colors = ['#FF6B6B', '#A66DD4', '#F9A826', '#6BCB77', '#4D96FF'];
    const getRandomColor = () => colors[Math.floor(Math.random() * colors.length)];
    return (
        <Layout>
            <Box sx={{
                minHeight: '60vh'
            }}>
                <Box sx={{
                    minHeight: { xs: '25vh', md: '12vh' },
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
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <Avatar
                                src={dataUser.url}
                                alt={dataUser.name}
                                sx={{
                                    width: { xs: 130, md: 150 },
                                    height: { xs: 130, md: 150 },
                                    top: { xs: 155, md: 80 },
                                    mt: { xs: 0, md: 4 },
                                    fontWeight: 'bold',
                                    fontSize: { xs: 50, md: 70 },
                                    color: '#fff',
                                    backgroundColor: getRandomColor(),
                                    backgroundBlendMode: 'overlay'
                                }}
                            >
                                {!dataUser.url && (dataUser.username || 'A')[0]?.toUpperCase()}
                            </Avatar>

                        </Box>
                    </Container>
                </Box>
                <Container maxWidth="lg" sx={{ mt: '10rem' }}>
                    <Typography variant="h4" sx={{ ml: 2, mt: { xs: '-5rem', md: '-3rem' }, fontWeight: 'bold' }}>{dataUser.name}</Typography>
                    <Typography variant="h5" sx={{ ml: 2, }}>{dataUser.username}</Typography>
                    <Tabs sx={{ mt: 5 }} value={tab} onChange={handleTabChange} variant="fullWidth">
                        <Tab label="Questions" />
                        <Tab label="Answers" />
                    </Tabs>
                    {tab === 0 && (
                        <Box sx={{ mt: 2 }}>
                            {questions.map((question, index) => {
                                const borderColor = getRandomColor();
                                return (
                                    <Card key={index} sx={{ mb: 2, borderLeft: `5px solid ${borderColor}`, borderRadius: '8px' }}>
                                        <CardContent>
                                            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{question.title}</Typography>
                                            <Typography variant="body2">{question.question}</Typography>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </Box>
                    )}
                    {tab === 1 && (
                        <Box sx={{ mt: 2 }}>
                            {answers.map((answer, index) => {
                                const borderColor = getRandomColor();
                                return (
                                    <Card key={index} sx={{ mb: 2, borderLeft: `5px solid ${borderColor}`, borderRadius: '8px' }}>
                                        <CardContent>
                                            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{answer.question.title}</Typography>
                                            <Typography variant="body2">{answer.answer}</Typography>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </Box>
                    )}
                </Container>
            </Box>
            <Footer />
        </Layout >
    )
}

export default UsersProfile