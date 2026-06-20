import React from 'react';
import { motion } from 'motion/react';
import { CT_SIGNATURE } from '../../data/catering.js';

/**
 * Signature section — showcases the brand's identity device: a round meal
 * photo with the identity-driven text-on-path SVG halo. Mirrors the moodboard
 * spread the client provided (أنماط العلامة → الكتابة على المنحنى) and acts as
 * the brand-recognition anchor of the page.
 */
export default function CtSignature() {
  return (
    <section className="ct-section ct-section--alt">
      <div className="ct-section__inner ct-signature">
        <motion.div
          className="ct-signature__visual"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="ct-signature__plate">
            <img src="/catering/Meal 1.png" alt="طبق ضيافة الهمزة" />
          </div>
          <img
            className="ct-signature__path"
            src="/catering/Round text on path 2.svg"
            alt=""
            aria-hidden="true"
          />
        </motion.div>

        <motion.div
          className="ct-signature__body"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="ct-eyebrow">هويتنا في طبق</span>
          <h3>{CT_SIGNATURE.title}</h3>
          <p>{CT_SIGNATURE.body}</p>
          <ul className="ct-signature__bullets">
            {CT_SIGNATURE.bullets.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}
