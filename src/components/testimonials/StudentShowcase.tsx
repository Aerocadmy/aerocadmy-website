import Image from "next/image";
import { RatingStars } from "./ReviewRating";
import { reviewAverage, participantReviews } from "./participant-reviews";
import styles from "./Reviews.module.css";

export function StudentShowcase() {
  return <section id="reviews" aria-labelledby="reviews-heading" className={styles.section}>
    <div className={styles.container}>
      <header className={styles.heading}>
        <div><span className={styles.sourceTag}>Internship learner feedback</span><h2 id="reviews-heading">The learner perspective.</h2></div>
        <p>Feedback from learners who built their foundations through Aerocadmy&apos;s live drone technology internship.</p>
      </header>
      <div className={styles.summary}>
        <div className={styles.score}>
          <div><strong>{reviewAverage.toFixed(1)}</strong><span>/ 5</span></div>
          <RatingStars rating={reviewAverage} /><p>From {participantReviews.length} featured internship reviews</p>
        </div>
        <div className={styles.distribution} aria-label="Featured internship rating distribution">
          {[5, 4, 3, 2, 1].map(rating => {
            const count = participantReviews.filter(review => review.rating === rating).length;
            const percentage = Math.round(count / participantReviews.length * 100);
            return <div key={rating} className={styles.barRow} aria-label={`${rating} stars: ${count} internship reviews`}>
              <span>{rating}<span aria-hidden="true">★</span></span>
              <div className={styles.barTrack} aria-hidden="true"><span style={{ width: `${percentage}%` }} /></div><span>{percentage}%</span>
            </div>;
          })}
        </div>
      </div>
      <div className={styles.grid}>
        {participantReviews.map((review) => <article key={review.name} className={styles.card}>
          <div className={styles.cardHeader}>
            <Image src={review.avatar} alt={review.name} width={44} height={44} sizes="44px" quality={90} className={styles.avatar} />
            <div className={styles.person}><h3>{review.name}</h3><p>{review.role}</p><p>{review.college}</p></div>
          </div>
          <div className={styles.cardRating}><RatingStars rating={review.rating} /><span>{review.rating}.0</span></div>
          <blockquote>“{review.quote}”</blockquote>
        </article>)}
      </div>
    </div>
  </section>;
}
