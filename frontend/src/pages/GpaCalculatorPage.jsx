import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';

const SITE_URL = 'https://pucit-resource-hub.vercel.app';

const GPA_JSON_LD = JSON.stringify({
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebApplication',
      name: 'PUCIT GPA Calculator',
      url: `${SITE_URL}/gpa-calculator`,
      description: 'Calculate your semester GPA and cumulative CGPA for PUCIT University of the Punjab using course credit hours and grades.',
      applicationCategory: 'EducationalApplication',
      operatingSystem: 'Any',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'PKR' },
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'How is GPA calculated at PUCIT?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'PUCIT uses a 4.0 GPA scale. GPA = Sum(Grade Points × Credit Hours) / Total Credit Hours for the semester. Grade A = 4.0, A- = 3.7, B+ = 3.3, B = 3.0, and so on.',
          },
        },
        {
          '@type': 'Question',
          name: 'What is a good CGPA for PUCIT BSCS?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'A CGPA of 3.5 or above is considered excellent at PUCIT. A CGPA above 3.0 is generally good. Students need at least 2.0 CGPA to remain in good academic standing.',
          },
        },
        {
          '@type': 'Question',
          name: 'How do I calculate cumulative CGPA at PUCIT?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'CGPA = (Previous CGPA × Previous Credit Hours + Current Semester GPA × Current Credit Hours) / (Previous + Current Credit Hours). Use the PUCIT GPA Calculator above to compute this automatically.',
          },
        },
      ],
    },
  ],
});


// Grade options — edit `points` values to match your university's scale
const GRADE_OPTIONS = [
  { label: 'A', points: 4.0 },
  { label: 'A-', points: 3.7 },
  { label: 'B+', points: 3.3 },
  { label: 'B', points: 3.0 },
  { label: 'B-', points: 2.7 },
  { label: 'C+', points: 2.3 },
  { label: 'C', points: 2.0 },
  { label: 'C-', points: 1.7 },
  { label: 'D', points: 1.0 },
  { label: 'F', points: 0.0 },
];

const defaultRow = () => ({ id: Date.now() + Math.random(), name: '', credits: '', grade: 'A' });
const defaultCourses = Array.from({ length: 5 }, defaultRow);

function getGpaColor(gpa) {
  if (gpa >= 3.5) return '#10b981';
  if (gpa >= 3.0) return '#6366f1';
  if (gpa >= 2.0) return '#f59e0b';
  return '#ef4444';
}

const CHEVRON_SVG = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%2394a3b8' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`;

