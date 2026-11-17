import React, { FormEvent, useEffect, useMemo, useState } from 'react';
import './App.css';

type Priority = 'low' | 'medium' | 'high';
type Task = {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  priority: Priority;
  dueDate: string | null;
  createdAt: string;
};

type Filter = 'all' | 'today' | 'upcoming' | 'completed';

const starterTasks: Task[] = [];

const today = () => new Date().toISOString().slice(0, 10);

function Icon({ name }: { name: string }) {
  const paths: Record<string, React.ReactNode> = {
    grid: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 10h18" /></>,
    check: <><path d="m5 12 4 4L19 6" /></>,
    search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
    plus: <><path d="M12 5v14M5 12h14" /></>,
    arrow: <><path d="m9 18 6-6-6-6" /></>,
    trash: <><path d="M3 6h18M8 6V4h8v2m3 0-1 14H6L5 6m4 4v6m6-6v6" /></>,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    spark: <><path d="m12 3 1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3ZM19 16l.9 2.1L22 19l-2.1.9L19 22l-.9-2.1L16 19l2.1-.9L19 16Z" /></>,
  };

  return <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>;
}

function App() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const saved = window.localStorage.getItem('daymark-tasks');
      return saved ? JSON.parse(saved) as Task[] : starterTasks;
    } catch {
      return starterTasks;
    }
  });
  const [filter, setFilter] = useState<Filter>('all');
  const [query, setQuery] = useState('');
  const [draft, setDraft] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [dueDate, setDueDate] = useState('');

  useEffect(() => {
    window.localStorage.setItem('daymark-tasks', JSON.stringify(tasks));
  }, [tasks]);

  const counts = useMemo(() => ({
    all: tasks.filter((task) => !task.completed).length,
    today: tasks.filter((task) => !task.completed && task.dueDate === today()).length,
    upcoming: tasks.filter((task) => !task.completed && !!task.dueDate && task.dueDate > today()).length,
    completed: tasks.filter((task) => task.completed).length,
  }), [tasks]);

  const visibleTasks = useMemo(() => tasks.filter((task) => {
    const matchesSearch = `${task.title} ${task.description}`.toLowerCase().includes(query.toLowerCase());
    const matchesFilter = filter === 'all' ? !task.completed
      : filter === 'today' ? !task.completed && task.dueDate === today()
        : filter === 'upcoming' ? !task.completed && !!task.dueDate && task.dueDate > today()
          : task.completed;
    return matchesSearch && matchesFilter;
  }), [filter, query, tasks]);

  const addTask = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const title = draft.trim();
    if (!title) return;
    setTasks((current) => [{
      id: Date.now(), title, description: '', completed: false, priority,
      dueDate: dueDate || null, createdAt: new Date().toISOString(),
    }, ...current]);
    setDraft('');
    setDueDate('');
    setPriority('medium');
  };

  const toggleTask = (id: number) => {
    setTasks((current) => current.map((task) => task.id === id ? { ...task, completed: !task.completed } : task));
  };

  const deleteTask = (id: number) => setTasks((current) => current.filter((task) => task.id !== id));
  const filters: { id: Filter; label: string; icon: string }[] = [
    { id: 'all', label: 'My tasks', icon: 'grid' },
    { id: 'today', label: 'Today', icon: 'calendar' },
    { id: 'upcoming', label: 'Upcoming', icon: 'clock' },
    { id: 'completed', label: 'Completed', icon: 'check' },
  ];

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a className="brand" href="#home" aria-label="Daymark home"><span className="brand-mark"><Icon name="check" /></span><span>daymark<span className="brand-period">.</span></span></a>
        <div className="workspace-label">WORKSPACE</div>
        <nav className="side-nav" aria-label="Task views">
          {filters.map((item) => <button key={item.id} className={`nav-item ${filter === item.id ? 'active' : ''}`} onClick={() => setFilter(item.id)}>
            <Icon name={item.icon} /><span>{item.label}</span>{item.id !== 'completed' && <span className="nav-count">{counts[item.id]}</span>}
          </button>)}
        </nav>
        
      </aside>

      <main className="main-content" id="home">
        <header className="topbar"><div className="breadcrumb">Workspace <Icon name="arrow" /> <span>{filters.find((item) => item.id === filter)?.label}</span></div><label className="search-box"><Icon name="search" /><input aria-label="Search tasks" placeholder="Search tasks..." value={query} onChange={(event) => setQuery(event.target.value)} /><kbd>⌘ K</kbd></label></header>
        <div className="page-content">
          <section className="welcome-row"><div><div className="eyebrow">TUESDAY, NOVEMBER 17</div><h1>{filter === 'today' ? 'Today, in focus.' : filter === 'upcoming' ? 'On the horizon.' : filter === 'completed' ? 'Look at you go.' : 'Make room for good work.'}</h1><p className="welcome-subtitle">A clear mind starts with a clear list.</p></div><div className="date-stamp"><span>YOUR DAY</span><strong>17</strong><small>NOV · TUE</small></div></section>

          <section className="stats-row" aria-label="Task summary">
            <div className="stat-item"><span className="stat-dot dot-ink" /><span>Open tasks</span><strong>{counts.all}</strong></div>
            <div className="stat-item"><span className="stat-dot dot-lime" /><span>Due today</span><strong>{counts.today}</strong></div>
            <div className="stat-item"><span className="stat-dot dot-coral" /><span>Completed</span><strong>{counts.completed}</strong></div>
            <div className="completion-track" aria-label={`${tasks.length ? Math.round((counts.completed / tasks.length) * 100) : 0}% complete`}><div style={{ width: `${tasks.length ? (counts.completed / tasks.length) * 100 : 0}%` }} /></div>
          </section>

          <section className="task-section">
            <div className="section-heading"><div><span className="section-kicker">YOUR LIST</span><h2>{filters.find((item) => item.id === filter)?.label}<span className="heading-count">{visibleTasks.length}</span></h2></div><div className="sort-label">PRIORITY <span>↕</span></div></div>
            <form className="add-task-form" onSubmit={addTask}><span className="add-icon"><Icon name="plus" /></span><input aria-label="New task title" placeholder="Add a task..." value={draft} onChange={(event) => setDraft(event.target.value)} /><select aria-label="Task priority" value={priority} onChange={(event) => setPriority(event.target.value as Priority)}><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option></select><input aria-label="Due date" className="date-input" type="date" value={dueDate} onChange={(event) => setDueDate(event.target.value)} /><button className="add-button" type="submit" aria-label="Add task"><Icon name="plus" /></button></form>

            <div className="task-list" aria-live="polite">
              {visibleTasks.length ? visibleTasks.map((task) => {
                const overdue = !task.completed && !!task.dueDate && task.dueDate < today();
                return <article className={`task-row ${task.completed ? 'is-completed' : ''}`} key={task.id}>
                  <button className="task-check" onClick={() => toggleTask(task.id)} aria-label={`${task.completed ? 'Mark incomplete' : 'Complete'} ${task.title}`}><Icon name="check" /></button>
                  <div className="task-copy"><h3>{task.title}</h3>{task.description && <p>{task.description}</p>}</div>
                  <span className={`priority-label priority-${task.priority}`}><i />{task.priority}</span>
                  <span className={`due-label ${overdue ? 'overdue' : ''}`}>{task.dueDate ? <><Icon name="calendar" />{overdue ? 'Overdue' : task.dueDate === today() ? 'Today' : new Date(`${task.dueDate}T12:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</> : <span className="no-date">No date</span>}</span>
                  <button className="delete-button" onClick={() => deleteTask(task.id)} aria-label={`Delete ${task.title}`}><Icon name="trash" /></button>
                </article>;
              }) : <div className="empty-state"><span className="empty-check"><Icon name="check" /></span><strong>{query ? 'No matching tasks' : 'Nothing on this list'}</strong><p>{query ? 'Try another search.' : 'Enjoy the breathing room, or add a task above.'}</p></div>}
            </div>
            <div className="list-footer"><span>{visibleTasks.length} {visibleTasks.length === 1 ? 'task' : 'tasks'} shown</span><span>Small steps, steady progress <span className="footer-spark">✳</span></span></div>
          </section>
          <footer className="page-footer"><span>DAYMARK <span>·</span> YOUR PERSONAL WORKSPACE</span><span>Make today count.</span></footer>
        </div>
      </main>
    </div>
  );
}

export default App;
