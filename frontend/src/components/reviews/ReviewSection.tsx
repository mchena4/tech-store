'use client';

import { useState } from 'react';
import { Star, MessageSquarePlus, AlertCircle } from 'lucide-react';
import { Review } from '@/types/api';
import { useAuthStore } from '@/store/useAuthStore';
import api from '@/lib/axios';

interface ReviewSectionProps {
  productId: number;
}

export default function ReviewSection({ productId }: ReviewSectionProps) {
  const { isAuthenticated, user } = useAuthStore();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) return;
    setSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await api.post<Review>('/add_review/', {
        product_id: productId,
        rating,
        review: reviewText,
      });

      setReviews([res.data, ...reviews]);
      setReviewText('');
      setRating(5);
    } catch (err: any) {
      if (err.response?.data?.error) {
        setErrorMessage(err.response.data.error);
      } else {
        setErrorMessage('Error al publicar la reseña');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-12 pt-8 border-t border-gray-100">
      <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <Star className="w-6 h-6 text-amber-400 fill-current" /> Opiniones y Reseñas
      </h3>

      {/* Add Review Form */}
      {isAuthenticated ? (
        <form onSubmit={handleSubmitReview} className="bg-gray-50 p-6 rounded-2xl mb-8 space-y-4 border border-gray-100">
          <h4 className="font-semibold text-gray-900 flex items-center gap-2">
            <MessageSquarePlus className="w-5 h-5 text-indigo-600" /> Deja tu calificación
          </h4>

          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" /> {errorMessage}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Calificación
            </label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="p-1 hover:scale-110 transition focus:outline-none"
                >
                  <Star
                    className={`w-6 h-6 ${
                      star <= rating ? 'text-amber-400 fill-current' : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Tu opinión
            </label>
            <textarea
              rows={3}
              required
              placeholder="¿Qué te pareció este producto?"
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              className="w-full p-3 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition disabled:opacity-50 text-sm"
          >
            {submitting ? 'Enviando...' : 'Publicar Reseña'}
          </button>
        </form>
      ) : (
        <div className="p-4 bg-indigo-50 rounded-2xl text-indigo-900 text-sm mb-8 text-center">
          Inicia sesión para dejar una reseña sobre este producto.
        </div>
      )}

      {/* Review List */}
      {reviews.length === 0 ? (
        <p className="text-gray-500 text-sm italic">Aún no hay reseñas para este producto.</p>
      ) : (
        <div className="space-y-4">
          {reviews.map((rev) => (
            <div key={rev.id} className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-gray-900 text-sm">
                  {rev.user?.first_name || 'Usuario'}
                </span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`w-4 h-4 ${
                        s <= rev.rating ? 'text-amber-400 fill-current' : 'text-gray-200'
                      }`}
                    />
                  ))}
                </div>
              </div>
              <p className="text-gray-700 text-sm">{rev.review}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
