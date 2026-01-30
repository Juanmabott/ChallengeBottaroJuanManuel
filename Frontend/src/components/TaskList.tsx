import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Task } from '../types/task';

const TaskList = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'completed' | 'pending'>('all');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/tasks');
        if (response.ok) {
          const data = await response.json();
          setTasks(data);
        } else {
          console.error('Error fetching tasks:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching tasks:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:3000/api/tasks/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setTasks(tasks.filter(task => task.id !== id));
      } else {
        console.error('Error deleting task:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'completed') return task.completed;
    if (filter === 'pending') return !task.completed;
    return true;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-125">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-lg text-slate-600">Loading tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2 flex flex-col items-center">
      <div className="flex flex-col gap-4 bg-white rounded-xl shadow-sm border border-slate-200 p-4  justify-between sm:flex-col sm:items-center min-w-[32%]">
        <h2 className="text-3xl font-bold text-slate-900">Tareas</h2>
        <button
          onClick={() => navigate('/tasksForm')}
          className="w-full sm:w-40 px-6 py-3 bg-linear-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg transform hover:scale-105"
        >+ Nueva Tarea
        </button>
      </div>

      <div className="flex gap-2 flex-wrap justify-center min-w-[32%]">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            filter === 'all'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
          }`}
        >
          Todas
        </button>
        <button
          onClick={() => setFilter('completed')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            filter === 'completed'
              ? 'bg-green-600 text-white shadow-md'
              : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
          }`}
        >
          Completadas
        </button>
        <button
          onClick={() => setFilter('pending')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            filter === 'pending'
              ? 'bg-red-600 text-white shadow-md'
              : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
          }`}
        >
          Pendientes
        </button>
      </div>

      {filteredTasks.length === 0 ? (
        <div className="flex items-center justify-center min-h-100">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-16 text-center max-w-md mx-auto">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-semibold text-slate-800 mb-2">No hay tareas aún</h3>
            <p className="text-slate-500 mb-6">Crea una tarea para comenza</p>
            <button
              onClick={() => navigate('/tasksForm')}
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
            >
              Crear Tarea
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-7xl">
          {filteredTasks.map((task) => (
            <div
              key={task.id}
              className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-lg hover:border-blue-300 transition-all transform hover:-translate-y-1 flex flex-col"
            >
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-slate-900 mb-3 line-clamp-2">{task.title}</h3>
                <p className="text-slate-600 mb-4 line-clamp-3 text-sm">{task.description}</p>
              </div>
              
                <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap">{new Date(task.createdAt).toLocaleDateString()}</p>
              
              <div className="mt-2">
                                <p className={`text-sm font-semibold flex items-center gap-2 ${task.completed ? 'text-green-600' : 'text-red-600'}`}>
                                    <span className={` ${task.completed ? 'text-green-500' : 'text-red-500'}`}>●</span>
                                    {task.completed ? 'Completada' : 'Pendiente'}
                                </p>
                            </div>
              <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-slate-100">
                <button
                  onClick={() => navigate(`/tasksItem/${task.id}`)}
                  className="w-full px-4 py-2.5 bg-linear-to-r from-slate-600 to-slate-700 text-white font-medium rounded-lg hover:from-slate-700 hover:to-slate-800 transition-all shadow-sm"
                >
                  Ver Detalles
                </button>
                <div className="flex gap-2">
                  <button
                    onClick={() => navigate(`/tasksForm/${task.id}/edit`)}
                    className="flex-1 px-3 py-2 bg-blue-50 text-blue-700 font-medium rounded-lg hover:bg-blue-100 transition-colors text-sm"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(task.id)}
                    className="flex-1 px-3 py-2 bg-red-50 text-red-700 font-medium rounded-lg hover:bg-red-100 transition-colors text-sm"
                  >
                    Borrar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskList;