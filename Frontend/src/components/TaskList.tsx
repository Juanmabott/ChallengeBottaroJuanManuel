import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Task {
  id: number;
  title: string;
  description: string;
}

const TaskList = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
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
    <div className="space-y-2">
      <div className="flex flex-col  justify-left gap-4 bg-white rounded-xl shadow-sm border border-slate-200 p-4 w-96/300 ">
        <h2 className="text-3xl font-bold text-slate-900">Tareas</h2>
        <button
          onClick={() => navigate('/tasks/new')}
          className="w-full sm:w-40 px-6 py-3 bg-linear-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg transform hover:scale-105"
        >+ Nueva Tarea
        </button>
      </div>
      {tasks.length === 0 ? (
        <div className="flex items-center justify-center min-h-100">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-16 text-center max-w-md mx-auto">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-semibold text-slate-800 mb-2">No hay tareas aún</h3>
            <p className="text-slate-500 mb-6">Crea una tarea para comenza</p>
            <button
              onClick={() => navigate('/tasks/new')}
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
            >
              Crear Tarea
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-lg hover:border-blue-300 transition-all transform hover:-translate-y-1 flex flex-col"
            >
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-slate-900 mb-3 line-clamp-2">{task.title}</h3>
                <p className="text-slate-600 mb-4 line-clamp-3 text-sm">{task.description}</p>
              </div>
              <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-slate-100">
                <button
                  onClick={() => navigate(`/tasks/${task.id}`)}
                  className="w-full px-4 py-2.5 bg-linear-to-r from-slate-600 to-slate-700 text-white font-medium rounded-lg hover:from-slate-700 hover:to-slate-800 transition-all shadow-sm"
                >
                  Ver Detalles
                </button>
                <div className="flex gap-2">
                  <button
                    onClick={() => navigate(`/tasks/${task.id}/edit`)}
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