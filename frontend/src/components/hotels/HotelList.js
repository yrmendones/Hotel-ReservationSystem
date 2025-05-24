import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  Rating,
  TextField,
  InputAdornment,
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import axios from 'axios';

const HotelList = () => {
  const [hotels, setHotels] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHotels();
  }, []);

  const fetchHotels = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/hotels');
      setHotels(response.data);
    } catch (error) {
      console.error('Error fetching hotels:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredHotels = hotels.filter(hotel =>
    hotel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    hotel.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <Container>
        <Typography>Loading hotels...</Typography>
      </Container>
    );
  }

  return (
    <Container>
      <Box sx={{ my: 4 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search room availability"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ mb: 4 }}
        />
        <Grid container spacing={3}>
          {filteredHotels.map((hotel) => (
            <Grid item xs={12} sm={6} md={4} key={hotel.id}>
              <Card>
                <CardMedia
                  component="img"
                  height="200"
                  image={hotel.image || 'https://via.placeholder.com/300x200'}
                  alt={hotel.name}
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {hotel.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {hotel.location}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Rating value={hotel.rating} readOnly precision={0.5} />
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                      ({hotel.rating})
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {hotel.description}
                  </Typography>
                  <Typography variant="h6" color="primary" gutterBottom>
                    ${hotel.pricePerNight} per night
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    href={`/hotels/${hotel.id}`}
                  >
                    View Details
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default HotelList; 