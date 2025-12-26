import React, { useState } from "react";
import { useQuiz } from "../context/QuizContext";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, ArrowRight, RotateCcw } from "lucide-react";
import { Link } from "react-router-dom";

export default function Quiz() {
    const { quizQuestions, score, setScore } = useQuiz();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [isAnswered, setIsAnswered] = useState(false);

    const currentQ = quizQuestions[currentIndex];

    if (!currentQ)
        return (
            <div className="text-center mt-20">
                <h2 className="text-2xl mb-4">
                    Chưa chọn chương hoặc không có dữ liệu!
                </h2>
                <Link to="/" className="text-blue-400 underline">
                    Quay lại trang chủ
                </Link>
            </div>
        );

    const handleSelect = (option) => {
        if (isAnswered) return;
        setSelectedOption(option);
        setIsAnswered(true);

        if (option === currentQ.answer) {
            setScore((prev) => ({ ...prev, correct: prev.correct + 1 }));
        } else {
            setScore((prev) => ({ ...prev, wrong: prev.wrong + 1 }));
        }
    };

    const nextQuestion = () => {
        if (currentIndex < quizQuestions.length - 1) {
            setCurrentIndex((prev) => prev + 1);
            setSelectedOption(null);
            setIsAnswered(false);
        } else {
            // Hoàn thành
            alert(`Kết thúc! Điểm số: ${score.correct}/${score.total}`);
        }
    };

    const progress = ((currentIndex + 1) / quizQuestions.length) * 100;

    return (
        <div className="max-w-3xl mx-auto">
            {/* Stats Bar */}
            <div className="flex justify-between mb-6 glass-panel p-4 text-sm font-semibold">
                <span className="text-green-400">Đúng: {score.correct}</span>
                <span className="text-red-400">Sai: {score.wrong}</span>
                <span className="text-blue-400">
                    Câu: {currentIndex + 1}/{quizQuestions.length}
                </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-700 h-2 rounded-full mb-8 overflow-hidden">
                <motion.div
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5 }}
                />
            </div>

            {/* Question Card */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentQ.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="glass-panel p-6 md:p-8"
                >
                    <div className="text-xs uppercase tracking-wider text-gray-400 mb-2">
                        {currentQ.chapter}
                    </div>
                    <h2 className="text-xl md:text-2xl font-bold mb-6">
                        {currentQ.question}
                    </h2>

                    <div className="space-y-3">
                        {currentQ.options.map((opt, idx) => {
                            let btnClass =
                                "w-full p-4 text-left rounded-xl border transition-all duration-200 flex justify-between items-center ";

                            if (isAnswered) {
                                if (opt === currentQ.answer)
                                    btnClass +=
                                        "bg-green-500/20 border-green-500 text-green-200"; // Đáp án đúng
                                else if (opt === selectedOption)
                                    btnClass +=
                                        "bg-red-500/20 border-red-500 text-red-200"; // Chọn sai
                                else
                                    btnClass +=
                                        "bg-white/5 border-transparent opacity-50"; // Các câu khác
                            } else {
                                btnClass +=
                                    "bg-white/5 border-white/10 hover:bg-white/10 hover:border-blue-400/50";
                            }

                            return (
                                <button
                                    key={idx}
                                    onClick={() => handleSelect(opt)}
                                    disabled={isAnswered}
                                    className={btnClass}
                                >
                                    <span>{opt}</span>
                                    {isAnswered && opt === currentQ.answer && (
                                        <CheckCircle
                                            size={20}
                                            className="text-green-400"
                                        />
                                    )}
                                    {isAnswered &&
                                        opt === selectedOption &&
                                        opt !== currentQ.answer && (
                                            <XCircle
                                                size={20}
                                                className="text-red-400"
                                            />
                                        )}
                                </button>
                            );
                        })}
                    </div>

                    {/* Feedback & Next Button */}
                    {isAnswered && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-6 flex justify-end"
                        >
                            <button
                                onClick={nextQuestion}
                                className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 transition"
                            >
                                {currentIndex === quizQuestions.length - 1
                                    ? "Hoàn thành"
                                    : "Câu tiếp theo"}{" "}
                                <ArrowRight size={18} />
                            </button>
                        </motion.div>
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
