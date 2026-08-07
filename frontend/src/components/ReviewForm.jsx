import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { reviewService } from '../api/reviewService';
import { AiFillStar, AiOutlineStar } from 'react-icons/ai';
import { toast } from 'react-hot-toast';

const ReviewForm = ({ productId, onReviewAdded }) => {
  const { user } = useAuth();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to add a review');
      return;
    }
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    try {
      setIsSubmitting(true);
      const reviewData = {
        productId: productId,
        userId: user.id,
        rating: rating,
        comment: comment.trim()
      };

      await reviewService.addReview(reviewData);
      toast.success('Review added successfully!');
      setRating(0);
      setComment('');
      if (onReviewAdded) {
        onReviewAdded();
      }
    } catch (error) {
      toast.error('Failed to add review. Please try again.');
      console.error('Error adding review:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h3 className="text-lg font-semibold mb-4">Write a Review</h3>
      <form onSubmit={handleSubmit}>
        {/* Rating Stars */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rating
          </label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className="text-2xl focus:outline-none transition-colors"
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(star)}
              >
                {star <= (hoverRating || rating) ? (
                  <AiFillStar className="text-yellow-400" />
                ) : (
                  <AiOutlineStar className="text-gray-400" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Comment */}
        <div className="mb-4">
          <label
            htmlFor="comment"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Your Review
          </label>
          <textarea
            id="comment"
            rows="4"
            className="block w-full border rounded-md shadow-sm p-2 text-gray-900 focus:ring-primary focus:border-primary"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your thoughts about the product..."
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting || !user}
          className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary ${
            (isSubmitting || !user) && 'opacity-50 cursor-not-allowed'
          }`}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Review'}
        </button>
        
        {!user && (
          <p className="mt-2 text-sm text-gray-500 text-center">
            Please log in to write a review
          </p>
        )}
      </form>
    </div>
  );
};

export default ReviewForm;