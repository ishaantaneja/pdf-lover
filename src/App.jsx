import { useState, useEffect } from 'react';
import { BookOpen, Trash2, Play } from 'lucide-react';
import UploadArea from './components/UploadArea';
import LessonViewer from './components/LessonViewer';
import { extractTextFromPDF } from './lib/pdfParser';
import { chunkTextToCards } from './lib/chunker';

function App() {
  const [lessons, setLessons] = useState([]);
  const [currentLessonId, setCurrentLessonId] = useState(null);

  // Load from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('micro_lessons');
    if (saved) {
      try {
        setLessons(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse lessons from local storage', e);
      }
    }
  }, []);

  // Save to local storage when lessons change
  useEffect(() => {
    localStorage.setItem('micro_lessons', JSON.stringify(lessons));
  }, [lessons]);

  const handleProcessPDF = async (file) => {
    // 1. Extract Text
    const text = await extractTextFromPDF(file);
    
    // 2. Chunk into Cards (Mocking AI heuristic)
    const cards = chunkTextToCards(text);
    
    // 3. Create Lesson Object
    const newLesson = {
      id: `lesson-${Date.now()}`,
      title: file.name.replace('.pdf', ''),
      cards: cards,
      progressIndex: 0,
      createdAt: new Date().toISOString()
    };
    
    // 4. Update State & Navigate
    setLessons(prev => [newLesson, ...prev]);
    setCurrentLessonId(newLesson.id);
  };

  const updateLessonProgress = (lessonId, newIndex) => {
    setLessons(prev => prev.map(l => 
      l.id === lessonId ? { ...l, progressIndex: newIndex } : l
    ));
  };

  const deleteLesson = (e, lessonId) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this lesson?")) {
      setLessons(prev => prev.filter(l => l.id !== lessonId));
      if (currentLessonId === lessonId) {
        setCurrentLessonId(null);
      }
    }
  };

  const currentLesson = lessons.find(l => l.id === currentLessonId);

  return (
    <>
      {!currentLessonId ? (
        <div className="fade-in">
          <header className="app-header">
            <h1>PDF to Microlearning</h1>
            <p>Turn long documents into bite-sized knowledge cards.</p>
          </header>

          <UploadArea onProcessPDF={handleProcessPDF} />

          {lessons.length > 0 && (
            <div style={{ marginTop: '3rem' }}>
              <h2 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <BookOpen size={24} color="var(--primary)" /> 
                Your Lessons
              </h2>
              <div style={{ display: 'grid', gap: '1rem' }}>
                {lessons.map(lesson => {
                  const progress = Math.round(((lesson.progressIndex + 1) / lesson.cards.length) * 100);
                  
                  return (
                    <div 
                      key={lesson.id} 
                      className="glass-panel" 
                      style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', transition: 'all 0.2s ease' }}
                      onClick={() => setCurrentLessonId(lesson.id)}
                    >
                      <div>
                        <h3 style={{ marginBottom: '0.25rem', color: 'var(--text-main)' }}>{lesson.title}</h3>
                        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                          {lesson.cards.length} cards • {progress}% complete
                        </p>
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                         <button className="btn btn-secondary" style={{ padding: '0.5rem', borderRadius: '50%' }} onClick={(e) => deleteLesson(e, lesson.id)} title="Delete Lesson">
                           <Trash2 size={18} color="#ef4444" />
                         </button>
                         <button className="btn" style={{ padding: '0.5rem 1rem' }}>
                           <Play size={18} /> Resume
                         </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      ) : (
        <LessonViewer 
          lesson={currentLesson} 
          onGoHome={() => setCurrentLessonId(null)} 
          onUpdateProgress={updateLessonProgress}
        />
      )}
    </>
  );
}

export default App;
