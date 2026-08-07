import React, { useState, useCallback } from 'react';
import { reviewService } from '../api/reviewService';
import ReviewForm from './ReviewForm';
import ReviewList from './ReviewList';
import { AiFillStar } from 'react-icons/ai';

const ReviewSection = ({ productId }) => {
  const [reviews, setReviews] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchReviews = useCallback(async () => {
    try {
      setLoading(true);
      const [reviewsData, summaryData] = await Promise.all([
        reviewService.getProductReviews(productId),
        reviewService.getReviewSummary(productId),
      ]);
      setReviews(reviewsData);
      setSummary(summaryData);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  }, [productId]);

  React.useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleReviewAdded = () => {
    fetchReviews();
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-semibold mb-6">Customer Reviews</h2>

      {/* Review Summary */}
      {summary && (
        <div className="flex items-center mb-6 bg-gray-50 p-4 rounded-lg">
          <div className="text-center mr-8">
            <div className="text-3xl font-bold text-gray-900">
              {summary.averageRating?.toFixed(1) || '0.0'}
            </div>
            <div className="flex items-center justify-center mt-1">
              {[...Array(5)].map((_, index) => (
                <AiFillStar
                  key={index}
                  className={`w-5 h-5 ${
                    index < Math.round(summary.averageRating || 0)
                      ? 'text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <div className="text-sm text-gray-500 mt-1">
              {summary.totalReviews} {summary.totalReviews === 1 ? 'review' : 'reviews'}
            </div>
          </div>

          {/* Rating Distribution */}
          <div className="flex-grow">
            {[5, 4, 3, 2, 1].map((star) => (
              <div key={star} className="flex items-center mb-1">
                <div className="text-sm text-gray-600 w-12">{star} stars</div>
                <div className="flex-grow mx-2">
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-yellow-400"
                      style={{
                        width: `${
                          ((summary.ratingDistribution?.[star] || 0) /
                            (summary.totalReviews || 1)) *
                          100
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>
                <div className="text-sm text-gray-500 w-12">
                  {summary.ratingDistribution?.[star] || 0}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Review Form */}
      <ReviewForm productId={productId} onReviewAdded={handleReviewAdded} />

      {/* Review List */}
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Reviews</h3>
        <ReviewList reviews={reviews} />
      </div>
    </div>
  );
};

export default ReviewSection;