import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from '../../../styles/components/Cards.module.css';

const AnimatedCardNavigation = () => {
  const [activeCard, setActiveCard] = useState(1);

  const cards = [
    { id: 1, title: "Accueil", content: "test" },
    { id: 2, title: "Projets", content: "test" },
    { id: 3, title: "Contact", content: "test" },
    { id: 4, title: "Piscine IA", content: "test" },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', marginBottom: '40px' }}>
        {cards.map((card) => (
          <motion.div
            key={card.id}
            onClick={() => setActiveCard(card.id)}
            className={styles.motion_card}
            style={{backgroundColor: activeCard === card.id ? '#4A1D96' : '#1F2937'}}
            whileHover={{ scale: 1.05 }}
            // whileTap={{ scale: 0.9 }}
          >
            {card.title}
          </motion.div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeCard}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          style={{ padding: '20px' }}
        >
          {cards.find(card => card.id === activeCard).content}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default AnimatedCardNavigation;