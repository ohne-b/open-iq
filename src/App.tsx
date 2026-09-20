import { Component, useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { Link, Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom';
import { createSession, flagSession, type Session } from './domain';
import { interruptSession, parseSession } from './session';
import { deleteSession, downloadSession, loadSessions, saveSession } from './storage';
import { Assessment, type UpdateSession } from './components/Assessment';
import { Results } from './components/Results';
import { About, Accessibility, Privacy } from './components/InfoPages';

function Home({
  sessions,
  onImport,
}: {
  sessions: Session[];
  onImport: (file: File) => Promise<void>;
}) {
  const pending = sessions.find((s) => s.stage !== 'complete');
  const [importing, setImporting] = useState(false);
  const [error, setError] = useState('');
  return (
    <main className="home-main" id="main-content" tabIndex={-1}>
      <h1 tabIndex={-1}>Cognitive assessment</h1>
      <p className="intro">Ten sections exploring reasoning, language, memory and visual speed.</p>
      <div className="home-facts">
        <span>Allow 60–75 minutes</span>
        <span>Ages 18+</span>
        <span>English</span>
      </div>
      <div className="actions">
        <Link className="button primary" to={pending ? `/test/${pending.id}` : '/prepare'}>
          {pending ? 'Continue assessment' : 'Take the assessment'}
          <span aria-hidden="true">→</span>
        </Link>
        {pending && (
          <Link className="quiet-button" to="/prepare">
            Start again
          </Link>
        )}
      </div>
      <p className="home-note">Free. No account. Progress saved on this device.</p>
      <div className="home-context">
        <p>
          You’ll receive scores for each task. This assessment is not yet validated and does not
          produce an IQ score.
        </p>
        <Link to="/about">
          About the test <span aria-hidden="true">↗</span>
        </Link>
      </div>
      {sessions.length > 0 && (
        <section className="saved-section">
          <h2>Saved assessments</h2>
          <ul className="saved-list">
            {sessions.map((session) => (
              <li key={session.id}>
                <div>
                  <Link to={`/results/${session.id}`}>
                    {new Date(session.startedAt).toLocaleDateString(undefined, {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </Link>
                  <span className="small muted">
                    {session.stage === 'complete'
                      ? 'Complete'
                      : `Section ${session.sectionIndex + 1} of 10`}
                  </span>
                </div>
                <Link
                  className="text-link"
                  to={
                    session.stage === 'complete' ? `/results/${session.id}` : `/test/${session.id}`
                  }
                >
                  {session.stage === 'complete' ? 'View results' : 'Continue'}{' '}
                  <span aria-hidden="true">→</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
      <div className="import-control">
        <label className="file-link">
          {importing ? 'Importing…' : 'Import a saved assessment'}
          <input
            type="file"
            accept="application/json,.json"
            disabled={importing}
            onChange={async (event) => {
              const file = event.target.files?.[0];
              if (!file) return;
              setImporting(true);
              setError('');
              try {
                await onImport(file);
              } catch (cause) {
                setError(
                  cause instanceof Error ? cause.message : 'This file could not be imported.',
                );
              } finally {
                setImporting(false);
                event.target.value = '';
              }
            }}
          />
        </label>
        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}
      </div>
    </main>
  );
}

function Prepare({
  hasPrevious,
  onBegin,
}: {
  hasPrevious: boolean;
  onBegin: (mode: Session['inputMode'], retest: boolean) => Promise<void>;
}) {
  const [accepted, setAccepted] = useState(false);
  const [retest, setRetest] = useState(hasPrevious);
  const [mode, setMode] = useState<Session['inputMode']>(() =>
    matchMedia('(pointer: coarse)').matches ? 'touch' : 'keyboard',
  );
  const [starting, setStarting] = useState(false);
  return (
    <main className="page narrow" id="main-content" tabIndex={-1}>
      <Link className="back-link" to="/">
        ← Back
      </Link>
      <h1 tabIndex={-1}>Before you begin</h1>
      <p className="intro">Find a quiet place and give yourself some time.</p>
      <ul className="prepare-list">
        <li>Work on your own, without notes, a calculator, or outside help.</li>
        <li>
          You can take breaks between tasks. Keep this tab open during memory sequences and timed
          rounds.
        </li>
        <li>Practice comes before every section. There’s no time limit on most questions.</li>
      </ul>
      <form
        onSubmit={async (event) => {
          event.preventDefault();
          if (!accepted || starting) return;
          setStarting(true);
          await onBegin(mode, retest);
          setStarting(false);
        }}
      >
        <fieldset className="input-mode">
          <legend>How are you taking the test?</legend>
          <label>
            <input
              type="radio"
              name="input-mode"
              checked={mode === 'keyboard'}
              onChange={() => setMode('keyboard')}
            />
            Keyboard & mouse
          </label>
          <label>
            <input
              type="radio"
              name="input-mode"
              checked={mode === 'touch'}
              onChange={() => setMode('touch')}
            />
            Touchscreen
          </label>
        </fieldset>
        {mode === 'touch' && (
          <p className="small muted">
            A larger screen is easier for visual tasks. Touch and keyboard speed scores are not
            interchangeable.
          </p>
        )}
        <label className="checkbox-row">
          <input
            type="checkbox"
            checked={retest}
            onChange={(event) => setRetest(event.target.checked)}
          />
          <span>I’ve taken this assessment before.</span>
        </label>
        <label className="checkbox-row adult-confirm">
          <input
            type="checkbox"
            required
            checked={accepted}
            onChange={(event) => setAccepted(event.target.checked)}
          />
          <span>I’m 18 or older and understand the English instructions.</span>
        </label>
        <p className="small muted">
          Your report shows task scores, not an IQ score. Answers are saved in this browser.{' '}
          <Link to="/privacy">Privacy</Link>
        </p>
        <button className="button primary" type="submit" disabled={!accepted || starting}>
          {starting ? 'Starting…' : 'Begin assessment'}
        </button>
      </form>
    </main>
  );
}

function SessionRoute({
  sessions,
  children,
}: {
  sessions: Session[];
  children: (session: Session) => ReactNode;
}) {
  const { id } = useParams();
  const session = sessions.find((s) => s.id === id);
  return session ? (
    children(session)
  ) : (
    <main className="page narrow">
      <h1>Assessment not found</h1>
      <p>
        It may have been deleted, or saved in a different browser. You can import a downloaded
        assessment from the home page.
      </p>
      <Link to="/" className="button primary">
        Go home
      </Link>
    </main>
  );
}

export class AppErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? (
      <main className="page narrow">
        <h1>Something went wrong.</h1>
        <p>
          Your saved answers remain in this browser. Reload to continue. An active memory sequence
          or timed round will be marked as interrupted.
        </p>
        <button className="button primary" onClick={() => window.location.reload()}>
          Reload
        </button>
      </main>
    ) : (
      this.props.children
    );
  }
}

export function App() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const current = useRef<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [storageError, setStorageError] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState('');
  const dialog = useRef<HTMLDialogElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const inTest = location.pathname.startsWith('/test/');
  const publish = useCallback((records: Session[]) => {
    current.current = records.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
    setSessions([...current.current]);
  }, []);
  const persist = useCallback(async (session: Session) => {
    try {
      await saveSession(session);
    } catch {
      setStorageError(true);
    }
  }, []);
  useEffect(() => {
    let cancelled = false;
    void loadSessions()
      .then(async (records) => {
        const recovered: Session[] = [];
        for (const record of records) {
          let next = record;
          if (record.activeTrial) {
            if (navigator.locks)
              await navigator.locks.request(
                `open-iq-assessment-${record.id}`,
                { ifAvailable: true },
                (lock) => {
                  if (lock) next = interruptSession(record);
                },
              );
            else next = interruptSession(record);
            if (next !== record) await persist(next);
          }
          recovered.push(next);
        }
        if (!cancelled) publish(recovered);
      })
      .catch(() => {
        if (!cancelled) setStorageError(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [persist, publish]);
  const update: UpdateSession = useCallback(
    async (id, transform) => {
      const previous = current.current.find((s) => s.id === id);
      if (!previous) return;
      let next = { ...transform(previous), updatedAt: new Date().toISOString() };
      if (storageError) next = flagSession(next, 'storage-unavailable');
      publish(current.current.map((s) => (s.id === id ? next : s)));
      await persist(next);
    },
    [persist, publish, storageError],
  );
  const openAssessment = useCallback(
    async (id: string) => {
      try {
        const record = (await loadSessions()).find((s) => s.id === id);
        if (record) {
          const recovered = interruptSession(record);
          publish(current.current.map((s) => (s.id === id ? recovered : s)));
          if (recovered !== record) await persist(recovered);
        }
      } catch {
        setStorageError(true);
      }
    },
    [persist, publish],
  );
  useEffect(() => {
    const title = location.pathname.startsWith('/results')
      ? 'Your results'
      : inTest
        ? 'Assessment'
        : location.pathname === '/about'
          ? 'About the test'
          : location.pathname === '/privacy'
            ? 'Privacy'
            : location.pathname === '/accessibility'
              ? 'Accessibility'
              : 'Cognitive assessment';
    document.title = `${title} · Open IQ`;
    window.scrollTo(0, 0);
    if (!inTest) document.querySelector<HTMLElement>('main h1')?.focus({ preventScroll: true });
  }, [location.pathname, inTest]);
  useEffect(() => {
    if (deleting) dialog.current?.showModal();
    else dialog.current?.close();
  }, [deleting]);
  const begin = async (mode: Session['inputMode'], retest: boolean) => {
    let session = createSession(mode, retest);
    if (storageError) session = flagSession(session, 'storage-unavailable');
    publish([session, ...current.current]);
    await persist(session);
    navigate(`/test/${session.id}`);
  };
  const importFile = async (file: File) => {
    if (file.size > 1_000_000)
      throw new Error('This file is too large. Choose an Open IQ JSON export under 1 MB.');
    let session: Session;
    try {
      session = parseSession(JSON.parse(await file.text()));
    } catch {
      throw new Error(
        'This is not a valid export for form 1.0. Choose the original JSON file from Open IQ.',
      );
    }
    if (current.current.some((s) => s.id === session.id))
      throw new Error(
        'This assessment is already saved on this device. Open it from the list above.',
      );
    session = flagSession(interruptSession(session), 'resumed');
    publish([session, ...current.current]);
    await persist(session);
    navigate(`/results/${session.id}`);
  };
  const leave = async (session: Session) => {
    await update(session.id, (s) => flagSession(interruptSession(s), 'resumed'));
    navigate('/');
  };
  const remove = async () => {
    if (!deleting) return;
    try {
      if (navigator.locks) {
        const removed = await navigator.locks.request(
          `open-iq-assessment-${deleting}`,
          { ifAvailable: true },
          async (lock) => {
            if (!lock) return false;
            await deleteSession(deleting);
            return true;
          },
        );
        if (!removed) {
          setDeleteError('This assessment is open in another tab. Close it there before deleting.');
          return;
        }
      } else await deleteSession(deleting);
      publish(current.current.filter((s) => s.id !== deleting));
      setDeleting(null);
      navigate('/');
    } catch {
      setDeleteError(
        'The result could not be deleted. Try again, or clear this site’s data in browser settings.',
      );
    }
  };
  return (
    <div className={`site-shell ${inTest ? 'in-assessment' : ''}`}>
      <a
        className="skip-link"
        href="#main-content"
        onClick={(event) => {
          event.preventDefault();
          const main = document.querySelector<HTMLElement>('main');
          main?.setAttribute('tabindex', '-1');
          main?.focus();
        }}
      >
        Skip to content
      </a>
      <header className="site-header">
        {inTest ? (
          <span className="site-name">Open IQ</span>
        ) : (
          <Link to="/" className="site-name">
            Open IQ
          </Link>
        )}
        {!inTest && (
          <Link to="/about" className="text-link">
            About the test
          </Link>
        )}
      </header>
      {storageError && (
        <div className="storage-notice" role="alert">
          Automatic saving is unavailable. You can continue in this tab and download your results
          before closing it.
          {inTest && sessions.find((s) => location.pathname.endsWith(s.id)) && (
            <button
              className="quiet-button"
              onClick={() =>
                downloadSession(sessions.find((s) => location.pathname.endsWith(s.id))!)
              }
            >
              Download progress
            </button>
          )}
        </div>
      )}
      {loading ? (
        <main className="page narrow" aria-busy="true">
          <p>Opening your assessments…</p>
        </main>
      ) : (
        <Routes>
          <Route path="/" element={<Home sessions={sessions} onImport={importFile} />} />
          <Route
            path="/prepare"
            element={<Prepare hasPrevious={sessions.length > 0} onBegin={begin} />}
          />
          <Route
            path="/test/:id"
            element={
              <SessionRoute sessions={sessions}>
                {(session) => (
                  <Assessment
                    key={session.id}
                    session={session}
                    update={update}
                    onLeave={() => leave(session)}
                    onOpen={openAssessment}
                  />
                )}
              </SessionRoute>
            }
          />
          <Route
            path="/results/:id"
            element={
              <SessionRoute sessions={sessions}>
                {(session) => (
                  <Results
                    session={session}
                    onDelete={() => {
                      setDeleteError('');
                      setDeleting(session.id);
                    }}
                  />
                )}
              </SessionRoute>
            }
          />
          <Route path="/about" element={<About />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/accessibility" element={<Accessibility />} />
          <Route
            path="*"
            element={
              <main className="page narrow">
                <h1>Page not found</h1>
                <Link to="/">Go home</Link>
              </main>
            }
          />
        </Routes>
      )}
      {!inTest && (
        <footer className="site-footer">
          <span>Open IQ</span>
          <nav aria-label="Footer">
            <Link to="/privacy">Privacy</Link>
            <Link to="/accessibility">Accessibility</Link>
            <a href="https://github.com/ohne-b/open-iq">Source ↗</a>
          </nav>
        </footer>
      )}
      <dialog
        ref={dialog}
        onCancel={() => setDeleting(null)}
        onClose={() => setDeleting(null)}
        aria-labelledby="delete-title"
      >
        <h2 id="delete-title">Delete this assessment?</h2>
        <p>
          Its answers and results will be removed from this browser. Download a copy first if you
          want to keep them.
        </p>
        {deleteError && (
          <p className="form-error" role="alert">
            {deleteError}
          </p>
        )}
        <div className="actions">
          <button className="button secondary" autoFocus onClick={() => setDeleting(null)}>
            Keep result
          </button>
          <button className="button danger" onClick={remove}>
            Delete assessment
          </button>
        </div>
      </dialog>
    </div>
  );
}
