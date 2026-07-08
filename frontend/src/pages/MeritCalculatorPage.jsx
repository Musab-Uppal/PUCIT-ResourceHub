import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';

const SITE_URL = 'https://pucit-resource-hub.vercel.app';

const MERIT_JSON_LD = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How is PUCIT merit calculated?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'PUCIT merit = ((¼ × Matric Obtained + Inter Part-I Obtained + 20 if Hafiz-e-Quran) / (¼ × Matric Total + Inter Part-I Total)) × 75  +  PU Admission Test marks × 0.25',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the weight of PU entry test in PUCIT merit?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The PU Admission Test contributes 25% (0.25 weight) of the total PUCIT merit score.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do Hafiz-e-Quran students get extra marks in PUCIT merit?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Hafiz-e-Quran applicants receive 20 additional marks added directly to the numerator of the academic component of the merit formula.',
      },
    },
    {
      '@type': 'Question',
      name: 'Which Inter result is used for PUCIT merit — Part I or Part II?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Only Intermediate Part-I marks are used in the PUCIT merit formula, not Part-II.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the minimum merit for BSCS at PUCIT?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'PUCIT merit cutoffs vary each year. Use this merit calculator to estimate your score and check the official PU/PUCIT admission portal for current cutoffs.',
      },
    },
  ],
});


function getMeritColor(merit) {
  if (merit >= 80) return '#10b981';
  if (merit >= 70) return '#6366f1';
  if (merit >= 60) return '#f59e0b';
  return '#ef4444';
}

function getMeritLabel(merit) {
  if (merit >= 80) return 'Excellent';
  if (merit >= 70) return 'Good';
  if (merit >= 60) return 'Average';
  return 'Below Average';
}

