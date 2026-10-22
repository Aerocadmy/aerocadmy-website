import { Star } from "lucide-react";
import { reviewAverage, participantReviews } from "./participant-reviews";
import styles from "./Reviews.module.css";

export function RatingStars({ rating }: { rating: number }) {
  return <span className={styles.stars} role="img" aria-label={`${rating.toFixed(1)} out of 5 stars`}>
    {Array.from({ length: 5 }, (_, index) => <span key={index} className={styles.star} aria-hidden="true">
      <Star size={15} className={styles.starBase} />
      <span className={styles.starFill} style={{ width: `${Math.max(0, Math.min(1, rating - index)) * 100}%` }}><Star size={15} /></span>
    </span>)}
  </span>;
}

export function ReviewRating({ href = "#reviews" }: { href?: string }) {
  return <a href={href} className={styles.topRating} aria-label={`View ${participantReviews.length} webinar reviews, rated ${reviewAverage.toFixed(1)} out of 5`}>
    <strong>{reviewAverage.toFixed(1)}</strong><RatingStars rating={reviewAverage} /><span>{participantReviews.length} webinar reviews</span>
  </a>;
}
