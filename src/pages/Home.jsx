import React, { useState } from "react";
import { useQuiz } from "../context/QuizContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Play, Layers, FileText } from "lucide-react";

export default function Home() {
    const { chapters, startQuiz, allQuestions } = useQuiz();
    const navigate = useNavigate();
    const [numQuestions, setNumQuestions] = useState(""); // Mặc định là '' (tất cả)

    const handleStart = (chapter) => {
        const limit = parseInt(numQuestions) || 0; // 0 nghĩa là lấy hết
        startQuiz(chapter, limit);
        navigate("/quiz");
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center space-y-2">
                <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent py-2">
                    SE Quiz Master
                </h1>
                <p className="text-gray-400">
                    Hệ thống ôn tập trắc nghiệm - TM
                </p>
            </div>

            {/* Cấu hình bài thi */}
            <div className="glass-panel p-6 flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <FileText className="text-blue-400" />
                    <div>
                        <h3 className="font-bold">Số lượng câu hỏi</h3>
                        <p className="text-xs text-gray-400">
                            Để trống để làm tất cả câu trong chương
                        </p>
                    </div>
                </div>
                <input
                    type="number"
                    placeholder="VD: 10, 20..."
                    className="glass-input md:w-48 text-center font-bold text-lg"
                    value={numQuestions}
                    onChange={(e) => setNumQuestions(e.target.value)}
                    min="1"
                />
            </div>

            <div className="grid gap-4">
                <h2 className="text-xl font-bold flex items-center gap-2 text-white/80">
                    <Layers size={20} /> Chọn chương để bắt đầu
                </h2>

                <div className="grid md:grid-cols-2 gap-4">
                    {/* Nút Tổng hợp */}
                    <motion.button
                        whileHover={{
                            scale: 1.01,
                            backgroundColor: "rgba(255,255,255,0.05)",
                        }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleStart("All")}
                        className="glass-panel p-6 text-left border-l-4 border-l-purple-500 group relative overflow-hidden"
                    >
                        <div className="relative z-10">
                            <h3 className="text-xl font-bold text-white group-hover:text-purple-300 transition">
                                Tổng hợp kiến thức
                            </h3>
                            <p className="text-gray-400 text-sm mt-1">
                                Ngân hàng {allQuestions.length} câu hỏi trộn
                                ngẫu nhiên
                            </p>
                        </div>
                        <Play
                            className="absolute right-4 bottom-4 text-white/5 group-hover:text-purple-500/20 transition-all scale-150 group-hover:scale-125"
                            size={48}
                        />
                    </motion.button>

                    {/* Danh sách chương */}
                    {chapters.map((chap, idx) => {
                        // Đếm số câu trong chương
                        const count = allQuestions.filter(
                            (q) => q.chapter === chap
                        ).length;
                        return (
                            <motion.button
                                key={idx}
                                whileHover={{
                                    scale: 1.01,
                                    backgroundColor: "rgba(255,255,255,0.05)",
                                }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => handleStart(chap)}
                                className="glass-panel p-5 text-left flex justify-between items-center border-l-4 border-l-blue-500/50 hover:border-l-blue-400"
                            >
                                <div>
                                    <h3 className="font-semibold text-lg">
                                        {chap}
                                    </h3>
                                    <span className="text-xs text-blue-300/80 bg-blue-500/10 px-2 py-1 rounded mt-2 inline-block">
                                        {count} câu hỏi
                                    </span>
                                </div>
                                <Play size={20} className="text-gray-500" />
                            </motion.button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
