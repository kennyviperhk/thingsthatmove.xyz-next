'use client';

import { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import styles from './styles/Home.module.css';

export default function Home() {
  const controls = useAnimation();

  useEffect(() => {
    controls.start({ opacity: 1, y: 0 });
  }, [controls]);

  const services = [
    'Kinetic Art',
    'Interactive Design',
    'Robotics',
    'Technical Consultancy',
    'Creative and Research'
  ];

  return (
    <main>


      <section className={styles.servicesSection}>
        <div className={styles.servicesList}>
          {services.map((service, index) => (
            <motion.div
              key={service}
              className={styles.serviceItem}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              {service}
            </motion.div>
          ))}
        </div>
      </section>

      <section className={styles.collaborateSection}>
        <h2 className={styles.collaborateTitle}>
          LET&apos;S COLLABORATE
        </h2>
      </section>
    </main>
  );
}
