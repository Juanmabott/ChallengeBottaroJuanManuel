import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
export const TaskItem = () => {
    const [task, setTask] = useState<{id:number; title:string; description:string;} | null>(null);
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTask = async () => {
            try { 
                const response = await fetch(`http://localhost:3000/api/tasks/${id}`);
                if (response.ok) {
                    const data = await response.json();
                    setTask(data);
                } else {
                    console.error('Error fetching task:', response.statusText);
                }
            } catch (error) {
                console.error('Error fetching task:', error);
            }
        };

        fetchTask();
    }, [id]); 

    if (!task) {
        return (
            <div className="flex items-center justify-center min-h-125">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                    <p className="text-lg text-slate-600">Loading task details...</p>
                </div>
            </div>
        );
    }
    
    return (
        <div className="flex items-start justify-center min-h-150">
            <div className="w-full max-w-4xl">
                <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
                    <div className="bg-linear-to-r from-blue-600 to-blue-700 px-8 py-6">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <h2 className="text-3xl font-bold text-white flex-1">{task.title}</h2>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => navigate(`/tasks/${id}/edit`)}
                                    className="px-5 py-2.5 bg-white text-blue-700 font-semibold rounded-lg hover:bg-blue-50 transition-all shadow-md hover:shadow-lg"
                                >
                                    Editar
                                </button>
                                <button
                                    onClick={() => navigate('/tasks')}
                                    className="px-5 py-2.5 bg-white/20 backdrop-blur-sm text-white font-semibold rounded-lg hover:bg-white/30 transition-all"
                                >
                                    ← Volver
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="p-8 md:p-10">
                        <div className="mb-4">
                            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">
                                Descripción
                            </h3>
                            <div className="bg-slate-50 rounded-lg p-6 border border-slate-200">
                                <p className="text-slate-700 text-lg leading-relaxed whitespace-pre-wrap">{task.description}</p>
                            </div>
                        </div>
                        <div className="mt-8 pt-6 border-t border-slate-200 flex justify-center">
                            <button
                                onClick={() => navigate('/tasks')}
                                className="px-8 py-3 bg-linear-to-r from-slate-600 to-slate-700 text-white font-semibold rounded-lg hover:from-slate-700 hover:to-slate-800 transition-all shadow-md hover:shadow-lg transform hover:scale-105"
                            >
                                Ver Todas las Tareas
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}