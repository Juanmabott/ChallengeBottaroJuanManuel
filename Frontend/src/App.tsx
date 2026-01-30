import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import { TaskItem } from './components/TaskItem';
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-slate-100 flex flex-col">
        <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-slate-200 sticky top-0 z-10 overflow-x-auto">
          <div className="max-w-7x2 mx-auto px-4 sm:px-6 lg:px-8 py-5">
            <div className="flex flex-col items-start space-y-2">
              <h1
                className="text-2xl font-bold bg-linear-to-r from-blue-600 to-slate-900 bg-clip-text text-transparent whitespace-nowrap"
                onClick={() => window.location.href = '/tasksList'}
              >
                Challenge
              </h1>
            </div>
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full">
          <div className="flex justify-center">
            <div className="w-full">
              <Routes>
                <Route path="/" element={<Navigate to="/tasksList" replace />} />
                <Route path="/tasksList" element={<TaskList />} />
                <Route path="/tasksForm" element={<TaskForm />} />
                <Route path="/tasksItem/:id" element={<TaskItem />} />
                <Route path="/tasksForm/:id/edit" element={<TaskForm />} />
              </Routes>
            </div>
          </div>
        </main>
        <footer className="w-full text-center py-0.5 text-xs text-slate-600 border-t border-slate-200 h-auto max-h-2 mt-auto">
          Hecho por Juan Manuel Bottaro
        </footer>
      </div>
    </BrowserRouter>
  )
}

export default App