export default function GpaCalculatorPage() {
  const [courses, setCourses] = useState(defaultCourses);
  const [prevCgpa, setPrevCgpa] = useState('');
  const [prevCredits, setPrevCredits] = useState('');
  const [result, setResult] = useState(null);

  const updateRow = (id, field, value) => {
    setCourses(prev => prev.map(c => c.id === id ? { ...c, [field]: value } : c));
    setResult(null);
  };

  const addRow = () => setCourses(prev => [...prev, defaultRow()]);

  const removeRow = (id) => {
    if (courses.length <= 1) return;
    setCourses(prev => prev.filter(c => c.id !== id));
    setResult(null);
  };

  const calculate = () => {
    let totalPoints = 0;
    let totalCredits = 0;

    for (const c of courses) {
      const credits = parseFloat(c.credits);
      if (!c.name.trim() || isNaN(credits) || credits <= 0) {
        setResult({ error: 'Please fill all course names and valid credit hours.' });
        return;
      }
      const gradeObj = GRADE_OPTIONS.find(g => g.label === c.grade);
      totalPoints += gradeObj.points * credits;
      totalCredits += credits;
    }

    if (totalCredits === 0) {
      setResult({ error: 'Please fill all course names and valid credit hours.' });
      return;
    }

    const semGpa = totalPoints / totalCredits;

    // Cumulative GPA
    let cgpa = null;
    const pCgpa = parseFloat(prevCgpa);
    const pCredits = parseFloat(prevCredits);
    if (!isNaN(pCgpa) && !isNaN(pCredits) && pCredits >= 0 && pCgpa >= 0 && pCgpa <= 4) {
      const totalAllCredits = pCredits + totalCredits;
      cgpa = totalAllCredits > 0
        ? ((pCgpa * pCredits + semGpa * totalCredits) / totalAllCredits).toFixed(2)
        : semGpa.toFixed(2);
    }

    setResult({ gpa: semGpa.toFixed(2), totalCredits, cgpa });
  };

  const reset = () => {
    setCourses(Array.from({ length: 5 }, defaultRow));
    setPrevCgpa('');
    setPrevCredits('');
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-surface-900 pt-6 pb-12 px-4">

      {/* ── SEO ── */}
      <Helmet>
        <title>PUCIT GPA Calculator 2025 — Semester GPA & CGPA Calculator | PUCIT ResourceHub</title>
        <meta name="description" content="Free PUCIT GPA calculator. Enter your courses, credit hours, and grades to instantly compute your semester GPA and cumulative CGPA on the 4.0 scale used at University of the Punjab, Lahore." />
        <meta name="keywords" content="PUCIT GPA calculator, CGPA calculator PUCIT, University of Punjab GPA, BSCS GPA calculator, PUCIT semester GPA, how to calculate GPA PUCIT, Punjab University CGPA, 4.0 GPA scale Pakistan" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={`${SITE_URL}/gpa-calculator`} />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="PUCIT ResourceHub" />
        <meta property="og:title" content="PUCIT GPA Calculator 2025 — Semester GPA & CGPA Calculator" />
        <meta property="og:description" content="Instantly compute your PUCIT semester GPA and cumulative CGPA. Supports all courses and credit hours on the 4.0 scale." />
        <meta property="og:image" content={`${SITE_URL}/logo.png`} />
        <meta property="og:url" content={`${SITE_URL}/gpa-calculator`} />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="PUCIT GPA Calculator 2025" />
        <meta name="twitter:description" content="Calculate your PUCIT semester GPA and cumulative CGPA instantly with this free tool." />
        <meta name="twitter:image" content={`${SITE_URL}/logo.png`} />

        {/* JSON-LD Structured Data */}
        <script type="application/ld+json">{GPA_JSON_LD}</script>
      </Helmet>

      {/* Page header — compact */}
      <div className="max-w-3xl mx-auto mb-5 text-center">
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

          <h1 className="text-2xl font-extrabold text-white mb-1">
            GPA <span className="gradient-text">Calculator</span>
          </h1>
          <p className="text-slate-500 text-xs">Enter courses below to calculate your semester GPA and cumulative CGPA.</p>
        </motion.div>
      </div>

      {/* Main card */}
      <motion.div
        className="max-w-3xl mx-auto glass rounded-2xl p-5"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.1 }}
      >
        {/* Column labels */}
        <div className="grid grid-cols-[1fr_100px_110px_28px] gap-2 mb-2 px-0.5">
          <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Course Name</span>
          <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Credits</span>
          <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Grade</span>
          <span />
        </div>

        {/* Course rows */}
        <AnimatePresence initial={false}>
          {courses.map((course, idx) => (
            <motion.div
              key={course.id}
              layout
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 16, height: 0, marginBottom: 0 }}
              transition={{ duration: 0.18 }}
              className="grid grid-cols-[1fr_100px_110px_28px] gap-2 mb-2 items-center"
            >
              <input
                type="text"
                placeholder={`Course ${idx + 1}`}
                value={course.name}
                onChange={e => updateRow(course.id, 'name', e.target.value)}
                className="bg-surface-700 border border-white/5 text-slate-200 placeholder-slate-600 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/50 transition"
              />
              <input
                type="number"
                min="0.5"
                max="3"
                step="0.5"
                placeholder="e.g. 3"
                value={course.credits}
                onChange={e => updateRow(course.id, 'credits', e.target.value)}
                className="bg-surface-700 border border-white/5 text-slate-200 placeholder-slate-600 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/50 transition"
              />
              <select
                value={course.grade}
                onChange={e => updateRow(course.id, 'grade', e.target.value)}
                className="bg-surface-700 border border-white/5 text-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/50 transition appearance-none cursor-pointer"
                style={{ backgroundImage: CHEVRON_SVG, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 6px center', backgroundSize: '14px', paddingRight: '24px' }}
              >
                {GRADE_OPTIONS.map(g => (
                  <option key={g.label} value={g.label}>{g.label}</option>
                ))}
              </select>
              <button
                onClick={() => removeRow(course.id)}
                title="Remove"
                className="w-7 h-7 flex items-center justify-center rounded-md text-slate-600 hover:text-red-400 hover:bg-red-400/10 transition-colors text-base leading-none"
              >
                ×
              </button>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Add course */}
        <motion.button
          onClick={addRow}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.97 }}
          className="mt-1 mb-4 flex items-center gap-1.5 text-xs text-brand-400 hover:text-brand-300 border border-dashed border-brand-500/30 hover:border-brand-500/60 rounded-lg px-3 py-1.5 w-full justify-center transition-all"
        >
          <span className="text-sm font-bold leading-none">+</span>
          Add Course
        </motion.button>

        {/* Previous CGPA inputs */}
        <div className="bg-surface-800 border border-white/5 rounded-xl px-4 py-3 mb-4">
          <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2">Previous CGPA (optional)</p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-400 block mb-1">Previous CGPA</label>
              <input
                type="number"
                min="0"
                max="4"
                step="0.01"
                placeholder="e.g. 3.20"
                value={prevCgpa}
                onChange={e => { setPrevCgpa(e.target.value); setResult(null); }}
                className="w-full bg-surface-700 border border-white/5 text-slate-200 placeholder-slate-600 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/50 transition"
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1">Previous Credit Hours</label>
              <input
                type="number"
                min="0"
                step="1"
                placeholder="e.g. 60"
                value={prevCredits}
                onChange={e => { setPrevCredits(e.target.value); setResult(null); }}
                className="w-full bg-surface-700 border border-white/5 text-slate-200 placeholder-slate-600 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/50 transition"
              />
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2">
          <motion.button
            onClick={calculate}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="flex-1 bg-brand-500 hover:bg-brand-600 text-white font-semibold py-2 rounded-lg text-xs transition-colors shadow-lg shadow-brand-500/20"
          >
            Calculate GPA
          </motion.button>
          <motion.button
            onClick={reset}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="px-4 bg-surface-600 hover:bg-surface-500 text-slate-300 font-medium py-2 rounded-lg text-xs transition-colors border border-white/5"
          >
            Reset
          </motion.button>
        </div>

        {/* Result */}
        <AnimatePresence>
          {result && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.3 }}
              className="mt-4"
            >
              {result.error ? (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-red-400 text-xs text-center">
                  ⚠️ {result.error}
                </div>
              ) : (
                <div className="bg-surface-800 border border-white/5 rounded-xl px-4 py-4 grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {/* Semester GPA */}
                  <div className="text-center">
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold mb-1">Semester GPA</p>
                    <p className="text-3xl font-extrabold" style={{ color: getGpaColor(parseFloat(result.gpa)) }}>
                      {result.gpa}
                    </p>
                    <p className="text-slate-600 text-[10px] mt-0.5">/ 4.00</p>
                  </div>

                  {/* Semester Credits */}
                  <div className="text-center">
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold mb-1">Sem. Credits</p>
                    <p className="text-3xl font-extrabold text-white">{result.totalCredits}</p>
                    <p className="text-slate-600 text-[10px] mt-0.5">credit hrs</p>
                  </div>

                  {/* Cumulative CGPA (only if prev values provided) */}
                  {result.cgpa !== null && (
                    <div className="text-center col-span-2 sm:col-span-1">
                      <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold mb-1">Cumulative CGPA</p>
                      <p className="text-3xl font-extrabold" style={{ color: getGpaColor(parseFloat(result.cgpa)) }}>
                        {result.cgpa}
                      </p>
                      <p className="text-slate-600 text-[10px] mt-0.5">/ 4.00</p>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Grade reference table — compact */}
      <motion.div
        className="max-w-3xl mx-auto mt-4 glass rounded-xl p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.25 }}
      >
        <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2">Grade Point Reference</p>
        <div className="grid grid-cols-5 sm:grid-cols-10 gap-1.5">
          {GRADE_OPTIONS.map(g => (
            <div key={g.label} className="bg-surface-700 rounded-lg px-1 py-2 text-center border border-white/5">
              <p className="text-white font-bold text-xs">{g.label}</p>
              <p className="text-slate-500 text-[10px] mt-0.5">{g.points.toFixed(1)}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
