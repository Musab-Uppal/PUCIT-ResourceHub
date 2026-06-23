import { Link } from 'react-router-dom';

export default function AboutPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-white mb-4">About PUCIT Hub</h1>
        <p className="text-slate-400 text-lg">
          A community-driven platform to organize and share academic resources across FCIT campuses.
        </p>
      </div>

      <div className="glass rounded-3xl p-8 mb-8">
        <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-2">
          <span className="text-brand-400">🏷️</span> Tagging Guidelines
        </h2>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium text-white mb-2">📚 Courses</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Please select the relevant course tag for the resource so it's easy to manage and filter. If it applies to multiple subjects, pick the primary one.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-medium text-white mb-2">👨‍🏫 Teachers</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              If you are sharing a specific teacher's notes, slides, or past papers, please tag them! It helps students looking for material from their exact instructor.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-medium text-white mb-2">🏫 Campus (NC/OC)</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              This is for relevancy. Some courses or instructors are specific to the New Campus (NC) or Old Campus (OC). Tagging the campus ensures students get the exact results they need when searching.
            </p>
          </div>
        </div>
      </div>

      <div className="glass border-brand-500/20 bg-brand-500/5 rounded-3xl p-8 text-center">
        <h2 className="text-xl font-semibold text-white mb-3">Get in Touch</h2>
        <p className="text-slate-400 text-sm mb-6 max-w-lg mx-auto">
          Have a suggestion, found a bug, or want to share new ideas/content? We'd love to hear from you.
        </p>

        <a
          href="mailto:musabismail02@gmail.com?subject=PUCIT%20ResourceHub%20Feedback"
          className="inline-flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white px-6 py-3 rounded-xl font-medium transition-colors shadow-lg shadow-brand-500/20"
        >
          ✉️ Contact Admin
        </a>
        <p className="text-xs text-slate-500 mt-4">
          musabismail02@gmail.com
        </p>
      </div>
    </main>
  );
}
