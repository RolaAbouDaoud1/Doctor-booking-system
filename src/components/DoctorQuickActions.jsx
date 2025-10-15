import React, { useState, useEffect, useCallback, useMemo } from 'react';
import ReactDOM from 'react-dom';
import { Sparkles, Trophy, Heart, Stethoscope, Clock, Zap } from 'lucide-react';

const DoctorQuickActions = ({ onNavigate }) => {
  const [showWellnessHub, setShowWellnessHub] = useState(false);
  const [activeAction, setActiveAction] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [completedToday, setCompletedToday] = useState([]);
  const [showMotivation, setShowMotivation] = useState(null);
  const [currentPhase, setCurrentPhase] = useState(0);

  const wellnessActions = useMemo(() => [
    {
      id: 'power-nap',
      icon: '😴',
      title: 'Power Nap',
      subtitle: 'Quick energy boost',
      color: '#8b5cf6',
      duration: 300,
      phases: [
        { duration: 60, message: '🛋️ Find a quiet space and get comfortable' },
        { duration: 180, message: '😴 Rest your eyes and mind - deep breathing' },
        { duration: 60, message: '🔄 Gently awaken and stretch' }
      ],
      message: 'Perfect! A short nap can improve alertness and performance!',
      tip: '20-minute power naps can restore energy without grogginess. Great between long procedures.'
    },
    {
      id: 'focus-breath',
      icon: '🎯',
      title: 'Focus Breathing',
      subtitle: 'Mental clarity',
      color: '#06b6d4',
      duration: 60,
      phases: [
        { duration: 20, message: '🧘 Inhale deeply through nose (4s), hold (4s)' },
        { duration: 20, message: '💨 Exhale slowly through mouth (6s)' },
        { duration: 20, message: '⚡ Feel the mental clarity returning' }
      ],
      message: 'Excellent! Oxygenating your brain enhances focus and decision-making!',
      tip: '4-4-6 breathing pattern increases oxygen to the brain, perfect before complex decisions.'
    },
    {
      id: 'posture-reset',
      icon: '🚶',
      title: 'Posture Reset',
      subtitle: 'Spinal alignment',
      color: '#10b981',
      duration: 90,
      phases: [
        { duration: 30, message: '🪑 Stand up and stretch overhead' },
        { duration: 30, message: '🔁 Roll shoulders back and down' },
        { duration: 30, message: '📏 Align ears over shoulders, hips over ankles' }
      ],
      message: 'Great posture reset! This prevents chronic pain from long hours.',
      tip: 'Reset your posture every hour. Proper alignment reduces back and neck strain during procedures.'
    },
    {
      id: 'hydration-break',
      icon: '💧',
      title: 'Smart Hydration',
      subtitle: 'Cognitive function',
      color: '#3b82f6',
      duration: 45,
      phases: [
        { duration: 15, message: '💧 Pour a glass of water' },
        { duration: 15, message: '🚰 Sip slowly and mindfully' },
        { duration: 15, message: '🧠 Feel the mental refreshment' }
      ],
      message: 'Hydration boost! Even mild dehydration affects cognitive performance.',
      tip: 'Drink 250ml water every hour. Maintains focus during long consultations and surgeries.'
    },
    {
      id: 'eye-rest',
      icon: '👁️',
      title: 'Eye Recovery',
      subtitle: 'Visual strain relief',
      color: '#f59e0b',
      duration: 120,
      phases: [
        { duration: 40, message: '👀 Close eyes, palm them with hands' },
        { duration: 40, message: '🔄 Look at distant object (20ft away)' },
        { duration: 40, message: '💫 Gentle eye rotations and blinking' }
      ],
      message: 'Eye strain relieved! Essential for detailed visual work.',
      tip: '20-20-20 rule: Every 20 minutes, look at something 20 feet away for 20 seconds.'
    },
    {
      id: 'mental-switch',
      icon: '🔄',
      title: 'Mental Switch',
      subtitle: 'Cognitive reset',
      color: '#ec4899',
      duration: 75,
      phases: [
        { duration: 25, message: '🧠 Acknowledge current mental state' },
        { duration: 25, message: '🔄 Consciously release previous task' },
        { duration: 25, message: '🎯 Set intention for next activity' }
      ],
      message: 'Mental context switch successful! Reduces cognitive load between patients.',
      tip: 'Clear mental cache between patients. Improves diagnostic accuracy and patient connection.'
    }
  ], []);

  const motivationalQuotes = useMemo(() => [
    "Your well-being ensures your patients' well-being! 🌟",
    "Taking care of yourself is part of taking care of others! 💪",
    "The best doctors practice what they prescribe! 🎯",
    "Your mental clarity saves lives - including your own! ❤️",
    "Sustainable practice leads to exceptional care! 🚀"
  ], []);

  const milestoneMessages = useMemo(() => ({
    3: { message: "3 breaks taken! You're modeling healthy habits! 🔥", icon: "🔥" },
    6: { message: "Full wellness rotation! You're a healer who heals themselves! 🏆", icon: "🏆" }
  }), []);

  useEffect(() => {
    const today = new Date().toDateString();
    const saved = JSON.parse(localStorage.getItem('doctorWellnessData') || '{}');
    
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

    localStorage.setItem('doctorWellnessData', JSON.stringify({
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
              <Stethoscope size={24} /> Doctor Wellness Breaks
            </h3>
            <p className="modal-subtitle">Quick recovery strategies for sustained clinical excellence</p>
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
                  <p className="motivation-tip"><strong>Clinical Benefit:</strong> {showMotivation.action.tip}</p>
                </div>
              </div>
            )}

            {completedCount > 0 && !activeAction && (
              <div className="progress-card">
                <div className="progress-header">
                  <span className="progress-label">Today's Wellness Rotation</span>
                  <span className="progress-count">{completedCount}/6</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${progress}%` }} />
                </div>
                {completedCount === 6 && (
                  <div className="completion-badge">
                    <Trophy size={16} /> Full rotation complete! Peak performance maintained!
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
                    <Zap size={16} /> Clinical Benefit
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
                  <button className="cancel-btn" onClick={cancelAction}>Cancel Break</button>
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
                        <Clock size={14} />
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
        <button className="btn mint" onClick={() => onNavigate("/doctor-search")}>
            <span className="btn-icon">🔍</span>
            Find Colleagues
          </button>
          
          <button 
            className="btn coral wellness-btn" 
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
            <button className="btn main" onClick={() => onNavigate("/doctor-profile")}>
            <span className="btn-icon">👨‍⚕️</span>
            Update Profile
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

export default DoctorQuickActions;