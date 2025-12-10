import React from 'react';
import {
    Box,
    Container,
    Grid,
    Typography,
    Divider,
    IconButton
} from '@mui/material';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import FacebookIcon from '@mui/icons-material/FacebookOutlined';

const Footer = () => {
    return (
        <Box sx={{ backgroundColor: '#F6F6F6', mt: 4, pt: 6, pb: 3 }}>
            <Container maxWidth="lg">
                <Grid container spacing={4}>
                    <Grid item xs={12} md={4}>
                        <Typography variant="h6" sx={{ fontFamily: 'PT Sans', mb: 1 }}>
                            Tentang Intelligentsia Guild
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ fontFamily: 'PT Sans', lineHeight: 1.8 }}>
                            Platform forum tanya jawab untuk berbagi pengetahuan dan membangun komunitas cerdas yang saling mendukung. Diskusi sehat, kontribusi positif, dan semangat belajar jadi prioritas utama kami.
                        </Typography>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Typography variant="h6" sx={{ fontFamily: 'PT Sans', mb: 1 }}>
                            Ikuti Kami
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <IconButton aria-label="Instagram" href="#" target="_blank">
                                <InstagramIcon sx={{ color: '#E1306C' }} />
                            </IconButton>
                            <IconButton aria-label="Twitter" href="#" target="_blank">
                                <TwitterIcon sx={{ color: '#1DA1F2' }} />
                            </IconButton>
                            <IconButton aria-label="Facebook" href="#" target="_blank">
                                <FacebookIcon sx={{ color: '#1877F2' }} />
                            </IconButton>
                        </Box>
                    </Grid>
                </Grid>
                <Divider sx={{ my: 4 }} />
                <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="overline" color="text.secondary" sx={{ fontFamily: 'PT Sans', fontWeight: 400 }}>
                        Bryant
                        &copy; {new Date().getFullYear()} Intelligentsia Guild. All rights reserved.
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
};

export default Footer;
