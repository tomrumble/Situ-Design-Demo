import React, { useEffect, useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';

function slugify(text) {
  return String(text || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

export default function SectionNav() {
  const location = useLocation();
  const [sections, setSections] = useState([]);
  const [activeId, setActiveId] = useState(null);

  const collectSections = useCallback(() => {
    try {
      const headers = Array.from(document.querySelectorAll('.content-section .content-header'));
      const list = headers
        .map((el, idx) => {
          const titleEl = el.querySelector('h3, h2, h1');
          const label = (titleEl && titleEl.textContent && titleEl.textContent.trim());
          // Skip sections that don't have a heading (paragraph-only headers)
          if (!label) return null;
          let id = el.getAttribute('id');
          if (!id) {
            id = slugify(label) || `section-${idx + 1}`;
            let tryId = id;
            let i = 1;
            while (document.getElementById(tryId)) {
              tryId = `${id}-${i++}`;
            }
            id = tryId;
            el.setAttribute('id', id);
          }
          return { id, label };
        })
        .filter(Boolean); // Remove null entries
      setSections(list);
    } catch (e) {
      setSections([]);
    }
  }, []);

  useEffect(() => {
    collectSections();
    const contentRoot = document.querySelector('.scroll-content');
    if (!contentRoot) return undefined;

    const mo = new MutationObserver(() => collectSections());
    mo.observe(contentRoot, { childList: true, subtree: true });

    return () => mo.disconnect();
  }, [location.pathname, collectSections]);

  useEffect(() => {
    const viewport = document.querySelector('.scroll-viewport');
    if (!viewport) return undefined;

    const onScroll = () => {
      if (!sections || !sections.length) return;
      const viewportRect = viewport.getBoundingClientRect();
      let closest = null;
      let closestDist = Infinity;
      sections.forEach(s => {
        const el = document.getElementById(s.id);
        if (!el) return;
        const r = el.getBoundingClientRect();
        const dist = Math.abs(r.top - viewportRect.top);
        if (dist < closestDist) {
          closestDist = dist;
          closest = s.id;
        }
      });
      if (closest) setActiveId(closest);
    };

    viewport.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    return () => viewport.removeEventListener('scroll', onScroll);
  }, [sections]);

  const handleClick = (id) => {
    try {
      const viewport = document.querySelector('.scroll-viewport');
      if (id === 'top') {
        // Scroll to top
        viewport.scrollTo({ top: 0, behavior: 'smooth' });
        setActiveId(null); // Clear active state when going to top
        return;
      }
      const target = document.getElementById(id);
      if (!viewport || !target) return;
      const vpRect = viewport.getBoundingClientRect();
      const targetRect = target.getBoundingClientRect();
      const currentScroll = viewport.scrollTop;
      const offset = targetRect.top - vpRect.top + currentScroll - 128;
      viewport.scrollTo({ top: offset, behavior: 'smooth' });
      setActiveId(id);
    } catch (_) {}
  };

  if (!sections || sections.length === 0) return null;

  return (
    <aside className="section-nav" aria-label="Page sections">
      <h3 className="navbar-section-title">On this page</h3>
      <nav className="navbar-nav">
        <button
          className="section-nav-item"
          onClick={() => handleClick('top')}
          type="button"
        >
          Top
        </button>
        {sections.map(s => (
          <button
            key={s.id}
            className={`section-nav-item ${activeId === s.id ? 'active' : ''}`}
            onClick={() => handleClick(s.id)}
            type="button"
          >
            {s.label}
          </button>
        ))}
      </nav>
    </aside>
  );
}


