import React from 'react';
import { motion } from 'motion/react';
import { TR_PROJECTS } from '../../data/travel.js';

/**
 * Projects — three case-studies (Ikram Resort, Saudi Summit, Warf Al Maarifa)
 * pulled directly from the business profile. Each card carries a brand vector
 * accent and the scope chip listing what the engagement covered.
 */
export default function TrProjects() {
  return (
    <section id="projects" className="tr-section">
      <div className="tr-section__inner">
        <header className="tr-section__head">
          <span className="tr-eyebrow">من أعمالنا</span>
          <h2 className="tr-h2">
            مشاريع <span className="tr-hl">نفخر بها</span>
          </h2>
          <p className="tr-lede">
            ثلاثة شركاء نجاح اعتمدوا علينا في إدارة سفرهم وإقامتهم وإعاشتهم —
            من منتجع صحي لكبار السن، إلى قمّة وطنية، إلى برامج معرفية مستمرة.
          </p>
        </header>

        <div className="tr-projects">
          {TR_PROJECTS.map((p, i) => (
            <motion.article
              key={p.id}
              className="tr-project"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.55, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="tr-project__vector" aria-hidden>
                <img src={p.vector} alt="" />
              </div>
              <div className="tr-project__chip">{p.location}</div>
              <h3 className="tr-project__title">{p.name}</h3>
              <p className="tr-project__body">{p.body}</p>
              <div className="tr-project__scope">
                {p.scope.split('•').map((tag) => (
                  <span key={tag.trim()} className="tr-project__tag">{tag.trim()}</span>
                ))}
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
