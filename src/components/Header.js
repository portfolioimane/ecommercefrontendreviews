import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav, Modal, Button } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/authSlice';
import { FaShoppingCart, FaHeart } from 'react-icons/fa'; // Import FaHeart for the wishlist icon
import CartPage from '../pages/CartPage';
import axios from '../axios';
import { getCartSuccess } from '../redux/cartSlice';
import './Header.css';

const Header = () => {
  const token = useSelector((state) => state.auth.token);
  const cartItems = useSelector((state) => state.cart.items || []);
  const guestItems = useSelector((state) => state.cart.guestItems || []);
  const wishlistItems = useSelector((state) => state.wishlist.items || []); // Assuming there's a wishlist state
  const dispatch = useDispatch();

  const [showCartModal, setShowCartModal] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [guestCartCount, setGuestCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);

  // Fetch cart items only if the user is logged in
  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await axios.get('/api/cart'); // Fetch cart items
        const items = response.data.items || [];
        dispatch(getCartSuccess(items)); // Dispatch action with fetched items
      } catch (error) {
        console.error('Error fetching cart items:', error);
      }
    };

    if (token) {
      fetchCartItems();
    }
  }, [dispatch, token]);

  // Update cart count and guest cart count whenever cartItems or guestItems change
  useEffect(() => {
    const totalLoggedInCount = cartItems.reduce((total, item) => total + item.quantity, 0);
    setCartCount(totalLoggedInCount);
    
    const totalGuestCount = guestItems.reduce((total, item) => total + item.quantity, 0);
    setGuestCartCount(totalGuestCount);
  }, [cartItems, guestItems]);

  // Update wishlist count whenever wishlistItems change
  useEffect(() => {
    setWishlistCount(wishlistItems.length); // Set wishlist count
  }, [wishlistItems]);

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleCartClick = () => {
    setShowCartModal(true);
  };

  const handleClose = () => {
    setShowCartModal(false);
  };

  const displayCartCount = token ? cartCount : guestCartCount;

  return (
    <>
      <Navbar bg="light" variant="light" expand="lg" className="shadow">
        <Navbar.Brand as={Link} to="/">E-Shop</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
          <Nav>
            <Nav.Link as={Link} to="/shop">Shop</Nav.Link>
            <Nav.Link as={Link} to="/contact">Contact Us</Nav.Link>
            {token && <Nav.Link as={Link} to="/orders">Orders</Nav.Link>}
            
            {/* Wishlist Icon */}
            <Nav.Link as={Link} to="/wishlist" className="d-flex align-items-center">
              <FaHeart className="red-heart" size={20} />
              {wishlistCount > 0 && <span className="wishlist-count">{wishlistCount}</span>}
            </Nav.Link>

            {/* Cart Icon */}
            <Nav.Link onClick={handleCartClick} className="d-flex align-items-center">
              <FaShoppingCart size={20} />
              {displayCartCount > 0 && <span className="cart-count">{displayCartCount}</span>}
            </Nav.Link>

            {!token ? (
              <>
                <Nav.Link as={Link} to="/login">Login</Nav.Link>
                <Nav.Link as={Link} to="/register">Register</Nav.Link>
              </>
            ) : (
              <Nav.Link as={Link} to="/" onClick={handleLogout}>Logout</Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Navbar>

      {/* Cart Modal */}
      <Modal 
        show={showCartModal} 
        onHide={handleClose} 
        dialogClassName="cart-modal"
        aria-labelledby="cart-modal-title"
      >
        <Modal.Header closeButton>
          <Modal.Title id="cart-modal-title">Your Cart</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div tabIndex={0} style={{ outline: 'none' }}>
            <CartPage /> {/* No props passed */}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Link to="/cart">
            <Button variant="primary" onClick={handleClose}>
              View Full Cart
            </Button>
          </Link>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Header;
