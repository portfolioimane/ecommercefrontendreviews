import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setProducts } from '../redux/productSlice';
import { addToWishlist, removeFromWishlist, setWishlist } from '../redux/wishlistSlice';
import { Container, Row, Col, Card, Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import Slider from 'react-slick';
import { FaEye, FaShippingFast, FaCheckCircle, FaMoneyBillWave, FaHeart } from 'react-icons/fa';
import axios from '../axios'; // Ensure this is correctly configured
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './HomePage.css';

const HomePage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const products = useSelector((state) => state.products.items);
    const wishlistItems = useSelector((state) => state.wishlist.items);
    const token = useSelector((state) => state.auth.token); // Get the token from the Redux store
    const [reviews, setReviews] = useState([]); // State to store reviews

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
    };

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('/api/products');
                dispatch(setProducts(response.data));
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        const fetchWishlistItems = async () => {
            try {
                const response = await axios.get('/api/wishlist');
                dispatch(setWishlist(response.data));
            } catch (error) {
                console.error('Error fetching wishlist items:', error);
            }
        };

        const fetchReviews = async () => {
            try {
                const response = await axios.get('/api/reviews/featured'); // Adjust the endpoint as necessary
                setReviews(response.data); // Store reviews in state
            } catch (error) {
                console.error('Error fetching reviews:', error);
            }
        };

        fetchProducts();
        fetchWishlistItems();
        fetchReviews(); // Fetch reviews on component mount
    }, [dispatch]);

    const isInWishlist = (productId) => {
        return wishlistItems.some((item) => item.product_id === productId);
    };

    const handleToggleWishlist = async (product) => {
        try {
            if (isInWishlist(product.id)) {
                await axios.delete(`/api/wishlist/remove/${product.id}`);
                dispatch(removeFromWishlist(product.id));
            } else {
                await axios.post(`/api/wishlist/add/${product.id}`);
                const newItem = { product_id: product.id, ...product };
                dispatch(addToWishlist(newItem));
            }
        } catch (error) {
            console.error('Error updating wishlist:', error);
        }
    };

    return (
        <Container className="my-5">
            <Row>
                <Col>
                    <h1 className="text-center mb-4" style={{ color: '#DAA520', fontFamily: 'Arial, sans-serif', fontWeight: 'bold' }}>Welcome to E-Shop!</h1>
                    <p className="text-center mb-5" style={{ color: '#212529', fontSize: '1.2em' }}>Discover amazing products at great prices.</p>
                </Col>
            </Row>

            <Row>
                <Col>
                    <Slider {...settings} className="mb-4">
                        <div>
                            <img src="/path/to/your/image1.jpg" alt="Sale 1" className="img-fluid rounded" />
                        </div>
                        <div>
                            <img src="/path/to/your/image2.jpg" alt="Sale 2" className="img-fluid rounded" />
                        </div>
                        <div>
                            <img src="/path/to/your/image3.jpg" alt="Sale 3" className="img-fluid rounded" />
                        </div>
                    </Slider>
                </Col>
            </Row>

            <Row className="text-center services mb-5 mt-4">
                <Col md={4}>
                    <div className="icon-container">
                        <FaCheckCircle className="icon" />
                        <h4 style={{ color: '#DAA520', fontWeight: 'bold' }}>Quality Products</h4>
                        <p>Your satisfaction is our priority.</p>
                    </div>
                </Col>
                <Col md={4}>
                    <div className="icon-container">
                        <FaShippingFast className="icon" />
                        <h4 style={{ color: '#DAA520', fontWeight: 'bold' }}>Free Shipping</h4>
                        <p>On all orders over $50.</p>
                    </div>
                </Col>
                <Col md={4}>
                    <div className="icon-container">
                        <FaMoneyBillWave className="icon" />
                        <h4 style={{ color: '#DAA520', fontWeight: 'bold' }}>Cash on Delivery</h4>
                        <p>Pay when you receive your order.</p>
                    </div>
                </Col>
            </Row>

            <Row>
                <Col>
                    <h2 className="text-center mb-4" style={{ color: '#212529', fontFamily: 'Arial, sans-serif', fontWeight: 'bold' }}>Featured Products</h2>
                </Col>
            </Row>
            <Row>
                {products.map((product) => (
                    <Col md={4} key={product.id} className="mb-4">
                        <Card className="product-card shadow-sm border-light position-relative">
                            <Card.Img
                                variant="top"
                                alt={product.name}
                                src={product.image ? `${process.env.REACT_APP_API_URL}/storage/${product.image}` : ''}
                                style={{ width: '100%', height: '250px', objectFit: 'cover' }}
                            />
                            {/* Conditionally render the wishlist button based on authentication */}
                            {token && (
                                <OverlayTrigger
                                    placement="top"
                                    overlay={
                                        <Tooltip id={`tooltip-${product.id}`}>
                                            {isInWishlist(product.id) ? 'Remove from Wishlist' : 'Add to Wishlist'}
                                        </Tooltip>
                                    }
                                >
                                    <Button
                                        variant="light"
                                        className="position-absolute top-0 end-0 mt-2 me-2 wishlist-button"
                                        onClick={() => handleToggleWishlist(product)}
                                    >
                                        <FaHeart color={isInWishlist(product.id) ? 'red' : 'black'} />
                                    </Button>
                                </OverlayTrigger>
                            )}
                            <Card.Body>
                                <Card.Title className="text-center" style={{ color: '#DAA520', fontWeight: 'bold' }}>{product.name}</Card.Title>
                                <Card.Text className="text-center">{product.description}</Card.Text>
                                <div className="d-flex justify-content-center">
                                    <Button 
                                        className="golden-button" 
                                        onClick={() => navigate(`/product/${product.id}`)}
                                    >
                                        View Product
                                    </Button>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>

            {/* Reviews Section */}
            <Row className="mt-5">
                <Col>
                    <h2 className="text-center mb-4" style={{ color: '#212529', fontFamily: 'Arial, sans-serif', fontWeight: 'bold' }}>Customer Reviews</h2>
                </Col>
            </Row>
            <Row>
                {reviews.map((review) => (
                    <Col md={4} key={review.id} className="mb-4">
                        <Card className="review-card shadow-sm border-light">
                            <Card.Body>
                                <Card.Title style={{ color: '#DAA520', fontWeight: 'bold' }}>{review.customer_name}</Card.Title>
                                <Card.Text>{review.content}</Card.Text>
                                <div className="text-center">
                                    <span style={{ color: '#DAA520' }}>{'★'.repeat(review.rating)}</span>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default HomePage;
