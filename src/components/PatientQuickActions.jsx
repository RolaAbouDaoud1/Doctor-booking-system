import React, { useState, useEffect, useCallback, useMemo } from 'react';
import ReactDOM from 'react-dom';
import { Sparkles, Trophy, Heart } from 'lucide-react';

const PatientQuickActions = () => {
  const [showWellnessHub, setShowWellnessHub] = useState(false);
  const [activeAction, setActiveAction] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [completedToday, setCompletedToday] = useState([]);
  const [showMotivation, setShowMotivation] = useState(null);
  const [currentPhase, setCurrentPhase] = useState(0);

  const wellnessActions = useMemo(() => [
    {
      id: 'hydration',
      icon: '💧',
      title: 'Hydration',
      subtitle: 'Drink water now',
      color: '#06b6d4',
      duration: 30,
      phases: [
        { duration: 10, message: '💧 Fill your glass with water' },
        { duration: 10, message: '🥤 Drink half of the water slowly' },
        { duration: 10, message: '💦 Finish the remaining water' }
      ],
      message: 'Fantastic! Your body is 60% water - you just gave it the fuel it needs!',
      tip: 'Drink a full glass of water. Aim for 8 glasses daily to boost energy and improve focus.'
    },
    {
      id: 'snack',
      icon: '🥗',
      title: 'Healthy Snack',
      subtitle: 'Nutritious fuel',
      color: '#10b981',
      duration: 300,
      phases: [
        { duration: 60, message: '🍎 Choose and prepare your healthy snack' },
        { duration: 120, message: '🍽️ Eat mindfully, savor each bite' },
        { duration: 120, message: '😋 Enjoy the nourishment and energy boost' }
      ],
      message: 'Great choice! You just nourished your body with wholesome nutrition!',
      tip: 'Choose fruits, nuts, veggies, or yogurt. Healthy snacks stabilize blood sugar and energy.'
    },
    {
      id: 'stretch',
      icon: '🤸',
      title: 'Quick Stretch',
      subtitle: 'Flexibility boost',
      color: '#ec4899',
      duration: 90,
      phases: [
        { duration: 30, message: '🦵 Stretch your legs and feet' },
        { duration: 30, message: '💪 Stretch your arms and shoulders' },
        { duration: 30, message: '🧘 Stretch your neck and back' }
      ],
      message: 'Brilliant! You just released muscle tension and improved flexibility!',
      tip: 'Stretch your neck, shoulders, and back. Hold each stretch for 10 seconds to reduce stiffness.'
    },
    {
      id: 'breathe',
      icon: '🌬️',
      title: '4-4-4 Breathing',
      subtitle: 'Box breathing',
      color: '#8b5cf6',
      duration: 64,
      phases: [
        { duration: 4, message: '👃 Breathe IN (4 seconds)' },
        { duration: 4, message: '🫁 HOLD your breath (4 seconds)' },
        { duration: 4, message: '💨 Breathe OUT slowly (4 seconds)' },
        { duration: 4, message: '⏸️ HOLD empty (4 seconds)' }
      ],
      message: 'Perfect! This breathing pattern calms your nervous system instantly!',
      tip: 'Inhale for 4 seconds, hold for 4 seconds, exhale for 4 seconds, hold for 4 seconds. Repeat 4 times for calm.'
    },
    {
      id: 'walk',
      icon: '🚶',
      title: 'Have a Walk',
      subtitle: 'Active break',
      color: '#14b8a6',
      duration: 120,
      phases: [
        { duration: 30, message: '🚶 Start walking at a comfortable pace' },
        { duration: 60, message: '👟 Keep moving, feel your body' },
        { duration: 30, message: '🏃 Final stretch, you got this!' }
      ],
      message: 'Outstanding! You just boosted your mood and cardiovascular health!',
      tip: 'Walk for 2 minutes around your space. Movement increases blood flow and clarity.'
    },
    {
      id: 'sunlight',
      icon: '☀️',
      title: 'Sunlight Exposure',
      subtitle: 'Natural Vitamin D',
      color: '#f59e0b',
      duration: 180,
      phases: [
        { duration: 60, message: '☀️ Find a sunny spot or window' },
        { duration: 60, message: '😌 Relax and soak in the warmth' },
        { duration: 60, message: '🌞 Feel the Vitamin D boost!' }
      ],
      message: 'Excellent! You are absorbing natural Vitamin D from sunlight!',
      tip: 'Sit near a window or step outside for 3 minutes. Sunlight boosts mood, immunity, and bone health.'
    }
  ], []);

  const motivationalQuotes = useMemo(() => [
    "You're doing amazing! Every small step counts! 🌟",
    "Your health is your wealth - keep investing! 💪",
    "Consistency beats perfection! You're building great habits! 🎯",
    "Your body is thanking you right now! Keep it up! ❤️",
    "Progress over perfection - you're on the right track! 🚀"
  ], []);

  const milestoneMessages = useMemo(() => ({
    3: { message: "3 activities! You're on fire! 🔥", icon: "🔥" },
    6: { message: "Full completion! You're a wellness champion! 🏆", icon: "🏆" }
  }), []);

  useEffect(() => {
    const today = new Date().toDateString();
    const saved = JSON.parse(localStorage.getItem('wellnessData') || '{}');
    
    if (saved.lastDate === today) {
      setCompletedToday(saved.completed || []);
    } else {
      setCompletedToday([]);
    }
  }, []);

  const handleComplete = useCallback(() => {
    if (!activeAction) return;

    const today = new Date().toDateString();
    const updated = [...completedToday, activeAction.id];
    setCompletedToday(updated);

    localStorage.setItem('wellnessData', JSON.stringify({
      completed: updated,
      lastDate: today
    }));

    const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
    const milestone = milestoneMessages[updated.length];

    setShowMotivation({
      type: 'complete',
      message: activeAction.message,
      quote: milestone ? milestone.message : randomQuote,
      icon: milestone ? milestone.icon : '✨',
      action: activeAction
    });

    setActiveAction(null);
    setTimeRemaining(0);
    setCurrentPhase(0);

    setTimeout(() => setShowMotivation(null), 4000);
  }, [activeAction, completedToday, motivationalQuotes, milestoneMessages]);

  useEffect(() => {
    let timer;
    if (timeRemaining > 0 && activeAction) {
      timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            // Move to next phase or complete
            if (currentPhase < activeAction.phases.length - 1) {
              setCurrentPhase(prevPhase => prevPhase + 1);
              return activeAction.phases[currentPhase + 1].duration;
            } else {
              handleComplete();
              return 0;
            }
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [timeRemaining, activeAction, currentPhase, handleComplete]);

  const startAction = (action) => {
    if (completedToday.includes(action.id)) return;
    setActiveAction(action);
    setCurrentPhase(0);
    setTimeRemaining(action.phases[0].duration);
  };

  const cancelAction = () => {
    setActiveAction(null);
    setTimeRemaining(0);
    setCurrentPhase(0);
  };

  const getCurrentPhaseMessage = () => {
    if (!activeAction || !activeAction.phases || !activeAction.phases[currentPhase]) return '';
    return activeAction.phases[currentPhase].message;
  };

  const getProgressPercentage = () => {
    if (!activeAction) return 0;
    
    const totalDuration = activeAction.duration;
    const elapsedTime = activeAction.phases
      .slice(0, currentPhase)
      .reduce((total, phase) => total + phase.duration, 0) + 
      (activeAction.phases[currentPhase].duration - timeRemaining);
    
    return (elapsedTime / totalDuration) * 100;
  };

  const handleNavigation = (path) => {
    console.log('Navigate to:', path);
    window.location.href = path;
  };

  const WellnessHubModal = () => {
    const completedCount = completedToday.length;
    const progress = (completedCount / 6) * 100;

    return (
      <div className="wellness-overlay" onClick={() => !activeAction && setShowWellnessHub(false)}>
        <div className="wellness-modal" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <button 
              className="close-btn" 
              onClick={() => setShowWellnessHub(false)}
              disabled={activeAction !== null}
              style={{ opacity: activeAction ? 0.3 : 1, cursor: activeAction ? 'not-allowed' : 'pointer' }}
            >
              ×
            </button>
            <h3 className="modal-title">
              <Sparkles size={24} /> Wellness Micro-Breaks
            </h3>
            <p className="modal-subtitle">Quick health boosters that make a difference</p>
          </div>

          <div className="wellness-modal-content">
            {showMotivation && !activeAction && (
              <div className="motivation-popup" style={{ borderColor: showMotivation.action.color }}>
                <div className="motivation-icon" style={{ background: `${showMotivation.action.color}15` }}>
                  {showMotivation.icon}
                </div>
                <div className="motivation-content">
                  <p className="motivation-message">{showMotivation.message}</p>
                  <p className="motivation-quote">{showMotivation.quote}</p>
                  <p className="motivation-tip"><strong>How to do it:</strong> {showMotivation.action.tip}</p>
                </div>
              </div>
            )}

            {completedCount > 0 && !activeAction && (
              <div className="progress-card">
                <div className="progress-header">
                  <span className="progress-label">Today's Progress</span>
                  <span className="progress-count">{completedCount}/6</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${progress}%` }} />
                </div>
                {completedCount === 6 && (
                  <div className="completion-badge">
                    <Trophy size={16} /> All completed! Amazing work!
                  </div>
                )}
              </div>
            )}

            {activeAction && (
              <>
                <div className="activity-instructions" style={{ 
                  background: `${activeAction.color}10`, 
                  borderLeft: `4px solid ${activeAction.color}`,
                  padding: '1.5rem',
                  borderRadius: '12px',
                  marginBottom: '1.5rem'
                }}>
                  <h4 style={{ color: activeAction.color, marginBottom: '0.5rem', fontSize: '1.1rem' }}>
                    📋 Instructions
                  </h4>
                  <p style={{ color: '#475569', lineHeight: '1.6', margin: 0 }}>
                    {activeAction.tip}
                  </p>
                </div>

                <div className="timer-card" style={{ borderColor: activeAction.color }}>
                  <div className="timer-header">
                    <span className="timer-icon">{activeAction.icon}</span>
                    <div className="timer-info">
                      <h4>{activeAction.title}</h4>
                      <p>Phase {currentPhase + 1} of {activeAction.phases.length}</p>
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="progress-bar" style={{ margin: '1rem 0', height: '6px', background: '#e2e8f0', borderRadius: '3px' }}>
                    <div 
                      className="progress-fill" 
                      style={{ 
                        width: `${getProgressPercentage()}%`, 
                        background: activeAction.color,
                        height: '100%',
                        borderRadius: '3px',
                        transition: 'width 0.3s ease'
                      }} 
                    />
                  </div>

                  <div className="timer-display">
                    <div className="timer-circle" style={{ background: `${activeAction.color}10`, borderColor: activeAction.color }}>
                      <span className="timer-number">{timeRemaining}</span>
                      <span className="timer-label">seconds</span>
                    </div>
                  </div>
                  <p className="timer-message">{getCurrentPhaseMessage()}</p>
                  <button className="cancel-btn" onClick={cancelAction}>Cancel</button>
                </div>
              </>
            )}

            {!activeAction && (
              <div className="actions-grid">
                {wellnessActions.map((action) => {
                  const isCompleted = completedToday.includes(action.id);
                  
                  return (
                    <button
                      key={action.id}
                      onClick={() => startAction(action)}
                      disabled={isCompleted}
                      className={`wellness-action ${isCompleted ? 'completed' : ''}`}
                      style={{ 
                        borderColor: action.color,
                        opacity: isCompleted ? 0.5 : 1 
                      }}
                    >
                      {isCompleted && (
                        <div className="check-badge">✓</div>
                      )}
                      <div className="action-icon">{action.icon}</div>
                      <div className="action-title">{action.title}</div>
                      <div className="action-subtitle">{action.subtitle}</div>
                      <div className="action-duration" style={{ color: action.color }}>
                        {action.duration < 60 ? `${action.duration}s` : `${Math.floor(action.duration / 60)}m`}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="quick-actions-container">
      <div className="quick-actions-card">
        <h3 className="section-title">⚡ Quick Actions</h3>

        <section className="quick-actions">
          <button className="action-btn bg-teal" onClick={() => handleNavigation("/booking-appointment")}>
            📅 Book Appointment
          </button>

          <button className="action-btn bg-light-teal" onClick={() => handleNavigation("/search-doctor")}>
            🔍 Find Doctors
          </button>

          <button 
            className="action-btn wellness-btn" 
            onClick={() => setShowWellnessHub(true)}
          >
            <div className="wellness-btn-content">
              <Heart size={20} />
              <span>Wellness Break</span>
              {completedToday.length > 0 && (
                <span className="wellness-badge">{completedToday.length}/6</span>
              )}
            </div>
          </button>

          <button className="action-btn bg-gray" onClick={() => handleNavigation("/patient-profile")}>
            👤 My Profile
          </button>
        </section>
      </div>

      {showWellnessHub && ReactDOM.createPortal(
        <WellnessHubModal />,
        document.body
      )}
    </div>
  );
};

export default PatientQuickActions;