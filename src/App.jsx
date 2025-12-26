import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { QuizProvider } from "./context/QuizContext";
import Home from "./pages/Home";
import Quiz from "./pages/Quiz";
import Admin from "./pages/Admin";
import { BookOpen, ShieldCheck } from "lucide-react";

function App() {
    return (
        <QuizProvider>
            <BrowserRouter>
                <div className="min-h-screen text-white p-4 md:p-8 max-w-5xl mx-auto">
                    {/* Header */}
                    <nav className="flex justify-between items-center mb-8 glass-panel p-4">
                        <Link
                            to="/"
                            className="text-xl md:text-2xl font-bold flex items-center gap-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
                        >
                            <BookOpen className="text-blue-400" /> SE Quiz
                            Master
                        </Link>
                        <div className="flex gap-4">
                            <Link
                                to="/"
                                className="hover:text-blue-300 transition"
                            >
                                Ôn tập
                            </Link>
                            <Link
                                to="/admin"
                                className="hover:text-purple-300 transition flex items-center gap-1"
                            >
                                <ShieldCheck size={18} /> Admin
                            </Link>
                        </div>
                    </nav>

                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/quiz" element={<Quiz />} />
                        <Route path="/admin" element={<Admin />} />
                    </Routes>
                </div>
            </BrowserRouter>
        </QuizProvider>
    );
}

export default App;
