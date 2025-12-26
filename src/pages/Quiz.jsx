import React, { useState } from "react";
import { useQuiz } from "../context/QuizContext";
import { motion, AnimatePresence } from "framer-motion";
import {
    CheckCircle,
    XCircle,
    ArrowRight,
    ArrowLeft,
    Grid,
    Menu,
} from "lucide-react";
import { Link } from "react-router-dom";
import clsx from "clsx";

export default function Quiz() {
    const { quizQuestions, score, userAnswers, handleAnswer } = useQuiz();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showGrid, setShowGrid] = useState(false); // Mobile: toggle danh sách câu

    const currentQ = quizQuestions[currentIndex];

    if (!currentQ)
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                <h2 className="text-2xl font-bold mb-4">Chưa chọn đề tài!</h2>
                <Link
                    to="/"
                    className="px-6 py-2 bg-blue-600 rounded-lg hover:bg-blue-500 transition"
                >
                    Về trang chủ
                </Link>
            </div>
        );

    const isAnswered = !!userAnswers[currentQ.id];
    const selectedOption = userAnswers[currentQ.id];

    const onSelect = (option) => {
        if (isAnswered) return;
        const isCorrect = option === currentQ.answer;
        handleAnswer(currentQ.id, isCorrect, option);
    };

    const goToQuestion = (index) => {
        setCurrentIndex(index);
        setShowGrid(false); // Đóng menu trên mobile sau khi chọn
    };

    return (
        <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-140px)]">
            {/* Cột trái: Nội dung câu hỏi */}
            <div className="flex-1 flex flex-col">
                {/* Progress Info */}
                <div className="flex items-center justify-between mb-4 glass-panel p-3 px-5">
                    <div className="flex gap-4 font-mono font-bold text-sm">
                        <span className="text-green-400">
                            Đúng: {score.correct}
                        </span>
                        <span className="text-red-400">Sai: {score.wrong}</span>
                    </div>
                    <div className="font-bold text-blue-300">
                        Câu {currentIndex + 1} / {quizQuestions.length}
                    </div>
                    <button
                        onClick={() => setShowGrid(!showGrid)}
                        className="lg:hidden p-2 bg-white/10 rounded"
                    >
                        <Grid size={18} />
                    </button>
                </div>

                {/* Question Area */}
                <div className="flex-1 relative">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentQ.id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.2 }}
                            className="glass-panel p-6 md:p-8 h-full flex flex-col overflow-y-auto"
                        >
                            <div className="text-xs uppercase tracking-wider text-gray-500 mb-2 font-bold">
                                {currentQ.chapter}
                            </div>
                            <h2 className="text-xl md:text-2xl font-bold mb-6 leading-relaxed text-white/90">
                                {currentQ.question}
                            </h2>

                            <div className="space-y-3 flex-1">
                                {currentQ.options.map((opt, idx) => {
                                    const isSelected = opt === selectedOption;
                                    const isCorrect = opt === currentQ.answer;

                                    // Logic màu sắc:
                                    // Chưa trả lời: bình thường
                                    // Đã trả lời:
                                    //  - Nếu đây là đáp án ĐÚNG: luôn hiện xanh (để user biết đáp án đúng kể cả khi chọn sai)
                                    //  - Nếu user chọn SAI: hiện đỏ
                                    let btnStyle =
                                        "bg-white/5 border-white/10 hover:bg-white/10";

                                    if (isAnswered) {
                                        if (isCorrect)
                                            btnStyle =
                                                "bg-green-500/20 border-green-500 text-green-100 font-medium";
                                        else if (isSelected)
                                            btnStyle =
                                                "bg-red-500/20 border-red-500 text-red-100";
                                        else
                                            btnStyle =
                                                "bg-white/5 border-transparent opacity-40";
                                    }

                                    return (
                                        <button
                                            key={idx}
                                            onClick={() => onSelect(opt)}
                                            disabled={isAnswered}
                                            className={clsx(
                                                "w-full p-4 text-left rounded-xl border transition-all duration-200 flex justify-between items-start gap-3",
                                                btnStyle
                                            )}
                                        >
                                            <span className="flex-1">
                                                {opt}
                                            </span>
                                            {isAnswered && isCorrect && (
                                                <CheckCircle
                                                    size={20}
                                                    className="text-green-400 shrink-0"
                                                />
                                            )}
                                            {isAnswered &&
                                                isSelected &&
                                                !isCorrect && (
                                                    <XCircle
                                                        size={20}
                                                        className="text-red-400 shrink-0"
                                                    />
                                                )}
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Navigation Buttons */}
                            <div className="flex justify-between items-center mt-8 pt-4 border-t border-white/10">
                                <button
                                    onClick={() =>
                                        setCurrentIndex((prev) =>
                                            Math.max(0, prev - 1)
                                        )
                                    }
                                    disabled={currentIndex === 0}
                                    className="flex items-center gap-2 text-gray-400 hover:text-white disabled:opacity-30 disabled:hover:text-gray-400 transition"
                                >
                                    <ArrowLeft size={18} /> Câu trước
                                </button>

                                {currentIndex < quizQuestions.length - 1 ? (
                                    <button
                                        onClick={() =>
                                            setCurrentIndex((prev) => prev + 1)
                                        }
                                        className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 transition shadow-lg shadow-blue-900/50"
                                    >
                                        Tiếp theo <ArrowRight size={18} />
                                    </button>
                                ) : (
                                    <button
                                        onClick={() =>
                                            alert(
                                                `Kết quả: ${score.correct}/${score.total}`
                                            )
                                        }
                                        className="bg-green-600 hover:bg-green-500 text-white px-6 py-2 rounded-lg font-bold transition shadow-lg shadow-green-900/50"
                                    >
                                        Hoàn thành
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>

            {/* Cột phải: Danh sách câu hỏi (Grid) */}
            <div
                className={clsx(
                    "fixed inset-0 z-50 bg-slate-900/95 p-6 lg:static lg:bg-transparent lg:p-0 lg:w-72 lg:block transition-all",
                    showGrid ? "block" : "hidden"
                )}
            >
                <div className="glass-panel p-4 h-full flex flex-col">
                    <div className="flex justify-between items-center mb-4 lg:hidden">
                        <h3 className="font-bold">Danh sách câu hỏi</h3>
                        <button onClick={() => setShowGrid(false)}>
                            <XCircle />
                        </button>
                    </div>
                    <h3 className="font-bold mb-4 hidden lg:block text-gray-300">
                        Danh sách câu hỏi
                    </h3>

                    <div className="grid grid-cols-5 gap-2 overflow-y-auto pr-2 content-start">
                        {quizQuestions.map((q, idx) => {
                            const status = userAnswers[q.id];
                            const isCurrent = idx === currentIndex;

                            // Màu sắc ô số
                            let bgClass =
                                "bg-white/5 hover:bg-white/20 text-gray-400";
                            if (status) {
                                if (status === q.answer)
                                    bgClass =
                                        "bg-green-500/80 text-white border-green-400"; // Đúng
                                else
                                    bgClass =
                                        "bg-red-500/80 text-white border-red-400"; // Sai
                            }
                            if (isCurrent)
                                bgClass +=
                                    " ring-2 ring-blue-400 ring-offset-2 ring-offset-slate-900 bg-blue-500/20 text-blue-200";

                            return (
                                <button
                                    key={idx}
                                    onClick={() => goToQuestion(idx)}
                                    className={clsx(
                                        "h-10 w-10 rounded-lg text-sm font-bold border border-transparent transition-all flex items-center justify-center",
                                        bgClass
                                    )}
                                >
                                    {idx + 1}
                                </button>
                            );
                        })}
                    </div>

                    {/* Legend */}
                    <div className="mt-auto pt-4 border-t border-white/10 text-xs text-gray-400 space-y-2">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-green-500 rounded"></div>{" "}
                            Đúng
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-red-500 rounded"></div>{" "}
                            Sai
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-white/10 border border-blue-400 rounded"></div>{" "}
                            Đang chọn
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