export default function MeritCalculatorPage() {
  const [matricObtained, setMatricObtained] = useState('');
  const [matricTotal, setMatricTotal] = useState('');
  const [interObtained, setInterObtained] = useState('');
  const [interTotal, setInterTotal] = useState('');
  const [puTestMarks, setPuTestMarks] = useState('');
  const [isHafiz, setIsHafiz] = useState(false);
  const [result, setResult] = useState(null);

  const reset = () => {
    setMatricObtained('');
    setMatricTotal('');
    setInterObtained('');
    setInterTotal('');
    setPuTestMarks('');
    setIsHafiz(false);
    setResult(null);
  };

  const calculate = () => {
    const mObt = parseFloat(matricObtained);
    const mTot = parseFloat(matricTotal);
    const iObt = parseFloat(interObtained);
    const iTot = parseFloat(interTotal);
    const puTest = parseFloat(puTestMarks);

    if ([mObt, mTot, iObt, iTot, puTest].some(isNaN)) {
      setResult({ error: 'Please fill in all required fields with valid numbers.' });
      return;
    }
    if (mObt > mTot) {
      setResult({ error: 'Matric obtained marks cannot exceed total marks.' });
      return;
    }
    if (iObt > iTot) {
      setResult({ error: 'Inter obtained marks cannot exceed total marks.' });
      return;
    }
    if (mTot <= 0 || iTot <= 0) {
      setResult({ error: 'Total marks must be greater than zero.' });
      return;
    }
    if (puTest < 0 || puTest > 100) {
      setResult({ error: 'PU Admission Test marks must be between 0 and 100.' });
      return;
    }

    const hafizBonus = isHafiz ? 20 : 0;
    const numerator = mObt / 4 + iObt + hafizBonus;
    const denominator = mTot / 4 + iTot;
    const academicPart = (numerator / denominator) * 75;
    const testPart = puTest * 0.25;
    const merit = academicPart + testPart;

    setResult({
      merit: merit.toFixed(2),
      academicPart: academicPart.toFixed(2),
      testPart: testPart.toFixed(2),
      hafizBonus,
    });
  };

  const inputClass =
    'w-full bg-surface-700 border border-white/5 text-slate-200 placeholder-slate-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/50 transition';
  const labelClass = 'text-xs text-slate-400 block mb-1 font-medium';

  return (
    <div className="min-h-screen bg-surface-900 pt-6 pb-12 px-4">

      {/* ── SEO ── */}
      <Helmet>
        <title>PUCIT Merit Calculator @Date().year   — Calculate Your Admission Merit Score | PUCIT ResourceHub</title>
        <meta name="description" content="Free online PUCIT merit calculator. Enter your Matric, Inter Part-I marks and PU Admission Test score to instantly calculate your PUCIT admission merit. Supports Hafiz-e-Quran bonus." />
        <meta name="keywords" content="PUCIT merit calculator, PUCIT admission merit 2026, Punjab University merit calculator, BSCS PUCIT merit, BSIT PUCIT merit, FSc merit PUCIT, Hafiz e Quran merit bonus PUCIT, PU entry test merit, how to calculate PUCIT merit" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={`${SITE_URL}/merit-calculator`} />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="PUCIT ResourceHub" />
        <meta property="og:title" content="PUCIT Merit Calculator 2025 — Calculate Your Admission Merit Score" />
        <meta property="og:description" content="Instantly calculate your PUCIT merit score using Matric, Inter Part-I, and PU Admission Test marks. Includes Hafiz-e-Quran bonus support." />
        <meta property="og:image" content={`${SITE_URL}/logo.png`} />
        <meta property="og:url" content={`${SITE_URL}/merit-calculator`} />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="PUCIT Merit Calculator 2025" />
        <meta name="twitter:description" content="Calculate your PUCIT admission merit score instantly. Supports Matric, Inter Part-I, PU Test & Hafiz-e-Quran bonus." />
        <meta name="twitter:image" content={`${SITE_URL}/logo.png`} />

        {/* JSON-LD FAQ Structured Data */}
        <script type="application/ld+json">{MERIT_JSON_LD}</script>
      </Helmet>

      {/* Page Header */}
      <div className="max-w-2xl mx-auto mb-6 text-center">
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

          <h1 className="text-2xl font-extrabold text-white mb-1">
            Merit <span className="gradient-text">Calculator</span>
          </h1>
          <p className="text-slate-500 text-xs">
            Calculate your PUCIT admission merit based on Matric, Inter Part-I, and PU Entry Test scores.
          </p>
        </motion.div>
      </div>

      {/* Formula Card */}
      <motion.div
        className="max-w-2xl mx-auto mb-4 glass rounded-2xl px-5 py-4"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2">Formula Used</p>
        <div className="bg-surface-800 rounded-xl px-4 py-3 border border-white/5 text-center">
          <p className="text-slate-300 text-xs leading-relaxed font-mono">
            <span className="text-brand-400">Merit</span>{' = '}
            <span className="text-emerald-400">
              {'( (¼ × Matric Obt. + Inter Obt. + Hifz Bonus) / (¼ × Matric Total + Inter Total) ) × 75'}
            </span>
            <br />
            <span className="text-slate-500">+</span>
            <br />
            <span className="text-purple-400">PU Test Marks × 0.25</span>
          </p>
          <p className="text-[10px] text-slate-600 mt-2">Hifz Bonus = 20 marks (if Hafiz-e-Quran)</p>
        </div>
      </motion.div>

      {/* Main Input Card */}
      <motion.div
        className="max-w-2xl mx-auto glass rounded-2xl p-5"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.1 }}
      >

        {/* Matric Section */}
        <div className="mb-5">
          <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-brand-500/20 text-brand-400 flex items-center justify-center text-[10px] font-bold">1</span>
            Matriculation (SSC)
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Obtained Marks</label>
              <input
                id="matric-obtained"
                type="number"
                min="0"
                placeholder="e.g. 900"
                value={matricObtained}
                onChange={e => { setMatricObtained(e.target.value); setResult(null); }}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Total Marks</label>
              <input
                id="matric-total"
                type="number"
                min="1"
                placeholder="e.g. 1100"
                value={matricTotal}
                onChange={e => { setMatricTotal(e.target.value); setResult(null); }}
                className={inputClass}
              />
            </div>
          </div>
        </div>

        <div className="border-t border-white/5 mb-5" />

        {/* Inter Part-I Section */}
        <div className="mb-5">
          <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-brand-500/20 text-brand-400 flex items-center justify-center text-[10px] font-bold">2</span>
            Intermediate Part-I (FSc / ICS / FA)
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Obtained Marks</label>
              <input
                id="inter-obtained"
                type="number"
                min="0"
                placeholder="e.g. 480"
                value={interObtained}
                onChange={e => { setInterObtained(e.target.value); setResult(null); }}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Total Marks</label>
              <input
                id="inter-total"
                type="number"
                min="1"
                placeholder="e.g. 550"
                value={interTotal}
                onChange={e => { setInterTotal(e.target.value); setResult(null); }}
                className={inputClass}
              />
            </div>
          </div>
        </div>

        <div className="border-t border-white/5 mb-5" />

        {/* PU Test Section */}
        <div className="mb-5">
          <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-brand-500/20 text-brand-400 flex items-center justify-center text-[10px] font-bold">3</span>
            PU Admission Test
          </p>
          <div className="max-w-xs">
            <label className={labelClass}>Obtained Marks (out of 100)</label>
            <input
              id="pu-test-marks"
              type="number"
              min="0"
              max="100"
              placeholder="e.g. 72"
              value={puTestMarks}
              onChange={e => { setPuTestMarks(e.target.value); setResult(null); }}
              className={inputClass}
            />
          </div>
        </div>

        <div className="border-t border-white/5 mb-5" />

        {/* Hafiz-e-Quran Toggle */}
        <div className="mb-5">
          <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-[10px] font-bold">★</span>
            Hafiz-e-Quran (Optional)
          </p>
          <button
            id="hafiz-toggle"
            type="button"
            onClick={() => { setIsHafiz(prev => !prev); setResult(null); }}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all text-sm font-medium w-full text-left ${isHafiz
              ? 'bg-amber-500/10 border-amber-500/40 text-amber-300'
              : 'bg-surface-700 border-white/5 text-slate-400 hover:border-white/15 hover:text-slate-300'
              }`}
          >
            <span className={`w-10 h-5 rounded-full transition-all relative flex-shrink-0 ${isHafiz ? 'bg-amber-500' : 'bg-surface-600'}`}>
              <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${isHafiz ? 'left-5' : 'left-0.5'}`} />
            </span>
            {isHafiz ? '✅ Yes, I am Hafiz-e-Quran (+20 bonus marks)' : 'No — I am not Hafiz-e-Quran'}
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <motion.button
            id="calculate-merit-btn"
            onClick={calculate}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="flex-1 bg-brand-500 hover:bg-brand-600 text-white font-semibold py-2.5 rounded-lg text-sm transition-colors shadow-lg shadow-brand-500/20"
          >
            Calculate Merit
          </motion.button>
          <motion.button
            id="reset-merit-btn"
            onClick={reset}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="px-5 bg-surface-600 hover:bg-surface-500 text-slate-300 font-medium py-2.5 rounded-lg text-sm transition-colors border border-white/5"
          >
            Reset
          </motion.button>
        </div>

        {/* Result */}
        <AnimatePresence>
          {result && (
            <motion.div
              key="merit-result"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.3 }}
              className="mt-5"
            >
              {result.error ? (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-red-400 text-sm text-center">
                  &#9888;&#65039; {result.error}
                </div>
              ) : (
                <div className="bg-surface-800 border border-white/5 rounded-2xl overflow-hidden">
                  {/* Merit score hero */}
                  <div className="px-6 py-5 text-center border-b border-white/5">
                    <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Your Merit Score</p>
                    <motion.p
                      initial={{ scale: 0.7, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: 'spring', stiffness: 260, damping: 18 }}
                      className="text-5xl font-extrabold"
                      style={{ color: getMeritColor(parseFloat(result.merit)) }}
                    >
                      {result.merit}
                    </motion.p>
                    <p className="text-slate-600 text-[10px] mt-1">/ 100.00</p>
                    <span
                      className="inline-block mt-2 px-3 py-0.5 rounded-full text-[10px] font-semibold"
                      style={{
                        background: getMeritColor(parseFloat(result.merit)) + '22',
                        color: getMeritColor(parseFloat(result.merit)),
                      }}
                    >
                      {getMeritLabel(parseFloat(result.merit))}
                    </span>
                  </div>

                  {/* Breakdown */}
                  <div className="grid grid-cols-3 divide-x divide-white/5">
                    <div className="px-4 py-3 text-center">
                      <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold mb-1">Academic Part</p>
                      <p className="text-xl font-bold text-emerald-400">{result.academicPart}</p>
                      <p className="text-slate-600 text-[10px] mt-0.5">&#215; 75 weight</p>
                    </div>
                    <div className="px-4 py-3 text-center">
                      <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold mb-1">Test Part</p>
                      <p className="text-xl font-bold text-purple-400">{result.testPart}</p>
                      <p className="text-slate-600 text-[10px] mt-0.5">&#215; 0.25 weight</p>
                    </div>
                    <div className="px-4 py-3 text-center">
                      <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold mb-1">Hifz Bonus</p>
                      <p className="text-xl font-bold text-amber-400">+{result.hafizBonus}</p>
                      <p className="text-slate-600 text-[10px] mt-0.5">in numerator</p>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Info Box */}
      <motion.div
        className="max-w-2xl mx-auto mt-4 glass rounded-xl p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2">Important Notes</p>
        <ul className="text-xs text-slate-500 space-y-1 list-none">
          <li className="flex items-start gap-2"><span className="text-brand-400 mt-0.5">&#8226;</span> Only <strong className="text-slate-400">Inter Part-I</strong> marks are used, not Part-II.</li>
          <li className="flex items-start gap-2"><span className="text-brand-400 mt-0.5">&#8226;</span> Matric marks are weighted at <strong className="text-slate-400">&#188; (25%)</strong> in the formula.</li>
          <li className="flex items-start gap-2"><span className="text-brand-400 mt-0.5">&#8226;</span> Hafiz-e-Quran applicants receive <strong className="text-slate-400">20 additional marks</strong> in the numerator.</li>
          <li className="flex items-start gap-2"><span className="text-brand-400 mt-0.5">&#8226;</span> PU Admission Test contributes <strong className="text-slate-400">25%</strong> of the total merit.</li>
          <li className="flex items-start gap-2"><span className="text-amber-400 mt-0.5">&#9888;</span> Merit cutoffs may change each year — use this as an estimate only.</li>
        </ul>
      </motion.div>
    </div>
  );
}
