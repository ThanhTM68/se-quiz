import React, { createContext, useContext, useState, useEffect } from "react";
import initialQuestions from "../data/questions.json";

const QuizContext = createContext();

export const QuizProvider = ({ children }) => {
    // Load questions từ localStorage nếu có (cho tính năng Admin), nếu không thì dùng file json
    const [allQuestions, setAllQuestions] = useState(() => {
        const saved = localStorage.getItem("se_quiz_data");
        return saved ? JSON.parse(saved) : initialQuestions;
    });

    const [currentChapter, setCurrentChapter] = useState(null);
    const [quizQuestions, setQuizQuestions] = useState([]);
    const [score, setScore] = useState({ correct: 0, wrong: 0, total: 0 });

    // Lưu lại vào localStorage mỗi khi questions thay đổi (Admin update)
    useEffect(() => {
        localStorage.setItem("se_quiz_data", JSON.stringify(allQuestions));
    }, [allQuestions]);

    // Hàm trộn mảng (Fisher-Yates Shuffle)
    const shuffleArray = (array) => {
        const arr = [...array];
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    };

    // Bắt đầu bài thi: Lọc theo chương -> Trộn câu hỏi -> Trộn đáp án
    const startQuiz = (chapter) => {
        setCurrentChapter(chapter);
        const filtered =
            chapter === "All"
                ? allQuestions
                : allQuestions.filter((q) => q.chapter === chapter);

        const shuffled = shuffleArray(filtered).map((q) => ({
            ...q,
            options: shuffleArray(q.options), // Trộn cả đáp án
        }));

        setQuizQuestions(shuffled);
        setScore({ correct: 0, wrong: 0, total: shuffled.length });
    };

    // Admin Actions
    const addQuestion = (newQ) => {
        setAllQuestions([...allQuestions, { ...newQ, id: Date.now() }]);
    };

    const deleteQuestion = (id) => {
        setAllQuestions(allQuestions.filter((q) => q.id !== id));
    };

    const updateQuestion = (updatedQ) => {
        setAllQuestions(
            allQuestions.map((q) => (q.id === updatedQ.id ? updatedQ : q))
        );
    };

    // Export JSON cho Admin
    const exportData = () => {
        const dataStr =
            "data:text/json;charset=utf-8," +
            encodeURIComponent(JSON.stringify(allQuestions, null, 2));
        const downloadAnchorNode = document.createElement("a");
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", "questions.json");
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    };

    // Lấy danh sách chương duy nhất
    const chapters = [...new Set(allQuestions.map((q) => q.chapter))];

    return (
        <QuizContext.Provider
            value={{
                allQuestions,
                quizQuestions,
                chapters,
                startQuiz,
                score,
                setScore,
                addQuestion,
                deleteQuestion,
                updateQuestion,
                exportData,
            }}
        >
            {children}
        </QuizContext.Provider>
    );
};

export const useQuiz = () => useContext(QuizContext);
