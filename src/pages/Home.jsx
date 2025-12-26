import React from "react";
import { useQuiz } from "../context/QuizContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Home() {
    const { chapters, startQuiz } = useQuiz();
    const navigate = useNavigate();

    const handleStart = (chapter) => {
        startQuiz(chapter);
        navigate("/quiz");
    };

    return (
        <div className="grid gap-6">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">
                    Ôn tập Công nghệ Phần mềm
                </h1>
                <p className="text-gray-400">
                    Chọn chương để bắt đầu làm bài trắc nghiệm
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleStart("All")}
                    className="glass-panel p-6 text-left hover:bg-white/5 transition group"
                >
                    <h3 className="text-xl font-bold text-blue-300 group-hover:text-blue-200">
                        Tổng hợp tất cả
                    </h3>
                    <p className="text-gray-400 text-sm mt-2">
                        Trộn câu hỏi từ tất cả các chương
                    </p>
                </motion.button>

                {chapters.map((chap) => (
                    <motion.button
                        key={chap}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleStart(chap)}
                        className="glass-panel p-6 text-left hover:bg-white/5 transition"
                    >
                        <h3 className="text-lg font-semibold">{chap}</h3>
                    </motion.button>
                ))}
            </div>
        </div>
    );
}
