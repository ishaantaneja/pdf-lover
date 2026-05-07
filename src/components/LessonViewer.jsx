import { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Home } from 'lucide-react';

export default function LessonViewer({ lesson, onGoHome, onUpdateProgress }) {
  const [currentIndex, setCurrentIndex] = useState(lesson.progressIndex || 0);
  const cards = lesson.cards || [];

  // Update progress in parent component when index changes
  useEffect(() => {
    onUpdateProgress(lesson.id, currentIndex);
  }, [currentIndex, lesson.id, onUpdateProgress]);

  if (cards.length === 0) {
    return (
      <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center' }}>
        <p>No cards generated for this document.</p>
        <button className="btn" onClick={onGoHome} style={{ marginTop: '1rem' }}>
          <Home size={20} /> Go Home
        </button>
      </div>
    );
  }

  const currentCard = cards[currentIndex];
  const progressPercent = ((currentIndex + 1) / cards.length) * 100;

  const goNext = () => {
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const goPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <div className="viewer-container fade-in">
      {/* Top Header / Progress */}
      <div className="glass-panel" style={{ padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button className="btn btn-secondary" onClick={onGoHome} style={{ padding: '0.5rem 1rem' }} title="Go Home">
          <Home size={18} />
        </button>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            <span>{lesson.title || "Lesson"}</span>
            <span>{currentIndex + 1} / {cards.length}</span>
          </div>
          <div className="progress-bar-bg">
            <div className="progress-bar-fill" style={{ width: `${progressPercent}%` }}></div>
          </div>
        </div>
      </div>

      {/* Main Card Content */}
      <div className="glass-panel card fade-in" key={currentIndex}>
        <h2>{currentCard.title}</h2>
        <div style={{ whiteSpace: 'pre-wrap', flex: 1, display: 'flex', alignItems: 'center' }}>
          <p>{currentCard.content}</p>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="glass-panel card-nav" style={{ padding: '1rem', display: 'flex', gap: '1rem' }}>
        <button 
          className="btn btn-secondary" 
          onClick={goPrev} 
          disabled={currentIndex === 0}
          style={{ flex: 1 }}
        >
          <ArrowLeft size={20} /> Previous
        </button>
        <button 
          className="btn" 
          onClick={goNext} 
          disabled={currentIndex === cards.length - 1}
          style={{ flex: 1 }}
        >
          Next <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
}
