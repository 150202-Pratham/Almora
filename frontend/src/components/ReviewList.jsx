import React from 'react';
import { AiFillStar } from 'react-icons/ai';
import { format } from 'date-fns';

const ReviewList = ({ reviews }) => {
  if (!reviews || reviews.length === 0) {
    return (
      <div className="text-center py-6 text-gray-500">
        No reviews yet. Be the first to review this product!
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <div key={review.id} className="border-b pb-6 last:border-b-0">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h4 className="font-medium text-gray-900">{review.userName}</h4>
              <div className="flex items-center mt-1">
                {[...Array(5)].map((_, index) => (
                  <AiFillStar
                    key={index}
                    className={`w-4 h-4 ${
                      index < review.rating
                        ? 'text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
            <span className="text-sm text-gray-500">
              {format(new Date(review.createdAt), 'MMM d, yyyy')}
            </span>
          </div>
          <p className="text-gray-700 mt-2">{review.comment}</p>
        </div>
      ))}
    </div>
  );
};

export default ReviewList;