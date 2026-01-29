import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const TaskForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const isEditMode = Boolean(id);

  useEffect(() => {
    if (isEditMode) {
      const fetchTask = async () => {
        try {
          const response = await fetch(`http://localhost:3000/api/tasks/${id}`);
          if (response.ok) {
            const data = await response.json();
            setTitle(data.title);
            setDescription(data.description);
          } else {
            console.error('Error fetching task:', response.statusText);
          }
        } catch (error) {
          console.error('Error fetching task:', error);
        }
      };
      fetchTask();
    }
  }, [id, isEditMode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = isEditMode
        ? `http://localhost:3000/api/tasks/${id}`
        : 'http://localhost:3000/api/tasks';
      const method = isEditMode ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, description }),
      });

      if (response.ok) {
        navigate('/tasks');
      } else {
        console.error('Error saving task:', response.statusText);
      }
    } catch (error) {
      console.error('Error saving task:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-start justify-center min-h-150">
      <div className="w-full max-w-2xl">
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-8 md:p-10">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-900">
              {isEditMode ? ' Editar Task' : '➕ Crear  Tarea'}
            </h2>
            <p className="text-slate-500 mt-2">
              {isEditMode ? 'Update your task details below' : 'Fill in the details for your new task'}
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-semibold text-slate-700 mb-2">
                Task Title
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="Enter a descriptive title"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-slate-900 placeholder-slate-400"
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-semibold text-slate-700 mb-2">
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                placeholder="Provide detailed information about this task"
                rows={6}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition resize-none text-slate-900 placeholder-slate-400"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-3 pt-6">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3.5 bg-linear-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 disabled:from-blue-400 disabled:to-blue-400 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg transform hover:scale-[1.02] disabled:transform-none"
              >
                {loading ? '💾 Saving...' : isEditMode ? '✓ Update Task' : '+ Create Task'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/tasks')}
                className="flex-1 px-6 py-3.5 bg-slate-100 text-slate-700 font-semibold rounded-lg hover:bg-slate-200 transition-all shadow-sm hover:shadow"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TaskForm;