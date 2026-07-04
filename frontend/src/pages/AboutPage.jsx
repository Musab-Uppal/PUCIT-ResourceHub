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

      {/* GitHub feedback section */}
      <div className="glass border border-brand-500/20 bg-brand-500/5 rounded-3xl p-8 text-center">
        <div className="flex items-center justify-center gap-3 mb-3">
          {/* GitHub icon */}
          <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 2C6.477 2 2 6.484 2 12.021c0 4.428 2.865 8.185 6.839 9.504.5.092.682-.217.682-.483 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.342-3.369-1.342-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.026 2.747-1.026.546 1.378.202 2.397.1 2.65.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482C19.138 20.2 22 16.447 22 12.021 22 6.484 17.523 2 12 2z"/>
          </svg>
          <h2 className="text-xl font-semibold text-white">Found a Bug? Have a Suggestion?</h2>
        </div>
        <p className="text-slate-400 text-sm mb-6 max-w-lg mx-auto">
          Help improve PUCIT ResourceHub by raising an issue on GitHub. Whether it's a bug report, a feature request, or a general idea — all contributions are welcome!
        </p>
        <a
          href="https://github.com/Musab-Uppal/PUCIT-ResourceHub/issues/new"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white px-6 py-3 rounded-xl font-medium transition-colors shadow-lg shadow-brand-500/20"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 2C6.477 2 2 6.484 2 12.021c0 4.428 2.865 8.185 6.839 9.504.5.092.682-.217.682-.483 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.342-3.369-1.342-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.026 2.747-1.026.546 1.378.202 2.397.1 2.65.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482C19.138 20.2 22 16.447 22 12.021 22 6.484 17.523 2 12 2z"/>
          </svg>
          Raise an Issue on GitHub
        </a>
        <p className="text-xs text-slate-500 mt-4">
          github.com/Musab-Uppal/PUCIT-ResourceHub
        </p>
      </div>

    </main>
  );
}
