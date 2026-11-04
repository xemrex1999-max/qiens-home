"use client"

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import StarRating from '../ui/StarRating';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, User } from 'lucide-react';

interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  user: {
    name: string;
  };
}

interface ReviewSectionProps {
  productId: string;
  initialReviews: Review[];
  onReviewAdded?: (newReview: Review) => void;
}

const ReviewSection = ({ productId, initialReviews, onReviewAdded }: ReviewSectionProps) => {
  const { data: session } = useSession();
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) {
      toast.error('Yorum yapmak için giriş yapmalısınız.');
      return;
    }

    if (!comment.trim()) {
      toast.error('Lütfen bir yorum yazın.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/products/${productId}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating, comment }),
      });

      const data = await res.json();

      if (res.ok) {
        setReviews([data, ...reviews]);
        setComment('');
        setRating(5);
        if (onReviewAdded) onReviewAdded(data);
        toast.success('Yorumunuz başarıyla eklendi!');
      } else {
        const errorMsg = data.details ? `${data.error} (${data.details})` : (data.error || 'Yorum eklenirken bir hata oluştu.');
        toast.error(errorMsg);
      }
    } catch (error) {
      console.error('Review submit error:', error);
      toast.error('Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-16">
      {/* REVIEW FORM */}
      <div className="bg-neutral-50 p-8 md:p-12 rounded-sm border border-neutral-100">
        <h3 className="text-xl font-bold tracking-tight mb-8">Değerlendirme Yazın</h3>
        {session ? (
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-4">
              <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Ürünü Puanlayın</span>
              <StarRating 
                rating={rating} 
                interactive 
                size={24} 
                onChange={setRating} 
              />
            </div>
            <div className="space-y-4">
              <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Yorumunuz</span>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Ürün hakkındaki deneyimlerinizi paylaşın..."
                className="w-full bg-white border border-neutral-200 p-6 rounded-sm text-sm focus:outline-none focus:border-accent min-h-[150px] resize-none transition-colors"
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-12 py-5 bg-neutral-900 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-sm hover:bg-accent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'GÖNDERİLİYOR...' : 'YORUMU GÖNDER'}
            </button>
          </form>
        ) : (
          <div className="text-center py-8 space-y-4">
            <p className="text-sm text-neutral-500">Yorum yazabilmek için üye girişi yapmanız gerekmektedir.</p>
            <a 
              href="/auth/login" 
              className="inline-block text-[10px] font-black uppercase tracking-widest text-accent hover:underline"
            >
              GİRİŞ YAP / KAYIT OL
            </a>
          </div>
        )}
      </div>

      {/* REVIEWS LIST */}
      <div className="space-y-12">
        <div className="flex items-center justify-between border-b border-neutral-100 pb-8">
          <h3 className="text-xl font-bold tracking-tight flex items-center gap-3">
            Müşteri Yorumları 
            <span className="text-sm font-light text-neutral-400">({reviews.length})</span>
          </h3>
        </div>

        {reviews.length > 0 ? (
          <div className="divide-y divide-neutral-100">
            <AnimatePresence initial={false}>
              {reviews.map((review) => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="py-12 space-y-4"
                >
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400">
                          <User size={16} />
                        </div>
                        <span className="text-sm font-bold text-neutral-900">{review.user.name}</span>
                      </div>
                      <StarRating rating={review.rating} size={14} />
                    </div>
                    <span className="text-[10px] font-medium text-neutral-400 uppercase tracking-widest">
                      {format(new Date(review.createdAt), 'dd MMMM yyyy', { locale: tr })}
                    </span>
                  </div>
                  <p className="text-sm text-neutral-600 leading-relaxed font-light pl-11">
                    {review.comment}
                  </p>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="text-center py-24 space-y-6">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-neutral-50 rounded-full text-neutral-200">
              <MessageSquare size={32} strokeWidth={1} />
            </div>
            <div className="space-y-2">
              <p className="text-lg font-bold text-neutral-900">Henüz yorum yok</p>
              <p className="text-sm text-neutral-400 max-w-xs mx-auto">Bu ürün hakkında ilk yorumu siz yaparak diğer müşterilerimize yardımcı olabilirsiniz.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewSection;
