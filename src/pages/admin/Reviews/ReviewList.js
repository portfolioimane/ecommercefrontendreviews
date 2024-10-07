import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setReviews, deleteReview } from '../../../redux/admin/reviewSlice'; // Adjust the path as needed
import axios from '../../../axios';
import './ReviewList.css'; // Import the CSS file for styling

const ReviewList = () => {
    const dispatch = useDispatch();
    const reviews = useSelector((state) => state.reviewsadmin.items);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await axios.get('/api/admin/reviews');
                console.log("admin reviews", response.data);
                dispatch(setReviews(response.data));
            } catch (error) {
                console.error('Error fetching reviews:', error);
            }
        };
        fetchReviews();
    }, [dispatch]);

    const handleDelete = async (id) => {
        try {
            await axios.delete(`/api/admin/reviews/${id}`);
            dispatch(deleteReview(id));
        } catch (error) {
            console.error('Error deleting review:', error);
        }
    };

    const handleStatusChange = async (id, newStatus) => {
        try {
            const response = await axios.put(`/api/admin/reviews/${id}`, { status: newStatus });
            dispatch(setReviews(reviews.map(review => (review.id === id ? response.data : review))));
        } catch (error) {
            console.error('Error updating review status:', error);
        }
    };

    return (
        <div className="review-list-container">
            <h1>Review List</h1>
            <table className="review-table">
                <thead>
                    <tr>
                        <th>Review</th>
                        <th>Rating</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {reviews.map((review) => (
                        <tr key={review.id}>
                            <td>{review.review}</td>
                            <td>{review.rating}</td>
                            <td>
                                <select
                                    value={review.status}
                                    onChange={(e) => handleStatusChange(review.id, e.target.value)}
                                    className="status-select"
                                >
                                    <option value="pending">Pending</option>
                                    <option value="approved">Approved</option>
                                    <option value="rejected">Rejected</option>
                                    <option value="featured">Featured</option>
                                </select>
                            </td>
                            <td>
                                <button className="delete-button" onClick={() => handleDelete(review.id)}>
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ReviewList;
