import React, { createContext, useContext, useState, useEffect } from "react";
import initialQuestions from "../data/questions.json";

const QuizContext = createContext();

export const QuizProvider = ({ children }) => {
    const [allQuestions, setAllQuestions] = useState(() => {
        const saved = localStorage.getItem("se_quiz_data");
        return saved ? JSON.parse(saved) : initialQuestions;
    });

    const [quizQuestions, setQuizQuestions] = useState([]);
    const [score, setScore] = useState({ correct: 0, wrong: 0, total: 0 });
    const [userAnswers, setUserAnswers] = useState({}); // Lưu trạng thái làm bài { questionId: selectedOption }

    useEffect(() => {
        localStorage.setItem("se_quiz_data", JSON.stringify(allQuestions));
    }, [allQuestions]);

    const shuffleArray = (array) => {
        const arr = [...array];
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    };

    // Thêm tham số limit để giới hạn số câu
    const startQuiz = (chapter, limit = 0) => {
        let filtered =
            chapter === "All"
                ? allQuestions
                : allQuestions.filter((q) => q.chapter === chapter);

        // Trộn câu hỏi
        let shuffled = shuffleArray(filtered).map((q) => ({
            ...q,
            options: shuffleArray(q.options),
        }));

        // Cắt theo số lượng nếu có yêu cầu
        if (limit > 0 && limit < shuffled.length) {
            shuffled = shuffled.slice(0, limit);
        }

        setQuizQuestions(shuffled);
        setScore({ correct: 0, wrong: 0, total: shuffled.length });
        setUserAnswers({}); // Reset câu trả lời
    };

    const handleAnswer = (questionId, isCorrect, option) => {
        // Chỉ cập nhật nếu chưa trả lời câu này
        if (!userAnswers[questionId]) {
            setUserAnswers((prev) => ({ ...prev, [questionId]: option }));
            if (isCorrect)
                setScore((prev) => ({ ...prev, correct: prev.correct + 1 }));
            else setScore((prev) => ({ ...prev, wrong: prev.wrong + 1 }));
        }
    };

    // Admin: Import file
    const importQuestions = (jsonData) => {
        // Merge câu hỏi mới vào, lọc trùng ID nếu cần
        const currentIds = new Set(allQuestions.map((q) => q.id));
        const newQuestions = jsonData.filter((q) => !currentIds.has(q.id));
        setAllQuestions([...allQuestions, ...newQuestions]);
        return newQuestions.length; // Trả về số lượng thêm thành công
    };

    const addQuestion = (newQ) => {
        setAllQuestions([...allQuestions, { ...newQ, id: Date.now() }]);
    };

    const deleteQuestion = (id) => {
        setAllQuestions(allQuestions.filter((q) => q.id !== id));
    };

    const chapters = [...new Set(allQuestions.map((q) => q.chapter))];

    return (
        <QuizContext.Provider
            value={{
                allQuestions,
                quizQuestions,
                chapters,
                startQuiz,
                score,
                userAnswers,
                handleAnswer,
                addQuestion,
                deleteQuestion,
                importQuestions,
            }}
        >
            {children}
        </QuizContext.Provider>
    );
};

export const useQuiz = () => useContext(QuizContext);
